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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          priority: number | null
          recommendation_type: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          priority?: number | null
          recommendation_type: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          priority?: number | null
          recommendation_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          instructor: string | null
          level: string | null
          modules_count: number | null
          rating: number | null
          students_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor?: string | null
          level?: string | null
          modules_count?: number | null
          rating?: number | null
          students_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor?: string | null
          level?: string | null
          modules_count?: number | null
          rating?: number | null
          students_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "user_course_progress"
            referencedColumns: ["course_id"]
          },
        ]
      }
      graph_recommendations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          reason: string | null
          score: number
          skill_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          reason?: string | null
          score: number
          skill_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          reason?: string | null
          score?: number
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "graph_recommendations_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_sessions: {
        Row: {
          completed_at: string | null
          duration_minutes: number | null
          feedback: string | null
          id: string
          improvements: string[] | null
          interview_type: string
          overall_score: number | null
          questions: Json | null
          responses: Json | null
          strengths: string[] | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          improvements?: string[] | null
          interview_type: string
          overall_score?: number | null
          questions?: Json | null
          responses?: Json | null
          strengths?: string[] | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          improvements?: string[] | null
          interview_type?: string
          overall_score?: number | null
          questions?: Json | null
          responses?: Json | null
          strengths?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      learning_activities: {
        Row: {
          accuracy_score: number | null
          activity_type: string
          completed_at: string | null
          created_at: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          engagement_score: number | null
          id: string
          skills_practiced: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          accuracy_score?: number | null
          activity_type: string
          completed_at?: string | null
          created_at?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          engagement_score?: number | null
          id?: string
          skills_practiced?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          accuracy_score?: number | null
          activity_type?: string
          completed_at?: string | null
          created_at?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          engagement_score?: number | null
          id?: string
          skills_practiced?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string
          status: Database["public"]["Enums"]["lesson_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id: string
          status?: Database["public"]["Enums"]["lesson_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string
          status?: Database["public"]["Enums"]["lesson_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string
          id: string
          module_id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          module_id: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          module_id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "user_course_progress"
            referencedColumns: ["course_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          module_id: string
          options: Json
          question_text: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          module_id: string
          options: Json
          question_text: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          module_id?: string
          options?: Json
          question_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_weeks: {
        Row: {
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          skills_focus: string[] | null
          status: string | null
          title: string
          topics: string[] | null
          updated_at: string | null
          user_id: string
          week_number: number
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          skills_focus?: string[] | null
          status?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string | null
          user_id: string
          week_number: number
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          skills_focus?: string[] | null
          status?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string | null
          user_id?: string
          week_number?: number
        }
        Relationships: []
      }
      skill_cluster_mapping: {
        Row: {
          cluster_id: string
          skill_id: string
        }
        Insert: {
          cluster_id: string
          skill_id: string
        }
        Update: {
          cluster_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_cluster_mapping_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "skill_clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_cluster_mapping_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_clusters: {
        Row: {
          career_path: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          career_path?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          career_path?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      skill_dependencies: {
        Row: {
          prerequisite_id: string
          skill_id: string
          weight: number | null
        }
        Insert: {
          prerequisite_id: string
          skill_id: string
          weight?: number | null
        }
        Update: {
          prerequisite_id?: string
          skill_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_dependencies_prerequisite_id_fkey"
            columns: ["prerequisite_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_dependencies_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty: number
          estimated_hours: number | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty: number
          estimated_hours?: number | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: number
          estimated_hours?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_description: string | null
          achievement_title: string
          badge_icon: string | null
          category: string | null
          earned_at: string | null
          id: string
          points_earned: number | null
          user_id: string
        }
        Insert: {
          achievement_description?: string | null
          achievement_title: string
          badge_icon?: string | null
          category?: string | null
          earned_at?: string | null
          id?: string
          points_earned?: number | null
          user_id: string
        }
        Update: {
          achievement_description?: string | null
          achievement_title?: string
          badge_icon?: string | null
          category?: string | null
          earned_at?: string | null
          id?: string
          points_earned?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          created_at: string | null
          description: string | null
          goal_type: string
          id: string
          priority: number | null
          status: string | null
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          goal_type?: string
          id?: string
          priority?: number | null
          status?: string | null
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          goal_type?: string
          id?: string
          priority?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          active_hours: string[] | null
          career_focuses: string[] | null
          created_at: string | null
          experience_level: string | null
          id: string
          learning_style: string | null
          motivation_type: string | null
          preferred_schedule: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_hours?: string[] | null
          career_focuses?: string[] | null
          created_at?: string | null
          experience_level?: string | null
          id?: string
          learning_style?: string | null
          motivation_type?: string | null
          preferred_schedule?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_hours?: string[] | null
          career_focuses?: string[] | null
          created_at?: string | null
          experience_level?: string | null
          id?: string
          learning_style?: string | null
          motivation_type?: string | null
          preferred_schedule?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_skill_graph: {
        Row: {
          created_at: string
          id: string
          is_unlocked: boolean | null
          last_practiced: string | null
          mastery_level: number | null
          reinforcement_count: number | null
          skill_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_unlocked?: boolean | null
          last_practiced?: string | null
          mastery_level?: number | null
          reinforcement_count?: number | null
          skill_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_unlocked?: boolean | null
          last_practiced?: string | null
          mastery_level?: number | null
          reinforcement_count?: number | null
          skill_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skill_graph_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          category: string
          created_at: string | null
          decay_rate: number | null
          id: string
          last_practiced: string | null
          level: number | null
          mastery_score: number | null
          reinforcement_count: number | null
          skill_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          decay_rate?: number | null
          id?: string
          last_practiced?: string | null
          level?: number | null
          mastery_score?: number | null
          reinforcement_count?: number | null
          skill_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          decay_rate?: number | null
          id?: string
          last_practiced?: string | null
          level?: number | null
          mastery_score?: number | null
          reinforcement_count?: number | null
          skill_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          consistency_score: number | null
          courses_completed: number | null
          created_at: string | null
          dropout_risk: string | null
          engagement_trend: string | null
          id: string
          last_activity: string | null
          learning_velocity: number | null
          placement_readiness: number | null
          skills_mastered: number | null
          total_learning_hours: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          consistency_score?: number | null
          courses_completed?: number | null
          created_at?: string | null
          dropout_risk?: string | null
          engagement_trend?: string | null
          id?: string
          last_activity?: string | null
          learning_velocity?: number | null
          placement_readiness?: number | null
          skills_mastered?: number | null
          total_learning_hours?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          consistency_score?: number | null
          courses_completed?: number | null
          created_at?: string | null
          dropout_risk?: string | null
          engagement_trend?: string | null
          id?: string
          last_activity?: string | null
          learning_velocity?: number | null
          placement_readiness?: number | null
          skills_mastered?: number | null
          total_learning_hours?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_course_progress: {
        Row: {
          completed_lessons: number | null
          course_description: string | null
          course_id: string | null
          course_title: string | null
          progress_percentage: number | null
          status: Database["public"]["Enums"]["enrollment_status"] | null
          total_lessons: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      increment_courses_completed: {
        Args: { user_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      enrollment_status: "in_progress" | "completed"
      lesson_status: "not_started" | "in_progress" | "completed"
      quiz_type: "module_quiz" | "final_exam"
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
      enrollment_status: ["in_progress", "completed"],
      lesson_status: ["not_started", "in_progress", "completed"],
      quiz_type: ["module_quiz", "final_exam"],
    },
  },
} as const
