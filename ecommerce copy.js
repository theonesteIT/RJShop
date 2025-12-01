// ===== GLOBAL STATE =====
let cartItems = [];
let wishlistItems = [];
let currentLanguage = 'en';
let isDarkMode = false;

// ===== SAMPLE PRODUCT DATA =====
const products = [
    {
        id: 1,
        title: 'Wireless Bluetooth Headphones',
        price: 79.99,
        oldPrice: 129.99,
        rating: 4.5,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        category: 'Electronics',
        badge: '-40%',
        stock: 3,
        slug: 'wireless-bluetooth-headphones'
    },
    {
        id: 2,
        title: 'Smart Watch Series 6',
        price: 299.99,
        oldPrice: 399.99,
        rating: 4.8,
        reviews: 567,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        category: 'Electronics',
        badge: '-25%',
        stock: 12,
        slug: 'smart-watch-series-6'
    },
    {
        id: 3,
        title: 'Premium Leather Jacket',
        price: 159.99,
        oldPrice: 249.99,
        rating: 4.6,
        reviews: 189,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
        category: 'Fashion',
        badge: '-36%',
        stock: 8,
        slug: 'premium-leather-jacket'
    },
    {
        id: 4,
        title: 'Running Shoes Pro',
        price: 89.99,
        oldPrice: 139.99,
        rating: 4.7,
        reviews: 423,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        category: 'Sports',
        badge: '-36%',
        stock: 15,
        slug: 'running-shoes-pro'
    },
    {
        id: 5,
        title: 'Professional Camera',
        price: 899.99,
        oldPrice: 1299.99,
        rating: 4.9,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
        category: 'Electronics',
        badge: '-31%',
        stock: 5,
        slug: 'professional-camera'
    },
    {
        id: 6,
        title: 'Designer Sunglasses',
        price: 149.99,
        oldPrice: 249.99,
        rating: 4.4,
        reviews: 278,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
        category: 'Accessories',
        badge: '-40%',
        stock: 20,
        slug: 'designer-sunglasses'
    },
    {
        id: 7,
        title: 'Laptop Backpack Pro',
        price: 59.99,
        oldPrice: 89.99,
        rating: 4.5,
        reviews: 341,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
        category: 'Accessories',
        badge: '-33%',
        stock: 18,
        slug: 'laptop-backpack-pro'
    },
    {
        id: 8,
        title: 'Wireless Gaming Mouse',
        price: 49.99,
        oldPrice: 79.99,
        rating: 4.6,
        reviews: 512,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
        category: 'Electronics',
        badge: '-38%',
        stock: 25,
        slug: 'wireless-gaming-mouse'
    }
];

// ===== SEARCH SUGGESTIONS DATA =====
const searchSuggestions = {
    trending: ['Wireless Headphones', 'Smart Watch', 'Running Shoes', 'Laptop', 'Phone Cases'],
    categories: ['Electronics', 'Fashion', 'Home & Furniture', 'Beauty', 'Sports'],
    recent: []
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadProducts();
    startCountdown();
    initScrollAnimations();
    setupNavbar();
    
    // Show welcome popup after 1 second
    setTimeout(() => {
        showWelcomePopup();
    }, 1000);
});

function initializeApp() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        isDarkMode = true;
        updateThemeIcon();
    }
    
    // Load saved cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartCount();
    }
    
    // Load saved wishlist
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        wishlistItems = JSON.parse(savedWishlist);
        updateWishlistCount();
    }
}

// ===== NAVBAR FUNCTIONS =====
function setupNavbar() {
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const scrollTop = document.getElementById('scrollTop');
        
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            scrollTop.classList.add('active');
        } else {
            navbar.classList.remove('scrolled');
            scrollTop.classList.remove('active');
        }
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.querySelector('.theme-toggle i');
    themeToggle.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    const langBtn = document.querySelector('.language-btn span');
    if (langBtn) {
        langBtn.textContent = currentLanguage.toUpperCase();
    }
}

// ===== SEARCH FUNCTIONS =====
function showSearchSuggestions() {
    const input = document.getElementById('searchInput');
    const suggestionsDiv = document.getElementById('searchSuggestions');
    const query = input.value.trim().toLowerCase();
    
    if (query.length === 0) {
        suggestionsDiv.classList.remove('active');
        return;
    }
    
    let html = '';
    
    // Trending searches
    html += '<div class="suggestion-section">';
    html += '<h4>Trending Searches</h4>';
    searchSuggestions.trending
        .filter(item => item.toLowerCase().includes(query))
        .forEach(item => {
            html += `<div class="suggestion-item" onclick="selectSearch('${item}')">
                <i class="fas fa-fire"></i>
                <span>${item}</span>
            </div>`;
        });
    html += '</div>';
    
    // Categories
    html += '<div class="suggestion-section">';
    html += '<h4>Categories</h4>';
    searchSuggestions.categories
        .filter(item => item.toLowerCase().includes(query))
        .forEach(item => {
            html += `<div class="suggestion-item" onclick="selectSearch('${item}')">
                <i class="fas fa-tag"></i>
                <span>${item}</span>
            </div>`;
        });
    html += '</div>';
    
    suggestionsDiv.innerHTML = html;
    suggestionsDiv.classList.add('active');
}

function selectSearch(query) {
    const input = document.getElementById('searchInput');
    input.value = query;
    
    // Add to recent searches
    if (!searchSuggestions.recent.includes(query)) {
        searchSuggestions.recent.unshift(query);
        if (searchSuggestions.recent.length > 5) {
            searchSuggestions.recent.pop();
        }
    }
    
    document.getElementById('searchSuggestions').classList.remove('active');
    console.log('Searching for:', query);
}

// Close search suggestions when clicking outside
document.addEventListener('click', function(e) {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(e.target)) {
        document.getElementById('searchSuggestions').classList.remove('active');
    }
});

// ===== CART FUNCTIONS =====
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        displayCartItems();
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Added to cart!', 'success');
    
    // Show cart preview
    setTimeout(() => {
        toggleCart();
    }, 300);
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCartItems();
}

function updateCartQuantity(productId, change) {
    const item = cartItems.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        displayCartItems();
    }
}

function displayCartItems() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cartItems.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = '$0.00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-image" style="background: url('${item.image}') center/cover;"></div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsDiv.innerHTML = html;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// ===== WISHLIST FUNCTIONS =====
function toggleWishlist() {
    showNotification('Wishlist feature coming soon!', 'info');
}

function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const exists = wishlistItems.find(item => item.id === productId);
    
    if (exists) {
        wishlistItems = wishlistItems.filter(item => item.id !== productId);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlistItems.push(product);
        showNotification('Added to wishlist!', 'success');
    }
    
    saveWishlist();
    updateWishlistCount();
}

function updateWishlistCount() {
    document.getElementById('wishlistCount').textContent = wishlistItems.length;
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
}

// ===== PRODUCT DISPLAY FUNCTIONS =====
function loadProducts() {
    // Load flash sale products
    const flashProducts = document.getElementById('flashProducts');
    if (flashProducts) {
        flashProducts.innerHTML = products.slice(0, 6).map(product => createProductCard(product)).join('');
    }
    
    // Load featured products
    const featuredProducts = document.getElementById('featuredProducts');
    if (featuredProducts) {
        featuredProducts.innerHTML = products.slice(0, 6).map(product => createProductCard(product)).join('');
    }
    
    // Load new arrivals
    const newProducts = document.getElementById('newProducts');
    if (newProducts) {
        newProducts.innerHTML = products.map(product => createProductCard(product, 'new')).join('');
    }
    
    // Load best sellers
    const bestProducts = document.getElementById('bestProducts');
    if (bestProducts) {
        bestProducts.innerHTML = products.slice(0, 6).map(product => createProductCard(product, 'bestseller')).join('');
    }
}

// ===== NEW: Navigate to Product Page =====
function goToProductPage(productId) {
    // Save product ID to session storage for the product page to use
    sessionStorage.setItem('selectedProductId', productId);
    
    // Navigate to product page
    window.location.href = 'product.html';
}

function createProductCard(product, badgeType = null) {
    const badgeClass = badgeType || '';
    const badgeText = badgeType === 'new' ? 'NEW' : badgeType === 'bestseller' ? 'BESTSELLER' : product.badge;
    
    return `
        <div class="product-card" onclick="goToProductPage(${product.id})" style="cursor: pointer;">
            <div class="product-image" style="background: url('${product.image}') center/cover;">
                <span class="product-badge ${badgeClass}">${badgeText}</span>
                ${product.stock < 10 ? `<span class="stock-indicator">Only ${product.stock} left!</span>` : ''}
                <div class="product-actions" onclick="event.stopPropagation()">
                    <button class="action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="quickView(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showNotification(`Quick view: ${product.title}`, 'info');
        // Implement modal for quick view
    }
}

// ===== CAROUSEL FUNCTIONS =====
function scrollCarousel(type, direction) {
    const slider = document.getElementById(`${type}Products`);
    if (!slider) return;
    
    const scrollAmount = 300;
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// ===== COUNTDOWN TIMER =====
function startCountdown() {
    const countdownDate = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(countdownInterval);
        }
    };
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// ===== POPUP FUNCTIONS =====
function showWelcomePopup() {
    const popup = document.getElementById('welcomePopup');
    if (popup && !sessionStorage.getItem('welcomeShown')) {
        popup.classList.add('active');
        sessionStorage.setItem('welcomeShown', 'true');
    }
}

function closeWelcomePopup() {
    const popup = document.getElementById('welcomePopup');
    if (popup) {
        popup.classList.remove('active');
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.animate-slide-up, .animate-fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ===== SCROLL TO TOP =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'danger' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== NEWSLETTER SUBSCRIPTION =====
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const button = newsletterForm.querySelector('button');
        button.addEventListener('click', () => {
            const input = newsletterForm.querySelector('input');
            const email = input.value.trim();
            
            if (email && isValidEmail(email)) {
                showNotification('Successfully subscribed to newsletter!', 'success');
                input.value = '';
            } else {
                showNotification('Please enter a valid email address', 'danger');
            }
        });
    }
});

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== CHECKOUT FUNCTION =====
function goToCheckout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty!', 'danger');
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    window.location.href = 'checkout.html';
}

// ===== ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .cart-item {
        position: relative;
    }
    
    .remove-item {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #e74c3c;
        color: white;
        border: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: all 0.3s ease;
    }
    
    .remove-item:hover {
        background: #c0392b;
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

// ===== HERO IMAGE SLIDESHOW =====
const heroImages = [
    "Images/slide4.jpg",
    "Images/slide2.jpg",
    "Images/slide3.jpg",
    "Images/slide1.jpg"
];

let currentIndex = 0;
const heroImageElement = document.querySelector('.hero-image');

if (heroImageElement) {
    function changeHeroImage() {
        currentIndex = (currentIndex + 1) % heroImages.length;
        heroImageElement.style.opacity = 0;

        setTimeout(() => {
            heroImageElement.style.backgroundImage = `url('${heroImages[currentIndex]}')`;
            heroImageElement.style.opacity = 1;
        }, 10);
    }

    setInterval(changeHeroImage, 5000);
}

console.log('E-commerce site initialized successfully!');