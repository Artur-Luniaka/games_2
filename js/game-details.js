// Game Details Page Functionality
class GameDetailsPage {
  constructor() {
    this.game = null;
    this.reviews = [];
    this.allGames = [];
    this.gameId = this.getGameIdFromUrl();
    this.init();
  }

  getGameIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get("id"));
  }

  async init() {
    if (!this.gameId) {
      this.showError("Game not found");
      return;
    }

    await this.loadData();
    this.renderGameDetails();
    this.renderReviews();
    this.renderRecommendations();
    this.setupEventListeners();
  }

  async loadData() {
    try {
      // Load games data
      const gamesResponse = await fetch("data/games.json");
      this.allGames = await gamesResponse.json();
      this.game = this.allGames.find((g) => g.id === this.gameId);

      if (!this.game) {
        this.showError("Game not found");
        return;
      }

      // Load reviews data
      const reviewsResponse = await fetch("data/reviews.json");
      this.reviews = await reviewsResponse.json();
    } catch (error) {
      console.error("Error loading data:", error);
      this.showError("Error loading game data");
    }
  }

  renderGameDetails() {
    if (!this.game) return;

    // Update page title
    document.title = `${this.game.title} - GameStore`;

    // Update breadcrumb
    const gameTitle = document.getElementById("game-title");
    if (gameTitle) gameTitle.textContent = this.game.title;

    // Update game image
    const gameImage = document.getElementById("game-image");
    if (gameImage) {
      gameImage.src = this.game.image;
      gameImage.alt = this.game.title;
    }

    // Update game name
    const gameName = document.getElementById("game-name");
    if (gameName) gameName.textContent = this.game.title;

    // Update rating
    const gameStars = document.getElementById("game-stars");
    const gameRatingText = document.getElementById("game-rating-text");
    if (gameStars)
      gameStars.innerHTML = this.createStarRating(this.game.rating);
    if (gameRatingText)
      gameRatingText.textContent = this.game.rating.toFixed(1);

    // Update platforms
    const gamePlatforms = document.getElementById("game-platforms");
    if (gamePlatforms) {
      gamePlatforms.innerHTML = this.game.platforms
        .map((platform) => `<span class="platform-badge">${platform}</span>`)
        .join("");
    }

    // Update price
    const gamePrice = document.getElementById("game-price");
    const gameOriginalPrice = document.getElementById("game-original-price");
    if (gamePrice) gamePrice.textContent = `$${this.game.price.toFixed(2)}`;
    if (gameOriginalPrice) {
      if (this.game.originalPrice > this.game.price) {
        gameOriginalPrice.textContent = `$${this.game.originalPrice.toFixed(
          2
        )}`;
        gameOriginalPrice.style.display = "inline";
      } else {
        gameOriginalPrice.style.display = "none";
      }
    }

    // Update description
    const gameDescription = document.getElementById("game-description");
    if (gameDescription) gameDescription.textContent = this.game.description;

    // Update game details
    const gameGenre = document.getElementById("game-genre");
    const gameReleaseDate = document.getElementById("game-release-date");
    const gameDeveloper = document.getElementById("game-developer");
    const gamePublisher = document.getElementById("game-publisher");

    if (gameGenre) gameGenre.textContent = this.game.genre;
    if (gameReleaseDate)
      gameReleaseDate.textContent = this.formatDate(this.game.releaseDate);
    if (gameDeveloper) gameDeveloper.textContent = this.game.developer;
    if (gamePublisher) gamePublisher.textContent = this.game.publisher;

    // Update features
    const gameFeatures = document.getElementById("game-features");
    if (gameFeatures) {
      gameFeatures.innerHTML = this.game.features
        .map((feature) => `<li>${feature}</li>`)
        .join("");
    }

    // Update add to cart button
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.dataset.gameId = this.game.id;
    }
  }

  renderReviews() {
    const gameReviews = this.reviews.filter(
      (review) => review.gameId === this.gameId
    );
    const gameReviewsList = document.getElementById("game-reviews-list");
    const overallRating = document.getElementById("overall-rating");
    const overallStars = document.getElementById("overall-stars");
    const totalReviews = document.getElementById("total-reviews");

    if (!gameReviewsList) return;

    // Calculate overall rating
    const averageRating =
      gameReviews.length > 0
        ? gameReviews.reduce((sum, review) => sum + review.rating, 0) /
          gameReviews.length
        : 0;

    // Update overall rating display
    if (overallRating) overallRating.textContent = averageRating.toFixed(1);
    if (overallStars)
      overallStars.innerHTML = this.createStarRating(averageRating);
    if (totalReviews)
      totalReviews.textContent = `${gameReviews.length} review${
        gameReviews.length !== 1 ? "s" : ""
      }`;

    // Render individual reviews
    gameReviewsList.innerHTML = gameReviews
      .map((review) => {
        const stars = this.createStarRating(review.rating);
        const reviewerInitial = review.reviewerName.charAt(0);
        const reviewDate = this.formatDate(review.date);

        return `
                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-avatar">${reviewerInitial}</div>
                        <div class="reviewer-info">
                            <h4>${review.reviewerName}</h4>
                            <div class="stars">${stars}</div>
                            <small>${reviewDate}</small>
                        </div>
                    </div>
                    <div class="review-text">
                        <p>${review.review}</p>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  renderRecommendations() {
    const recommendationsGrid = document.getElementById("recommendations-grid");
    if (!recommendationsGrid) return;

    // Get 3 random games that are not the current game
    const otherGames = this.allGames.filter((game) => game.id !== this.gameId);
    const recommendations = this.shuffleArray(otherGames).slice(0, 3);

    recommendationsGrid.innerHTML = recommendations
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
                            }">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  setupEventListeners() {
    // Add to cart button
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        if (window.cart && this.game) {
          window.cart.addToCart(this.game);
        }
      });
    }
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

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  showError(message) {
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `
                <div class="container">
                    <div style="text-align: center; padding: 4rem 0;">
                        <h1>Error</h1>
                        <p>${message}</p>
                        <a href="catalog.html" class="btn btn-primary">Back to Catalog</a>
                    </div>
                </div>
            `;
    }
  }
}

// Initialize game details page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GameDetailsPage();
});
