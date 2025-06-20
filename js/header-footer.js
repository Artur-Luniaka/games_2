// Header and Footer Component
class HeaderFooter {
  constructor() {
    this.init();
  }

  init() {
    this.loadHeader();
    this.loadFooter();
    this.setupMobileMenu();
  }

  async loadHeader() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (!headerPlaceholder) return;

    const headerHTML = `
            <header>
                <div class="container">
                    <div class="header-content">
                        <a href="./" class="logo"><img src="./assets/logo-icon.png" alt="logo" width="50" height="50"></a>
                        
                        <nav>
                            <ul class="nav-menu" id="nav-menu">
                                <li><a href="./">Store</a></li>
              <li><a href="./#pc-games">PC Games</a></li>
              <li><a href="./#xbox-games">Xbox Games</a></li>
                                <li><a href="catalog.html">Catalog</a></li>
                                <li><a href="contact.html">Contact</a></li>
                            </ul>
                        </nav>

                        <div class="header-actions">
                            <a href="cart.html" class="cart-icon" id="cart-icon">
                                <img src="assets/shopping-cart.png" alt="Shopping Cart" width="30" height="30">
                                <span class="cart-count" id="cart-count">0</span>
                            </a>
                            <button class="mobile-menu-toggle" id="mobile-menu-toggle">
                                ☰
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;

    headerPlaceholder.innerHTML = headerHTML;
    this.updateCartCount();
  }

  async loadFooter() {
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (!footerPlaceholder) return;

    const footerHTML = `
            <footer>
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h3>MobilePlayStrike Support</h3>
                            <ul>
                                <li><a href="privacy.html">Privacy Policy</a></li>
                                <li><a href="terms.html">Terms of Service</a></li>
                                <li><a href="return-policy.html">Return & Refund Policy</a></li>
                                <li><a href="shipping.html">Shipping & Delivery</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p>&copy; 2025 MobilePlayStrike.com | All rights reserved</p>
                    </div>
                </div>
            </footer>
        `;

    footerPlaceholder.innerHTML = footerHTML;
  }

  setupMobileMenu() {
    // Wait for DOM to be ready
    setTimeout(() => {
      const mobileToggle = document.getElementById("mobile-menu-toggle");
      const navMenu = document.getElementById("nav-menu");

      if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
          navMenu.classList.toggle("active");
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
          if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove("active");
          }
        });

        // Close menu when clicking on a link
        navMenu.addEventListener("click", (e) => {
          if (e.target.tagName === "A") {
            navMenu.classList.remove("active");
          }
        });
      }
    }, 100);
  }

  updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? "flex" : "none";
    }
  }
}

// Initialize header and footer when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new HeaderFooter();
});

// Export for use in other modules
window.HeaderFooter = HeaderFooter;
