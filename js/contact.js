document.addEventListener('DOMContentLoaded', function() {
    // Initialize common components from app.js
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
    
    if (typeof initNewsletter === 'function') {
        initNewsletter();
    }
    
    // Handle FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class on the clicked question
            this.classList.toggle('active');
            
            // Close other FAQs when one is opened
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.classList.remove('active');
                }
            });
        });
    });
    
    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Create form message elements
        const successMessage = document.createElement('div');
        successMessage.className = 'form-message success';
        successMessage.innerHTML = '<p>Your message has been sent successfully! We\'ll get back to you soon.</p>';
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-message error';
        errorMessage.innerHTML = '<p>There was an error sending your message. Please try again.</p>';
        
        // Insert message elements before the form
        contactForm.parentNode.insertBefore(successMessage, contactForm);
        contactForm.parentNode.insertBefore(errorMessage, contactForm);
        
        // Form validation and submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous error states
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            
            // Hide previous messages
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            
            // Get form fields
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const subjectField = document.getElementById('subject');
            const messageField = document.getElementById('message');
            
            // Validation flags
            let hasErrors = false;
            
            // Validate name
            if (!nameField.value.trim()) {
                setFieldError(nameField, 'Please enter your name');
                hasErrors = true;
            }
            
            // Validate email
            if (!emailField.value.trim()) {
                setFieldError(emailField, 'Please enter your email');
                hasErrors = true;
            } else if (!isValidEmail(emailField.value)) {
                setFieldError(emailField, 'Please enter a valid email address');
                hasErrors = true;
            }
            
            // Validate subject
            if (!subjectField.value) {
                setFieldError(subjectField, 'Please select a subject');
                hasErrors = true;
            }
            
            // Validate message
            if (!messageField.value.trim()) {
                setFieldError(messageField, 'Please enter your message');
                hasErrors = true;
            } else if (messageField.value.trim().length < 10) {
                setFieldError(messageField, 'Your message is too short (minimum 10 characters)');
                hasErrors = true;
            }
            
            // If there are errors, stop form submission
            if (hasErrors) {
                return;
            }
            
            // In a real application, you would send the form data to a server
            // For this demo, we'll simulate a successful form submission
            simulateFormSubmission(contactForm);
        });
        
        // Helper function to set field error
        function setFieldError(field, errorMessage) {
            const formGroup = field.closest('.form-group');
            formGroup.classList.add('error');
            
            // Create or update error text
            let errorText = formGroup.querySelector('.error-text');
            
            if (!errorText) {
                errorText = document.createElement('div');
                errorText.className = 'error-text';
                formGroup.appendChild(errorText);
            }
            
            errorText.textContent = errorMessage;
        }
        
        // Helper function to validate email format
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Simulate form submission with a delay
        function simulateFormSubmission(form) {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate network delay
            setTimeout(() => {
                // Simulate successful submission (in a real app, this would be the server response)
                const success = Math.random() > 0.1; // 90% success rate for demo
                
                if (success) {
                    // Show success message
                    successMessage.style.display = 'block';
                    form.reset();
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    // Show error message
                    errorMessage.style.display = 'block';
                    
                    // Scroll to error message
                    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }, 1500);
        }
    }
});
