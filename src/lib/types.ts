export interface Line {
  id: number;
  lineNumber: string;
  phoneNumber: string;
  carrier: string;
  status: 'active' | 'suspended' | 'terminated';
  monthlyCost: number;
  monthlyRate: number;
  contractEnd: string;
  assignedUser: string;
  employee: string;
  employeeId?: string;
  costCenter?: string;
  department: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDB {
  id: number;
  subject: string; 
  description: string;
  type: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  line_id?: number;
  user_id?: string;
  created_at: string; 
  updated_at: string; 
  assignee_name?: string; 
}

export interface Ticket {
  id: number;
  title: string; 
  description: string;
  type: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  lineId?: number;
  userId?: string;
  createdAt: Date; 
  updatedAt: Date; 
  assigneeName?: string; 
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
