export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          journey_stage: string | null;
          religious_background: string | null;
          preferred_lesson_length: number | null;
          preferred_content_type: string | null;
          timezone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          journey_stage?: string | null;
          religious_background?: string | null;
          preferred_lesson_length?: number | null;
          preferred_content_type?: string | null;
          timezone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          journey_stage?: string | null;
          religious_background?: string | null;
          preferred_lesson_length?: number | null;
          preferred_content_type?: string | null;
          timezone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_journeys: {
        Row: {
          id: string;
          profile_id: string;
          journey_id: string;
          status: string;
          started_at: string;
          completed_at: string | null;
          last_lesson_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          journey_id: string;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          last_lesson_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          journey_id?: string;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          last_lesson_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          profile_id: string;
          journey_id: string;
          lesson_id: string;
          status: string;
          progress_percent: number;
          last_position: number | null;
          started_at: string | null;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          journey_id: string;
          lesson_id: string;
          status?: string;
          progress_percent?: number;
          last_position?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          status?: string;
          progress_percent?: number;
          last_position?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          profile_id: string;
          content_type: string;
          content_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          content_type: string;
          content_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      question_submissions: {
        Row: {
          id: string;
          profile_id: string | null;
          anonymous_id: string | null;
          question: string;
          category: string | null;
          status: string;
          is_anonymous: boolean;
          submitted_from: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          anonymous_id?: string | null;
          question: string;
          category?: string | null;
          status?: string;
          is_anonymous?: boolean;
          submitted_from?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          question?: string;
          category?: string | null;
          status?: string;
          is_anonymous?: boolean;
          submitted_from?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      notification_preferences: {
        Row: {
          profile_id: string;
          daily_lesson_enabled: boolean;
          weekly_summary_enabled: boolean;
          question_answered_enabled: boolean;
          email_frequency: string;
          preferred_send_time: string | null;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          daily_lesson_enabled?: boolean;
          weekly_summary_enabled?: boolean;
          question_answered_enabled?: boolean;
          email_frequency?: string;
          preferred_send_time?: string | null;
          updated_at?: string;
        };
        Update: {
          daily_lesson_enabled?: boolean;
          weekly_summary_enabled?: boolean;
          question_answered_enabled?: boolean;
          email_frequency?: string;
          preferred_send_time?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
