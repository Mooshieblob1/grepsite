import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const ticketId = params.id;
    const { content, type, author } = await request.json();

    // Validate required fields
    if (!content || !author) {
      return new Response(JSON.stringify({ 
        error: 'Content and author are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate comment type
    const validTypes = ['internal', 'customer'];
    const commentType = type || 'internal';
    if (!validTypes.includes(commentType)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid comment type. Valid types: internal, customer' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create comment object
    const comment = {
      id: `comment-${Date.now()}`,
      ticketId: ticketId,
      type: commentType,
      content: content,
      author: author,
      timestamp: new Date().toISOString(),
      isInternal: commentType === 'internal'
    };

    // Create activity log entry
    const activity = {
      id: `activity-${Date.now()}`,
      type: 'comment',
      description: `${commentType === 'internal' ? 'Internal note' : 'Customer communication'} added`,
      timestamp: new Date().toISOString(),
      user: author
    };

    // In a real application, save to database
    // For now, return success response
    
    return new Response(JSON.stringify({
      success: true,
      comment: comment,
      activity: activity,
      message: `${commentType === 'internal' ? 'Internal note' : 'Customer comment'} added successfully`
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to add comment' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ params, url }) => {
  try {
    const ticketId = params.id;
    const searchParams = new URL(url).searchParams;
    const type = searchParams.get('type'); // 'internal', 'customer', or null for all

    // Mock comments for demonstration
    const mockComments = [
      {
        id: 'comment-001',
        ticketId: ticketId,
        type: 'internal',
        content: 'Customer verification completed. Proceeding with line provisioning.',
        author: 'John Smith - TEM Specialist',
        timestamp: new Date('2024-07-26T10:30:00Z').toISOString(),
        isInternal: true
      },
      {
        id: 'comment-002',
        ticketId: ticketId,
        type: 'customer',
        content: 'Hello, we have processed your request and will have the new line activated by the effective date. You will receive a confirmation email once complete.',
        author: 'TEM Support Team',
        timestamp: new Date('2024-07-26T14:15:00Z').toISOString(),
        isInternal: false
      },
      {
        id: 'comment-003',
        ticketId: ticketId,
        type: 'internal',
        content: 'Device shipped to user. Tracking number: 1234567890. Expected delivery: July 29th.',
        author: 'Sarah Wilson - Device Coordinator',
        timestamp: new Date('2024-07-27T09:45:00Z').toISOString(),
        isInternal: true
      }
    ];

    // Filter by type if specified
    let filteredComments = mockComments;
    if (type) {
      filteredComments = mockComments.filter(comment => comment.type === type);
    }

    // Sort by timestamp (newest first)
    filteredComments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return new Response(JSON.stringify({
      success: true,
      comments: filteredComments,
      total: filteredComments.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch comments' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
