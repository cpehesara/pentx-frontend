// ==================== Form Handlers - Contact & Demo ====================

(function() {
    'use strict';

    // ==================== Contact Form ====================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (contactForm.checkValidity()) {
                showFormMessage('contactForm', 'formMessage', 'success', 
                    '<i class="fas fa-check-circle me-2"></i> <strong>Success!</strong> Your message has been sent. We will get back to you within 24 hours.');
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            } else {
                contactForm.classList.add('was-validated');
            }
        }, false);
    }

    // ==================== Demo Form ====================
    const demoForm = document.getElementById('demoForm');
    
    if (demoForm) {
        // Set minimum date to today
        const preferredDateInput = document.getElementById('preferredDate');
        if (preferredDateInput) {
            preferredDateInput.min = new Date().toISOString().split('T')[0];
        }

        // Service Selection Handler
        const serviceCheckboxes = document.querySelectorAll('input[name="services[]"]');
        const selectedServicesSummary = document.getElementById('selectedServicesSummary');
        const selectedServiceTags = document.getElementById('selectedServiceTags');
        const selectedCount = document.getElementById('selectedCount');
        const servicesError = document.getElementById('servicesError');
        
        const serviceNames = {
            'web-development': 'Web Development',
            'mobile-apps': 'Mobile Apps',
            'uiux-design': 'UI/UX Design',
            'software-integration': 'Software Integration',
            'cloud-solutions': 'Cloud Solutions',
            'maintenance': 'Maintenance & Support',
            'data-dashboards': 'Data Dashboards',
            'ecommerce': 'E-commerce'
        };

        // Update selected services display
        function updateSelectedServices() {
            const selected = Array.from(serviceCheckboxes).filter(cb => cb.checked);
            selectedCount.textContent = selected.length;
            
            selectedServiceTags.innerHTML = '';
            
            if (selected.length > 0) {
                selectedServicesSummary.classList.add('show');
                servicesError.style.display = 'none';
                
                selected.forEach(checkbox => {
                    const tag = document.createElement('span');
                    tag.className = 'selected-service-tag';
                    tag.innerHTML = `
                        ${serviceNames[checkbox.value]}
                        <i class="fas fa-times" data-value="${checkbox.value}"></i>
                    `;
                    
                    const removeIcon = tag.querySelector('i');
                    removeIcon.addEventListener('click', function(e) {
                        e.preventDefault();
                        removeService(this.dataset.value);
                    });
                    
                    selectedServiceTags.appendChild(tag);
                });
            } else {
                selectedServicesSummary.classList.remove('show');
            }
            
            // Update card styling
            serviceCheckboxes.forEach(cb => {
                const card = cb.closest('.service-checkbox-card');
                if (cb.checked) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });
        }

        // Remove service function
        function removeService(value) {
            const checkbox = document.querySelector(`input[value="${value}"]`);
            if (checkbox) {
                checkbox.checked = false;
                updateSelectedServices();
            }
        }

        // Add event listeners to checkboxes
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectedServices);
        });

        // Form submission
        demoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const selectedServices = Array.from(serviceCheckboxes).filter(cb => cb.checked);
            const isValid = demoForm.checkValidity() && selectedServices.length > 0;
            
            if (selectedServices.length === 0) {
                servicesError.style.display = 'block';
                servicesError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                servicesError.style.display = 'none';
            }
            
            if (isValid) {
                showFormMessage('demoForm', 'demoFormMessage', 'success',
                    '<i class="fas fa-check-circle me-2"></i> <strong>Success!</strong> Your demo has been booked. We will contact you within 24 hours to confirm the details.');
                demoForm.reset();
                demoForm.classList.remove('was-validated');
                updateSelectedServices();
            } else {
                demoForm.classList.add('was-validated');
            }
        }, false);
    }

    // ==================== Shared Form Message Function ====================
    function showFormMessage(formId, messageId, type, message) {
        const formMessage = document.getElementById(messageId);
        const form = document.getElementById(formId);
        
        if (!formMessage || !form) return;
        
        formMessage.className = `alert alert-${type} mt-${formId === 'demoForm' ? '4' : '3'}`;
        formMessage.innerHTML = message;
        formMessage.style.display = 'block';
        
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 7000);
    }

    // ==================== Form Validation Enhancement ====================
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

})();

async function submitDemoForm(event) {
    event.preventDefault();

    const data = {
        fullName: document.getElementById("full-name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        company: document.getElementById("company").value,
        services: [...document.querySelectorAll("input[name='services']:checked")].map(i => i.value),
        preferredDate: document.getElementById("date").value,
        preferredTime: document.getElementById("time").value,
        projectDetails: document.getElementById("details").value,
        budget: document.getElementById("budget").value,
        demoType: document.querySelector("input[name='demo-type']:checked").value,
        submittedAt: new Date().toISOString()
    };

    const response = await fetch("/.netlify/functions/submitDemo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
        alert("Demo request saved to MongoDB!");
    } else {
        alert("Failed: " + result.error);
    }
}