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
          id: string
          design_system_id: string
          user_id: string
          key_hash: string
          name: string
          scopes: string[] | null
          last_used_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          design_system_id: string
          user_id: string
          key_hash: string
          name: string
          scopes?: string[] | null
          last_used_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          design_system_id?: string
          user_id?: string
          key_hash?: string
          name?: string
          scopes?: string[] | null
          last_used_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          }
        ]
      }
      brand_themes: {
        Row: {
          created_at: string
          design_system_id: string
          id: string
          is_default: boolean | null
          mode: string | null
          name: string
          tokens_override: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          design_system_id: string
          id?: string
          is_default?: boolean | null
          mode?: string | null
          name: string
          tokens_override?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          design_system_id?: string
          id?: string
          is_default?: boolean | null
          mode?: string | null
          name?: string
          tokens_override?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_themes_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          }
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
      design_tokens: {
        Row: {
          alias_path: string | null
          created_at: string
          description: string | null
          design_system_id: string
          extensions: Json | null
          group_id: string | null
          id: string
          is_alias: boolean | null
          name: string
          path: string
          token_type: string
          updated_at: string
          value: Json
          staging_value: Json | null
          status: "synced" | "changed"
        }
        Insert: {
          alias_path?: string | null
          created_at?: string
          description?: string | null
          design_system_id: string
          extensions?: Json | null
          group_id?: string | null
          id?: string
          is_alias?: boolean | null
          name: string
          path: string
          token_type: string
          updated_at?: string
          value: Json
          staging_value?: Json | null
          status?: "synced" | "changed"
        }
        Update: {
          alias_path?: string | null
          created_at?: string
          description?: string | null
          design_system_id?: string
          extensions?: Json | null
          group_id?: string | null
          id?: string
          is_alias?: boolean | null
          name?: string
          path?: string
          token_type?: string
          updated_at?: string
          value?: Json
          staging_value?: Json | null
          status?: "synced" | "changed"
        }
        Relationships: [
          {
            foreignKeyName: "design_tokens_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "design_tokens_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "token_groups"
            referencedColumns: ["id"]
          }
        ]
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
      figma_connections: {
        Row: {
          id: string
          design_system_id: string
          user_id: string
          figma_file_key: string | null
          access_token: string
          sync_status: string | null
          last_sync_at: string | null
          created_at: string
          updated_at: string
          figma_token: string | null
          figma_refresh_token: string | null
          token_expires_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          design_system_id: string
          user_id: string
          figma_file_key?: string | null
          access_token: string
          sync_status?: string | null
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
          figma_token?: string | null
          figma_refresh_token?: string | null
          token_expires_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          design_system_id?: string
          user_id?: string
          figma_file_key?: string | null
          access_token?: string
          sync_status?: string | null
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
          figma_token?: string | null
          figma_refresh_token?: string | null
          token_expires_at?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "figma_connections_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: true
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          }
        ]
      }
      token_groups: {
        Row: {
          created_at: string
          description: string | null
          design_system_id: string
          id: string
          name: string
          parent_id: string | null
          path: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          design_system_id: string
          id?: string
          name: string
          parent_id?: string | null
          path: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          design_system_id?: string
          id?: string
          name?: string
          parent_id?: string | null
          path?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_groups_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_groups_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "token_groups"
            referencedColumns: ["id"]
          }
        ]
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
          }
        ]
      }
      approval_requests: {
        Row: {
          id: string
          design_system_id: string
          version_number: string
          description: string | null
          author_id: string
          status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "PUBLISHED"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          design_system_id: string
          version_number: string
          description?: string | null
          author_id?: string
          status?: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "PUBLISHED"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          design_system_id?: string
          version_number?: string
          description?: string | null
          author_id?: string
          status?: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "PUBLISHED"
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          }
        ]
      }
      approval_changes: {
        Row: {
          id: string
          approval_request_id: string
          token_path: string
          old_value: Json | null
          new_value: Json | null
          change_type: string
        }
        Insert: {
          id?: string
          approval_request_id: string
          token_path: string
          old_value?: Json | null
          new_value?: Json | null
          change_type: string
        }
        Update: {
          id?: string
          approval_request_id?: string
          token_path?: string
          old_value?: Json | null
          new_value?: Json | null
          change_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_changes_approval_request_id_fkey"
            columns: ["approval_request_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          design_system_id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_value: Json | null
          new_value: Json | null
          metadata: Json | null
          created_at: string
          summary: string | null
        }
        Insert: {
          id?: string
          design_system_id: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_value?: Json | null
          new_value?: Json | null
          metadata?: Json | null
          created_at?: string
          summary?: string | null
        }
        Update: {
          id?: string
          design_system_id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_value?: Json | null
          new_value?: Json | null
          metadata?: Json | null
          created_at?: string
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          }
        ]
      }
      design_system_versions: {
        Row: {
          id: string
          design_system_id: string
          version_number: string
          config: Json
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          design_system_id: string
          version_number: string
          config: Json
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          design_system_id?: string
          version_number?: string
          config?: Json
          created_at?: string
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "design_system_versions_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      publish_design_system: {
        Args: {
          request_id: string
        }
        Returns: void
      }
    }
    Enums: {
      app_role: "owner" | "editor" | "viewer"
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
