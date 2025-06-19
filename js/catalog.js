// Catalog Page Functionality
class CatalogPage {
  constructor() {
    this.games = [];
    this.filteredGames = [];
    this.filters = {
      platforms: ["xbox", "pc"],
      genres: [],
      priceRange: { min: 0, max: 100 },
    };
    this.sortBy = "name";
    this.init();
  }

  async init() {
    await this.loadGames();
    this.setupFilters();
    this.setupSorting();
    this.renderGames();
    this.updateResultsCount();
  }

  async loadGames() {
    try {
      const response = await fetch("data/games.json");
      this.games = await response.json();
      this.filteredGames = [...this.games];
    } catch (error) {
      console.error("Error loading games:", error);
    }
  }

  setupFilters() {
    this.setupPlatformFilters();
    this.setupGenreFilters();
    this.setupPriceFilters();
    this.setupClearFilters();
  }

  setupPlatformFilters() {
    const platformCheckboxes = document.querySelectorAll(
      'input[value="xbox"], input[value="pc"]'
    );
    platformCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.updatePlatformFilters();
        this.applyFilters();
      });
    });
  }

  setupGenreFilters() {
    const genreFiltersContainer = document.getElementById("genre-filters");
    if (!genreFiltersContainer) return;

    // Get unique genres from games
    const genres = [...new Set(this.games.map((game) => game.genre))];

    genreFiltersContainer.innerHTML = genres
      .map(
        (genre) => `
            <label class="filter-option">
                <input type="checkbox" value="${genre.toLowerCase()}">
                <span>${genre}</span>
            </label>
        `
      )
      .join("");

    // Add event listeners
    const genreCheckboxes = genreFiltersContainer.querySelectorAll(
      'input[type="checkbox"]'
    );
    genreCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.updateGenreFilters();
        this.applyFilters();
      });
    });
  }

  setupPriceFilters() {
    const priceMin = document.getElementById("price-min");
    const priceMax = document.getElementById("price-max");
    const priceMinLabel = document.getElementById("price-min-label");
    const priceMaxLabel = document.getElementById("price-max-label");

    if (!priceMin || !priceMax) return;

    // Set initial values based on actual game prices
    const prices = this.games.map((game) => game.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));

    priceMin.min = minPrice;
    priceMin.max = maxPrice;
    priceMin.value = minPrice;

    priceMax.min = minPrice;
    priceMax.max = maxPrice;
    priceMax.value = maxPrice;

    priceMinLabel.textContent = `$${minPrice}`;
    priceMaxLabel.textContent = `$${maxPrice}`;

    // Add event listeners
    priceMin.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      priceMinLabel.textContent = `$${value}`;
      this.filters.priceRange.min = value;
      this.applyFilters();
    });

    priceMax.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      priceMaxLabel.textContent = `$${value}`;
      this.filters.priceRange.max = value;
      this.applyFilters();
    });
  }

  setupClearFilters() {
    const clearFiltersBtn = document.getElementById("clear-filters");
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        this.clearFilters();
      });
    }
  }

  setupSorting() {
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.applySorting();
        this.renderGames();
      });
    }
  }

  updatePlatformFilters() {
    const platformCheckboxes = document.querySelectorAll(
      'input[value="xbox"], input[value="pc"]'
    );
    this.filters.platforms = Array.from(platformCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  }

  updateGenreFilters() {
    const genreCheckboxes = document.querySelectorAll(
      '#genre-filters input[type="checkbox"]'
    );
    this.filters.genres = Array.from(genreCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  }

  clearFilters() {
    // Reset platform filters
    const platformCheckboxes = document.querySelectorAll(
      'input[value="xbox"], input[value="pc"]'
    );
    platformCheckboxes.forEach((checkbox) => (checkbox.checked = true));

    // Reset genre filters
    const genreCheckboxes = document.querySelectorAll(
      '#genre-filters input[type="checkbox"]'
    );
    genreCheckboxes.forEach((checkbox) => (checkbox.checked = false));

    // Reset price filters
    const priceMin = document.getElementById("price-min");
    const priceMax = document.getElementById("price-max");
    const priceMinLabel = document.getElementById("price-min-label");
    const priceMaxLabel = document.getElementById("price-max-label");

    if (priceMin && priceMax) {
      const prices = this.games.map((game) => game.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));

      priceMin.value = minPrice;
      priceMax.value = maxPrice;
      priceMinLabel.textContent = `$${minPrice}`;
      priceMaxLabel.textContent = `$${maxPrice}`;
    }

    // Reset sort
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = "name";

    // Update filters and re-render
    this.filters = {
      platforms: ["xbox", "pc"],
      genres: [],
      priceRange: { min: 0, max: 100 },
    };
    this.sortBy = "name";
    this.applyFilters();
  }

  applyFilters() {
    this.filteredGames = this.games.filter((game) => {
      // Platform filter
      const platformMatch = game.platforms.some((platform) =>
        this.filters.platforms.includes(platform.toLowerCase())
      );

      // Genre filter
      const genreMatch =
        this.filters.genres.length === 0 ||
        this.filters.genres.includes(game.genre.toLowerCase());

      // Price filter
      const priceMatch =
        game.price >= this.filters.priceRange.min &&
        game.price <= this.filters.priceRange.max;

      return platformMatch && genreMatch && priceMatch;
    });

    this.applySorting();
    this.renderGames();
    this.updateResultsCount();
  }

  applySorting() {
    switch (this.sortBy) {
      case "name":
        this.filteredGames.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "price-low":
        this.filteredGames.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        this.filteredGames.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        this.filteredGames.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  renderGames() {
    const gamesGrid = document.getElementById("catalog-games-grid");
    const noResults = document.getElementById("no-results");

    if (!gamesGrid) return;

    if (this.filteredGames.length === 0) {
      gamesGrid.style.display = "none";
      if (noResults) noResults.style.display = "block";
      return;
    }

    gamesGrid.style.display = "grid";
    if (noResults) noResults.style.display = "none";

    gamesGrid.innerHTML = this.filteredGames
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

  updateResultsCount() {
    const resultsCount = document.getElementById("results-count");
    if (resultsCount) {
      const count = this.filteredGames.length;
      resultsCount.textContent = `${count} game${count !== 1 ? "s" : ""} found`;
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
}

// Initialize catalog page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CatalogPage();
});
