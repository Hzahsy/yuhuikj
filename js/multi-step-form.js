class MultiStepForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.steps = Array.from(this.form.querySelectorAll('.form-step'));
        this.nextButtons = this.form.querySelectorAll('.form-next-btn');
        this.prevButtons = this.form.querySelectorAll('.form-prev-btn');
        this.submitButton = this.form.querySelector('.form-submit-btn');
        this.progressSteps = this.form.querySelectorAll('.progress-step');
        this.currentStep = 0;
        
        this.initialize();
    }
    
    initialize() {
        // Show first step
        this.showStep(0);
        
        // Add event listeners
        this.nextButtons.forEach(button => {
            button.addEventListener('click', () => this.nextStep());
        });
        
        this.prevButtons.forEach(button => {
            button.addEventListener('click', () => this.prevStep());
        });
        
        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    showStep(stepIndex) {
        // Hide all steps
        this.steps.forEach(step => step.classList.remove('active'));
        
        // Show current step
        this.steps[stepIndex].classList.add('active');
        
        // Update progress indicator
        this.progressSteps.forEach((step, index) => {
            if (index <= stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update current step
        this.currentStep = stepIndex;
    }
    
    nextStep() {
        // Validate current step before proceeding
        if (this.validateStep(this.currentStep)) {
            if (this.currentStep < this.steps.length - 1) {
                this.showStep(this.currentStep + 1);
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    validateStep(stepIndex) {
        const currentStep = this.steps[stepIndex];
        const requiredFields = currentStep.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value && !field.checked) {
                isValid = false;
                this.showError(field, 'Este campo es obligatorio');
            } else {
                this.clearError(field);
                
                // Additional validation for specific fields
                if (field.type === 'email' && !this.isValidEmail(field.value)) {
                    isValid = false;
                    this.showError(field, 'Por favor, introduce un correo electrónico válido');
                }
                
                if (field.name === 'cp' && !/^\d{5}$/.test(field.value)) {
                    isValid = false;
                    this.showError(field, 'Por favor, introduce un código postal válido de 5 dígitos');
                }
                
                if (field.name === 'phone' && !/^[0-9]{9}$/.test(field.value)) {
                    isValid = false;
                    this.showError(field, 'Por favor, introduce un número de teléfono válido de 9 dígitos');
                }
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all steps before submission
        let allStepsValid = true;
        for (let i = 0; i < this.steps.length; i++) {
            if (!this.validateStep(i)) {
                allStepsValid = false;
                this.showStep(i);
                break;
            }
        }
        
        if (!allStepsValid) return;
        
        // Show loading state
        const originalButtonText = this.submitButton.innerHTML;
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        try {
            // Get all form data
            const formData = new FormData(this.form);
            const vivienda = formData.get('vivienda') || 'casa';
            
            // Map form data to match backend expectations
            const data = {
                name: formData.get('name') || '',
                email: formData.get('email') || '',
                phone: formData.get('phone') || '',
                address: formData.get('address') || 'No proporcionada',
                postal_code: formData.get('postal_code') || '',
                property_type: vivienda,
                property_owner: 'propietario', // Default value as required by backend
                message: `Tipo de vivienda: ${vivienda}`
            };
            
            // Debug: Log the collected data
            console.log('Form data being submitted:', data);
            
            // Validate required fields
            const requiredFields = ['name', 'email', 'phone', 'postal_code', 'address'];
            for (const field of requiredFields) {
                if (!data[field]) {
                    throw new Error(`${field.replace('_', ' ')} is required`);
                }
            }
            
            // Send data to server
            console.log('Sending request to server with data:', data);

            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('Received response status:', response.status);
            
            let result;
            try {
                const responseText = await response.text();
                console.log('Raw server response:', responseText);
                result = responseText ? JSON.parse(responseText) : {};
                console.log('Parsed server response:', result);
            } catch (e) {
                console.error('Error parsing JSON response:', e);
                throw new Error('Error al procesar la respuesta del servidor. Por favor, inténtalo de nuevo más tarde.');
            }
            
            if (response.ok) {
                // Show success message
                this.showMessage('¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.', 'success');
                // Reset form
                this.form.reset();
                // Go back to first step
                this.showStep(0);
            } else {
                // Extract error message from different possible response formats
                const errorMessage = result.error?.message || 
                                  result.errors?.[0]?.msg || 
                                  result.message || 
                                  'Error al enviar el formulario';
                
                console.error('Server error details:', {
                    status: response.status,
                    statusText: response.statusText,
                    response: result
                });
                
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            this.showMessage(error.message || 'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.', 'error');
        } finally {
            // Reset button state
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = originalButtonText;
        }
    }
    
    showError(field, message) {
        // Remove any existing error
        this.clearError(field);
        
        // Add error class to field
        field.classList.add('error');
        
        // Create and show error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e53e3e';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        // Insert after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    clearError(field) {
        // Remove error class
        field.classList.remove('error');
        
        // Remove error message if it exists
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    showMessage(message, type = 'info') {
        // Remove any existing messages
        const existingMessages = this.form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.padding = '12px 15px';
        messageElement.style.margin = '15px 0';
        messageElement.style.borderRadius = '4px';
        messageElement.style.fontSize = '14px';
        
        if (type === 'success') {
            messageElement.style.backgroundColor = '#d4edda';
            messageElement.style.color = '#155724';
            messageElement.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            messageElement.style.backgroundColor = '#f8d7da';
            messageElement.style.color = '#721c24';
            messageElement.style.border = '1px solid #f5c6cb';
        } else {
            messageElement.style.backgroundColor = '#e2e3e5';
            messageElement.style.color = '#383d41';
            messageElement.style.border = '1px solid #d6d8db';
        }
        
        // Insert message before the form
        this.form.parentNode.insertBefore(messageElement, this.form);
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.opacity = '0';
                setTimeout(() => messageElement.remove(), 300);
            }, 5000);
        }
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MultiStepForm('multiStepForm');
});
