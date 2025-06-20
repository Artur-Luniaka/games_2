// Cart Management System
class Cart {
  constructor() {
    this.cart = this.loadCart();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateCartCount();
  }

  loadCart() {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.updateCartCount();
  }

  addToCart(game) {
    const existingItem = this.cart.find((item) => item.id === game.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: game.id,
        title: game.title,
        price: game.price,
        image: game.image,
        quantity: 1,
      });
    }

    this.saveCart();
    this.showNotification(`${game.title} added to cart!`);
  }

  removeFromCart(gameId) {
    this.cart = this.cart.filter((item) => item.id !== gameId);
    this.saveCart();
    this.showNotification("Item removed from cart");
  }

  updateQuantity(gameId, quantity) {
    const item = this.cart.find((item) => item.id === gameId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(gameId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  getCartTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      const count = this.getCartCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? "flex" : "none";
    }
  }

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

  setupEventListeners() {
    // Listen for add to cart button clicks
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart-btn")) {
        e.preventDefault();
        const gameId = parseInt(e.target.dataset.gameId);
        this.handleAddToCart(gameId);
      }
    });

    // Listen for quantity changes
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("quantity-btn")) {
        e.preventDefault();
        const gameId = parseInt(e.target.dataset.gameId);
        const action = e.target.dataset.action;
        this.handleQuantityChange(gameId, action);
      }
    });

    // Listen for remove item clicks
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        e.preventDefault();
        const gameId = parseInt(e.target.dataset.gameId);
        this.removeFromCart(gameId);
        this.renderCart(); // Re-render if on cart page
      }
    });
  }

  async handleAddToCart(gameId) {
    try {
      const response = await fetch("data/games.json");
      const games = await response.json();
      const game = games.find((g) => g.id === gameId);

      if (game) {
        this.addToCart(game);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      this.showNotification("Error adding item to cart", "error");
    }
  }

  handleQuantityChange(gameId, action) {
    const item = this.cart.find((item) => item.id === gameId);
    if (item) {
      let newQuantity = item.quantity;

      if (action === "increase") {
        newQuantity += 1;
      } else if (action === "decrease") {
        newQuantity -= 1;
      }

      this.updateQuantity(gameId, newQuantity);
      this.renderCart(); // Re-render if on cart page
    }
  }

  renderCart() {
    const cartItems = document.getElementById("cart-items");
    const emptyCart = document.getElementById("empty-cart");
    const cartSummary = document.getElementById("cart-summary");

    if (!cartItems) return;

    if (this.cart.length === 0) {
      cartItems.style.display = "none";
      if (emptyCart) emptyCart.style.display = "block";
      if (cartSummary) cartSummary.style.display = "none";
      return;
    }

    cartItems.style.display = "block";
    if (emptyCart) emptyCart.style.display = "none";
    if (cartSummary) cartSummary.style.display = "block";

    cartItems.innerHTML = this.cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-main">
                    <img src="${item.image}" alt="${
          item.title
        }" class="cart-item-image">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>Platform: PC</p> 
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-game-id="${
                          item.id
                        }" data-action="decrease">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" data-game-id="${
                          item.id
                        }" data-action="increase">+</button>
                    </div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <button class="remove-btn" data-game-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `
      )
      .join("");

    this.updateCartSummary();
  }

  updateCartSummary() {
    const subtotal = this.getCartTotal();
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    if (subtotalElement)
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
  }

  renderOrderSummary() {
    const orderItems = document.getElementById("order-items");
    const orderSubtotal = document.getElementById("order-subtotal");
    const orderTax = document.getElementById("order-tax");
    const orderTotal = document.getElementById("order-total");

    if (!orderItems) return;

    orderItems.innerHTML = this.cart
      .map(
        (item) => `
            <div class="order-item">
                <div class="order-item-info">
                    <h4>${item.title}</h4>
                    <span>Quantity: ${item.quantity}</span>
                </div>
                <div class="order-item-price">$${(
                  item.price * item.quantity
                ).toFixed(2)}</div>
            </div>
        `
      )
      .join("");

    const subtotal = this.getCartTotal();
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    if (orderSubtotal) orderSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (orderTax) orderTax.textContent = `$${tax.toFixed(2)}`;
    if (orderTotal) orderTotal.textContent = `$${total.toFixed(2)}`;
  }

  // Utility method to create star rating HTML
  createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = "";
    for (let i = 0; i < fullStars; i++) {
      starsHTML += "★";
    }
    if (hasHalfStar) {
      starsHTML += "☆";
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += "☆";
    }

    return starsHTML;
  }

  // Method to render game cards with add to cart functionality
  renderGameCard(game) {
    const stars = this.createStarRating(game.rating);
    const platforms = game.platforms
      .map((platform) => `<span class="platform-badge">${platform}</span>`)
      .join("");

    return `
            <div class="game-card">
                <div class="game-image">
                    <a href="game.html?id=${game.id}">
                        <img src="${game.image}" alt="${game.title}">
                    </a>
                </div>
                <div class="game-content">
                    <h3 class="game-title">
                        <a href="game.html?id=${game.id}">${game.title}</a>
                    </h3>
                    <div class="game-meta">
                        <div class="game-rating">
                            <div class="stars">${stars}</div>
                            <span>${game.rating}</span>
                        </div>
                        <div class="game-platforms">
                            ${platforms}
                        </div>
                    </div>
                    <div class="game-price">
                        <span class="price">$${game.price.toFixed(2)}</span>
                        ${
                          game.originalPrice > game.price
                            ? `<span class="original-price">$${game.originalPrice.toFixed(
                                2
                              )}</span>`
                            : ""
                        }
                    </div>
                    <button class="add-to-cart-btn" data-game-id="${game.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
  }
}

// Initialize cart when DOM is loaded
let cart;
document.addEventListener("DOMContentLoaded", () => {
  cart = new Cart();
  window.cart = cart;
});

// Export for use in other modules
window.Cart = Cart;
