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

    // Card number formatting
    const cardNumberInput = document.getElementById("card-number");
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", (e) => {
        this.formatCardNumber(e.target);
      });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById("expiry");
    if (expiryInput) {
      expiryInput.addEventListener("input", (e) => {
        this.formatExpiryDate(e.target);
      });
    }

    // CVV validation
    const cvvInput = document.getElementById("cvv");
    if (cvvInput) {
      cvvInput.addEventListener("input", (e) => {
        this.validateCVV(e.target);
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

  formatCardNumber(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    input.value = value.substring(0, 19);
  }

  formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    input.value = value.substring(0, 5);
  }

  validateCVV(input) {
    const value = input.value.replace(/\D/g, "");
    input.value = value.substring(0, 4);
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

    // Validate card number
    const cardNumber = document.getElementById("card-number");
    if (cardNumber && cardNumber.value.replace(/\s/g, "").length < 13) {
      this.showFieldError(cardNumber, "Please enter a valid card number");
      isValid = false;
    }

    // Validate expiry date
    const expiry = document.getElementById("expiry");
    if (expiry && !this.validateExpiryDate(expiry.value)) {
      this.showFieldError(expiry, "Please enter a valid expiry date (MM/YY)");
      isValid = false;
    }

    // Validate CVV
    const cvv = document.getElementById("cvv");
    if (cvv && cvv.value.length < 3) {
      this.showFieldError(cvv, "Please enter a valid CVV");
      isValid = false;
    }

    return isValid;
  }

  validateExpiryDate(expiry) {
    if (!expiry || expiry.length !== 5) return false;

    const [month, year] = expiry.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) return false;
    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    )
      return false;

    return true;
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
      if (window.cart) {
        window.cart.showNotification(
          "Please fix the errors in the form",
          "error"
        );
      }
      return;
    }

    if (!window.cart || window.cart.getCartCount() === 0) {
      if (window.cart) {
        window.cart.showNotification("Your cart is empty", "error");
      }
      return;
    }

    // Show loading state
    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.textContent = "Processing...";
      placeOrderBtn.disabled = true;
    }

    try {
      // Simulate order processing
      await this.processOrder();

      // Clear cart
      if (window.cart) {
        window.cart.clearCart();
      }

      // Show success message
      this.showOrderSuccess();
    } catch (error) {
      console.error("Order processing error:", error);
      if (window.cart) {
        window.cart.showNotification(
          "Error processing order. Please try again.",
          "error"
        );
      }

      // Reset button
      if (placeOrderBtn) {
        placeOrderBtn.textContent = "Place Order";
        placeOrderBtn.disabled = false;
      }
    }
  }

  async processOrder() {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  showOrderSuccess() {
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `
                <div class="container">
                    <div style="text-align: center; padding: 4rem 0;">
                        <div style="font-size: 4rem; margin-bottom: 2rem;">🎉</div>
                        <h1>Order Placed Successfully!</h1>
                        <p>Thank you for your purchase. You will receive an email confirmation shortly with your game download links.</p>
                        <div style="margin-top: 2rem;">
                            <a href="index.html" class="btn btn-primary">Continue Shopping</a>
                        </div>
                    </div>
                </div>
            `;
    }
  }
}

// Initialize checkout page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CheckoutPage();
});
