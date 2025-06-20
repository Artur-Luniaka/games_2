// Checkout Page Functionality
class CheckoutPage {
  constructor() {
    this.init();
  }

  init() {
    this.renderOrderSummary();
    this.setupFormValidation();
    this.setupEventListeners();
  }

  renderOrderSummary() {
    if (window.cart) {
      window.cart.renderOrderSummary();
    }
  }

  setupFormValidation() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    // Email validation
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.addEventListener("blur", () => {
        this.validateEmail(emailInput);
      });
    }
  }

  setupEventListeners() {
    const form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmission();
      });
    }

    // Place order button
    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", (e) => {
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

  validateForm() {
    const form = document.getElementById("checkout-form");
    if (!form) return false;

    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (field.type === "email") {
        if (!this.validateEmail(field)) {
          isValid = false;
        }
      } else if (field.type === "checkbox") {
        if (!field.checked) {
          this.showFieldError(field, "This field is required");
          isValid = false;
        } else {
          this.clearFieldError(field);
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
      return;
    }

    try {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Create and show overlay
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      document.body.appendChild(overlay);

      await this.processOrder();
      this.showOrderSuccess();
    } catch (error) {
      console.error("Error processing order:", error);
      this.showNotification(
        "Error processing your order. Please try again.",
        "error"
      );
    }
  }

  async processOrder() {
    // Here you would typically send the order to your backend
    // For now, we'll just simulate a successful order
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  showOrderSuccess() {
    // Clear the cart
    if (window.cart) {
      window.cart.clearCart();
    }

    // Hide the checkout content
    const checkoutContent = document.querySelector(".checkout-content");
    if (checkoutContent) {
      checkoutContent.style.display = "none";
    }

    // Show success message
    const successMessage = document.getElementById("success-message");
    if (successMessage) {
      successMessage.style.display = "flex";
    }

    // Redirect to home page after 10 seconds
    setTimeout(() => {
      window.location.href = "./";
    }, 10000);
  }

  // Функция для показа уведомлений
  showNotification(message, type = "success") {
    // Создаем элемент уведомления
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    // Добавляем иконку в зависимости от типа уведомления
    const icon =
      type === "success"
        ? '<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : '<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

    notification.innerHTML = `
      ${icon}
      <div class="notification-content">
        <h3>${type === "success" ? "Success!" : "Error!"}</h3>
        <p>${message}</p>
      </div>
      <button class="notification-close" aria-label="Close notification">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    // Добавляем уведомление на страницу
    document.body.appendChild(notification);

    // Добавляем класс для анимации появления
    setTimeout(() => notification.classList.add("show"), 10);

    // Добавляем обработчик для кнопки закрытия
    const closeButton = notification.querySelector(".notification-close");
    closeButton.addEventListener("click", () => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    });

    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize checkout page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CheckoutPage();
});
