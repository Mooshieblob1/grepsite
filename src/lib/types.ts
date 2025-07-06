export interface Line {
  id: number;
  lineNumber: string;
  carrier: string;
  status: 'active' | 'suspended' | 'terminated';
  monthlyCost: number;
  contractEnd: string;
  assignedUser: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: number;
  title: string; // Changed from subject
  description: string;
  type: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  lineId?: number;
  userId?: string;
  created_at: string; // Changed from createdAt
  updated_at: string; // Changed from updatedAt
  assignee_name?: string; // Added from view
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  department?: string;
  jobTitle?: string;
  memberSince?: string;
  lastLogin?: string;
  location?: string;
  permissions?: Permission[];
}

export enum Permission {
  MANAGE_LINES = 'manage_lines',
  VIEW_REPORTS = 'view_reports',
  UPLOAD_INVOICES = 'upload_invoices',
  CREATE_TICKETS = 'create_tickets',
  EXPORT_DATA = 'export_data'
}

export interface Invoice {
  id: string;
  carrier: string;
  invoiceDate: Date;
  dueDate: Date;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  filePath: string; // Path to the uploaded invoice file
  createdAt: Date;
  updatedAt: Date;
}
