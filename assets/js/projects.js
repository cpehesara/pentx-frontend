// ==================== Projects Page JavaScript ====================

(function() {
    'use strict';

    // ==================== Counter Animation for Statistics ====================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    // Intersection Observer for counter animation
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // ==================== Filter Functionality ====================
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const techFilter = document.getElementById('techFilter');
    const sortFilter = document.getElementById('sortFilter');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const industryBtns = document.querySelectorAll('.industry-btn');

    // View toggle
    if (gridViewBtn && listViewBtn) {
        const projectsGrid = document.querySelector('.row.g-4');
        
        gridViewBtn.addEventListener('click', function() {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            if (projectsGrid) {
                projectsGrid.classList.remove('list-view');
            }
        });

        listViewBtn.addEventListener('click', function() {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            if (projectsGrid) {
                projectsGrid.classList.add('list-view');
            }
        });
    }

    // Industry filter buttons
    industryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            industryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const industry = this.getAttribute('data-industry');
            if (categoryFilter) {
                categoryFilter.value = industry;
                updateClearButtonVisibility();
            }
        });
    });

    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'all';
            if (techFilter) techFilter.value = 'all';
            if (sortFilter) sortFilter.value = 'default';
            
            industryBtns.forEach(btn => {
                if (btn.getAttribute('data-industry') === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            clearFiltersBtn.style.display = 'none';
            
            const activeFilters = document.getElementById('activeFilters');
            if (activeFilters) {
                activeFilters.innerHTML = '';
            }
        });
    }

    // Show clear button when filters are active
    function updateClearButtonVisibility() {
        const hasActiveFilters = 
            (searchInput && searchInput.value !== '') ||
            (categoryFilter && categoryFilter.value !== 'all') ||
            (techFilter && techFilter.value !== 'all') ||
            (sortFilter && sortFilter.value !== 'default');
        
        if (clearFiltersBtn) {
            clearFiltersBtn.style.display = hasActiveFilters ? 'block' : 'none';
        }
    }

    // Add event listeners for filter changes
    if (searchInput) searchInput.addEventListener('input', updateClearButtonVisibility);
    if (categoryFilter) categoryFilter.addEventListener('change', updateClearButtonVisibility);
    if (techFilter) techFilter.addEventListener('change', updateClearButtonVisibility);
    if (sortFilter) sortFilter.addEventListener('change', updateClearButtonVisibility);

})();