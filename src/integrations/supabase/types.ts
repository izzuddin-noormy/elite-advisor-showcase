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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      insights: {
        Row: {
          author: string | null
          category: string | null
          content_en: string
          content_zh: string
          created_at: string | null
          excerpt_en: string | null
          excerpt_zh: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          published_at: string | null
          read_time: number | null
          slug: string
          title_en: string
          title_zh: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content_en: string
          content_zh: string
          created_at?: string | null
          excerpt_en?: string | null
          excerpt_zh?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          read_time?: number | null
          slug: string
          title_en: string
          title_zh: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content_en?: string
          content_zh?: string
          created_at?: string | null
          excerpt_en?: string | null
          excerpt_zh?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          read_time?: number | null
          slug?: string
          title_en?: string
          title_zh?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content_en: string
          content_zh: string
          created_at: string | null
          featured: boolean | null
          id: string
          slug: string
          title_en: string
          title_zh: string
          type: Database["public"]["Enums"]["content_type"] | null
          updated_at: string | null
        }
        Insert: {
          content_en: string
          content_zh: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          slug: string
          title_en: string
          title_zh: string
          type?: Database["public"]["Enums"]["content_type"] | null
          updated_at?: string | null
        }
        Update: {
          content_en?: string
          content_zh?: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          slug?: string
          title_en?: string
          title_zh?: string
          type?: Database["public"]["Enums"]["content_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          baths: number | null
          beds: number | null
          created_at: string | null
          description_en: string
          description_zh: string
          featured: boolean | null
          id: string
          image_url: string | null
          location: string
          price: number
          slug: string
          sqft: number | null
          status: Database["public"]["Enums"]["property_status"] | null
          title_en: string
          title_zh: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          baths?: number | null
          beds?: number | null
          created_at?: string | null
          description_en: string
          description_zh: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          location: string
          price: number
          slug: string
          sqft?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          title_en: string
          title_zh: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          baths?: number | null
          beds?: number | null
          created_at?: string | null
          description_en?: string
          description_zh?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          location?: string
          price?: number
          slug?: string
          sqft?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          title_en?: string
          title_zh?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_type: "static" | "listing" | "insight"
      property_status: "available" | "under_contract" | "sold" | "pending"
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
      content_type: ["static", "listing", "insight"],
      property_status: ["available", "under_contract", "sold", "pending"],
    },
  },
} as const
