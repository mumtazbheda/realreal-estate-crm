/**
 * Core types for Real Estate CRM (matching existing Supabase schema)
 */

export type Role = 'owner' | 'manager' | 'agent' | 'viewer' | 'super_admin'

// Using "company" instead of "tenant" to match existing schema
export interface Company {
  id: string
  name: string
  created_at: string
  updated_at?: string
}

export interface User {
  id: string
  tg_user_id?: string  // Telegram user ID
  email?: string
  full_name?: string
  created_at: string
}

export interface CompanyUser {
  company_id: string
  user_id: string
  role: Role
  created_at: string
}

export interface Contact {
  id: string
  company_id: string
  full_name?: string
  phone?: string
  email?: string
  created_by?: string
  created_at: string
}

export interface Lead {
  id: string
  company_id: string
  contact_id?: string
  title?: string
  status: string  // 'new', 'contacted', 'qualified', etc.
  source?: string
  assignee_id?: string
  budget?: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  company_id: string
  title?: string
  type?: string
  price?: number
  location?: string
  status?: string
  created_at: string
  updated_at?: string
}

export interface Deal {
  id: string
  company_id: string
  contact_id?: string
  property_id?: string
  pipeline_stage_id?: string
  amount?: number
  created_at: string
  updated_at?: string
}

export interface Task {
  id: string
  company_id: string
  assigned_to?: string
  title: string
  due_date?: string
  status: string
  created_at: string
  updated_at?: string
}

export interface Activity {
  id: string
  company_id: string
  actor_id?: string
  entity: string
  entity_id?: string
  verb: string
  delta?: Record<string, any>
  created_at: string
}

export interface PipelineStage {
  id: string
  company_id: string
  name: string
  order: number
  created_at: string
}

// Integration types
export interface WebhookEvent {
  id: string
  company_id?: string
  provider: string
  event_key: string
  payload: Record<string, any>
  status: 'received' | 'processed' | 'error'
  error?: string
  created_at: string
}

export interface WhatsAppMessage {
  id: string
  company_id?: string
  contact_id?: string
  direction: 'in' | 'out'
  contact_phone?: string
  message_id?: string
  body?: string
  media_url?: string
  meta?: Record<string, any>
  created_at: string
}

export interface EmailEvent {
  id: string
  company_id?: string
  contact_id?: string
  event_type: string
  email?: string
  campaign_id?: string
  campaign_name?: string
  meta?: Record<string, any>
  created_at: string
}

export interface Automation {
  id: string
  company_id: string
  name: string
  trigger_type: string
  action_type: string
  config: Record<string, any>
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface AutomationRun {
  id: string
  automation_id: string
  company_id: string
  entity_type?: string
  entity_id?: string
  status: 'success' | 'failed' | 'skipped'
  error?: string
  meta?: Record<string, any>
  created_at: string
}
