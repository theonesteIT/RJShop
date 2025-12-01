// Sample order data (in real app, this would come from backend)
const sampleOrders = {
    'ORD-654321': {
        orderId: 'ORD-654321',
        trackingNumber: 'TRK-9876543210',
        orderDate: 'Nov 25, 2024',
        deliveryDate: 'Nov 30, 2024',
        deliveryMethod: 'Express Delivery',
        paymentMethod: 'Visa •••• 4242',
        orderAmount: '$259.99',
        customerName: 'John Doe',
        customerPhone: '+250 788 XXX XXX',
        customerEmail: 'john.doe@email.com',
        shippingAddress: 'KG 123 St, Apt 4B<br>Kigali, Gasabo<br>Rwanda',
        status: 'In Transit',
        currentStep: 4,
        otpCode: '7 4 9 2'
    },
    'TRK-9876543210': {
        orderId: 'ORD-654321',
        trackingNumber: 'TRK-9876543210',
        orderDate: 'Nov 25, 2024',
        deliveryDate: 'Nov 30, 2024',
        deliveryMethod: 'Express Delivery',
        paymentMethod: 'Visa •••• 4242',
        orderAmount: '$259.99',
        customerName: 'John Doe',
        customerPhone: '+250 788 XXX XXX',
        customerEmail: 'john.doe@email.com',
        shippingAddress: 'KG 123 St, Apt 4B<br>Kigali, Gasabo<br>Rwanda',
        status: 'In Transit',
        currentStep: 4,
        otpCode: '7 4 9 2'
    }
};

// Global variables
let currentOrder = null;
let liveTrackingEnabled = false;
let autoRefreshInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's an order ID in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    
    if (orderId) {
        document.getElementById('orderId').value = orderId;
        trackOrder('orderid');
    }
});

// Switch between tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.track-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update forms
    document.querySelectorAll('.track-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tabName}Form`).classList.add('active');
    
    // Hide error message
    document.getElementById('errorMessage').style.display = 'none';
}

// Track order function
function trackOrder(method) {
    let searchValue = '';
    
    switch(method) {
        case 'orderid':
            searchValue = document.getElementById('orderId').value.trim().toUpperCase();
            break;
        case 'phone':
            searchValue = document.getElementById('phoneNumber').value.trim();
            const phoneOrderId = document.getElementById('phoneOrderId').value.trim().toUpperCase();
            if (phoneOrderId) searchValue = phoneOrderId;
            break;
        case 'email':
            searchValue = document.getElementById('email').value.trim();
            const emailOrderId = document.getElementById('emailOrderId').value.trim().toUpperCase();
            if (emailOrderId) searchValue = emailOrderId;
            break;
    }
    
    if (!searchValue) {
        showError('Please enter the required information');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        const order = sampleOrders[searchValue];
        
        if (order) {
            currentOrder = order;
            displayOrderTracking(order);
            hideLoading();
        } else {
            hideLoading();
            showError('Order not found. Please check your details and try again.');
        }
    }, 1500);
}

// Display order tracking
function displayOrderTracking(order) {
    document.getElementById('trackInputSection').style.display = 'none';
    document.getElementById('trackingSection').style.display = 'block';
    
    // Update order summary
    document.getElementById('summaryOrderId').textContent = order.orderId;
    document.getElementById('trackingNumber').textContent = order.trackingNumber;
    document.getElementById('orderDate').textContent = order.orderDate;
    document.getElementById('deliveryDate').textContent = order.deliveryDate;
    document.getElementById('deliveryMethod').textContent = order.deliveryMethod;
    document.getElementById('paymentMethod').textContent = order.paymentMethod;
    document.getElementById('orderAmount').textContent = order.orderAmount;
    document.getElementById('customerName').textContent = order.customerName;
    document.getElementById('orderStatus').textContent = order.status;
    
    // Update customer info
    document.getElementById('custName').textContent = order.customerName;
    document.getElementById('custPhone').textContent = order.customerPhone;
    document.getElementById('custEmail').textContent = order.customerEmail;
    document.getElementById('shippingAddress').innerHTML = order.shippingAddress;
    
    // Update OTP
    document.getElementById('otpCode').textContent = order.otpCode;
    
    // Update progress bar
    const progress = (order.currentStep / 6) * 100;
    document.getElementById('progressFillTrack').style.width = progress + '%';
    
    // Update alert message based on status
    updateAlertMessage(order.status);
    
    // Start auto-refresh
    startAutoRefresh();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update alert message
function updateAlertMessage(status) {
    const messages = {
        'Order Placed': 'Your order has been placed successfully!',
        'Payment Verified': 'Payment confirmed. Preparing your order...',
        'Processing': 'Your order is being prepared for shipment',
        'In Transit': 'Your package is out for delivery today!',
        'Out for Delivery': 'Your package will arrive soon!',
        'Delivered': 'Your package has been delivered successfully!'
    };
    
    document.getElementById('alertMessage').textContent = messages[status] || 'Tracking your order...';
}

// Show error
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    document.getElementById('errorText').textContent = message;
    errorDiv.style.display = 'flex';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Show loading
function showLoading() {
    const buttons = document.querySelectorAll('.btn-track');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Tracking...';
    });
}

// Hide loading
function hideLoading() {
    const buttons = document.querySelectorAll('.btn-track');
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-search"></i> Track Order';
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.4s ease;
        font-weight: 600;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    notification.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Refresh tracking
function refreshTracking() {
    const btn = document.querySelector('.btn-refresh i');
    btn.classList.add('fa-spin');
    
    showNotification('Refreshing tracking information...', 'info');
    
    setTimeout(() => {
        btn.classList.remove('fa-spin');
        showNotification('Tracking information updated!', 'success');
    }, 1500);
}

// Enable live tracking
function enableLiveTracking() {
    if (!liveTrackingEnabled) {
        liveTrackingEnabled = true;
        document.querySelector('.map-placeholder').style.display = 'none';
        document.getElementById('mapInfo').style.display = 'block';
        
        // Simulate map loading
        const mapContainer = document.getElementById('mapContainer');
        mapContainer.innerHTML = `
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 600;">
                <div style="text-align: center;">
                    <i class="fas fa-map-marked-alt" style="font-size: 60px; margin-bottom: 15px;"></i>
                    <p>Live Tracking Active</p>
                    <p style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Driver is 5.2 km away</p>
                </div>
            </div>
        `;
        
        showNotification('Live tracking enabled!', 'success');
    } else {
        showNotification('Live tracking is already active', 'info');
    }
}

// Filter updates
function filterUpdates(filter) {
    showNotification(`Showing ${filter} updates`, 'info');
}

// Reorder
function reorder() {
    showNotification('Adding items to cart...', 'success');
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1500);
}

// Download invoice
function downloadInvoice() {
    showNotification('Downloading invoice...', 'success');
    setTimeout(() => {
        showNotification('Invoice downloaded successfully!', 'success');
    }, 1000);
}

// Contact support
function contactSupport() {
    showNotification('Opening support chat...', 'info');
    setTimeout(() => {
        openLiveChat();
    }, 500);
}

// Call rider
function callRider() {
    showNotification('Calling delivery partner...', 'info');
    setTimeout(() => {
        window.location.href = 'tel:+250788000000';
    }, 1000);
}

// SMS rider
function smsRider() {
    showNotification('Opening SMS...', 'info');
    setTimeout(() => {
        window.location.href = 'sms:+250788000000';
    }, 1000);
}

// Download label
function downloadLabel() {
    showNotification('Downloading package label...', 'success');
}

// Edit address
function editAddress() {
    const newAddress = prompt('Enter new delivery address:');
    if (newAddress) {
        showNotification('Address update requested. Support will contact you shortly.', 'success');
    }
}

// Toggle card
function toggleCard(button) {
    const card = button.closest('.card');
    const body = card.querySelector('.card-body');
    const icon = button.querySelector('i');
    
    if (body.style.display === 'none') {
        body.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        body.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// Cancel order
function cancelOrder() {
    if (confirm('Are you sure you want to cancel this order?')) {
        showNotification('Processing cancellation request...', 'info');
        setTimeout(() => {
            showNotification('Cancellation request submitted. We will process your refund within 3-5 business days.', 'success');
        }, 1500);
    }
}

// Reschedule delivery
function rescheduleDelivery() {
    const newDate = prompt('Enter preferred delivery date (e.g., Dec 5, 2024):');
    if (newDate) {
        showNotification('Delivery rescheduled successfully!', 'success');
    }
}

// Change address
function changeAddress() {
    const newAddress = prompt('Enter new delivery address:');
    if (newAddress) {
        showNotification('Address updated successfully!', 'success');
        document.getElementById('shippingAddress').textContent = newAddress;
    }
}

// Request return
function requestReturn() {
    showNotification('Return request form will open shortly...', 'info');
    setTimeout(() => {
        alert('Return Request Form\n\nPlease contact support at support@shophub.com or call +250 788 XXX XXX to initiate a return.');
    }, 1000);
}

// Open live chat
function openLiveChat() {
    alert('Live Chat\n\nConnecting you to a support representative...\n\nIn a real application, this would open a live chat widget.');
    showNotification('Connected to support!', 'success');
}

// Submit ticket
function submitTicket() {
    const issue = prompt('Describe your issue:');
    if (issue) {
        showNotification('Support ticket submitted. Ticket #' + Math.floor(100000 + Math.random() * 900000), 'success');
    }
}

// Open support
function openSupport() {
    alert('Support Options:\n\n📧 Email: support@shophub.com\n📞 Phone: +250 788 XXX XXX\n💬 Live Chat: Available 24/7');
}

// Buy again
function buyAgain(productId) {
    showNotification('Adding product to cart...', 'success');
    setTimeout(() => {
        showNotification('Product added to cart!', 'success');
    }, 1000);
}

// Auto-refresh tracking data
function startAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Refresh every 2 minutes
    autoRefreshInterval = setInterval(() => {
        console.log('Auto-refreshing tracking data...');
        // In real app, this would fetch new data from API
    }, 120000);
}

// Stop auto-refresh when leaving page
window.addEventListener('beforeunload', function() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});

// Handle back button
window.addEventListener('popstate', function() {
    if (document.getElementById('trackingSection').style.display === 'block') {
        document.getElementById('trackingSection').style.display = 'none';
        document.getElementById('trackInputSection').style.display = 'flex';
    }
});

// Demo function - auto-load tracking for demonstration
// Uncomment the line below to automatically show tracking page
// setTimeout(() => trackOrder('orderid'), 500);