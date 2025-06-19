// Contact Page Functionality
class ContactPage {
  constructor() {
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupEventListeners();
  }

  setupFormValidation() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    // Email validation
    const emailInput = document.getElementById("contact-email");
    if (emailInput) {
      emailInput.addEventListener("blur", () => {
        this.validateEmail(emailInput);
      });
    }

    // Name validation
    const nameInput = document.getElementById("contact-name");
    if (nameInput) {
      nameInput.addEventListener("blur", () => {
        this.validateName(nameInput);
      });
    }
  }

  setupEventListeners() {
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmission();
      });
    }
  }

  validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      this.showFieldError(input, "Please enter a valid email address");
      return false;
    } else {
      this.clearFieldError(input);
      return true;
    }
  }

  validateName(input) {
    const name = input.value.trim();

    if (name.length < 2) {
      this.showFieldError(input, "Name must be at least 2 characters long");
      return false;
    } else {
      this.clearFieldError(input);
      return true;
    }
  }

  validateForm() {
    const form = document.getElementById("contact-form");
    if (!form) return false;

    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (field.type === "email") {
        if (!this.validateEmail(field)) {
          isValid = false;
        }
      } else if (field.type === "text") {
        if (field.id === "contact-name") {
          if (!this.validateName(field)) {
            isValid = false;
          }
        } else {
          if (!field.value.trim()) {
            this.showFieldError(field, "This field is required");
            isValid = false;
          } else {
            this.clearFieldError(field);
          }
        }
      } else {
        if (!field.value.trim()) {
          this.showFieldError(field, "This field is required");
          isValid = false;
        } else {
          this.clearFieldError(field);
        }
      }
    });

    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    field.classList.add("error");

    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;
    errorDiv.style.color = "#dc2626";
    errorDiv.style.fontSize = "0.875rem";
    errorDiv.style.marginTop = "0.25rem";

    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.classList.remove("error");
    const errorDiv = field.parentNode.querySelector(".field-error");
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  async handleFormSubmission() {
    if (!this.validateForm()) {
      this.showNotification("Please fix the errors in the form", "error");
      return;
    }

    const form = document.getElementById("contact-form");
    const submitBtn = form.querySelector('button[type="submit"]');

    // Show loading state
    if (submitBtn) {
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;
    }

    try {
      // Simulate form submission
      await this.submitForm();

      // Show success message
      this.showSuccessMessage();

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      this.showNotification(
        "Error sending message. Please try again.",
        "error"
      );
    } finally {
      // Reset button
      if (submitBtn) {
        submitBtn.textContent = "Send Message";
        submitBtn.disabled = false;
      }
    }
  }

  async submitForm() {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }

  showSuccessMessage() {
    const form = document.getElementById("contact-form");
    if (form) {
      form.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h2>Message Sent Successfully!</h2>
                    <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                        Send Another Message
                    </button>
                </div>
            `;
    }
  }

  showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    if (notification) {
      notification.textContent = message;
      notification.className = `notification ${type}`;
      notification.classList.add("show");

      setTimeout(() => {
        notification.classList.remove("show");
      }, 3000);
    }
  }
}

// Initialize contact page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ContactPage();
});
