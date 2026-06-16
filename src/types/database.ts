export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          slug: string
          display_name: string | null
          headline: string | null
          bio: string | null
          avatar_url: string | null
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          slug: string
          display_name?: string | null
          headline?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          display_name?: string | null
          headline?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      links: {
        Row: {
          id: string
          profile_id: string
          title: string
          url: string
          kind: string
          position: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          url: string
          kind?: string
          position?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          url?: string
          kind?: string
          position?: number
          is_active?: boolean
        }
        Relationships: []
      }
      page_views: {
        Row: {
          id: string
          profile_id: string
          referrer: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          referrer?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      link_clicks: {
        Row: {
          id: string
          link_id: string
          profile_id: string
          referrer: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          link_id: string
          profile_id: string
          referrer?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Link = Database['public']['Tables']['links']['Row']
export type PageView = Database['public']['Tables']['page_views']['Row']
export type LinkClick = Database['public']['Tables']['link_clicks']['Row']
