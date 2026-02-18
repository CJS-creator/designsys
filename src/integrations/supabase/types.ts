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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          design_system_id: string
          expires_at: string | null
          id: string
          key_hash: string
          last_used_at: string | null
          name: string
          scopes: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          design_system_id: string
          expires_at?: string | null
          id?: string
          key_hash: string
          last_used_at?: string | null
          name: string
          scopes?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          design_system_id?: string
          expires_at?: string | null
          id?: string
          key_hash?: string
          last_used_at?: string | null
          name?: string
          scopes?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_changes: {
        Row: {
          approval_request_id: string
          change_type: string
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
          token_path: string
        }
        Insert: {
          approval_request_id: string
          change_type: string
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          token_path: string
        }
        Update: {
          approval_request_id?: string
          change_type?: string
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          token_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_changes_approval_request_id_fkey"
            columns: ["approval_request_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          author_id: string
          created_at: string
          description: string | null
          design_system_id: string
          id: string
          status: Database["public"]["Enums"]["approval_status"]
          updated_at: string
          version_number: string
        }
        Insert: {
          author_id: string
          created_at?: string
          description?: string | null
          design_system_id: string
          id?: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          version_number: string
        }
        Update: {
          author_id?: string
          created_at?: string
          description?: string | null
          design_system_id?: string
          id?: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          version_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          design_system_id: string
          event_type: string
          id: string
          metadata: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string
          design_system_id: string
          event_type: string
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string
          design_system_id?: string
          event_type?: string
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          design_system_id: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          summary: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          design_system_id: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          design_system_id?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          summary?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      design_system_versions: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          design_system_id: string
          id: string
          is_published: boolean | null
          name: string | null
          parent_version_id: string | null
          published_at: string | null
          snapshot: Json
          updated_at: string
          version_number: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          design_system_id: string
          id?: string
          is_published?: boolean | null
          name?: string | null
          parent_version_id?: string | null
          published_at?: string | null
          snapshot: Json
          updated_at?: string
          version_number: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          design_system_id?: string
          id?: string
          is_published?: boolean | null
          name?: string | null
          parent_version_id?: string | null
          published_at?: string | null
          snapshot?: Json
          updated_at?: string
          version_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_system_versions_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "design_system_versions_parent_version_id_fkey"
            columns: ["parent_version_id"]
            isOneToOne: false
            referencedRelation: "design_system_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      design_systems: {
        Row: {
          created_at: string
          description: string | null
          design_system_data: Json
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          design_system_data: Json
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          design_system_data?: Json
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      git_connections: {
        Row: {
          created_at: string
          default_branch: string
          design_system_id: string
          id: string
          last_sync_at: string | null
          provider: string
          repo_full_name: string
          sync_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_branch?: string
          design_system_id: string
          id?: string
          last_sync_at?: string | null
          provider?: string
          repo_full_name: string
          sync_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_branch?: string
          design_system_id?: string
          id?: string
          last_sync_at?: string | null
          provider?: string
          repo_full_name?: string
          sync_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "git_connections_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: true
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          design_system_id: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          design_system_id: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          design_system_id?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      version_changelog: {
        Row: {
          action: string
          created_at: string
          design_system_id: string
          id: string
          new_value: Json | null
          old_value: Json | null
          token_path: string
          version_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          design_system_id: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          token_path: string
          version_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          design_system_id?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          token_path?: string
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "version_changelog_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "version_changelog_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "design_system_versions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      governance_kpi_median_lead_time_28d: {
        Row: {
          design_system_id: string | null
          median_lead_time_ms: number | null
        }
        Relationships: []
      }
      governance_kpi_rejection_rate_28d: {
        Row: {
          design_system_id: string | null
          published_count: number | null
          rejected_count: number | null
          rejection_rate: number | null
        }
        Relationships: []
      }
      governance_kpi_weekly_activation: {
        Row: {
          active_design_systems: number | null
          week_start: string | null
        }
        Relationships: []
      }
      governance_kpi_weekly_throughput: {
        Row: {
          published_requests: number | null
          week_start: string | null
        }
        Relationships: []
      }
      governance_sla_stale_requests: {
        Row: {
          author_id: string | null
          created_at: string | null
          design_system_id: string | null
          pending_for: unknown | null
          request_id: string | null
          version_number: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "owner" | "editor" | "viewer"
      approval_status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "PUBLISHED"
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
    Enums: {},
  },
} as const
