import type { APIRoute } from 'astro';

export interface BulkMACDRequest {
  operations: Array<{
    requestType: 'move' | 'add' | 'change' | 'disconnect';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    requestedBy: {
      name: string;
      email: string;
      department: string;
    };
    lineDetails: {
      phoneNumber?: string;
      circuitId?: string;
      deviceType?: string;
      carrier?: string;
      currentPlan?: string;
      requestedPlan?: string;
      location?: string;
    };
    actionDescription: string;
    effectiveDate: string;
    subject: string;
  }>;
  batchName: string;
  scheduledDate?: string;
  approvalRequired?: boolean;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: BulkMACDRequest = await request.json();
    
    if (!data.operations || data.operations.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'At least one operation is required for bulk processing' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate each operation
    const errors: string[] = [];
    data.operations.forEach((op, index) => {
      if (!op.requestType || !op.subject) {
        errors.push(`Operation ${index + 1}: Missing requestType or subject`);
      }
    });

    if (errors.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Validation errors',
        details: errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate batch ID
    const batchId = `BATCH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create individual tickets for each operation
    const createdTickets = data.operations.map((operation, index) => {
      const ticketId = `MACD-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id: ticketId,
        batchId: batchId,
        type: 'macd',
        requestType: operation.requestType,
        subject: operation.subject,
        description: operation.actionDescription,
        status: data.approvalRequired ? 'pending_approval' : 'new',
        priority: operation.priority || 'medium',
        requestedBy: operation.requestedBy,
        lineDetails: operation.lineDetails,
        effectiveDate: operation.effectiveDate,
        scheduledDate: data.scheduledDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    const response = {
      success: true,
      batchId: batchId,
      batchName: data.batchName,
      totalOperations: data.operations.length,
      status: data.approvalRequired ? 'pending_approval' : 'processing',
      tickets: createdTickets,
      scheduledDate: data.scheduledDate,
      createdAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to process bulk MACD request',
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
    const batchId = searchParams.get('batchId');
    const status = searchParams.get('status');

    // Mock bulk operation batches
    const mockBatches = [
      {
        batchId: 'BATCH-001',
        batchName: 'Q4 2024 Office Relocation',
        totalOperations: 25,
        status: 'processing',
        progress: {
          completed: 15,
          pending: 8,
          failed: 2
        },
        scheduledDate: '2024-10-01',
        createdAt: '2024-09-15T10:00:00Z'
      },
      {
        batchId: 'BATCH-002',
        batchName: 'New Employee Onboarding - September',
        totalOperations: 12,
        status: 'completed',
        progress: {
          completed: 12,
          pending: 0,
          failed: 0
        },
        scheduledDate: '2024-09-01',
        createdAt: '2024-08-25T14:30:00Z'
      }
    ];

    let filteredBatches = mockBatches;
    
    if (batchId) {
      filteredBatches = filteredBatches.filter(batch => batch.batchId === batchId);
    }
    
    if (status) {
      filteredBatches = filteredBatches.filter(batch => batch.status === status);
    }

    return new Response(JSON.stringify({
      success: true,
      batches: filteredBatches,
      total: filteredBatches.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch bulk operations' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
