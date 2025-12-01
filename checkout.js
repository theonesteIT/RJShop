// Global Variables
let currentStep = 1;
let cartItems = [];
let formData = {
    fullName: '',
    email: '',
    phone: '',
    country: 'Rwanda',
    city: '',
    district: '',
    street: '',
    apartment: '',
    postalCode: '',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    couponCode: '',
    giftWrap: false,
    orderNotes: ''
};

let prices = {
    subtotal: 0,
    shipping: 5.00,
    discount: 0,
    tax: 0,
    giftWrap: 0
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    initializeForm();
    updateProgressBar();
    setupEventListeners();
    displayCartItems();
    calculateTotal();
});

// Load cart from localStorage (from main site)
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cartItems = JSON.parse(savedCart);
            console.log('Cart loaded:', cartItems);
            
            // Check if cart is empty
            if (cartItems.length === 0) {
                showEmptyCartModal();
            }
        } catch (e) {
            console.error('Error loading cart:', e);
            cartItems = [];
            showEmptyCartModal();
        }
    } else {
        showEmptyCartModal();
    }
}

// Show empty cart modal
function showEmptyCartModal() {
    const modal = document.getElementById('emptyCartModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Display cart items in order summary
function displayCartItems() {
    const summaryProducts = document.getElementById('summaryProducts');
    
    if (!summaryProducts) return;
    
    if (cartItems.length === 0) {
        summaryProducts.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    let savings = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        // Calculate savings if there's an old price
        if (item.oldPrice) {
            savings += (item.oldPrice - item.price) * item.quantity;
        }
        
        html += `
            <div class="product-item">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/80'">
                <div class="product-details">
                    <h4>${item.title}</h4>
                    <p>Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
                </div>
                <div class="product-price">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    summaryProducts.innerHTML = html;
    prices.subtotal = subtotal;
    
    // Show savings if applicable
    if (savings > 0) {
        document.getElementById('savingsRow').style.display = 'flex';
        document.getElementById('savings').textContent = '$' + savings.toFixed(2);
    }
}

// Initialize form
function initializeForm() {
    document.getElementById('country').value = 'Rwanda';
    detectPhoneCountryCode();
}

// Setup all event listeners
function setupEventListeners() {
    // Delivery method selection
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', handleDeliveryChange);
    });

    // Payment method selection
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentChange);
    });

    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
    }

    // Card expiry formatting
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', formatCardExpiry);
    }

    // CVV formatting
    const cardCVV = document.getElementById('cardCVV');
    if (cardCVV) {
        cardCVV.addEventListener('input', formatCVV);
    }

    // Phone formatting
    const phone = document.getElementById('phone');
    if (phone) {
        phone.addEventListener('input', formatPhone);
    }

    // Gift wrap checkbox
    const giftWrap = document.getElementById('giftWrap');
    if (giftWrap) {
        giftWrap.addEventListener('change', handleGiftWrap);
    }

    // Real-time validation
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Navigation Functions
function nextStep() {
    if (validateCurrentStep()) {
        saveStepData();
        currentStep++;
        showStep(currentStep);
        updateProgressBar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (currentStep === 5) {
            updateReviewSection();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgressBar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showStep(step) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const currentSection = document.getElementById(`step${step}`);
    if (currentSection) {
        currentSection.classList.add('active');
    }
    
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });
}

function updateProgressBar() {
    const progress = ((currentStep - 1) / 4) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// Validation Functions
function validateCurrentStep() {
    let isValid = true;
    
    switch(currentStep) {
        case 1:
            isValid = validateStep1();
            break;
        case 2:
            isValid = validateStep2();
            break;
        case 3:
            isValid = validateStep3();
            break;
        case 4:
            isValid = validateStep4();
            break;
    }
    
    return isValid;
}

function validateStep1() {
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    
    let isValid = true;
    
    if (!validateField(fullName)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validateField(phone)) isValid = false;
    
    return isValid;
}

function validateStep2() {
    const city = document.getElementById('city');
    const district = document.getElementById('district');
    const street = document.getElementById('street');
    
    let isValid = true;
    
    if (!validateField(city)) isValid = false;
    if (!validateField(district)) isValid = false;
    if (!validateField(street)) isValid = false;
    
    return isValid;
}

function validateStep3() {
    return true;
}

function validateStep4() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber');
        const cardExpiry = document.getElementById('cardExpiry');
        const cardCVV = document.getElementById('cardCVV');
        
        let isValid = true;
        
        if (!validateCardNumber(cardNumber)) isValid = false;
        if (!validateField(cardExpiry)) isValid = false;
        if (!validateField(cardCVV)) isValid = false;
        
        return isValid;
    } else if (paymentMethod === 'mobile') {
        const mobileNumber = document.getElementById('mobileNumber');
        return validateField(mobileNumber);
    }
    
    return true;
}

function validateField(field) {
    if (!field) return true;
    
    const value = field.value.trim();
    const errorElement = field.nextElementSibling;
    
    if (value === '') {
        field.classList.add('error');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = 'This field is required';
            errorElement.classList.add('show');
        }
        return false;
    } else {
        field.classList.remove('error');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.classList.remove('show');
        }
        return true;
    }
}

function validateEmail(field) {
    const value = field.value.trim();
    const errorElement = field.nextElementSibling;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value === '') {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = 'Email is required';
            errorElement.classList.add('show');
        }
        return false;
    } else if (!emailPattern.test(value)) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.classList.add('show');
        }
        return false;
    } else {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        return true;
    }
}

function validateCardNumber(field) {
    const value = field.value.replace(/\s/g, '');
    const errorElement = field.nextElementSibling;
    
    if (value === '') {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = 'Card number is required';
            errorElement.classList.add('show');
        }
        return false;
    } else if (value.length < 13) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = 'Please enter a valid card number';
            errorElement.classList.add('show');
        }
        return false;
    } else {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        return true;
    }
}

// Formatting Functions
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

function formatCardExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function formatCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
}

function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('250')) {
        value = value.substring(3);
    }
    if (value.length > 0) {
        e.target.value = '+250 ' + value.substring(0, 3) + (value.length > 3 ? ' ' + value.substring(3, 6) : '') + (value.length > 6 ? ' ' + value.substring(6, 9) : '');
    }
}

function detectPhoneCountryCode() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput && phoneInput.value === '') {
        phoneInput.placeholder = '+250 7XX XXX XXX';
    }
}

// Delivery and Payment Handlers
function handleDeliveryChange(e) {
    const method = e.target.value;
    formData.deliveryMethod = method;
    
    document.querySelectorAll('.delivery-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    e.target.closest('.delivery-option').classList.add('selected');
    
    switch(method) {
        case 'standard':
            prices.shipping = 5.00;
            break;
        case 'express':
            prices.shipping = 15.00;
            break;
        case 'sameday':
            prices.shipping = 25.00;
            break;
        case 'pickup':
            prices.shipping = 0;
            break;
    }
    
    calculateTotal();
}

function handlePaymentChange(e) {
    const method = e.target.value;
    formData.paymentMethod = method;
    
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('active');
    });
    
    e.target.closest('.payment-option').classList.add('active');
    
    document.getElementById('cardForm').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('mobileForm').style.display = method === 'mobile' ? 'block' : 'none';
}

function handleGiftWrap(e) {
    formData.giftWrap = e.target.checked;
    prices.giftWrap = e.target.checked ? 5.00 : 0;
    
    const giftWrapRow = document.getElementById('giftWrapRow');
    if (giftWrapRow) {
        giftWrapRow.style.display = e.target.checked ? 'flex' : 'none';
    }
    
    calculateTotal();
}

// Coupon Functions
function applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    const validCoupons = {
        'WELCOME20': 20,
        'SAVE20': 20,
        'SAVE10': 10,
        'FREESHIP': 'free_shipping'
    };
    
    if (validCoupons[couponCode]) {
        if (validCoupons[couponCode] === 'free_shipping') {
            prices.shipping = 0;
            document.getElementById('couponText').textContent = `Coupon "${couponCode}" applied - Free shipping!`;
            showNotification('Free shipping applied!', 'success');
        } else {
            prices.discount = (prices.subtotal * validCoupons[couponCode]) / 100;
            document.getElementById('couponText').textContent = `Coupon "${couponCode}" applied - ${validCoupons[couponCode]}% off!`;
            showNotification(`${validCoupons[couponCode]}% discount applied!`, 'success');
        }
        
        document.getElementById('couponApplied').style.display = 'flex';
        document.querySelector('.coupon-section').style.display = 'none';
        formData.couponCode = couponCode;
        calculateTotal();
    } else {
        showNotification('Invalid coupon code', 'error');
    }
}

function removeCoupon() {
    prices.discount = 0;
    const currentDeliveryMethod = formData.deliveryMethod;
    
    // Reset shipping based on current delivery method
    switch(currentDeliveryMethod) {
        case 'standard':
            prices.shipping = 5.00;
            break;
        case 'express':
            prices.shipping = 15.00;
            break;
        case 'sameday':
            prices.shipping = 25.00;
            break;
        case 'pickup':
            prices.shipping = 0;
            break;
    }
    
    formData.couponCode = '';
    
    document.getElementById('couponApplied').style.display = 'none';
    document.querySelector('.coupon-section').style.display = 'flex';
    document.getElementById('couponInput').value = '';
    
    calculateTotal();
    showNotification('Coupon removed', 'info');
}

// Calculate Total
function calculateTotal() {
    const subtotal = prices.subtotal;
    const shipping = prices.shipping;
    const discount = prices.discount;
    const giftWrap = prices.giftWrap;
    
    const subtotalAfterDiscount = subtotal - discount + giftWrap;
    const tax = subtotalAfterDiscount * 0.16;
    const total = subtotalAfterDiscount + shipping + tax;
    
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
    
    if (discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discount').textContent = '-$' + discount.toFixed(2);
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
    
    prices.tax = tax;
}

// Save Step Data
function saveStepData() {
    switch(currentStep) {
        case 1:
            formData.fullName = document.getElementById('fullName').value;
            formData.email = document.getElementById('email').value;
            formData.phone = document.getElementById('phone').value;
            break;
        case 2:
            formData.country = document.getElementById('country').value;
            formData.city = document.getElementById('city').value;
            formData.district = document.getElementById('district').value;
            formData.street = document.getElementById('street').value;
            formData.apartment = document.getElementById('apartment').value;
            formData.postalCode = document.getElementById('postalCode').value;
            break;
        case 4:
            formData.orderNotes = document.getElementById('orderNotes')?.value || '';
            break;
    }
}

// Update Review Section
function updateReviewSection() {
    document.getElementById('reviewName').textContent = formData.fullName;
    document.getElementById('reviewEmail').textContent = formData.email;
    document.getElementById('reviewPhone').textContent = formData.phone;
    
    const address = `${formData.street}${formData.apartment ? ', ' + formData.apartment : ''}<br>
                     ${formData.city}, ${formData.district}<br>
                     ${formData.country}${formData.postalCode ? ', ' + formData.postalCode : ''}`;
    document.getElementById('reviewAddress').innerHTML = address;
    
    const deliveryNames = {
        'standard': 'Standard Delivery (5-7 days) - $5.00',
        'express': 'Express Delivery (Tomorrow) - $15.00',
        'sameday': 'Same-Day Delivery (Today) - $25.00',
        'pickup': 'Pickup Station - Free'
    };
    document.getElementById('reviewDelivery').textContent = deliveryNames[formData.deliveryMethod];
    
    const paymentNames = {
        'card': 'Credit / Debit Card',
        'mobile': 'Mobile Money',
        'paypal': 'PayPal',
        'cod': 'Cash on Delivery'
    };
    document.getElementById('reviewPayment').textContent = paymentNames[formData.paymentMethod];
}

// Place Order
function placeOrder() {
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        
        // Clear cart after successful order
        localStorage.removeItem('cart');
        cartItems = [];
        
        showSuccessModal();
    }, 2000);
}

function showLoadingState() {
    const btn = document.querySelector('.btn-success');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
}

function hideLoadingState() {
    const btn = document.querySelector('.btn-success');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-lock"></i> Place Order & Pay';
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
    
    const orderNumber = '#ORD-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('orderNumber').textContent = orderNumber;
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('deliveryDate').textContent = deliveryDate.toLocaleDateString('en-US', options);
}

function closeModal() {
    document.getElementById('successModal').classList.remove('show');
    window.location.href = 'index.html';
}

function downloadInvoice() {
    showNotification('Invoice downloaded successfully!', 'success');
}

function trackOrder() {
    showNotification('Redirecting to order tracking...', 'info');
    setTimeout(() => {
        window.location.href = 'track-order.html';
    }, 1000);
}

// Utility Functions
function detectLocation() {
    if (navigator.geolocation) {
        showNotification('Detecting your location...', 'info');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                showNotification('Location detected!', 'success');
                document.getElementById('city').value = 'Kigali';
                document.getElementById('district').value = 'Gasabo';
            },
            (error) => {
                showNotification('Unable to detect location', 'error');
            }
        );
    } else {
        showNotification('Geolocation is not supported by your browser', 'error');
    }
}

function toggleSummary() {
    const content = document.getElementById('summaryContent');
    const toggle = document.getElementById('summaryToggle');
    const header = document.querySelector('.summary-header');
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        header.classList.remove('collapsed');
        toggle.classList.remove('fa-chevron-down');
        toggle.classList.add('fa-chevron-up');
    } else {
        content.classList.add('collapsed');
        header.classList.add('collapsed');
        toggle.classList.remove('fa-chevron-up');
        toggle.classList.add('fa-chevron-down');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    notification.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    .empty-cart-message {
        text-align: center;
        padding: 20px;
        color: #7f8c8d;
        font-style: italic;
    }
`;
document.head.appendChild(style);

