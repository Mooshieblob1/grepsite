import type { Line, Ticket } from './types';

export class DataService {
  static async getLines(): Promise<Line[]> {
    try {
      // In MVP1, load from JSON file
      const response = await import('../data/lines.json');
      return response.default;
    } catch (error) {
      console.error('Failed to load lines data:', error);
      return [];
    }
  }

  static async getTickets(): Promise<Ticket[]> {
    try {
      // In MVP1, load from JSON file
      const response = await import('../data/tickets.json');
      return response.default;
    } catch (error) {
      console.error('Failed to load tickets data:', error);
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
}
