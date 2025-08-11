import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const sql = neon(process.env.DATABASE_URL)

// Types
export interface School {
  id: number
  name: string
  address?: string
  director_id?: number
  total_classes: number
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  role: 'student' | 'teacher' | 'director' | 'admin'
  school_id?: number
  grade?: string
  points: number
  level: number
  created_at: string
  updated_at: string
}

export interface Class {
  id: number
  name: string
  grade: string
  school_id: number
  teacher_id?: number
  student_count: number
  created_at: string
}

export interface EcoAction {
  id: number
  name: string
  description?: string
  points: number
  category?: string
  icon?: string
  created_at: string
}

export interface UserAction {
  id: number
  user_id: number
  action_id: number
  quantity: number
  points_earned: number
  description?: string
  photo_url?: string
  status: string
  created_at: string
}

export interface Challenge {
  id: number
  title: string
  description?: string
  target_value: number
  points_reward: number
  start_date?: string
  end_date?: string
  challenge_type?: string
  school_id?: number
  created_by?: number
  created_at: string
}

export interface UserChallenge {
  id: number
  user_id: number
  challenge_id: number
  current_progress: number
  completed: boolean
  completed_at?: string
  created_at: string
}

export interface Badge {
  id: number
  name: string
  description?: string
  icon?: string
  points_required?: number
  created_at: string
}

export interface UserBadge {
  id: number
  user_id: number
  badge_id: number
  earned_at: string
}
