// ==================== Services Page Filter Functionality ====================

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const serviceItems = document.querySelectorAll('.service-item');
        const resultCount = document.getElementById('resultCount');
        const totalCount = document.getElementById('totalCount');
        const noResults = document.getElementById('noResults');
        
        if (!filterButtons.length || !serviceItems.length) return;
        
        // Set total count
        totalCount.textContent = serviceItems.length;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter services with animation
                let visibleCount = 0;
                
                serviceItems.forEach((item, index) => {
                    const categories = item.getAttribute('data-category').split(' ');
                    const card = item.querySelector('.service-detail-card');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        // Show item with staggered animation
                        setTimeout(() => {
                            item.style.display = 'block';
                            if (card) {
                                card.classList.remove('fade-out', 'hidden');
                                card.classList.add('fade-in');
                            }
                        }, index * 50);
                        visibleCount++;
                    } else {
                        // Hide item
                        if (card) {
                            card.classList.add('fade-out');
                            setTimeout(() => {
                                item.style.display = 'none';
                                card.classList.add('hidden');
                            }, 300);
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
                
                // Update counter and show/hide no results message
                setTimeout(() => {
                    resultCount.textContent = visibleCount;
                    
                    if (visibleCount === 0 && noResults) {
                        noResults.classList.add('show');
                    } else if (noResults) {
                        noResults.classList.remove('show');
                    }
                }, 350);
                
                // Smooth scroll to services section
                const servicesSection = document.querySelector('.services-section');
                if (servicesSection) {
                    setTimeout(() => {
                        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            });
        });
    });
})();