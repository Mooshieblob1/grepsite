import type { APIRoute } from 'astro';

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const ticketId = params.id;
    const { status, reason } = await request.json();

    // Validate status
    const validStatuses = ['new', 'open', 'pending', 'closed'];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // In a real app, this would update the database
    // For now, return success response
    const response = {
      success: true,
      ticketId,
      newStatus: status,
      updatedAt: new Date().toISOString(),
      activity: {
        type: 'status_change',
        description: `Status changed to ${status}${reason ? `: ${reason}` : ''}`,
        timestamp: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to update ticket status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
