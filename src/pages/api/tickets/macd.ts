import type { APIRoute } from 'astro';

export interface MACDTicketRequest {
  requestType: 'move' | 'add' | 'change' | 'disconnect';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedBy: {
    name: string;
    email: string;
    department: string;
  };
  requestedFor?: {
    name: string;
    email: string;
    department: string;
  };
  lineDetails: {
    phoneNumber?: string;
    circuitId?: string;
    deviceType?: string;
    imei?: string;
    serialNumber?: string;
    carrier?: string;
    currentPlan?: string;
    requestedPlan?: string;
    location?: string; // for moves
  };
  actionDescription: string;
  effectiveDate: string;
  subject: string;
  attachments?: string[];
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: MACDTicketRequest = await request.json();
    
    // Validate required fields
    if (!data.requestType || !data.requestedBy?.name || !data.requestedBy?.email || !data.subject) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: requestType, requestedBy (name, email), or subject' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate ticket ID
    const ticketId = `MACD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create MACD ticket object
    const mACDTicket = {
      id: ticketId,
      type: 'macd',
      requestType: data.requestType,
      subject: data.subject,
      description: data.actionDescription,
      status: 'new',
      priority: data.priority || 'medium',
      requestedBy: data.requestedBy,
      requestedFor: data.requestedFor || data.requestedBy,
      lineDetails: data.lineDetails,
      effectiveDate: data.effectiveDate,
      attachments: data.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activities: [{
        id: `activity-${Date.now()}`,
        type: 'created',
        description: `MACD ticket created for ${data.requestType.toUpperCase()} request`,
        timestamp: new Date().toISOString(),
        user: data.requestedBy.name
      }]
    };

    // In a real application, save to database
    // For now, we'll return the created ticket
    
    return new Response(JSON.stringify({
      success: true,
      ticket: mACDTicket,
      message: `MACD ${data.requestType} ticket created successfully`
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating MACD ticket:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create MACD ticket',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    // Mock MACD tickets for demonstration
    const mockMACDTickets = [
      {
        id: 'MACD-001',
        type: 'macd',
        requestType: 'add',
        subject: 'New line for Marketing Manager',
        description: 'Request for new iPhone line with unlimited plan',
        status: 'in_progress',
        priority: 'medium',
        requestedBy: { name: 'Sarah Johnson', email: 'sarah@company.com', department: 'HR' },
        requestedFor: { name: 'Mike Chen', email: 'mike@company.com', department: 'Marketing' },
        lineDetails: {
          deviceType: 'iPhone 15 Pro',
          carrier: 'Verizon',
          requestedPlan: 'Unlimited Premium'
        },
        effectiveDate: '2024-08-01',
        createdAt: new Date('2024-07-25').toISOString(),
        updatedAt: new Date('2024-07-26').toISOString()
      },
      {
        id: 'MACD-002',
        type: 'macd',
        requestType: 'change',
        subject: 'Plan upgrade for CEO',
        description: 'Upgrade from Business plan to Unlimited Premium',
        status: 'awaiting_info',
        priority: 'high',
        requestedBy: { name: 'IT Admin', email: 'admin@company.com', department: 'IT' },
        requestedFor: { name: 'John CEO', email: 'ceo@company.com', department: 'Executive' },
        lineDetails: {
          phoneNumber: '(555) 123-4567',
          currentPlan: 'Business Plus',
          requestedPlan: 'Unlimited Premium',
          carrier: 'AT&T'
        },
        effectiveDate: '2024-08-15',
        createdAt: new Date('2024-07-20').toISOString(),
        updatedAt: new Date('2024-07-28').toISOString()
      }
    ];

    // Filter tickets based on query parameters
    let filteredTickets = mockMACDTickets;
    
    if (type) {
      filteredTickets = filteredTickets.filter(ticket => ticket.requestType === type);
    }
    
    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }
    
    if (priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
    }

    return new Response(JSON.stringify({
      success: true,
      tickets: filteredTickets,
      total: filteredTickets.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching MACD tickets:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch MACD tickets' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
