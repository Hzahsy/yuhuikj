// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando...';

    // Simulate form submission (replace with actual AJAX call)
    setTimeout(() => {
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'form-success';
      successMessage.innerHTML =
        '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
      contactForm.appendChild(successMessage);

      // Reset form
      contactForm.reset();

      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    }, 1500);
  });
}