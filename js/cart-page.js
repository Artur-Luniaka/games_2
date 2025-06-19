// Cart Page Functionality
class CartPage {
  constructor() {
    this.init();
  }

  init() {
    // Ждем инициализации cart
    setTimeout(() => {
      this.renderCart();
      this.setupEventListeners();
    }, 100);
  }

  renderCart() {
    if (window.cart) {
      window.cart.renderCart();
    }
  }

  setupEventListeners() {
    // Checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.proceedToCheckout();
      });
    }
  }

  proceedToCheckout() {
    if (window.cart && window.cart.getCartCount() > 0) {
      window.location.href = "checkout.html";
    } else {
      if (window.cart) {
        window.cart.showNotification("Your cart is empty", "error");
      }
    }
  }
}

// Initialize cart page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CartPage();
});
