// Dynamic chart initialization with real data
// This file fetches data from the API endpoint and initializes charts

class ChartManager {
  constructor() {
    this.data = null;
    this.charts = {};
  }

  async loadData() {
    try {
      // In MVP1, we'll get data from the window object passed from Astro
      if (window.dashboardData) {
        this.data = window.dashboardData;
        return;
      }
      
      // Fallback: Create sample data structure matching our real data
      this.data = {
        lines: [
          { carrier: 'AT&T', plan: { monthlyRate: 75 }, status: 'active' },
          { carrier: 'Verizon', plan: { monthlyRate: 85 }, status: 'active' },
          { carrier: 'T-Mobile', plan: { monthlyRate: 90 }, status: 'suspended' },
          { carrier: 'AT&T', plan: { monthlyRate: 65 }, status: 'active' }
        ],
        carrierStats: this.calculateCarrierStats()
      };
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      this.data = { lines: [], carrierStats: [] };
    }
  }

  calculateCarrierStats() {
    if (!this.data?.lines) return [];
    
    const stats = this.data.lines.reduce((acc, line) => {
      const carrier = line.carrier;
      if (!acc[carrier]) {
        acc[carrier] = {
          name: carrier,
          monthlySpend: 0, // Using monthlySpend to match DataService
          lineCount: 0,
          activeLines: 0
        };
      }
      
      acc[carrier].monthlySpend += line.plan.monthlyRate; // Add to monthlySpend
      acc[carrier].lineCount++;
      if (line.status === 'active') {
        acc[carrier].activeLines++;
      }
      
      return acc;
    }, {});

    return Object.values(stats);
  }

  async initializeCharts() {
    await this.loadData();
    
    this.initCostChart();
    this.initServiceChart();
    this.initUsageTrendsChart();
    this.initCostAnalysisChart();
  }

  initCostChart() {
    const costCtx = document.getElementById('costChart');
    if (!costCtx || !this.data) return;

    const carrierStats = this.data.carrierStats || this.calculateCarrierStats();
    const labels = carrierStats.map(stat => stat.name);
    const data = carrierStats.map(stat => stat.monthlySpend || 0);
    
    const colors = [
      'rgba(59, 130, 246, 0.7)',   // Blue for AT&T
      'rgba(239, 68, 68, 0.7)',    // Red for Verizon  
      'rgba(236, 72, 153, 0.7)',   // Pink for T-Mobile
      'rgba(249, 115, 22, 0.7)',   // Orange for others
      'rgba(34, 197, 94, 0.7)',    // Green
      'rgba(107, 114, 128, 0.7)'   // Gray
    ];

    this.charts.costChart = new Chart(costCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Monthly Cost ($)',
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
              }
            }
          },
          legend: {
            display: false
          }
        }
      }
    });
  }

  initServiceChart() {
    const serviceCtx = document.getElementById('serviceChart');
    if (!serviceCtx || !this.data) return;

    const carrierStats = this.data.carrierStats || this.calculateCarrierStats();
    const labels = carrierStats.map(stat => stat.name);
    const data = carrierStats.map(stat => stat.lineCount);

    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(239, 68, 68, 0.8)', 
      'rgba(236, 72, 153, 0.8)',
      'rgba(249, 115, 22, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(107, 114, 128, 0.8)'
    ];

    this.charts.serviceChart = new Chart(serviceCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return context.label + ': ' + context.parsed + ' lines (' + percentage + '%)';
              }
            }
          }
        }
      }
    });
  }

  initUsageTrendsChart() {
    const usageCtx = document.getElementById('usageTrendsChart');
    if (!usageCtx) return;

    // Sample usage trends data - in MVP2 this would come from usage analytics
    this.charts.usageTrendsChart = new Chart(usageCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Voice Minutes (K)',
          data: [12, 19, 13, 15, 22, 18],
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }, {
          label: 'Data Usage (GB)',
          data: [8, 11, 9, 12, 16, 14],
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  initCostAnalysisChart() {
    const costAnalysisCtx = document.getElementById('costAnalysisChart');
    if (!costAnalysisCtx || !this.data) return;

    const carrierStats = this.data.carrierStats || this.calculateCarrierStats();
    const labels = carrierStats.map(stat => stat.name);
    const data = carrierStats.map(stat => stat.monthlySpend || 0); // Use monthlySpend

    this.charts.costAnalysisChart = new Chart(costAnalysisCtx.getContext('2d'), {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(107, 114, 128, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return context.label + ': $' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
              }
            }
          }
        }
      }
    });
  }

  destroy() {
    Object.values(this.charts).forEach(chart => chart.destroy());
    this.charts = {};
  }
}

// Expose a global function to initialize charts with data, but do not run it automatically.
window.initializeDashboardCharts = function(data) {
  if (typeof Chart !== 'undefined') {
    // Clean up previous charts if any
    if (window.chartManager) {
      window.chartManager.destroy();
    }
    
    const chartManager = new ChartManager();
    // Pass data directly to the manager
    chartManager.data = data;
    
    // Initialize all charts
    chartManager.initCostChart();
    chartManager.initServiceChart();
    chartManager.initUsageTrendsChart();
    chartManager.initCostAnalysisChart();
    
    // Store the manager instance globally
    window.chartManager = chartManager;
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChartManager;
}
