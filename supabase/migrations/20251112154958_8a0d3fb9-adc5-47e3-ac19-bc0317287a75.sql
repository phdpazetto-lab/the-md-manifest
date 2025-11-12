-- ============================================
-- StarMKT OS Database Schema
-- Sistema Operacional Administrativo Integrado
-- ============================================

-- 1. CREATE APP ROLE ENUM
CREATE TYPE public.app_role AS ENUM ('admin', 'finance', 'juridico', 'coordenador', 'hub', 'viewer');

-- 2. CREATE STATUS ENUMS
CREATE TYPE public.reimbursement_status AS ENUM ('pending', 'coordinator_approved', 'finance_approved', 'juridico_approved', 'paid', 'rejected');
CREATE TYPE public.payment_status AS ENUM ('pending', 'scheduled', 'paid', 'cancelled');
CREATE TYPE public.asset_status AS ENUM ('active', 'inactive', 'maintenance', 'disposed');
CREATE TYPE public.invoice_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');

-- 3. HUBS TABLE
CREATE TABLE public.hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  city TEXT,
  state TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. USER ROLES TABLE (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- 6. USERS_HUBS (many-to-many relationship)
CREATE TABLE public.users_hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hub_id UUID REFERENCES public.hubs(id) ON DELETE CASCADE NOT NULL,
  is_coordinator BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, hub_id)
);

-- 7. PROVIDERS TABLE
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  document_number TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. CONTRACTS TABLE
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.providers(id),
  contract_number TEXT UNIQUE NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_value DECIMAL(15,2),
  document_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. AP_INVOICES (Accounts Payable)
CREATE TABLE public.ap_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.providers(id) NOT NULL,
  contract_id UUID REFERENCES public.contracts(id),
  invoice_number TEXT NOT NULL,
  description TEXT,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status invoice_status DEFAULT 'pending',
  document_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. PAYMENTS TABLE
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.ap_invoices(id),
  payment_date DATE,
  amount DECIMAL(15,2) NOT NULL,
  payment_method TEXT,
  status payment_status DEFAULT 'pending',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. REIMBURSEMENTS TABLE
CREATE TABLE public.reimbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID REFERENCES public.hubs(id) NOT NULL,
  requester_id UUID REFERENCES auth.users(id) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  expense_date DATE NOT NULL,
  status reimbursement_status DEFAULT 'pending',
  receipt_url TEXT,
  coordinator_approved_at TIMESTAMPTZ,
  coordinator_approved_by UUID REFERENCES auth.users(id),
  finance_approved_at TIMESTAMPTZ,
  finance_approved_by UUID REFERENCES auth.users(id),
  juridico_approved_at TIMESTAMPTZ,
  juridico_approved_by UUID REFERENCES auth.users(id),
  paid_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. ADVANCES TABLE
CREATE TABLE public.advances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID REFERENCES public.hubs(id) NOT NULL,
  requester_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  purpose TEXT NOT NULL,
  request_date DATE DEFAULT CURRENT_DATE,
  approved_date DATE,
  paid_date DATE,
  status payment_status DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. ASSETS TABLE (Patrimônio)
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID REFERENCES public.hubs(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  acquisition_date DATE,
  acquisition_value DECIMAL(15,2),
  current_value DECIMAL(15,2),
  serial_number TEXT,
  status asset_status DEFAULT 'active',
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. ASSET_MOVEMENTS TABLE
CREATE TABLE public.asset_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  from_hub_id UUID REFERENCES public.hubs(id),
  to_hub_id UUID REFERENCES public.hubs(id),
  movement_date DATE DEFAULT CURRENT_DATE,
  movement_type TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. AUDIT_LOG TABLE
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SECURITY DEFINER FUNCTIONS
-- ============================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user belongs to a hub
CREATE OR REPLACE FUNCTION public.user_in_hub(_user_id uuid, _hub_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users_hubs
    WHERE user_id = _user_id
      AND hub_id = _hub_id
  )
$$;

-- Function to get user's hubs
CREATE OR REPLACE FUNCTION public.get_user_hubs(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT hub_id
  FROM public.users_hubs
  WHERE user_id = _user_id
$$;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ap_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reimbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- HUBS POLICIES
CREATE POLICY "Authenticated users can view hubs" ON public.hubs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage hubs" ON public.hubs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- PROFILES POLICIES
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- USER_ROLES POLICIES
CREATE POLICY "Users can view all roles" ON public.user_roles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- USERS_HUBS POLICIES
CREATE POLICY "Users can view hub assignments" ON public.users_hubs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage hub assignments" ON public.users_hubs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- PROVIDERS POLICIES
CREATE POLICY "Authenticated users can view providers" ON public.providers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Finance and admins can manage providers" ON public.providers
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'finance')
  );

-- CONTRACTS POLICIES
CREATE POLICY "Authenticated users can view contracts" ON public.contracts
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Juridico, finance and admins can manage contracts" ON public.contracts
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'finance') OR
    public.has_role(auth.uid(), 'juridico')
  );

-- AP_INVOICES POLICIES
CREATE POLICY "Authenticated users can view invoices" ON public.ap_invoices
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Finance and admins can manage invoices" ON public.ap_invoices
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'finance')
  );

-- PAYMENTS POLICIES
CREATE POLICY "Authenticated users can view payments" ON public.payments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Finance and admins can manage payments" ON public.payments
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'finance')
  );

-- REIMBURSEMENTS POLICIES
CREATE POLICY "Users can view own reimbursements" ON public.reimbursements
  FOR SELECT USING (
    auth.uid() = requester_id OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'finance') OR
    public.has_role(auth.uid(), 'juridico') OR
    public.has_role(auth.uid(), 'coordenador')
  );

CREATE POLICY "Users can create reimbursements" ON public.reimbursements
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Authorized users can update reimbursements" ON public.reimbursements
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'finance') OR
    public.has_role(auth.uid(), 'juridico') OR
    public.has_role(auth.uid(), 'coordenador')
  );

-- ADVANCES POLICIES
CREATE POLICY "Users can view own advances" ON public.advances
  FOR SELECT USING (
    auth.uid() = requester_id OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'finance')
  );

CREATE POLICY "Users can create advances" ON public.advances
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Finance and admins can manage advances" ON public.advances
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'finance')
  );

-- ASSETS POLICIES
CREATE POLICY "Users can view assets in their hubs" ON public.assets
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR
    hub_id IN (SELECT public.get_user_hubs(auth.uid()))
  );

CREATE POLICY "Admins and coordinators can manage assets" ON public.assets
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'coordenador')
  );

-- ASSET_MOVEMENTS POLICIES
CREATE POLICY "Users can view asset movements" ON public.asset_movements
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and coordinators can create asset movements" ON public.asset_movements
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'coordenador')
  );

-- AUDIT_LOG POLICIES
CREATE POLICY "Admins can view audit log" ON public.audit_log
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit log" ON public.audit_log
  FOR INSERT WITH CHECK (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_users_hubs_user_id ON public.users_hubs(user_id);
CREATE INDEX idx_users_hubs_hub_id ON public.users_hubs(hub_id);
CREATE INDEX idx_reimbursements_requester ON public.reimbursements(requester_id);
CREATE INDEX idx_reimbursements_hub ON public.reimbursements(hub_id);
CREATE INDEX idx_reimbursements_status ON public.reimbursements(status);
CREATE INDEX idx_assets_hub ON public.assets(hub_id);
CREATE INDEX idx_ap_invoices_provider ON public.ap_invoices(provider_id);
CREATE INDEX idx_payments_invoice ON public.payments(invoice_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hubs_updated_at BEFORE UPDATE ON public.hubs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ap_invoices_updated_at BEFORE UPDATE ON public.ap_invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reimbursements_updated_at BEFORE UPDATE ON public.reimbursements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advances_updated_at BEFORE UPDATE ON public.advances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();