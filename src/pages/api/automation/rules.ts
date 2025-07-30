import type { APIRoute } from 'astro';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'schedule' | 'event' | 'condition';
    criteria: {
      // For schedule triggers
      cronExpression?: string;
      
      // For event triggers
      eventType?: 'employee_termination' | 'employee_onboarding' | 'location_change';
      
      // For condition triggers
      conditions?: Array<{
        field: string;
        operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
        value: string | number;
      }>;
    };
  };
  actions: Array<{
    type: 'create_macd' | 'update_status' | 'assign_team' | 'send_notification';
    parameters: {
      requestType?: 'move' | 'add' | 'change' | 'disconnect';
      assigneeTeam?: string;
      notificationTemplate?: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
    };
  }>;
  isActive: boolean;
  createdAt: string;
  lastExecuted?: string;
  executionCount: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.trigger || !data.actions) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: name, trigger, or actions' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate rule ID
    const ruleId = `RULE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const automationRule: AutomationRule = {
      id: ruleId,
      name: data.name,
      description: data.description || '',
      trigger: data.trigger,
      actions: data.actions,
      isActive: data.isActive !== false, // Default to true
      createdAt: new Date().toISOString(),
      executionCount: 0
    };

    return new Response(JSON.stringify({
      success: true,
      rule: automationRule,
      message: 'Automation rule created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to create automation rule',
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
    const isActive = searchParams.get('active');
    const triggerType = searchParams.get('triggerType');

    // Mock automation rules
    const mockRules: AutomationRule[] = [
      {
        id: 'RULE-001',
        name: 'Auto-disconnect terminated employees',
        description: 'Automatically create disconnect requests when employees are terminated',
        trigger: {
          type: 'event',
          criteria: {
            eventType: 'employee_termination'
          }
        },
        actions: [{
          type: 'create_macd',
          parameters: {
            requestType: 'disconnect',
            priority: 'high'
          }
        }],
        isActive: true,
        createdAt: '2024-07-01T10:00:00Z',
        lastExecuted: '2024-07-28T15:30:00Z',
        executionCount: 15
      },
      {
        id: 'RULE-002',
        name: 'New employee line provisioning',
        description: 'Auto-create line requests for new hires based on department',
        trigger: {
          type: 'event',
          criteria: {
            eventType: 'employee_onboarding'
          }
        },
        actions: [{
          type: 'create_macd',
          parameters: {
            requestType: 'add',
            priority: 'medium'
          }
        }],
        isActive: true,
        createdAt: '2024-06-15T14:20:00Z',
        lastExecuted: '2024-07-27T09:15:00Z',
        executionCount: 8
      },
      {
        id: 'RULE-003',
        name: 'Monthly usage review',
        description: 'Generate reports for lines with high usage overage charges',
        trigger: {
          type: 'schedule',
          criteria: {
            cronExpression: '0 0 1 * *' // First day of each month
          }
        },
        actions: [{
          type: 'send_notification',
          parameters: {
            notificationTemplate: 'usage_review'
          }
        }],
        isActive: false,
        createdAt: '2024-05-20T11:45:00Z',
        executionCount: 3
      }
    ];

    let filteredRules = mockRules;
    
    if (isActive !== null) {
      const activeFilter = isActive === 'true';
      filteredRules = filteredRules.filter(rule => rule.isActive === activeFilter);
    }
    
    if (triggerType) {
      filteredRules = filteredRules.filter(rule => rule.trigger.type === triggerType);
    }

    return new Response(JSON.stringify({
      success: true,
      rules: filteredRules,
      total: filteredRules.length,
      summary: {
        activeRules: mockRules.filter(r => r.isActive).length,
        totalExecutions: mockRules.reduce((sum, r) => sum + r.executionCount, 0)
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch automation rules' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PATCH: APIRoute = async ({ request, url }) => {
  try {
    const ruleId = new URL(url).searchParams.get('id');
    const updates = await request.json();

    if (!ruleId) {
      return new Response(JSON.stringify({ 
        error: 'Rule ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // In a real app, this would update the database
    const response = {
      success: true,
      ruleId: ruleId,
      updates: updates,
      updatedAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to update automation rule' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
