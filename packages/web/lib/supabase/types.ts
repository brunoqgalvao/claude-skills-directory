export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          id: string
          name: string
          github: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          github?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          github?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      verticals: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          summary: string
          description: string | null
          author_id: string | null
          visibility: string
          repo_url: string | null
          skill_md_url: string | null
          docs_url: string | null
          demo_url: string | null
          install_command: string | null
          prerequisites: string[] | null
          stars_count: number
          installs_count: number
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
          last_synced_at: string | null
        }
        Insert: {
          id: string
          name: string
          summary: string
          description?: string | null
          author_id?: string | null
          visibility?: string
          repo_url?: string | null
          skill_md_url?: string | null
          docs_url?: string | null
          demo_url?: string | null
          install_command?: string | null
          prerequisites?: string[] | null
          stars_count?: number
          installs_count?: number
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
          last_synced_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          summary?: string
          description?: string | null
          author_id?: string | null
          visibility?: string
          repo_url?: string | null
          skill_md_url?: string | null
          docs_url?: string | null
          demo_url?: string | null
          install_command?: string | null
          prerequisites?: string[] | null
          stars_count?: number
          installs_count?: number
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
          last_synced_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          github_username: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          github_username?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          github_username?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          parent_id: string | null
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          parent_id?: string | null
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          parent_id?: string | null
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      installs: {
        Row: {
          id: string
          skill_id: string
          user_id: string | null
          installed_at: string
          source: string | null
        }
        Insert: {
          id?: string
          skill_id: string
          user_id?: string | null
          installed_at?: string
          source?: string | null
        }
        Update: {
          id?: string
          skill_id?: string
          user_id?: string | null
          installed_at?: string
          source?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      skill_tags: {
        Row: {
          skill_id: string
          tag_id: string
        }
        Insert: {
          skill_id: string
          tag_id: string
        }
        Update: {
          skill_id?: string
          tag_id?: string
        }
      }
      skill_verticals: {
        Row: {
          skill_id: string
          vertical_id: string
        }
        Insert: {
          skill_id: string
          vertical_id: string
        }
        Update: {
          skill_id?: string
          vertical_id?: string
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
