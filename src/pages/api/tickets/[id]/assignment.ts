import type { APIRoute } from 'astro';

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const ticketId = params.id;
    const { assigneeName, assigneeEmail, team } = await request.json();

    if (!assigneeName) {
      return new Response(JSON.stringify({ 
        error: 'Assignee name is required'
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
      assignment: {
        assigneeName,
        assigneeEmail,
        team: team || 'TEM Operations',
        assignedAt: new Date().toISOString()
      },
      activity: {
        type: 'assignment',
        description: `Ticket assigned to ${assigneeName}${team ? ` (${team})` : ''}`,
        timestamp: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to assign ticket',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
