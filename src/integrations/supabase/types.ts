export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      advances: {
        Row: {
          amount: number
          approved_by: string | null
          approved_date: string | null
          created_at: string | null
          hub_id: string
          id: string
          notes: string | null
          paid_date: string | null
          purpose: string
          request_date: string | null
          requester_id: string
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string | null
          hub_id: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          purpose: string
          request_date?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string | null
          hub_id?: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          purpose?: string
          request_date?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advances_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      ap_invoices: {
        Row: {
          amount: number
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          document_url: string | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          provider_id: string
          status: Database["public"]["Enums"]["invoice_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          document_url?: string | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          provider_id: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          document_url?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          provider_id?: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ap_invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ap_invoices_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_movements: {
        Row: {
          asset_id: string
          created_at: string | null
          created_by: string | null
          from_hub_id: string | null
          id: string
          movement_date: string | null
          movement_type: string
          notes: string | null
          to_hub_id: string | null
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          created_by?: string | null
          from_hub_id?: string | null
          id?: string
          movement_date?: string | null
          movement_type: string
          notes?: string | null
          to_hub_id?: string | null
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          created_by?: string | null
          from_hub_id?: string | null
          id?: string
          movement_date?: string | null
          movement_type?: string
          notes?: string | null
          to_hub_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_movements_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_movements_from_hub_id_fkey"
            columns: ["from_hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_movements_to_hub_id_fkey"
            columns: ["to_hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          acquisition_date: string | null
          acquisition_value: number | null
          category: string | null
          created_at: string | null
          current_value: number | null
          description: string | null
          hub_id: string
          id: string
          name: string
          photo_url: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["asset_status"] | null
          updated_at: string | null
        }
        Insert: {
          acquisition_date?: string | null
          acquisition_value?: number | null
          category?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          hub_id: string
          id?: string
          name: string
          photo_url?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["asset_status"] | null
          updated_at?: string | null
        }
        Update: {
          acquisition_date?: string | null
          acquisition_value?: number | null
          category?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          hub_id?: string
          id?: string
          name?: string
          photo_url?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["asset_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          active: boolean | null
          contract_number: string
          created_at: string | null
          description: string | null
          document_url: string | null
          end_date: string | null
          id: string
          monthly_value: number | null
          provider_id: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          contract_number: string
          created_at?: string | null
          description?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          monthly_value?: number | null
          provider_id?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          contract_number?: string
          created_at?: string | null
          description?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          monthly_value?: number | null
          provider_id?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      hubs: {
        Row: {
          active: boolean | null
          city: string | null
          code: string
          created_at: string | null
          id: string
          name: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          city?: string | null
          code: string
          created_at?: string | null
          id?: string
          name: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          city?: string | null
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "ap_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          active: boolean | null
          address: string | null
          created_at: string | null
          document_number: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          created_at?: string | null
          document_number: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          created_at?: string | null
          document_number?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reimbursements: {
        Row: {
          amount: number
          coordinator_approved_at: string | null
          coordinator_approved_by: string | null
          created_at: string | null
          description: string
          expense_date: string
          finance_approved_at: string | null
          finance_approved_by: string | null
          hub_id: string
          id: string
          juridico_approved_at: string | null
          juridico_approved_by: string | null
          paid_at: string | null
          receipt_url: string | null
          rejection_reason: string | null
          requester_id: string
          status: Database["public"]["Enums"]["reimbursement_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          coordinator_approved_at?: string | null
          coordinator_approved_by?: string | null
          created_at?: string | null
          description: string
          expense_date: string
          finance_approved_at?: string | null
          finance_approved_by?: string | null
          hub_id: string
          id?: string
          juridico_approved_at?: string | null
          juridico_approved_by?: string | null
          paid_at?: string | null
          receipt_url?: string | null
          rejection_reason?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["reimbursement_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          coordinator_approved_at?: string | null
          coordinator_approved_by?: string | null
          created_at?: string | null
          description?: string
          expense_date?: string
          finance_approved_at?: string | null
          finance_approved_by?: string | null
          hub_id?: string
          id?: string
          juridico_approved_at?: string | null
          juridico_approved_by?: string | null
          paid_at?: string | null
          receipt_url?: string | null
          rejection_reason?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["reimbursement_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reimbursements_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users_hubs: {
        Row: {
          created_at: string | null
          hub_id: string
          id: string
          is_coordinator: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hub_id: string
          id?: string
          is_coordinator?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          hub_id?: string
          id?: string
          is_coordinator?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_hubs_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_hubs: { Args: { _user_id: string }; Returns: string[] }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_in_hub: {
        Args: { _hub_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "finance"
        | "juridico"
        | "coordenador"
        | "hub"
        | "viewer"
      asset_status: "active" | "inactive" | "maintenance" | "disposed"
      invoice_status: "pending" | "approved" | "paid" | "cancelled"
      payment_status: "pending" | "scheduled" | "paid" | "cancelled"
      reimbursement_status:
        | "pending"
        | "coordinator_approved"
        | "finance_approved"
        | "juridico_approved"
        | "paid"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "finance",
        "juridico",
        "coordenador",
        "hub",
        "viewer",
      ],
      asset_status: ["active", "inactive", "maintenance", "disposed"],
      invoice_status: ["pending", "approved", "paid", "cancelled"],
      payment_status: ["pending", "scheduled", "paid", "cancelled"],
      reimbursement_status: [
        "pending",
        "coordinator_approved",
        "finance_approved",
        "juridico_approved",
        "paid",
        "rejected",
      ],
    },
  },
} as const
