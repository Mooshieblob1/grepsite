import type { Line, Ticket, User, Invoice, TicketDB } from './types';
import { supabase } from './supabase';

export class DataService {
  static async getLines(): Promise<Line[]> {
    try {
      const { data, error } = await supabase.from('lines').select('*');
      if (error) throw error;
      return data as Line[];
    } catch (error) {
      console.error('Failed to load lines data from Supabase, falling back to local file:', error);
      // Fallback to original implementation
      const response = await import('../data/lines.json');
      // Convert the JSON data to match our Line interface
      const jsonLines = response.default as any[];
      return jsonLines.map(line => ({
        id: typeof line.id === 'string' ? parseInt(line.id.split('-')[1]) : line.id,
        lineNumber: line.phoneNumber,
        phoneNumber: line.phoneNumber,
        carrier: line.carrier,
        status: line.status,
        monthlyCost: line.plan?.monthlyRate || 0,
        monthlyRate: line.plan?.monthlyRate || 0,
        contractEnd: line.contractEnd,
        assignedUser: line.employee?.name || 'Unknown',
        employee: line.employee?.name || 'Unknown',
        employeeId: line.employee?.employeeId || `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        costCenter: `CC-${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
        department: line.employee?.department || 'Unknown',
        plan: line.plan?.name || 'Unknown',
        createdAt: line.createdAt,
        updatedAt: line.updatedAt
      })) as Line[];
    }
  }

  static async getTickets(): Promise<Ticket[]> {
    try {
      const { data, error } = await supabase.from('tickets').select('*');
      if (error) throw error;

      // Map snake_case from DB to camelCase
      const tickets: Ticket[] = (data as TicketDB[]).map(t => ({
        id: t.id,
        title: t.subject, // map subject to title
        description: t.description,
        type: t.type,
        status: t.status,
        priority: t.priority,
        lineId: t.line_id,
        userId: t.user_id,
        createdAt: new Date(t.created_at.replace(' ', 'T')), // Convert to Date object
        updatedAt: new Date(t.updated_at.replace(' ', 'T')), // Convert to Date object
        assigneeName: t.assignee_name,
      }));

      return tickets;
    } catch (error) {
      console.error('Failed to load tickets data from Supabase, falling back to local file:', error);
      // Fallback to original implementation
      const response = await import('../data/tickets.json');
      // Convert the JSON data to match our Ticket interface (convert string dates to Date objects and map fields)
      const jsonTickets = response.default as any[];
      return jsonTickets.map(ticket => {
        // Ensure we have a valid Date object
        const createdDate = ticket.createdAt instanceof Date ? ticket.createdAt : new Date(ticket.createdAt);
        const updatedDate = ticket.updatedAt instanceof Date ? ticket.updatedAt : new Date(ticket.updatedAt);
        
        return {
          id: typeof ticket.id === 'string' ? parseInt(ticket.id.split('-')[1]) : ticket.id,
          title: ticket.title,
          description: ticket.description,
          type: ticket.type,
          status: ticket.status,
          priority: ticket.priority,
          lineId: ticket.relatedLineId ? parseInt(ticket.relatedLineId.split('-')[1]) : undefined,
          userId: ticket.createdBy,
          assigneeName: ticket.assignee,
          createdAt: createdDate,
          updatedAt: updatedDate
        };
      }) as Ticket[];
    }
  }

  static async getInvoices(): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase.from('invoices').select('*');
      if (error) throw error;
      return data as Invoice[];
    } catch (error) {
      console.error('Failed to load invoices data from Supabase, falling back to local file:', error);
      // Fallback to original implementation
      const response = await import('../data/invoices.json');
      // Convert the JSON data to match our Invoice interface
      const jsonInvoices = response.default as any[];
      return jsonInvoices.map(invoice => ({
        id: invoice.id,
        carrier: invoice.carrierId, // Map carrierId to carrier field
        invoiceDate: new Date(invoice.invoiceDate),
        dueDate: new Date(invoice.dueDate),
        totalAmount: invoice.totalAmount,
        status: invoice.status.toLowerCase(),
        filePath: '', // Default empty path for JSON data
        createdAt: new Date(), // Default to current date
        updatedAt: new Date()  // Default to current date
      })) as Invoice[];
    }
  }

  static async getUsers(): Promise<User[]> {
    try {
      // In MVP1, load from JSON file
      const response = await import('../data/users.json');
      // Cast the JSON data to match our User interface (dates are strings in JSON)
      return response.default as unknown as User[];
    } catch (error) {
      console.error('Failed to load users data:', error);
      return [];
    }
  }

  static async getTicketById(id: number): Promise<Ticket | undefined> {
    try {
      const { data, error } = await supabase.from('tickets').select('*').eq('id', id).single();
      if (error) {
        // If the ticket is not found, Supabase might return an error.
        // We'll log it and fall back gracefully.
        console.warn(`Could not fetch ticket #${id} from Supabase:`, error.message);
      } else if (data) {
        return data as Ticket;
      }

      // Fallback to local file if Supabase fails or returns no data
      console.log(`Falling back to local JSON for ticket #${id}`);
      const response = await import('../data/tickets.json');
      const jsonTickets = response.default as any[];
      const ticket = jsonTickets.find(t => t.id === id || t.id === `ticket-${String(id).padStart(3, '0')}`);
      
      if (ticket) {
        return {
          id: typeof ticket.id === 'string' ? parseInt(ticket.id.split('-')[1]) : ticket.id,
          title: ticket.title,
          description: ticket.description,
          type: ticket.type,
          status: ticket.status,
          priority: ticket.priority,
          lineId: ticket.relatedLineId ? parseInt(ticket.relatedLineId.split('-')[1]) : undefined,
          userId: ticket.createdBy,
          assigneeName: ticket.assignee,
          createdAt: new Date(ticket.createdAt),
          updatedAt: new Date(ticket.updatedAt)
        } as Ticket;
      }
      
      return undefined;

    } catch (error) {
      console.error(`Failed to load ticket ${id}:`, error);
      return undefined;
    }
  }

  static async getUser(email: string, password: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      return user || null;
    } catch (error) {
      console.error('Failed to authenticate user:', error);
      return null;
    }
  }

  static async saveLines(lines: Line[]): Promise<void> {
    try {
      const { error } = await supabase.from('lines').upsert(lines);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to save lines to Supabase:', error);
      // Fallback to original implementation
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('lines', JSON.stringify(lines));
      }
    }
  }

  static async saveTickets(tickets: Ticket[]): Promise<void> {
    try {
      const { error } = await supabase.from('tickets').upsert(tickets);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to save tickets to Supabase:', error);
      // Fallback to original implementation
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('tickets', JSON.stringify(tickets));
      }
    }
  }

  static async saveInvoices(invoices: Invoice[]): Promise<void> {
    try {
      const { error } = await supabase.from('invoices').upsert(invoices);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to save invoices to Supabase:', error);
      // Fallback to original implementation
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('invoices', JSON.stringify(invoices));
      }
    }
  }

  // Helper functions for MVP1
  static calculateStats(lines: Line[]) {
    return {
      totalLines: lines.length,
      activeLines: lines.filter(line => line.status === 'active').length,
      suspendedLines: lines.filter(line => line.status === 'suspended').length,
      monthlyTotal: lines.reduce((sum, line) => sum + (line.monthlyCost || 0), 0),
      totalMonthlyCharges: lines.reduce((sum, line) => sum + (line.monthlyCost || 0), 0),
      carrierBreakdown: lines.reduce((acc, line) => {
        acc[line.carrier] = (acc[line.carrier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // Calculate detailed cost breakdown from real data
  static calculateCostBreakdown(lines: Line[]) {
    const totalMonthly = lines.reduce((sum, line) => sum + (line.monthlyCost || 0), 0);
    
    // Estimate breakdown based on typical carrier billing
    const lineCharges = totalMonthly * 0.75; // ~75% for basic service
    const additionalCharges = totalMonthly * 0.15; // ~15% for features/overages
    const equipmentCharges = totalMonthly * 0.10; // ~10% for device payments
    
    return {
      lineCharges,
      additionalCharges,
      equipmentCharges,
      total: totalMonthly,
      lineChargesPercent: (lineCharges / totalMonthly * 100).toFixed(1),
      additionalChargesPercent: (additionalCharges / totalMonthly * 100).toFixed(1),
      equipmentChargesPercent: (equipmentCharges / totalMonthly * 100).toFixed(1)
    };
  }

  // Calculate carrier-specific stats
  static calculateCarrierStats(lines: Line[]) {
    const carrierStats = lines.reduce((acc, line) => {
      const carrier = line.carrier;
      if (!acc[carrier]) {
        acc[carrier] = {
          name: carrier,
          lineCount: 0,
          monthlyCost: 0,
          activeLines: 0,
          status: 'Active', // Default, could be enhanced
          icon: this.getCarrierIcon(carrier),
          iconColor: this.getCarrierIconColor(carrier),
          contractEnd: line.contractEnd
        };
      }
      
      acc[carrier].lineCount++;
      acc[carrier].monthlyCost += (line.monthlyCost || 0);
      if (line.status === 'active') {
        acc[carrier].activeLines++;
      }
      
      // Find the latest contract end date for this carrier
      if (line.contractEnd && (!acc[carrier].contractEnd || new Date(line.contractEnd) > new Date(acc[carrier].contractEnd))) {
        acc[carrier].contractEnd = line.contractEnd;
      }
      
      return acc;
    }, {} as Record<string, any>);

    // Format contract end dates and determine carrier status
    return Object.values(carrierStats).map((carrier: any) => ({
      ...carrier,
      totalLines: carrier.lineCount,
      monthlySpend: carrier.monthlyCost,
      avgPerLine: carrier.lineCount > 0 ? carrier.monthlyCost / carrier.lineCount : 0,
      contractEnd: carrier.contractEnd ? this.formatContractEndDate(carrier.contractEnd) : 'N/A',
      status: carrier.contractEnd ? this.getCarrierStatus(carrier.contractEnd) : 'Unknown'
    }));
  }

  private static getCarrierIcon(carrier: string): string {
    const iconMap: Record<string, string> = {
      'Verizon': 'fas fa-signal',
      'AT&T': 'fas fa-signal', 
      'T-Mobile': 'fas fa-signal',
      'Sprint': 'fas fa-broadcast-tower',
      'Vonage': 'fas fa-phone',
      'Zoom': 'fas fa-video'
    };
    return iconMap[carrier] || 'fas fa-signal';
  }

  private static getCarrierIconColor(carrier: string): string {
    const colorMap: Record<string, string> = {
      'Verizon': 'bg-red-100',
      'AT&T': 'bg-blue-100',
      'T-Mobile': 'bg-pink-100', 
      'Sprint': 'bg-indigo-100',
      'Vonage': 'bg-orange-100',
      'Zoom': 'bg-green-100'
    };
    return colorMap[carrier] || 'bg-gray-100';
  }

  private static formatContractEndDate(contractEnd: string): string {
    const date = new Date(contractEnd);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short'
    });
  }

  private static getCarrierStatus(contractEnd: string): string {
    const today = new Date();
    const endDate = new Date(contractEnd);
    const monthsUntilEnd = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsUntilEnd < 0) {
      return 'Expired';
    } else if (monthsUntilEnd < 3) {
      return 'Expiring Soon';
    } else {
      return 'Active';
    }
  }
}

// Export convenience functions for common operations
export const getLines = () => DataService.getLines();
export const getTickets = () => DataService.getTickets();
export const getUsers = () => DataService.getUsers();
export const getUser = (email: string, password: string) => DataService.getUser(email, password);
