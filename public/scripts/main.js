// Main JavaScript for BlobLogic
document.addEventListener('DOMContentLoaded', function() {
  // Remove loading class to enable transitions
  document.documentElement.classList.remove('sidebar-loading');
  
  // Initialize the application
  initializeSidebar();
  initializeCharts();
  initializeSearch();
  initializeDropdowns();
  initializeGlobalSearch();
  initializeDarkMode();
  initializeDarkMode();
});

// Sidebar functionality
function initializeSidebar() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');

  if (sidebarToggle && sidebar && content) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      
      // Store sidebar state in localStorage and sync document class
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebarCollapsed', isCollapsed);
      
      // Update document class to match sidebar state
      if (isCollapsed) {
        document.documentElement.classList.add('sidebar-collapsed');
      } else {
        document.documentElement.classList.remove('sidebar-collapsed');
      }
    });
  }

  // Ensure sidebar state is properly synchronized
  const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
  if (sidebar) {
    if (sidebarCollapsed === 'true') {
      sidebar.classList.add('collapsed');
      document.documentElement.classList.add('sidebar-collapsed');
    } else if (sidebarCollapsed === 'false') {
      // Explicitly handle false case to remove any existing collapsed state
      sidebar.classList.remove('collapsed');
      document.documentElement.classList.remove('sidebar-collapsed');
    } else {
      // First time user - default to expanded
      sidebar.classList.remove('collapsed');
      document.documentElement.classList.remove('sidebar-collapsed');
      localStorage.setItem('sidebarCollapsed', 'false');
    }
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

// Global search functionality
function initializeGlobalSearch() {
  const searchInput = document.getElementById('global-search');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  let searchTimeout;
  
  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
      searchResults.classList.add('hidden');
      return;
    }
    
    // Debounce search
    searchTimeout = setTimeout(() => {
      performGlobalSearch(query);
    }, 300);
  });
  
  // Hide results when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.add('hidden');
    }
  });
}

function performGlobalSearch(query) {
  const searchResults = document.getElementById('search-results');
  
  // Normalize phone number for search
  const normalizedQuery = normalizePhoneNumber(query);
  
  // Mock search data - in real app, this would be an API call
  const mockData = {
    lines: [
      { number: '555-123-4567', user: 'John Smith', department: 'Sales', carrier: 'AT&T' },
      { number: '555.789.0123', user: 'Sarah Johnson', department: 'IT', carrier: 'Verizon' },
      { number: '555-456-7890', user: 'Mike Davis', department: 'Operations', carrier: 'T-Mobile' },
      { number: '(555) 321-9876', user: 'Lisa Wilson', department: 'HR', carrier: 'AT&T' },
    ],
    tickets: [
      { id: 'TK-001', subject: 'Line activation issue', status: 'Open', priority: 'High' },
      { id: 'TK-002', subject: 'Billing discrepancy', status: 'In Progress', priority: 'Medium' },
    ],
    carriers: [
      { name: 'AT&T Wireless', status: 'Active', services: 45 },
      { name: 'Verizon Business', status: 'Active', services: 62 },
    ]
  };
  
  const results = [];
  
  // Search lines
  mockData.lines.forEach(line => {
    const lineNumber = normalizePhoneNumber(line.number);
    if (lineNumber.includes(normalizedQuery) || 
        line.user.toLowerCase().includes(query.toLowerCase()) ||
        line.department.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        type: 'line',
        title: line.number,
        subtitle: `${line.user} - ${line.department}`,
        icon: 'fas fa-phone',
        color: 'text-blue-600',
        link: `/lines?search=${encodeURIComponent(line.number)}`
      });
    }
  });
  
  // Search tickets
  mockData.tickets.forEach(ticket => {
    if (ticket.subject.toLowerCase().includes(query.toLowerCase()) ||
        ticket.id.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        type: 'ticket',
        title: `${ticket.id}: ${ticket.subject}`,
        subtitle: `${ticket.status} - ${ticket.priority} Priority`,
        icon: 'fas fa-ticket-alt',
        color: 'text-orange-600',
        link: `/tickets?id=${ticket.id}`
      });
    }
  });
  
  // Search carriers
  mockData.carriers.forEach(carrier => {
    if (carrier.name.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        type: 'carrier',
        title: carrier.name,
        subtitle: `${carrier.services} services`,
        icon: 'fas fa-network-wired',
        color: 'text-purple-600',
        link: `/carriers?search=${encodeURIComponent(carrier.name)}`
      });
    }
  });
  
  displaySearchResults(results);
}

function normalizePhoneNumber(phone) {
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
}

function displaySearchResults(results) {
  const searchResults = document.getElementById('search-results');
  const resultsContainer = searchResults.querySelector('.max-h-96');
  
  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="p-4 text-center text-gray-500">
        <i class="fas fa-search text-2xl mb-2"></i>
        <p>No results found</p>
      </div>
    `;
  } else {
    resultsContainer.innerHTML = results.map(result => `
      <a href="${result.link}" class="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
        <div class="flex items-center space-x-3">
          <i class="${result.icon} ${result.color}"></i>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 truncate">${result.title}</div>
            <div class="text-xs text-gray-500 truncate">${result.subtitle}</div>
          </div>
          <div class="text-xs text-gray-400 uppercase tracking-wide">${result.type}</div>
        </div>
      </a>
    `).join('');
  }
  
  searchResults.classList.remove('hidden');
}

// Dark mode functionality
function initializeDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  if (darkModeToggle) {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial state
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      html.classList.add('dark');
      darkModeToggle.checked = true;
    }
    
    // Listen for toggle changes
    darkModeToggle.addEventListener('change', function() {
      if (this.checked) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }
}

// Export functions for use in other modules
window.TEM = {
  showLoading,
  hideLoading,
  showToast,
  updatePaginationInfo,
  initializeDarkMode
};
