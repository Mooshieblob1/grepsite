// Main JavaScript for BlobLogic
document.addEventListener('DOMContentLoaded', function() {
  // Remove loading class to enable transitions
  document.documentElement.classList.remove('sidebar-loading');
  
  // Initialize the application
  initializeSidebar();
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

// Carrier modal functionality
function openCarrierModal(carrierId) {
  // TODO: Implement carrier modal functionality
  console.log('Opening carrier modal for:', carrierId);
  // For now, just show an alert
  alert(`Carrier details for ${carrierId} would open here`);
}

// Make function globally available
window.openCarrierModal = openCarrierModal;

// Export functions for use in other modules
window.TEM = {
  showLoading,
  hideLoading,
  showToast,
  updatePaginationInfo,
  initializeDarkMode
};

// Carrier Modal Logic
function openCarrierModal(carrierName, monthlyCost, lines, activeLines) {
  const modal = document.getElementById('carrier-modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const modalFooter = modal.querySelector('.modal-footer');

  // Set modal content
  modalTitle.textContent = carrierName;
  modalBody.innerHTML = `
    <p class="text-lg font-semibold">Monthly Cost: $${monthlyCost.toFixed(2)}</p>
    <p class="mt-2 text-sm text-gray-500">Lines:</p>
    <ul class="list-disc list-inside">
      ${lines.map(line => `<li>${line}</li>`).join('')}
    </ul>
    <p class="mt-2 text-sm text-gray-500">Active Lines: ${activeLines}</p>
  `;

  // Show modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Close carrier modal
const carrierModal = document.getElementById('carrier-modal');
if (carrierModal) {
  carrierModal.addEventListener('click', function(e) {
    if (e.target === carrierModal) {
      closeCarrierModal();
    }
  });
}

// Close modal function
function closeCarrierModal() {
  const modal = document.getElementById('carrier-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Make close function globally available
window.closeCarrierModal = closeCarrierModal;

// Note: The initializeCharts function has been removed from this file 
// to prevent conflicts with the dynamic charts.js manager.
