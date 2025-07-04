export interface Line {
  id: string;
  phoneNumber: string;
  carrier: string;
  employee: {
    name: string;
    email: string;
    department: string;
    employeeId: string;
  };
  device: {
    type: string;
    model: string;
  };
  plan: {
    name: string;
    monthlyRate: number;
  };
  status: 'active' | 'suspended' | 'terminated';
  contractEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: 'line_change' | 'new_line' | 'termination' | 'plan_change';
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  relatedLineId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  permissions: Permission[];
}

export enum Permission {
  MANAGE_LINES = 'manage_lines',
  VIEW_REPORTS = 'view_reports',
  UPLOAD_INVOICES = 'upload_invoices',
  CREATE_TICKETS = 'create_tickets',
  EXPORT_DATA = 'export_data'
}
