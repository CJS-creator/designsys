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
      analytics_events: {
        Row: {
          created_at: string
          design_system_id: string | null
          event_data: Json | null
          event_name: string
          id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          design_system_id?: string | null
          event_data?: Json | null
          event_name: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          design_system_id?: string | null
          event_data?: Json | null
          event_name?: string
          id?: string
          session_id?: string | null
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
      api_keys: {
        Row: {
          created_at: string
          design_system_id: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_prefix: string | null
          last_used_at: string | null
          name: string
          scopes: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          design_system_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_prefix?: string | null
          last_used_at?: string | null
          name: string
          scopes?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          design_system_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_prefix?: string | null
          last_used_at?: string | null
          name?: string
          scopes?: string[]
          updated_at?: string
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
          new_value: string | null
          old_value: string | null
          token_path: string
        }
        Insert: {
          approval_request_id: string
          change_type?: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          token_path: string
        }
        Update: {
          approval_request_id?: string
          change_type?: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
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
          created_at: string
          description: string | null
          design_system_id: string
          id: string
          requester_id: string
          review_comment: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["approval_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          design_system_id: string
          id?: string
          requester_id: string
          review_comment?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          design_system_id?: string
          id?: string
          requester_id?: string
          review_comment?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          title?: string
          updated_at?: string
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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          design_system_id: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          design_system_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          design_system_id?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
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
          created_by: string
          description: string | null
          design_system_id: string
          id: string
          is_published: boolean
          name: string
          published_at: string | null
          snapshot_data: Json
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          design_system_id: string
          id?: string
          is_published?: boolean
          name: string
          published_at?: string | null
          snapshot_data: Json
          version_number?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          design_system_id?: string
          id?: string
          is_published?: boolean
          name?: string
          published_at?: string | null
          snapshot_data?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "design_system_versions_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
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
          is_public: boolean
          name: string
          share_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          design_system_data: Json
          id?: string
          is_public?: boolean
          name: string
          share_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          design_system_data?: Json
          id?: string
          is_public?: boolean
          name?: string
          share_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      design_tokens: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          design_system_id: string
          id: string
          name: string
          path: string
          ref: string | null
          status: string
          type: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          design_system_id: string
          id?: string
          name: string
          path: string
          ref?: string | null
          status?: string
          type: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          design_system_id?: string
          id?: string
          name?: string
          path?: string
          ref?: string | null
          status?: string
          type?: string
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "design_tokens_design_system_id_fkey"
            columns: ["design_system_id"]
            isOneToOne: false
            referencedRelation: "design_systems"
            referencedColumns: ["id"]
          },
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
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          design_system_id: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          design_system_id?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
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
          {
            foreignKeyName: "user_roles_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      version_changelog: {
        Row: {
          change_type: string
          created_at: string
          id: string
          new_value: string | null
          old_value: string | null
          token_path: string
          version_id: string
        }
        Insert: {
          change_type?: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          token_path: string
          version_id: string
        }
        Update: {
          change_type?: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          token_path?: string
          version_id?: string
        }
        Relationships: [
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
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _design_system_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_member: {
        Args: { _design_system_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "editor" | "viewer"
      approval_status:
        | "draft"
        | "pending_review"
        | "approved"
        | "rejected"
        | "published"
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
      app_role: ["owner", "editor", "viewer"],
      approval_status: [
        "draft",
        "pending_review",
        "approved",
        "rejected",
        "published",
      ],
    },
  },
} as const
