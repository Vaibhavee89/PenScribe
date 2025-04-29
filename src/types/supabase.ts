export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          user_id: string
          published: boolean
          featured: boolean
          slug: string
          excerpt: string | null
          cover_image: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          user_id: string
          published?: boolean
          featured?: boolean
          slug: string
          excerpt?: string | null
          cover_image?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          user_id?: string
          published?: boolean
          featured?: boolean
          slug?: string
          excerpt?: string | null
          cover_image?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
        }
      }
      post_categories: {
        Row: {
          id: string
          post_id: string
          category_id: string
        }
        Insert: {
          id?: string
          post_id: string
          category_id: string
        }
        Update: {
          id?: string
          post_id?: string
          category_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}