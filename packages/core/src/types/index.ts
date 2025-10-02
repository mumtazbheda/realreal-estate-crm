/**
 * Core types for Real Estate CRM
 */

export type Role = 'owner' | 'admin' | 'agent' | 'viewer'

export interface Tenant {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  created_at: string
  updated_at: string
}

export interface TenantUser {
  tenant_id: string
  user_id: string
  role: Role
  created_at: string
}

export interface Contact {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  tenant_id: string
  contact_id: string
  status: string
  source: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  tenant_id: string
  title: string
  description: string
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  tenant_id: string
  contact_id: string
  property_id: string
  stage: string
  amount: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  tenant_id: string
  assigned_to: string
  title: string
  due_date: string
  status: string
  created_at: string
  updated_at: string
}
