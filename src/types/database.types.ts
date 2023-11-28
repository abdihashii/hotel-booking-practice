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
      bookings: {
        Row: {
          check_in_date: string
          check_out_date: string
          created_at: string
          guest_name: string
          id: string
          room_name: string
        }
        Insert: {
          check_in_date: string
          check_out_date: string
          created_at?: string
          guest_name: string
          id?: string
          room_name: string
        }
        Update: {
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          guest_name?: string
          id?: string
          room_name?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
