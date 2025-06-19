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

  renderPCGames() {
    const pcGamesGrid = document.getElementById("pc-games-grid");
    if (!pcGamesGrid) return;

    const pcGames = this.games
      .filter((game) => game.platforms.includes("PC"))
      .slice(0, 3);

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

    const xboxGames = this.games
      .filter((game) => game.platforms.includes("Xbox"))
      .slice(0, 3);

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
}

// Initialize main page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MainPage();
});
