// Main Page Functionality
class MainPage {
  constructor() {
    this.games = [];
    this.reviews = [];
    this.init();
  }

  async init() {
    await this.loadData();
    this.renderPCGames();
    this.renderXboxGames();
    this.renderReviews();
    this.initCookieConsent();
  }

  async loadData() {
    try {
      // Load games data
      const gamesResponse = await fetch("data/games.json");
      this.games = await gamesResponse.json();

      // Load reviews data
      const reviewsResponse = await fetch("data/reviews.json");
      this.reviews = await reviewsResponse.json();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  getRandomGames(platform, count = 3) {
    const platformGames = this.games.filter((game) =>
      game.platforms.includes(platform)
    );
    const shuffled = [...platformGames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  renderPCGames() {
    const pcGamesGrid = document.getElementById("pc-games-grid");
    if (!pcGamesGrid) return;

    const pcGames = this.getRandomGames("PC", 3);

    pcGamesGrid.innerHTML = pcGames
      .map((game) => {
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
                        <div class="game-actions">
                            <a href="game.html?id=${
                              game.id
                            }" class="view-details-btn">View Details</a>
                            <button class="add-to-cart-btn" data-game-id="${
                              game.id
                            }">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  renderXboxGames() {
    const xboxGamesGrid = document.getElementById("xbox-games-grid");
    if (!xboxGamesGrid) return;

    const xboxGames = this.getRandomGames("Xbox", 3);

    xboxGamesGrid.innerHTML = xboxGames
      .map((game) => {
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
                        <div class="game-actions">
                            <a href="game.html?id=${
                              game.id
                            }" class="view-details-btn">View Details</a>
                            <button class="add-to-cart-btn" data-game-id="${
                              game.id
                            }">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  renderReviews() {
    const reviewsGrid = document.getElementById("reviews-grid");
    if (!reviewsGrid) return;

    // Get random reviews for display
    const randomReviews = this.getRandomReviews(3);

    reviewsGrid.innerHTML = randomReviews
      .map((review) => {
        const game = this.games.find((g) => g.id === review.gameId);
        const stars = this.createStarRating(review.rating);
        const reviewerInitial = review.reviewerName.charAt(0);

        return `
                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-avatar">${reviewerInitial}</div>
                        <div class="reviewer-info">
                            <h4>${review.reviewerName}</h4>
                            <div class="stars">${stars}</div>
                        </div>
                    </div>
                    <div class="review-text">
                        <p>${review.review}</p>
                        ${
                          game ? `<small>Review for: ${game.title}</small>` : ""
                        }
                    </div>
                </div>
            `;
      })
      .join("");
  }

  getRandomReviews(count) {
    const shuffled = [...this.reviews].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

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

  // Cookie Consent Management
  initCookieConsent() {
    const cookieBar = document.getElementById("cookie-bar");
    const acceptBtn = document.getElementById("accept-cookies");

    if (!cookieBar || !acceptBtn) return;

    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");

    if (cookieConsent === null) {
      // Show cookie bar after a short delay
      setTimeout(() => {
        cookieBar.classList.add("show");
      }, 1000);
    }

    // Accept cookies
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "accepted");
      localStorage.setItem("cookieConsentDate", new Date().toISOString());
      this.hideCookieBar();
    });
  }

  hideCookieBar() {
    const cookieBar = document.getElementById("cookie-bar");
    if (cookieBar) {
      cookieBar.classList.remove("show");
    }
  }

  showCookieNotification(message) {
    // Create cookie notification element with custom styling
    const notification = document.createElement("div");
    notification.className = "cookie-notification";
    notification.innerHTML = `
      <div class="cookie-notification-content">
        <div class="cookie-notification-icon">🍪</div>
        <div class="cookie-notification-text">
          <h3>Cookie Consent</h3>
          <p>${message}</p>
        </div>
        <button class="cookie-notification-close">×</button>
      </div>
    `;

    // Add custom styles
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
      width: 100%;
      max-width: 380px;
      transform: translateX(120%);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10000;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      // Check if mobile and adjust animation
      if (window.innerWidth <= 767) {
        notification.style.transform = "translateY(0)";
      } else {
        notification.style.transform = "translateX(0)";
      }
    }, 100);

    // Auto hide after 4 seconds
    setTimeout(() => {
      // Check if mobile and adjust animation
      if (window.innerWidth <= 767) {
        notification.style.transform = "translateY(-100%)";
      } else {
        notification.style.transform = "translateX(120%)";
      }
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);

    // Close button functionality
    const closeBtn = notification.querySelector(".cookie-notification-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        // Check if mobile and adjust animation
        if (window.innerWidth <= 767) {
          notification.style.transform = "translateY(-100%)";
        } else {
          notification.style.transform = "translateX(120%)";
        }
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      });
    }
  }

  showNotification(message, type = "success") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          ${type === "success" ? "✓" : "✕"}
        </div>
        <div class="notification-text">
          <h3>${type === "success" ? "Success" : "Notice"}</h3>
          <p>${message}</p>
        </div>
        <button class="notification-close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        notification.classList.remove("show");
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      });
    }
  }
}

// Initialize main page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MainPage();
});
