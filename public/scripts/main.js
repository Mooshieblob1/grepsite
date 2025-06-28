// Main JavaScript for TEM Portal
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  initializeSidebar();
  initializeCharts();
  initializeSearch();
  initializeDropdowns();
});

// Sidebar functionality
function initializeSidebar() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');

  if (sidebarToggle && sidebar && content) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      
      // Store sidebar state in localStorage
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebarCollapsed', isCollapsed);
    });
  }

  // Restore sidebar state from localStorage
  const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
  if (sidebarCollapsed === 'true' && sidebar) {
    sidebar.classList.add('collapsed');
  }

  // Mobile sidebar handling
  handleMobileSidebar();
  
  // Handle active nav item highlighting
  highlightActiveNavItem();
}

function highlightActiveNavItem() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '/')) {
      item.classList.add('bg-indigo-700');
      item.classList.remove('hover:bg-indigo-700');
    } else {
      item.classList.remove('bg-indigo-700');
      item.classList.add('hover:bg-indigo-700');
    }
  });
}

function handleMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  const sidebarToggle = document.getElementById('sidebar-toggle');

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
        content.classList.remove('sidebar-open');
      }
    }
  });

  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('open');
      content.classList.remove('sidebar-open');
    }
  });
}

// Charts initialization
function initializeCharts() {
  // Cost by Carrier Chart
  const costCtx = document.getElementById('costChart');
  if (costCtx) {
    const costChart = new Chart(costCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['AT&T', 'Verizon', 'T-Mobile', 'Vonage', 'Zoom', 'Sprint'],
        datasets: [{
          label: 'Monthly Cost ($)',
          data: [8750, 12340, 5670, 7890, 4520, 0],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(234, 88, 12, 0.7)',
            'rgba(220, 38, 38, 0.7)',
            'rgba(22, 163, 74, 0.7)',
            'rgba(107, 114, 128, 0.7)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(99, 102, 241, 1)',
            'rgba(234, 88, 12, 1)',
            'rgba(220, 38, 38, 1)',
            'rgba(22, 163, 74, 1)',
            'rgba(107, 114, 128, 1)'
          ],
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
                return '$' + context.raw.toLocaleString();
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

  // Service Distribution Chart
  const serviceCtx = document.getElementById('serviceChart');
  if (serviceCtx) {
    const serviceChart = new Chart(serviceCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Wireless', 'VoIP', 'Internet', 'Landline', 'Other'],
        datasets: [{
          data: [85, 42, 36, 18, 6],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(234, 88, 12, 0.7)',
            'rgba(22, 163, 74, 0.7)',
            'rgba(107, 114, 128, 0.7)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(99, 102, 241, 1)',
            'rgba(234, 88, 12, 1)',
            'rgba(22, 163, 74, 1)',
            'rgba(107, 114, 128, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}

// Search functionality
function initializeSearch() {
  const searchInput = document.querySelector('input[placeholder="Search carriers..."]');
  const carrierCards = document.querySelectorAll('.carrier-card');

  if (searchInput && carrierCards.length > 0) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      
      carrierCards.forEach(card => {
        const carrierName = card.querySelector('h3').textContent.toLowerCase();
        const isVisible = carrierName.includes(searchTerm);
        
        card.style.display = isVisible ? 'block' : 'none';
        
        // Add smooth transition
        if (isVisible) {
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 100);
        }
      });
      
      // Update pagination info based on visible cards
      updatePaginationInfo();
    });
  }
}

// Dropdown functionality
function initializeDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('button');
    const content = dropdown.querySelector('.dropdown-content');
    
    if (button && content) {
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
          content.style.display = 'none';
        }
      });
      
      // Toggle dropdown on click
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = content.style.display === 'block';
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(dc => {
          dc.style.display = 'none';
        });
        
        // Toggle current dropdown
        content.style.display = isVisible ? 'none' : 'block';
      });
    }
  });
}

// Utility functions
function updatePaginationInfo() {
  const visibleCards = document.querySelectorAll('.carrier-card[style*="display: block"], .carrier-card:not([style*="display: none"])');
  const paginationInfo = document.querySelector('.text-sm.text-gray-500');
  
  if (paginationInfo && visibleCards.length >= 0) {
    const total = visibleCards.length;
    const showing = Math.min(6, total);
    paginationInfo.innerHTML = `Showing <span class="font-medium">1</span> to <span class="font-medium">${showing}</span> of <span class="font-medium">${total}</span> carriers`;
  }
}

// Loading states
function showLoading(element) {
  element.classList.add('loading');
}

function hideLoading(element) {
  element.classList.remove('loading');
}

// Toast notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transform transition-all duration-300 translate-x-full`;
  
  switch(type) {
    case 'success':
      toast.classList.add('bg-green-500');
      break;
    case 'error':
      toast.classList.add('bg-red-500');
      break;
    case 'warning':
      toast.classList.add('bg-yellow-500');
      break;
    default:
      toast.classList.add('bg-blue-500');
  }
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Export functions for use in other modules
window.TEM = {
  showLoading,
  hideLoading,
  showToast,
  updatePaginationInfo
};
