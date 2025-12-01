// ===== GLOBAL STATE =====
let currentImageIndex = 0;
let quantity = 1;
let selectedColor = 'Awesome Black';
let selectedStorage = '128GB';
let cartItems = [];
let currentProduct = null;

// ===== PRODUCT DATABASE =====
const productsDatabase = [
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
        stock: 3
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
        stock: 12
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
        stock: 8
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
        stock: 15
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
        stock: 5
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
        stock: 20
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
        stock: 18
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
        stock: 25
    }
];

// ===== PRODUCT IMAGES =====
const productImages = [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800'
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeProduct();
    setupImageZoom();
    loadRelatedProducts();
    showLivePopup();
    loadCurrentProduct();
});

function initializeProduct() {
    // Load saved cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartBadge();
    }
}

// ===== LOAD CURRENT PRODUCT =====
function loadCurrentProduct() {
    // Get product ID from session storage
    const productId = parseInt(sessionStorage.getItem('selectedProductId'));
    
    if (productId) {
        currentProduct = productsDatabase.find(p => p.id === productId);
        
        if (currentProduct) {
            // Update page with product details
            updateProductDetails(currentProduct);
        }
    }
}

function updateProductDetails(product) {
    // Update title
    const titleElement = document.querySelector('.product-title');
    if (titleElement) titleElement.textContent = product.title;
    
    // Update price
    const currentPriceElement = document.querySelector('.current-price');
    if (currentPriceElement) currentPriceElement.textContent = `$${product.price.toFixed(2)}`;
    
    const oldPriceElement = document.querySelector('.old-price');
    if (oldPriceElement) oldPriceElement.textContent = `$${product.oldPrice.toFixed(2)}`;
    
    // Update rating
    const ratingNumber = document.querySelector('.rating-number');
    if (ratingNumber) ratingNumber.textContent = product.rating;
    
    const reviewCount = document.querySelector('.review-count');
    if (reviewCount) reviewCount.textContent = `${product.reviews} reviews`;
    
    // Update stock
    const stockInfo = document.querySelector('.stock-info span');
    if (stockInfo) {
        if (product.stock < 10) {
            stockInfo.innerHTML = `<i class="fas fa-check-circle"></i> In Stock - Only ${product.stock} left!`;
        } else {
            stockInfo.innerHTML = `<i class="fas fa-check-circle"></i> In Stock`;
        }
    }
}

// ===== IMAGE GALLERY FUNCTIONS =====
function changeImage(index) {
    currentImageIndex = index;
    const mainImage = document.querySelector('.main-image img');
    mainImage.src = productImages[index];
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function scrollGallery(direction) {
    const thumbnails = document.getElementById('thumbnails');
    const scrollAmount = 120;
    thumbnails.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

function playVideo() {
    showNotification('Video player feature coming soon!', 'info');
}

// ===== IMAGE ZOOM FUNCTIONALITY =====
function setupImageZoom() {
    const mainImage = document.querySelector('.main-image');
    if (!mainImage) return;
    
    const img = mainImage.querySelector('img');
    const lens = document.getElementById('zoomLens');
    const result = document.getElementById('zoomResult');
    
    if (!img || !lens || !result) return;
    
    mainImage.addEventListener('mousemove', function(e) {
        const rect = mainImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        lens.style.left = (x - lens.offsetWidth / 2) + 'px';
        lens.style.top = (y - lens.offsetHeight / 2) + 'px';
        
        const cx = result.offsetWidth / lens.offsetWidth;
        const cy = result.offsetHeight / lens.offsetHeight;
        
        result.style.backgroundImage = `url('${img.src}')`;
        result.style.backgroundSize = (img.width * cx) + 'px ' + (img.height * cy) + 'px';
        result.style.backgroundPosition = '-' + (x * cx - result.offsetWidth / 2) + 'px -' + (y * cy - result.offsetHeight / 2) + 'px';
    });
}

// ===== FULLSCREEN MODAL =====
function openFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    const fullscreenImage = document.getElementById('fullscreenImage');
    fullscreenImage.src = productImages[currentImageIndex];
    modal.classList.add('active');
    
    const modalThumbnails = document.getElementById('modalThumbnails');
    modalThumbnails.innerHTML = productImages.map((img, i) => 
        `<div class="thumbnail ${i === currentImageIndex ? 'active' : ''}" onclick="changeFullscreenImage(${i})">
            <img src="${img}" alt="Thumbnail ${i + 1}">
        </div>`
    ).join('');
}

function closeFullscreen() {
    document.getElementById('fullscreenModal').classList.remove('active');
}

function changeFullscreenImage(index) {
    currentImageIndex = index;
    document.getElementById('fullscreenImage').src = productImages[index];
    
    document.querySelectorAll('#modalThumbnails .thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function navigateImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = productImages.length - 1;
    if (currentImageIndex >= productImages.length) currentImageIndex = 0;
    
    changeFullscreenImage(currentImageIndex);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeFullscreen();
        closeShareModal();
    }
});

// ===== COLOR SELECTION =====
function selectColor(element) {
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('active');
    });
    element.classList.add('active');
    selectedColor = element.getAttribute('data-color');
    document.getElementById('selectedColor').textContent = selectedColor;
    
    showNotification(`Color changed to ${selectedColor}`, 'success');
}

// ===== STORAGE SELECTION =====
function selectStorage(element, storage) {
    document.querySelectorAll('.storage-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    element.classList.add('active');
    selectedStorage = storage;
    document.getElementById('selectedStorage').textContent = storage;
    
    showNotification(`Storage changed to ${storage}`, 'success');
}

// ===== QUANTITY CONTROLS =====
function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let newQuantity = parseInt(quantityInput.value) + change;
    
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 5) {
        showNotification('Maximum 5 items per customer', 'warning');
        newQuantity = 5;
    }
    
    quantityInput.value = newQuantity;
    quantity = newQuantity;
}

// ===== CART FUNCTIONS =====
function addToCart() {
    let product;
    
    if (currentProduct) {
        product = {
            id: currentProduct.id,
            title: currentProduct.title,
            price: currentProduct.price,
            color: selectedColor,
            storage: selectedStorage,
            quantity: quantity,
            image: currentProduct.image
        };
    } else {
        product = {
            id: Date.now(),
            title: 'Samsung Galaxy A53 5G',
            price: 299.99,
            color: selectedColor,
            storage: selectedStorage,
            quantity: quantity,
            image: productImages[0]
        };
    }
    
    const existingItem = cartItems.find(item => 
        item.id === product.id && 
        item.color === product.color && 
        item.storage === product.storage
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    showNotification(`${quantity} item(s) added to cart!`, 'success');
    updateCartBadge();
}

function buyNow() {
    addToCart();
    showNotification('Redirecting to checkout...', 'success');
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1000);
}

function updateCartBadge() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.badge').forEach(badge => {
        if (badge.parentElement.querySelector('.fa-shopping-cart')) {
            badge.textContent = totalItems;
        }
    });
}

// ===== WISHLIST =====
function addToWishlist() {
    showNotification('Added to wishlist!', 'success');
}

// ===== COMPARE =====
function addToCompare() {
    showNotification('Added to compare list!', 'success');
}

// ===== SHARE FUNCTIONS =====
function shareProduct() {
    document.getElementById('shareModal').classList.add('active');
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
}

function copyLink() {
    const input = document.querySelector('.copy-link input');
    input.select();
    document.execCommand('copy');
    showNotification('Link copied to clipboard!', 'success');
}

// ===== LOCATION =====
function changeLocation() {
    const newLocation = prompt('Enter your location:', 'Kigali');
    if (newLocation) {
        document.querySelector('.delivery-estimate strong:last-child').textContent = newLocation;
        showNotification(`Location changed to ${newLocation}`, 'success');
    }
}

// ===== COUPON FUNCTIONS =====
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    
    if (!couponCode) {
        showNotification('Please enter a coupon code', 'warning');
        return;
    }
    
    const validCoupons = {
        'SAVE10': { discount: 10, type: 'percentage' },
        'FIRST20': { discount: 20, type: 'fixed' }
    };
    
    if (validCoupons[couponCode]) {
        const coupon = validCoupons[couponCode];
        const message = coupon.type === 'percentage' 
            ? `${coupon.discount}% discount applied!` 
            : `$${coupon.discount} discount applied!`;
        showNotification(message, 'success');
    } else {
        showNotification('Invalid coupon code', 'danger');
    }
}

function useCoupon(code) {
    document.getElementById('couponCode').value = code;
    applyCoupon();
}

// ===== TAB SWITCHING =====
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    document.querySelector('.product-tabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== REVIEW MODAL =====
function openReviewModal() {
    showNotification('Review form will open here', 'info');
}

// ===== Q&A =====
function askQuestion() {
    showNotification('Question form will open here', 'info');
}

// ===== LOAD RELATED PRODUCTS =====
function loadRelatedProducts() {
    const relatedProductsGrid = document.getElementById('relatedProducts');
    const recentlyViewedGrid = document.getElementById('recentlyViewed');
    
    if (relatedProductsGrid) {
        relatedProductsGrid.innerHTML = productsDatabase.slice(0, 4).map(product => createProductCard(product)).join('');
    }
    
    if (recentlyViewedGrid) {
        recentlyViewedGrid.innerHTML = productsDatabase.slice(4, 8).map(product => createProductCard(product)).join('');
    }
}

function createProductCard(product) {
    const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    
    return `
        <div class="product-card" onclick="navigateToProduct(${product.id})" style="background: white; border-radius: 15px; overflow: hidden; border: 1px solid #e0e0e0; transition: all 0.3s; cursor: pointer;">
            <div style="position: relative; height: 250px; background: url('${product.image}') center/cover;">
                <span style="position: absolute; top: 10px; left: 10px; background: #27ae60; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold;">
                    -${discount}%
                </span>
            </div>
            <div style="padding: 15px;">
                <h4 style="font-size: 16px; margin-bottom: 10px;">${product.title}</h4>
                <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                    ${generateStars(product.rating)}
                    <span style="color: #7f8c8d; font-size: 13px;">(${product.rating})</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <span style="font-size: 22px; font-weight: bold; color: #ff6b35;">$${product.price.toFixed(2)}</span>
                    <span style="font-size: 16px; color: #7f8c8d; text-decoration: line-through;">$${product.oldPrice.toFixed(2)}</span>
                </div>
                <button onclick="event.stopPropagation(); quickAddToCart(${product.id})" style="width: 100%; padding: 12px; background: #ff6b35; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

function navigateToProduct(productId) {
    sessionStorage.setItem('selectedProductId', productId);
    window.location.reload();
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star" style="color: #f39c12; font-size: 14px;"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt" style="color: #f39c12; font-size: 14px;"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star" style="color: #f39c12; font-size: 14px;"></i>';
    }
    
    return stars;
}

function quickAddToCart(productId) {
    const product = productsDatabase.find(p => p.id === productId);
    if (product) {
        const existingItem = cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
        showNotification(`${product.title} added to cart!`, 'success');
        updateCartBadge();
    }
}

// ===== LIVE POPUP =====
function showLivePopup() {
    const popup = document.getElementById('livePopup');
    if (!popup) return;
    
    setInterval(() => {
        const randomSales = Math.floor(Math.random() * 20) + 5;
        popup.querySelector('span').textContent = `${randomSales} people bought this in the last 24 hours`;
        
        popup.style.animation = 'none';
        setTimeout(() => {
            popup.style.animation = 'slideInLeft 0.5s ease, pulse 2s infinite';
        }, 10);
    }, 30000);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const colors = {
        success: '#27ae60',
        danger: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-width: 400px;
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

// ===== SCROLL EFFECTS =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 100) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else if (navbar) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// ===== ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
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
`;
document.head.appendChild(style);

// ===== INITIALIZE ON LOAD =====
window.addEventListener('load', () => {
    updateCartBadge();
    
    setTimeout(() => {
        const productInfo = document.querySelectorAll('.product-info > *');
        if (productInfo.length > 0) {
            productInfo.forEach((el, i) => {
                setTimeout(() => {
                    el.style.animation = 'slideInRight 0.5s ease forwards';
                }, i * 50);
            });
        }
    }, 100);
});

console.log('Product page initialized successfully!');