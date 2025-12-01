// Sample Product Data
const productsData = [
    {
        id: 1,
        name: "Samsung Galaxy S24 Ultra",
        category: "electronics",
        brand: "samsung",
        price: 1199,
        originalPrice: 1399,
        rating: 4.8,
        reviews: 342,
        image: "https://via.placeholder.com/300x300/667eea/ffffff?text=Galaxy+S24",
        description: "Latest flagship smartphone with AI-powered camera and S Pen",
        inStock: true,
        discount: 14,
        tags: ["trending", "new", "bestseller"],
        color: "black",
        shipping: "free"
    },
    {
        id: 2,
        name: "Nike Air Max 270",
        category: "fashion",
        brand: "nike",
        price: 150,
        originalPrice: 200,
        rating: 4.6,
        reviews: 189,
        image: "https://via.placeholder.com/300x300/f093fb/ffffff?text=Air+Max",
        description: "Comfortable running shoes with Max Air cushioning",
        inStock: true,
        discount: 25,
        tags: ["bestseller"],
        color: "white",
        size: "m",
        shipping: "free"
    },
    {
        id: 3,
        name: "Apple MacBook Pro 14",
        category: "electronics",
        brand: "apple",
        price: 1999,
        originalPrice: 2399,
        rating: 4.9,
        reviews: 523,
        image: "https://via.placeholder.com/300x300/764ba2/ffffff?text=MacBook",
        description: "M3 chip, 16GB RAM, 512GB SSD - Professional laptop",
        inStock: true,
        discount: 17,
        tags: ["trending", "bestseller"],
        color: "gray",
        shipping: "free"
    },
    {
        id: 4,
        name: "Adidas Ultraboost 23",
        category: "sports",
        brand: "adidas",
        price: 180,
        originalPrice: 220,
        rating: 4.7,
        reviews: 267,
        image: "https://via.placeholder.com/300x300/4facfe/ffffff?text=Ultraboost",
        description: "Premium running shoes with boost technology",
        inStock: true,
        discount: 18,
        tags: ["new"],
        color: "blue",
        size: "l",
        shipping: "fast"
    },
    {
        id: 5,
        name: "Sony WH-1000XM5",
        category: "electronics",
        brand: "sony",
        price: 349,
        originalPrice: 399,
        rating: 4.9,
        reviews: 445,
        image: "https://via.placeholder.com/300x300/00f2fe/ffffff?text=WH-1000XM5",
        description: "Industry-leading noise canceling headphones",
        inStock: true,
        discount: 13,
        tags: ["bestseller", "trending"],
        color: "black",
        shipping: "free"
    },
    {
        id: 6,
        name: "Modern Leather Sofa",
        category: "home",
        brand: "lg",
        price: 899,
        originalPrice: 1299,
        rating: 4.5,
        reviews: 89,
        image: "https://via.placeholder.com/300x300/43e97b/ffffff?text=Sofa",
        description: "Comfortable 3-seater leather sofa for living room",
        inStock: true,
        discount: 31,
        tags: ["new"],
        color: "brown",
        shipping: "cod"
    },
    {
        id: 7,
        name: "Luxury Skincare Set",
        category: "beauty",
        brand: "samsung",
        price: 79,
        originalPrice: 120,
        rating: 4.4,
        reviews: 156,
        image: "https://via.placeholder.com/300x300/667eea/ffffff?text=Skincare",
        description: "Complete skincare routine with natural ingredients",
        inStock: true,
        discount: 34,
        tags: ["bestseller"],
        color: "pink",
        shipping: "free"
    },
    {
        id: 8,
        name: "Kids Learning Tablet",
        category: "kids",
        brand: "apple",
        price: 129,
        originalPrice: 179,
        rating: 4.3,
        reviews: 234,
        image: "https://via.placeholder.com/300x300/764ba2/ffffff?text=Kids+Tablet",
        description: "Educational tablet with parental controls",
        inStock: true,
        discount: 28,
        tags: ["new"],
        color: "blue",
        shipping: "free"
    },
    {
        id: 9,
        name: "Wireless Gaming Mouse",
        category: "electronics",
        brand: "samsung",
        price: 89,
        originalPrice: 119,
        rating: 4.6,
        reviews: 312,
        image: "https://via.placeholder.com/300x300/f093fb/ffffff?text=Gaming+Mouse",
        description: "High-precision wireless gaming mouse",
        inStock: true,
        discount: 25,
        tags: ["trending"],
        color: "black",
        shipping: "free"
    },
    {
        id: 10,
        name: "Designer Handbag",
        category: "fashion",
        brand: "nike",
        price: 299,
        originalPrice: 450,
        rating: 4.7,
        reviews: 178,
        image: "https://via.placeholder.com/300x300/4facfe/ffffff?text=Handbag",
        description: "Elegant leather handbag with gold accents",
        inStock: true,
        discount: 34,
        tags: ["bestseller"],
        color: "red",
        shipping: "free"
    },
    {
        id: 11,
        name: "Smart Yoga Mat",
        category: "sports",
        brand: "adidas",
        price: 149,
        originalPrice: 199,
        rating: 4.5,
        reviews: 98,
        image: "https://via.placeholder.com/300x300/00f2fe/ffffff?text=Yoga+Mat",
        description: "Interactive yoga mat with guided sessions",
        inStock: false,
        discount: 25,
        tags: ["new", "trending"],
        color: "purple",
        shipping: "fast"
    },
    {
        id: 12,
        name: "4K Smart TV 55 inch",
        category: "electronics",
        brand: "lg",
        price: 599,
        originalPrice: 899,
        rating: 4.8,
        reviews: 401,
        image: "https://via.placeholder.com/300x300/43e97b/ffffff?text=Smart+TV",
        description: "Crystal clear 4K display with smart features",
        inStock: true,
        discount: 33,
        tags: ["bestseller", "trending"],
        color: "black",
        shipping: "free"
    }
];

// State Management
let currentPage = 1;
let itemsPerPage = 12;
let currentLayout = 'grid';
let filteredProducts = [...productsData];
let compareList = [];
let wishlist = [];
let recentlyViewed = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    renderProducts();
    updateResultsCount();
    generatePageNumbers();
});

// Event Listeners
function initializeEventListeners() {
    // Filter toggles
    document.querySelectorAll('.filter-title').forEach(title => {
        title.addEventListener('click', function() {
            toggleFilterSection(this);
        });
    });

    // Filter changes
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
        input.addEventListener('change', applyFilters);
    });

    // Price range
    document.getElementById('priceRange').addEventListener('input', function() {
        document.getElementById('maxPrice').value = this.value;
    });

    document.getElementById('applyPrice').addEventListener('click', applyFilters);

    // Quick filters
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            handleQuickFilter(this);
        });
    });

    // Brand items
    document.querySelectorAll('.brand-item').forEach(item => {
        item.addEventListener('click', function() {
            filterByBrand(this.dataset.brand);
        });
    });

    // Sort
    document.getElementById('sortBy').addEventListener('change', function() {
        sortProducts(this.value);
    });

    // Items per page
    document.getElementById('itemsPerPage').addEventListener('change', function() {
        changeItemsPerPage(parseInt(this.value));
    });

    // Layout switch
    document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchLayout(this.dataset.layout);
        });
    });

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));

    // Mobile filters
    document.getElementById('mobileFilterBtn').addEventListener('click', toggleMobileFilters);
    document.getElementById('mobileFilterOverlay').addEventListener('click', toggleMobileFilters);

    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);

    // Search
    document.getElementById('filterSearch').addEventListener('input', function() {
        searchProducts(this.value);
    });

    // Load more
    document.getElementById('loadMoreBtn').addEventListener('click', loadMoreProducts);

    // Scroll to top
    document.getElementById('scrollTop').addEventListener('click', scrollToTop);
    window.addEventListener('scroll', handleScroll);

    // Compare panel
    document.getElementById('closeCompare').addEventListener('click', toggleComparePanel);
    document.getElementById('goToCompare').addEventListener('click', goToComparison);

    // Quick view modal
    document.getElementById('closeQuickView').addEventListener('click', closeQuickView);
    document.querySelector('.modal-overlay').addEventListener('click', closeQuickView);
}

// Toggle Filter Section
function toggleFilterSection(element) {
    element.classList.toggle('collapsed');
    const content = element.nextElementSibling;
    content.classList.toggle('hidden');
}

// Apply Filters
function applyFilters() {
    const filters = {
        categories: getCheckedValues('category'),
        brands: getCheckedValues('brand'),
        colors: getCheckedValues('color'),
        sizes: getCheckedValues('size'),
        availability: getCheckedValues('availability'),
        discount: getCheckedValues('discount'),
        shipping: getCheckedValues('shipping'),
        rating: document.querySelector('input[name="rating"]:checked')?.value,
        minPrice: parseInt(document.getElementById('minPrice').value) || 0,
        maxPrice: parseInt(document.getElementById('maxPrice').value) || 10000
    };

    filteredProducts = productsData.filter(product => {
        // Category filter
        if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
            return false;
        }

        // Brand filter
        if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
            return false;
        }

        // Color filter
        if (filters.colors.length > 0 && !filters.colors.includes(product.color)) {
            return false;
        }

        // Size filter
        if (filters.sizes.length > 0 && !filters.sizes.includes(product.size)) {
            return false;
        }

        // Availability filter
        if (filters.availability.includes('in-stock') && !product.inStock) {
            return false;
        }
        if (filters.availability.includes('out-of-stock') && product.inStock) {
            return false;
        }

        // Discount filter
        if (filters.discount.length > 0) {
            const maxDiscount = Math.max(...filters.discount.filter(d => d !== 'flash').map(d => parseInt(d)));
            if (product.discount < maxDiscount) {
                return false;
            }
        }

        // Shipping filter
        if (filters.shipping.length > 0 && !filters.shipping.includes(product.shipping)) {
            return false;
        }

        // Rating filter
        if (filters.rating && product.rating < parseFloat(filters.rating)) {
            return false;
        }

        // Price filter
        if (product.price < filters.minPrice || product.price > filters.maxPrice) {
            return false;
        }

        return true;
    });

    updateActiveFilters(filters);
    currentPage = 1;
    renderProducts();
    updateResultsCount();
    generatePageNumbers();
}

// Get Checked Values
function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(input => input.value);
}

// Update Active Filters
function updateActiveFilters(filters) {
    const container = document.getElementById('activeFilters');
    container.innerHTML = '';

    const allFilters = [
        ...filters.categories.map(f => ({ type: 'category', value: f })),
        ...filters.brands.map(f => ({ type: 'brand', value: f })),
        ...filters.colors.map(f => ({ type: 'color', value: f })),
        ...filters.sizes.map(f => ({ type: 'size', value: f }))
    ];

    allFilters.forEach(filter => {
        const tag = document.createElement('div');
        tag.className = 'active-filter-tag';
        tag.innerHTML = `
            ${filter.value}
            <i class="fas fa-times" onclick="removeFilter('${filter.type}', '${filter.value}')"></i>
        `;
        container.appendChild(tag);
    });
}

// Remove Filter
function removeFilter(type, value) {
    const input = document.querySelector(`input[name="${type}"][value="${value}"]`);
    if (input) {
        input.checked = false;
        applyFilters();
    }
}

// Clear All Filters
function clearAllFilters() {
    document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });
    document.querySelectorAll('.filters-sidebar input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 1000;
    document.getElementById('priceRange').value = 1000;
    document.getElementById('filterSearch').value = '';
    
    filteredProducts = [...productsData];
    currentPage = 1;
    renderProducts();
    updateResultsCount();
    generatePageNumbers();
    document.getElementById('activeFilters').innerHTML = '';
}

// Quick Filters
function handleQuickFilter(element) {
    document.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
    element.classList.add('active');

    const filter = element.dataset.filter;

    if (filter === 'all') {
        filteredProducts = [...productsData];
    } else if (filter === 'under50') {
        filteredProducts = productsData.filter(p => p.price < 50);
    } else if (filter === 'free-shipping') {
        filteredProducts = productsData.filter(p => p.shipping === 'free');
    } else {
        filteredProducts = productsData.filter(p => p.tags.includes(filter));
    }

    currentPage = 1;
    renderProducts();
    updateResultsCount();
    generatePageNumbers();
}

// Filter by Brand
function filterByBrand(brand) {
    const brandInput = document.querySelector(`input[name="brand"][value="${brand.toLowerCase()}"]`);
    if (brandInput) {
        brandInput.checked = true;
        applyFilters();
    }
}

// Search Products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    filteredProducts = productsData.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderProducts();
    updateResultsCount();
    generatePageNumbers();
}

// Sort Products
function sortProducts(sortBy) {
    switch(sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'bestselling':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            filteredProducts = [...productsData];
    }
    renderProducts();
}

// Change Items Per Page
function changeItemsPerPage(count) {
    itemsPerPage = count;
    currentPage = 1;
    renderProducts();
    updateResultsCount();
    generatePageNumbers();
}

// Switch Layout
function switchLayout(layout) {
    currentLayout = layout;
    document.querySelectorAll('.layout-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-layout="${layout}"]`).classList.add('active');
    
    const container = document.getElementById('productsContainer');
    container.className = `products-container ${layout}-view`;
}

// Render Products
function renderProducts() {
    const container = document.getElementById('productsContainer');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    if (productsToShow.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #7f8c8d;">No products found matching your filters.</div>';
        return;
    }

    container.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
}

// Create Product Card
function createProductCard(product) {
    const stars = generateStars(product.rating);
    const isWishlisted = wishlist.includes(product.id);
    const inCompare = compareList.includes(product.id);

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badges">
                    ${product.discount ? `<span class="badge-discount">-${product.discount}%</span>` : ''}
                    ${product.tags.includes('new') ? '<span class="badge-new">NEW</span>' : ''}
                    ${product.tags.includes('bestseller') ? '<span class="badge-bestseller">BESTSELLER</span>' : ''}
                </div>
                <div class="product-actions">
                    <button class="action-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="openQuickView(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn ${inCompare ? 'active' : ''}" onclick="toggleCompare(${product.id})" title="Compare">
                        <i class="fas fa-balance-scale"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                ${currentLayout === 'list' ? `<p class="product-description">${product.description}</p>` : ''}
                ${currentLayout === 'list' && product.shipping === 'free' ? '<div class="shipping-info"><i class="fas fa-truck"></i> Free Shipping</div>' : ''}
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">$${product.price}</span>
                    ${product.originalPrice ? `<span class="price-original">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-footer">
                    <button class="btn-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-quick-view" onclick="openQuickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate Stars
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - rating < 1) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Pagination
function changePage(direction) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderProducts();
        updateResultsCount();
        generatePageNumbers();
        scrollToTop();
    }
}

function generatePageNumbers() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const container = document.getElementById('pageNumbers');
    container.innerHTML = '';

    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => goToPage(i);
        container.appendChild(btn);
    }

    if (endPage < totalPages) {
        container.innerHTML += '<span>...</span>';
        const lastBtn = document.createElement('button');
        lastBtn.className = 'page-num';
        lastBtn.textContent = totalPages;
        lastBtn.onclick = () => goToPage(totalPages);
        container.appendChild(lastBtn);
    }

    // Update button states
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
    updateResultsCount();
    generatePageNumbers();
    scrollToTop();
}

// Update Results Count
function updateResultsCount() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredProducts.length);
    const total = filteredProducts.length;
    document.getElementById('resultsCount').textContent = 
        `Showing ${startIndex}–${endIndex} of ${total} products`;
}

// Load More Products
function loadMoreProducts() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        updateResultsCount();
        generatePageNumbers();
    }
}

// Wishlist
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    renderProducts();
}

// Compare
function toggleCompare(productId) {
    const index = compareList.indexOf(productId);
    if (index > -1) {
        compareList.splice(index, 1);
    } else {
        if (compareList.length >= 4) {
            alert('You can compare up to 4 products only!');
            return;
        }
        compareList.push(productId);
    }
    
    updateComparePanel();
    renderProducts();
}

function updateComparePanel() {
    document.getElementById('compareCount').textContent = compareList.length;
    const panel = document.getElementById('comparePanel');
    const itemsContainer = document.getElementById('compareItems');
    
    if (compareList.length > 0) {
        panel.classList.add('active');
        itemsContainer.innerHTML = compareList.map(id => {
            const product = productsData.find(p => p.id === id);
            return `
                <div class="compare-item">
                    <img src="${product.image}" alt="${product.name}">
                    <p style="font-size: 0.85rem; margin-top: 0.5rem;">${product.name}</p>
                    <button class="remove-compare" onclick="toggleCompare(${id})">×</button>
                </div>
            `;
        }).join('');
    } else {
        panel.classList.remove('active');
    }
}

function toggleComparePanel() {
    document.getElementById('comparePanel').classList.toggle('active');
}

function goToComparison() {
    alert('Redirecting to comparison page...');
}

// Quick View
function openQuickView(productId) {
    const product = productsData.find(p => p.id === productId);
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;">
            </div>
            <div>
                <div style="font-size: 0.85rem; color: #7f8c8d; text-transform: uppercase; margin-bottom: 0.5rem;">${product.category}</div>
                <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">${product.name}</h2>
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div class="stars" style="color: #f39c12;">${generateStars(product.rating)}</div>
                    <span style="color: #7f8c8d;">(${product.reviews} reviews)</span>
                </div>
                <p style="color: #7f8c8d; line-height: 1.6; margin-bottom: 1.5rem;">${product.description}</p>
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                    <span style="font-size: 2rem; font-weight: bold; color: #ff6b35;">$${product.price}</span>
                    ${product.originalPrice ? `<span style="font-size: 1.2rem; color: #7f8c8d; text-decoration: line-through;">$${product.originalPrice}</span>` : ''}
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="addToCart(${product.id}); closeQuickView();" style="flex: 1; padding: 1rem; background: #ff6b35; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600; font-size: 1rem;">Add to Cart</button>
                    <button onclick="toggleWishlist(${product.id})" style="padding: 1rem; background: #f5f5f5; border: none; border-radius: 5px; cursor: pointer;"><i class="fas fa-heart"></i></button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Add to recently viewed
    if (!recentlyViewed.includes(productId)) {
        recentlyViewed.unshift(productId);
        if (recentlyViewed.length > 6) recentlyViewed.pop();
        updateRecentlyViewed();
    }
}

function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('active');
}

// Recently Viewed
function updateRecentlyViewed() {
    const container = document.getElementById('recentlyViewed');
    container.innerHTML = recentlyViewed.map(id => {
        const product = productsData.find(p => p.id === id);
        return createProductCard(product);
    }).join('');
}

// Cart
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    alert(`Added "${product.name}" to cart!`);
}

// Mobile Filters
function toggleMobileFilters() {
    document.getElementById('filtersSidebar').classList.toggle('active');
    document.getElementById('mobileFilterOverlay').classList.toggle('active');
}

// Scroll
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleScroll() {
    const scrollBtn = document.getElementById('scrollTop');
    if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
}