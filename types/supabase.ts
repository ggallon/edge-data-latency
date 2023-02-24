export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          emp_no: number
          first_name: string | null
          inserted_at: string | null
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          emp_no?: number
          first_name?: string | null
          inserted_at?: string | null
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          emp_no?: number
          first_name?: string | null
          inserted_at?: string | null
          last_name?: string | null
          updated_at?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
