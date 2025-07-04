import type { Line, Ticket, User } from './types';

export class DataService {
  static async getLines(): Promise<Line[]> {
    try {
      // In MVP1, load from JSON file
      const response = await import('../data/lines.json');
      // Cast the JSON data to match our Line interface (dates are strings in JSON)
      return response.default as unknown as Line[];
    } catch (error) {
      console.error('Failed to load lines data:', error);
      return [];
    }
  }

  static async getTickets(): Promise<Ticket[]> {
    try {
      // In MVP1, load from JSON file
      const response = await import('../data/tickets.json');
      // Cast the JSON data to match our Ticket interface (dates are strings in JSON)
      return response.default as unknown as Ticket[];
    } catch (error) {
      console.error('Failed to load tickets data:', error);
      return [];
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

  static async saveLines(lines: Line[]): Promise<void> {
    // MVP1: Browser localStorage for now
    // MVP2: API calls
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lines', JSON.stringify(lines));
    }
  }

  static async saveTickets(tickets: Ticket[]): Promise<void> {
    // MVP1: Browser localStorage for now
    // MVP2: API calls
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    }
  }

  // Helper functions for MVP1
  static calculateStats(lines: Line[]) {
    return {
      totalLines: lines.length,
      activeLines: lines.filter(line => line.status === 'active').length,
      monthlyTotal: lines.reduce((sum, line) => sum + line.plan.monthlyRate, 0),
      carrierBreakdown: lines.reduce((acc, line) => {
        acc[line.carrier] = (acc[line.carrier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // Calculate detailed cost breakdown from real data
  static calculateCostBreakdown(lines: Line[]) {
    const totalMonthly = lines.reduce((sum, line) => sum + line.plan.monthlyRate, 0);
    
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
      acc[carrier].monthlyCost += line.plan.monthlyRate;
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
