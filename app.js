class SneakerApp {
  constructor() {
    this.apiUrl = "https://json-db-lyjd.onrender.com/sneakers";
    this.sneakers = [];
    this.wishlist = new Set();
    this.filters = {
      minPrice: 0,
      maxPrice: 999,
      brand: "All"
    };

    this.initializeElements();
    this.setupEventListeners();
    this.loadSneakers();
  }

  initializeElements() {
    this.elements = {
      grid: document.getElementById("sneaker-grid"),
      wishlistGrid: document.getElementById("wishlist-grid"),
      homeSection: document.getElementById("home-section"),
      wishlistSection: document.getElementById("wishlist-section"),
      detailsModal: document.getElementById("details-modal"),
      modalBackdrop: document.getElementById("modal-backdrop"),
      priceMin: document.getElementById("price-min"),
      priceMax: document.getElementById("price-max"),
      brandSelect: document.getElementById("brand-select"),
      navBtns: document.querySelectorAll(".nav-btn"),
      closeModalBtn: document.getElementById("close-modal-btn"),
      mobileMenuBtn: document.getElementById("mobile-menu-btn"),
      mobileMenu: document.getElementById("mobile-menu"),
      wishlistBadge: document.getElementById("wishlist-badge"),
      clearFiltersBtn: document.getElementById("clear-filters-btn")
    };
  }

  setupEventListeners() {
    this.elements.priceMin.addEventListener("input", () => this.applyFilters());
    this.elements.priceMax.addEventListener("input", () => this.applyFilters());
    this.elements.brandSelect.addEventListener("change", () => this.applyFilters());

    this.elements.navBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.switchSection(e.target.dataset.section));
    });

    this.elements.closeModalBtn.addEventListener("click", () => this.closeModal());
    this.elements.modalBackdrop.addEventListener("click", () => this.closeModal());
    this.elements.mobileMenuBtn.addEventListener("click", () => this.toggleMobileMenu());
    this.elements.clearFiltersBtn.addEventListener("click", () => this.resetFilters());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });
  }

  async loadSneakers() {
    try {
      this.elements.grid.innerHTML = '<div class="col-span-full flex items-center justify-center py-12"><div class="animate-pulse text-slate-400">Loading sneakers...</div></div>';

      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error("Failed to load sneakers");

      this.sneakers = await response.json();
      this.renderSneakers(this.sneakers);
    } catch (error) {
      console.error("Error loading sneakers:", error);
      this.elements.grid.innerHTML = '<div class="col-span-full text-center py-12 text-red-500">Failed to load sneakers. Please try again later.</div>';
    }
  }

  renderSneakers(sneakers) {
    this.elements.grid.innerHTML = "";

    if (sneakers.length === 0) {
      this.elements.grid.innerHTML = '<div class="col-span-full text-center py-12 text-slate-500">No sneakers found matching your filters.</div>';
      return;
    }

    sneakers.forEach((sneaker) => {
      const card = this.createSneakerCard(sneaker);
      this.elements.grid.appendChild(card);
    });
  }

  createSneakerCard(sneaker) {
    const card = document.createElement("div");
    card.className = "sneaker-card";

    const isInWishlist = this.wishlist.has(sneaker.id);

    card.innerHTML = `
      <img src="${sneaker.image}" alt="${sneaker.brand} ${sneaker.model}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
      <div class="sneaker-card-content">
        <h3 class="sneaker-card-title">${sneaker.brand} ${sneaker.model}</h3>
        <div class="sneaker-card-meta">
          <p class="text-xs text-slate-500">${sneaker.color} • Size ${sneaker.size}</p>
        </div>
        <div class="sneaker-card-footer">
          <span class="sneaker-price">$${sneaker.price}</span>
          <button class="wishlist-btn px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
            isInWishlist
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }">
            ${isInWishlist ? "♥" : "🤍"}
          </button>
        </div>
      </div>
    `;

    const img = card.querySelector("img");
    img.addEventListener("click", () => this.showDetails(sneaker));

    const wishlistBtn = card.querySelector(".wishlist-btn");
    wishlistBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleWishlist(sneaker);
      this.updateWishlistUI();
    });

    return card;
  }

  showDetails(sneaker) {
    document.getElementById("modal-image").src = sneaker.image;
    document.getElementById("modal-brand").textContent = `${sneaker.brand} ${sneaker.model}`;
    document.getElementById("modal-model").textContent = `${sneaker.color} • Size ${sneaker.size}`;
    document.getElementById("modal-color").textContent = sneaker.color;
    document.getElementById("modal-size").textContent = sneaker.size;
    document.getElementById("modal-price").textContent = `$${sneaker.price}`;
    document.getElementById("modal-comments").textContent = sneaker.comments || "No description available.";

    const btn = document.getElementById("modal-wishlist-btn");
    if (this.wishlist.has(sneaker.id)) {
      btn.textContent = "Remove from Wishlist";
      btn.classList.remove("from-blue-600", "to-cyan-600");
      btn.classList.add("from-red-600", "to-red-500");
    } else {
      btn.textContent = "Add to Wishlist";
      btn.classList.remove("from-red-600", "to-red-500");
      btn.classList.add("from-blue-600", "to-cyan-600");
    }

    btn.onclick = () => {
      this.toggleWishlist(sneaker);
      this.updateWishlistUI();
      this.showDetails(sneaker);
    };

    this.elements.detailsModal.classList.remove("hidden");
  }

  closeModal() {
    this.elements.detailsModal.classList.add("hidden");
  }

  toggleWishlist(sneaker) {
    if (this.wishlist.has(sneaker.id)) {
      this.wishlist.delete(sneaker.id);
    } else {
      this.wishlist.add(sneaker.id);
    }
    localStorage.setItem("wishlist", JSON.stringify(Array.from(this.wishlist)));
  }

  updateWishlistUI() {
    this.elements.wishlistBadge.textContent = this.wishlist.size;
    this.wishlist.size > 0
      ? this.elements.wishlistBadge.classList.remove("hidden")
      : this.elements.wishlistBadge.classList.add("hidden");

    this.renderWishlist();
    this.renderSneakers(this.getFilteredSneakers());
  }

  renderWishlist() {
    this.elements.wishlistGrid.innerHTML = "";

    if (this.wishlist.size === 0) {
      this.elements.wishlistGrid.innerHTML = '<div class="col-span-full text-center py-12 text-slate-500">Your wishlist is empty. Add some sneakers!</div>';
      return;
    }

    const wishlistSneakers = this.sneakers.filter((s) => this.wishlist.has(s.id));
    wishlistSneakers.forEach((sneaker) => {
      const card = document.createElement("div");
      card.className = "sneaker-card";

      card.innerHTML = `
        <img src="${sneaker.image}" alt="${sneaker.brand} ${sneaker.model}" class="w-full h-48 object-cover">
        <div class="sneaker-card-content">
          <h3 class="sneaker-card-title">${sneaker.brand} ${sneaker.model}</h3>
          <div class="sneaker-card-meta">
            <p class="text-xs text-slate-500">${sneaker.color} • Size ${sneaker.size}</p>
          </div>
          <div class="sneaker-card-footer mt-auto">
            <span class="sneaker-price">$${sneaker.price}</span>
            <button class="remove-btn px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-all">
              Remove
            </button>
          </div>
        </div>
      `;

      card.querySelector(".remove-btn").addEventListener("click", () => {
        this.toggleWishlist(sneaker);
        this.updateWishlistUI();
      });

      this.elements.wishlistGrid.appendChild(card);
    });
  }

  applyFilters() {
    this.filters.minPrice = parseInt(this.elements.priceMin.value) || 0;
    this.filters.maxPrice = parseInt(this.elements.priceMax.value) || 999;
    this.filters.brand = this.elements.brandSelect.value;

    this.renderSneakers(this.getFilteredSneakers());
  }

  getFilteredSneakers() {
    return this.sneakers.filter((sneaker) => {
      const priceMatch =
        sneaker.price >= this.filters.minPrice && sneaker.price <= this.filters.maxPrice;
      const brandMatch =
        this.filters.brand === "All" || sneaker.brand === this.filters.brand;
      return priceMatch && brandMatch;
    });
  }

  resetFilters() {
    this.elements.priceMin.value = 0;
    this.elements.priceMax.value = 999;
    this.elements.brandSelect.value = "All";
    this.applyFilters();
  }

  switchSection(section) {
    this.elements.navBtns.forEach((btn) => btn.classList.remove("active"));
    document.querySelector(`[data-section="${section}"]`).classList.add("active");

    this.elements.homeSection.classList.add("hidden");
    this.elements.wishlistSection.classList.add("hidden");
    this.elements.detailsModal.classList.add("hidden");

    if (section === "home") {
      this.elements.homeSection.classList.remove("hidden");
    } else if (section === "wishlist") {
      this.elements.wishlistSection.classList.remove("hidden");
      this.renderWishlist();
    }

    this.elements.mobileMenu.classList.add("hidden");
  }

  toggleMobileMenu() {
    this.elements.mobileMenu.classList.toggle("hidden");
  }

  loadWishlistFromStorage() {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      this.wishlist = new Set(JSON.parse(stored));
      this.elements.wishlistBadge.textContent = this.wishlist.size;
      if (this.wishlist.size > 0) {
        this.elements.wishlistBadge.classList.remove("hidden");
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new SneakerApp();
  app.loadWishlistFromStorage();
  app.updateWishlistUI();
});
