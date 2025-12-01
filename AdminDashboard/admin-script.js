// ===== GLOBAL VARIABLES =====
let isDarkMode = false;
let currentPage = 1;
let itemsPerPage = 20;
let products = [];
let orders = [];
let categories = [];
let currentView = 'grid';

// ===== SAMPLE DATA =====
const sampleOrders = [
    { id: 'ORD-1001', customer: 'John Doe', date: '2025-01-15', total: 234.50, status: 'delivered' },
    { id: 'ORD-1002', customer: 'Jane Smith', date: '2025-01-14', total: 189.99, status: 'shipped' },
    { id: 'ORD-1003', customer: 'Mike Johnson', date: '2025-01-14', total: 456.00, status: 'pending' },
    { id: 'ORD-1004', customer: 'Sarah Wilson', date: '2025-01-13', total: 678.50, status: 'paid' },
    { id: 'ORD-1005', customer: 'Tom Brown', date: '2025-01-13', total: 123.45, status: 'canceled' }
];

const sampleCustomers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 234-567-8900',
        orders: 23,
        spent: 2345.67,
        status: 'active',
        joined: '2024-06-15'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1 234-567-8901',
        orders: 45,
        spent: 5678.90,
        status: 'active',
        joined: '2024-03-20'
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.j@email.com',
        phone: '+1 234-567-8902',
        orders: 12,
        spent: 1234.56,
        status: 'active',
        joined: '2024-08-10'
    },
    {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah.w@email.com',
        phone: '+1 234-567-8903',
        orders: 67,
        spent: 8901.23,
        status: 'active',
        joined: '2024-01-05'
    },
    {
        id: 5,
        name: 'Tom Brown',
        email: 'tom.brown@email.com',
        phone: '+1 234-567-8904',
        orders: 8,
        spent: 456.78,
        status: 'blocked',
        joined: '2024-10-22'
    }
];

const sampleProducts = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 79.99,
        stock: 45,
        sold: 234,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'
    },
    {
        id: 2,
        name: 'Smart Watch',
        price: 299.99,
        stock: 23,
        sold: 189,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'
    },
    {
        id: 3,
        name: 'Leather Jacket',
        price: 159.99,
        stock: 12,
        sold: 156,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100'
    },
    {
        id: 4,
        name: 'Running Shoes',
        price: 89.99,
        stock: 67,
        sold: 234,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'
    }
];

const sampleActivities = [
    { text: 'New order #1234 received', time: '5 minutes ago', icon: 'fa-shopping-cart', color: 'success' },
    { text: 'Product "Wireless Headphones" is low in stock', time: '15 minutes ago', icon: 'fa-exclamation-triangle', color: 'warning' },
    { text: 'Customer John Doe registered', time: '1 hour ago', icon: 'fa-user-plus', color: 'info' },
    { text: 'Order #1230 was delivered', time: '2 hours ago', icon: 'fa-check-circle', color: 'success' },
    { text: 'Payment failed for order #1229', time: '3 hours ago', icon: 'fa-times-circle', color: 'danger' }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadDashboardData();
    initializeCharts();
    loadProducts();
    loadOrders();
    loadCategories();
});

function initializeTheme() {
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        isDarkMode = true;
        updateThemeIcon();
    }
    
    // Load saved products
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
}

// ===== SIDEBAR FUNCTIONS =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// ===== THEME FUNCTIONS =====
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('adminTheme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeBtn = document.querySelector('.header-btn i.fa-moon, .header-btn i.fa-sun');
    if (themeBtn) {
        themeBtn.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ===== DASHBOARD DATA LOADING =====
function loadDashboardData() {
    loadRecentOrders();
    loadTopProducts();
    loadLowStockAlerts();
    loadRecentActivity();
    loadCustomers();
}

function loadRecentOrders() {
    const tableBody = document.getElementById('recentOrdersTable');
    if (!tableBody) return;

    tableBody.innerHTML = sampleOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td><strong>$${order.total.toFixed(2)}</strong></td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewOrder('${order.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editOrder('${order.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadTopProducts() {
    const productsDiv = document.getElementById('topProducts');
    if (!productsDiv) return;

    productsDiv.innerHTML = sampleProducts.map(product => `
        <div class="product-item">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-item-details">
                <h4>${product.name}</h4>
                <p><strong>$${product.price}</strong> • ${product.sold} sold</p>
            </div>
            <span class="status-badge ${product.stock < 20 ? 'pending' : 'active'}">
                ${product.stock} in stock
            </span>
        </div>
    `).join('');
}

function loadLowStockAlerts() {
    const alertsDiv = document.getElementById('lowStockAlerts');
    if (!alertsDiv) return;

    const lowStockProducts = sampleProducts.filter(p => p.stock < 30);
    
    if (lowStockProducts.length === 0) {
        alertsDiv.innerHTML = '<p style="text-align: center; color: var(--gray-500);">No low stock alerts</p>';
        return;
    }

    alertsDiv.innerHTML = lowStockProducts.map(product => `
        <div class="alert-item">
            <div style="display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-exclamation-triangle" style="color: var(--warning); font-size: 20px;"></i>
                <div style="flex: 1;">
                    <strong>${product.name}</strong>
                    <p style="font-size: 13px; color: var(--gray-500);">Only ${product.stock} units left</p>
                </div>
                <button class="btn btn-sm btn-primary" onclick="restockProduct(${product.id})">Restock</button>
            </div>
        </div>
    `).join('');
}

function loadRecentActivity() {
    const activityDiv = document.getElementById('activityList');
    if (!activityDiv) return;

    activityDiv.innerHTML = sampleActivities.map(activity => `
        <div class="activity-item">
            <div style="display: flex; align-items: start; gap: 15px;">
                <i class="fas ${activity.icon}" style="color: var(--${activity.color}); font-size: 18px; margin-top: 3px;"></i>
                <div style="flex: 1;">
                    <p style="margin-bottom: 5px;">${activity.text}</p>
                    <small style="color: var(--gray-500);">${activity.time}</small>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== CUSTOMERS FUNCTIONS =====
function loadCustomers() {
    const tableBody = document.getElementById('customersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = sampleCustomers.map(customer => `
        <tr>
            <td><input type="checkbox" class="customer-checkbox" data-id="${customer.id}"></td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random" 
                         style="width: 40px; height: 40px; border-radius: 50%;" 
                         alt="${customer.name}">
                    <strong>${customer.name}</strong>
                </div>
            </td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td><strong>${customer.orders}</strong></td>
            <td><strong>$${customer.spent.toFixed(2)}</strong></td>
            <td><span class="status-badge ${customer.status}">${customer.status}</span></td>
            <td>${customer.joined}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewCustomer(${customer.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editCustomer(${customer.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteCustomer(${customer.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
    const filteredCustomers = sampleCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
    );
    
    const tableBody = document.getElementById('customersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = filteredCustomers.map(customer => `
        <tr>
            <td><input type="checkbox" class="customer-checkbox" data-id="${customer.id}"></td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random" 
                         style="width: 40px; height: 40px; border-radius: 50%;" 
                         alt="${customer.name}">
                    <strong>${customer.name}</strong>
                </div>
            </td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td><strong>${customer.orders}</strong></td>
            <td><strong>$${customer.spent.toFixed(2)}</strong></td>
            <td><span class="status-badge ${customer.status}">${customer.status}</span></td>
            <td>${customer.joined}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewCustomer(${customer.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editCustomer(${customer.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteCustomer(${customer.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterCustomers(type) {
    console.log('Filtering customers by:', type);
    showNotification('Filter applied: ' + type, 'info');
}

function selectAllCustomers(checkbox) {
    const checkboxes = document.querySelectorAll('.customer-checkbox');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

function viewCustomer(id) {
    const customer = sampleCustomers.find(c => c.id === id);
    if (!customer) return;

    const modal = document.getElementById('customerDetailModal');
    const content = document.getElementById('customerDetailContent');
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h3 style="margin-bottom: 15px;">Customer Information</h3>
                <p><strong>Name:</strong> ${customer.name}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                <p><strong>Status:</strong> <span class="status-badge ${customer.status}">${customer.status}</span></p>
                <p><strong>Joined:</strong> ${customer.joined}</p>
            </div>
            <div>
                <h3 style="margin-bottom: 15px;">Order Statistics</h3>
                <p><strong>Total Orders:</strong> ${customer.orders}</p>
                <p><strong>Total Spent:</strong> $${customer.spent.toFixed(2)}</p>
                <p><strong>Average Order:</strong> $${(customer.spent / customer.orders).toFixed(2)}</p>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function editCustomer(id) {
    showNotification('Edit customer: ' + id, 'info');
}

function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        showNotification('Customer deleted successfully', 'success');
    }
}

function showAddCustomerModal() {
    showNotification('Add customer modal would open here', 'info');
}

function bulkEmail() {
    const selected = document.querySelectorAll('.customer-checkbox:checked').length;
    if (selected === 0) {
        showNotification('Please select customers first', 'warning');
        return;
    }
    showNotification(`Sending email to ${selected} customers`, 'success');
}

function bulkExport() {
    const selected = document.querySelectorAll('.customer-checkbox:checked').length;
    if (selected === 0) {
        showNotification('Please select customers first', 'warning');
        return;
    }
    showNotification(`Exporting ${selected} customers`, 'success');
}

// ===== PRODUCT FORM FUNCTIONS =====
function handleImageUpload(event) {
    const files = event.target.files;
    const previewGrid = document.getElementById('imagePreviewGrid');
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'image-preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Product image ${index + 1}">
                <button class="remove-image" onclick="removeImage(this)">
                    <i class="fas fa-times"></i>
                </button>
            `;
            previewGrid.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(button) {
    button.parentElement.remove();
}

function toggleVariants() {
    const checkbox = document.getElementById('hasVariants');
    const variantsSection = document.getElementById('variantsSection');
    variantsSection.style.display = checkbox.checked ? 'block' : 'none';
}

function saveProduct() {
    const form = document.getElementById('productForm');
    if (form && form.checkValidity()) {
        showNotification('Product saved successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1500);
    } else {
        showNotification('Please fill in all required fields', 'warning');
        form.reportValidity();
    }
}

function saveDraft() {
    showNotification('Product saved as draft', 'info');
}

// ===== ORDER FUNCTIONS =====
function viewOrder(id) {
    showNotification('View order: ' + id, 'info');
}

function editOrder(id) {
    showNotification('Edit order: ' + id, 'info');
}

// ===== PRODUCT FUNCTIONS =====
function restockProduct(id) {
    showNotification('Restock request sent for product ' + id, 'success');
}

// ===== MODAL FUNCTIONS =====
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ===== CHARTS =====
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Sales',
                    data: [1200, 1900, 1500, 2100, 1800, 2400, 2100],
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Order Status Chart
    const orderCtx = document.getElementById('orderChart');
    if (orderCtx) {
        new Chart(orderCtx, {
            type: 'doughnut',
            data: {
                labels: ['Delivered', 'Shipped', 'Pending', 'Canceled'],
                datasets: [{
                    data: [450, 230, 120, 45],
                    backgroundColor: [
                        '#27ae60',
                        '#3498db',
                        '#f39c12',
                        '#e74c3c'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? '#27ae60' : type === 'danger' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
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

// ===== LOGOUT =====
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// ===== ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
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

// ===== PRODUCTS MANAGEMENT =====
// function loadProducts() {
//     const productsGrid = document.getElementById('productsGrid');
//     const productsTableBody = document.getElementById('productsTableBody');
    
//     if (!productsGrid && !productsTableBody) return;
    
//     // If no products, use sample data
//     if (products.length === 0) {
//         products = sampleProducts.map((p, index) => ({
//             ...p,
//             sku: `SKU-${1000 + index}`,
//             category: p.category || 'Electronics',
//             status: 'active'
//         }));
//     }
    
//     // Grid View
//     if (productsGrid) {
//         productsGrid.innerHTML = products.map(product => `
//             <div class="product-display-card">
//                 <input type="checkbox" class="product-checkbox" data-id="${product.id}">
//                 <div class="product-display-image">
//                     ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<i class="fas fa-image"></i>'}
//                 </div>
//                 <div class="product-display-info">
//                     <h4>${product.name}</h4>
//                     <div class="product-display-meta">
//                         <span class="product-display-price">${product.price.toFixed(2)}</span>
//                         <span class="product-display-stock">${product.stock} in stock</span>
//                     </div>
//                     <div class="product-display-footer">
//                         <button class="btn btn-sm btn-outline" onclick="editProduct(${product.id})">
//                             <i class="fas fa-edit"></i> Edit
//                         </button>
//                         <button class="btn btn-sm btn-outline" onclick="deleteProduct(${product.id})">
//                             <i class="fas fa-trash"></i>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `).join('');
//     }
    
//     // Table View
//     if (productsTableBody) {
//         productsTableBody.innerHTML = products.map(product => `
//             <tr>
//                 <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
//                 <td>
//                     <div style="display: flex; align-items: center; gap: 10px;">
//                         <img src="${product.image || 'https://via.placeholder.com/50'}" 
//                              style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;" 
//                              alt="${product.name}">
//                         <strong>${product.name}</strong>
//                     </div>
//                 </td>
//                 <td>${product.sku}</td>
//                 <td><span class="status-badge active">${product.category}</span></td>
//                 <td><strong>${product.price.toFixed(2)}</strong></td>
//                 <td>${product.stock}</td>
//                 <td><span class="status-badge ${product.status}">${product.status}</span></td>
//                 <td>
//                     <div class="action-btns">
//                         <button class="action-btn view" onclick="viewProduct(${product.id})" title="View">
//                             <i class="fas fa-eye"></i>
//                         </button>
//                         <button class="action-btn edit" onclick="editProduct(${product.id})" title="Edit">
//                             <i class="fas fa-edit"></i>
//                         </button>
//                         <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Delete">
//                             <i class="fas fa-trash"></i>
//                         </button>
//                     </div>
//                 </td>
//             </tr>
//         `).join('');
//     }
// }

// function showAddProductModal() {
//     const modal = document.getElementById('productModal');
//     const title = document.getElementById('modalTitle');
//     const form = document.getElementById('productForm');
    
//     if (!modal || !form) return;
    
//     title.textContent = 'Add New Product';
//     form.reset();
//     document.getElementById('imagePreviewList').innerHTML = '';
//     modal.classList.add('active');
// }

// function closeProductModal() {
//     const modal = document.getElementById('productModal');
//     if (modal) {
//         modal.classList.remove('active');
//     }
// }

// function handleProductImages(event) {
//     const files = event.target.files;
//     const previewList = document.getElementById('imagePreviewList');
    
//     if (!previewList) return;
    
//     Array.from(files).forEach((file) => {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             const div = document.createElement('div');
//             div.className = 'image-preview-item-new';
//             div.innerHTML = `
//                 <img src="${e.target.result}" alt="Product image">
//                 <button class="remove-preview" onclick="this.parentElement.remove()">
//                     <i class="fas fa-times"></i>
//                 </button>
//             `;
//             previewList.appendChild(div);
//         };
//         reader.readAsDataURL(file);
//     });
// }

// function handleProductSubmit(event) {
//     event.preventDefault();
    
//     const formData = {
//         id: products.length + 1,
//         name: document.getElementById('productName').value,
//         description: document.getElementById('productDescription').value,
//         category: document.getElementById('productCategory').value,
//         brand: document.getElementById('productBrand').value,
//         price: parseFloat(document.getElementById('productPrice').value),
//         salePrice: parseFloat(document.getElementById('productSalePrice').value) || null,
//         sku: document.getElementById('productSKU').value,
//         stock: parseInt(document.getElementById('productStock').value),
//         status: document.getElementById('productStatus').value,
//         image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
//         sold: 0
//     };
    
//     products.push(formData);
//     localStorage.setItem('adminProducts', JSON.stringify(products));
    
//     closeProductModal();
//     loadProducts();
//     showNotification('Product added successfully!', 'success');
// }

// function editProduct(id) {
//     const product = products.find(p => p.id === id);
//     if (!product) return;
    
//     const modal = document.getElementById('productModal');
//     const title = document.getElementById('modalTitle');
    
//     if (!modal) return;
    
//     title.textContent = 'Edit Product';
    
//     document.getElementById('productName').value = product.name;
//     document.getElementById('productDescription').value = product.description || '';
//     document.getElementById('productCategory').value = product.category;
//     document.getElementById('productBrand').value = product.brand || '';
//     document.getElementById('productPrice').value = product.price;
//     document.getElementById('productSalePrice').value = product.salePrice || '';
//     document.getElementById('productSKU').value = product.sku;
//     document.getElementById('productStock').value = product.stock;
//     document.getElementById('productStatus').value = product.status;
    
//     modal.classList.add('active');
// }

// function deleteProduct(id) {
//     if (confirm('Are you sure you want to delete this product?')) {
//         products = products.filter(p => p.id !== id);
//         localStorage.setItem('adminProducts', JSON.stringify(products));
//         loadProducts();
//         showNotification('Product deleted successfully', 'success');
//     }
// }

// function viewProduct(id) {
//     const product = products.find(p => p.id === id);
//     if (product) {
//         showNotification(`Viewing: ${product.name}`, 'info');
//     }
// }

// function searchProducts() {
//     const searchTerm = document.getElementById('productSearch').value.toLowerCase();
//     const filteredProducts = products.filter(product => 
//         product.name.toLowerCase().includes(searchTerm) ||
//         product.sku.toLowerCase().includes(searchTerm) ||
//         product.category.toLowerCase().includes(searchTerm)
//     );
    
//     displayFilteredProducts(filteredProducts);
// }

// function filterProducts(filter) {
//     let filtered = [...products];
    
//     if (filter !== 'all') {
//         filtered = products.filter(p => p.status === filter);
//     }
    
//     displayFilteredProducts(filtered);
// }

// function filterByCategory(category) {
//     if (!category) {
//         loadProducts();
//         return;
//     }
    
//     const filtered = products.filter(p => p.category === category);
//     displayFilteredProducts(filtered);
// }

// function displayFilteredProducts(filteredProducts) {
//     const productsGrid = document.getElementById('productsGrid');
//     const productsTableBody = document.getElementById('productsTableBody');
    
//     if (productsGrid && currentView === 'grid') {
//         productsGrid.innerHTML = filteredProducts.map(product => `
//             <div class="product-display-card">
//                 <input type="checkbox" class="product-checkbox" data-id="${product.id}">
//                 <div class="product-display-image">
//                     ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<i class="fas fa-image"></i>'}
//                 </div>
//                 <div class="product-display-info">
//                     <h4>${product.name}</h4>
//                     <div class="product-display-meta">
//                         <span class="product-display-price">${product.price.toFixed(2)}</span>
//                         <span class="product-display-stock">${product.stock} in stock</span>
//                     </div>
//                     <div class="product-display-footer">
//                         <button class="btn btn-sm btn-outline" onclick="editProduct(${product.id})">
//                             <i class="fas fa-edit"></i> Edit
//                         </button>
//                         <button class="btn btn-sm btn-outline" onclick="deleteProduct(${product.id})">
//                             <i class="fas fa-trash"></i>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         `).join('');
//     }
// }

// function switchView(view) {
//     currentView = view;
//     const gridView = document.getElementById('productsGrid');
//     const tableView = document.getElementById('productsTable');
//     const buttons = document.querySelectorAll('.view-btn');
    
//     buttons.forEach(btn => {
//         btn.classList.remove('active');
//         if (btn.dataset.view === view) {
//             btn.classList.add('active');
//         }
//     });
    
//     if (view === 'grid') {
//         if (gridView) gridView.style.display = 'grid';
//         if (tableView) tableView.style.display = 'none';
//     } else {
//         if (gridView) gridView.style.display = 'none';
//         if (tableView) tableView.style.display = 'block';
//     }
// }

// function selectAllProducts(checkbox) {
//     const checkboxes = document.querySelectorAll('.product-checkbox');
//     checkboxes.forEach(cb => cb.checked = checkbox.checked);
// }

// function bulkDelete() {
//     const selected = Array.from(document.querySelectorAll('.product-checkbox:checked'));
//     if (selected.length === 0) {
//         showNotification('Please select products first', 'warning');
//         return;
//     }
    
//     if (confirm(`Delete ${selected.length} selected products?`)) {
//         const selectedIds = selected.map(cb => parseInt(cb.dataset.id));
//         products = products.filter(p => !selectedIds.includes(p.id));
//         localStorage.setItem('adminProducts', JSON.stringify(products));
//         loadProducts();
//         showNotification(`${selected.length} products deleted`, 'success');
//     }
// }

// ===== PRODUCTS MANAGEMENT WITH SPECIFICATIONS =====

let productSpecifications = {}; // Store specs for each product

// Enhanced product loading with new buttons
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const productsTableBody = document.getElementById('productsTableBody');
    
    if (!productsGrid && !productsTableBody) return;
    
    // If no products, use sample data
    if (products.length === 0) {
        products = sampleProducts.map((p, index) => ({
            ...p,
            sku: `SKU-${1000 + index}`,
            category: p.category || 'Electronics',
            status: 'active'
        }));
    }
    
    // Grid View with new buttons
    if (productsGrid) {
        productsGrid.innerHTML = products.map(product => `
            <div class="product-display-card">
                <input type="checkbox" class="product-checkbox" data-id="${product.id}">
                <div class="product-display-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<i class="fas fa-image"></i>'}
                </div>
                <div class="product-display-info">
                    <h4>${product.name}</h4>
                    <div class="product-display-meta">
                        <span class="product-display-price">$${product.price.toFixed(2)}</span>
                        <span class="product-display-stock">${product.stock} in stock</span>
                    </div>
                    <div class="product-actions-grid">
                        <button class="product-action-btn btn-update" onclick="updateProduct(${product.id})">
                            <i class="fas fa-edit"></i> Update
                        </button>
                        <button class="product-action-btn btn-delete" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        <button class="product-action-btn btn-spec" onclick="showSpecificationModal(${product.id})">
                            <i class="fas fa-list-ul"></i> Add Specification
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Table View remains the same
    if (productsTableBody) {
        productsTableBody.innerHTML = products.map(product => `
            <tr>
                <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${product.image || 'https://via.placeholder.com/50'}" 
                             style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;" 
                             alt="${product.name}">
                        <strong>${product.name}</strong>
                    </div>
                </td>
                <td>${product.sku}</td>
                <td><span class="status-badge active">${product.category}</span></td>
                <td><strong>$${product.price.toFixed(2)}</strong></td>
                <td>${product.stock}</td>
                <td><span class="status-badge ${product.status}">${product.status}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" onclick="viewProduct(${product.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="updateProduct(${product.id})" title="Update">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// ===== UPDATE PRODUCT FUNCTION =====
function updateProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    
    if (!modal) return;
    
    title.textContent = 'Update Product';
    
    // Fill form with existing data
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productBrand').value = product.brand || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productSalePrice').value = product.salePrice || '';
    document.getElementById('productSKU').value = product.sku;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productStatus').value = product.status;
    
    // Store the product ID for update
    modal.dataset.editingId = id;
    
    modal.classList.add('active');
}

// ===== ENHANCED PRODUCT FORM SUBMIT =====
function handleProductSubmit(event) {
    event.preventDefault();
    
    const modal = document.getElementById('productModal');
    const editingId = modal.dataset.editingId;
    
    const formData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand').value,
        price: parseFloat(document.getElementById('productPrice').value),
        salePrice: parseFloat(document.getElementById('productSalePrice').value) || null,
        sku: document.getElementById('productSKU').value,
        stock: parseInt(document.getElementById('productStock').value),
        status: document.getElementById('productStatus').value,
    };
    
    if (editingId) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(editingId));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...formData
            };
            showNotification('Product updated successfully!', 'success');
        }
        delete modal.dataset.editingId;
    } else {
        // Add new product
        formData.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        formData.image = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300';
        formData.sold = 0;
        products.push(formData);
        showNotification('Product added successfully!', 'success');
    }
    
    localStorage.setItem('adminProducts', JSON.stringify(products));
    closeProductModal();
    loadProducts();
}

// ===== SPECIFICATION MODAL =====
function showSpecificationModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Create specification modal if it doesn't exist
    let modal = document.getElementById('specificationModal');
    if (!modal) {
        modal = createSpecificationModal();
    }
    
    const title = document.getElementById('specModalTitle');
    const productInfo = document.getElementById('specProductInfo');
    const specList = document.getElementById('specificationList');
    
    title.textContent = `Specifications - ${product.name}`;
    productInfo.textContent = `SKU: ${product.sku} | Category: ${product.category}`;
    
    // Load existing specifications
    const specs = productSpecifications[productId] || [];
    displaySpecifications(specs);
    
    modal.dataset.productId = productId;
    modal.classList.add('active');
}

function createSpecificationModal() {
    const modalHTML = `
        <div class="modal" id="specificationModal">
            <div class="modal-content large">
                <div class="modal-header">
                    <div>
                        <h2 id="specModalTitle">Product Specifications</h2>
                        <p id="specProductInfo" style="font-size: 14px; color: var(--gray-500); margin-top: 5px;"></p>
                    </div>
                    <button class="modal-close" onclick="closeSpecificationModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-section">
                        <h3>Add Specification</h3>
                        <div class="spec-form-group">
                            <input type="text" id="specLabel" class="form-control" placeholder="Label (e.g., Color, Size)" required>
                            <input type="text" id="specValue" class="form-control" placeholder="Value (e.g., Black, Large)" required>
                            <button class="btn btn-primary" onclick="addSpecification()">
                                <i class="fas fa-plus"></i> Add
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-section" style="margin-top: 20px;">
                        <h3>Current Specifications</h3>
                        <div class="spec-list" id="specificationList">
                            <p style="text-align: center; color: var(--gray-500); padding: 20px;">No specifications added yet</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeSpecificationModal()">Close</button>
                    <button type="button" class="btn btn-primary" onclick="saveSpecifications()">
                        <i class="fas fa-save"></i> Save All Specifications
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.getElementById('specificationModal');
}

function addSpecification() {
    const labelInput = document.getElementById('specLabel');
    const valueInput = document.getElementById('specValue');
    
    const label = labelInput.value.trim();
    const value = valueInput.value.trim();
    
    if (!label || !value) {
        showNotification('Please fill in both label and value', 'warning');
        return;
    }
    
    const modal = document.getElementById('specificationModal');
    const productId = parseInt(modal.dataset.productId);
    
    if (!productSpecifications[productId]) {
        productSpecifications[productId] = [];
    }
    
    productSpecifications[productId].push({ label, value });
    displaySpecifications(productSpecifications[productId]);
    
    // Clear inputs
    labelInput.value = '';
    valueInput.value = '';
    labelInput.focus();
    
    showNotification('Specification added', 'success');
}

function displaySpecifications(specs) {
    const specList = document.getElementById('specificationList');
    
    if (specs.length === 0) {
        specList.innerHTML = '<p style="text-align: center; color: var(--gray-500); padding: 20px;">No specifications added yet</p>';
        return;
    }
    
    specList.innerHTML = specs.map((spec, index) => `
        <div class="spec-item">
            <div class="spec-item-content">
                <div class="spec-item-label">${spec.label}</div>
                <div class="spec-item-value">${spec.value}</div>
            </div>
            <div class="spec-item-actions">
                <button class="spec-remove-btn" onclick="removeSpecification(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function removeSpecification(index) {
    const modal = document.getElementById('specificationModal');
    const productId = parseInt(modal.dataset.productId);
    
    if (productSpecifications[productId]) {
        productSpecifications[productId].splice(index, 1);
        displaySpecifications(productSpecifications[productId]);
        showNotification('Specification removed', 'info');
    }
}

function saveSpecifications() {
    const modal = document.getElementById('specificationModal');
    const productId = parseInt(modal.dataset.productId);
    
    // Save to localStorage
    localStorage.setItem('productSpecifications', JSON.stringify(productSpecifications));
    
    showNotification('Specifications saved successfully!', 'success');
    closeSpecificationModal();
}

function closeSpecificationModal() {
    const modal = document.getElementById('specificationModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ===== ENHANCED IMAGE UPLOAD =====
function handleProductImages(event) {
    const files = event.target.files;
    const previewList = document.getElementById('imagePreviewList');
    
    if (!previewList) return;
    
    if (files.length > 10) {
        showNotification('Maximum 10 images allowed', 'warning');
        return;
    }
    
    Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) {
            showNotification(`${file.name} is not an image file`, 'warning');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            showNotification(`${file.name} is larger than 10MB`, 'warning');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'image-preview-item-new';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Product image">
                <button class="remove-preview" onclick="this.parentElement.remove()" type="button">
                    <i class="fas fa-times"></i>
                </button>
            `;
            previewList.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

// ===== ENHANCED ADD PRODUCT MODAL =====
function showAddProductModal() {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
    
    if (!modal || !form) return;
    
    title.textContent = 'Add New Product';
    form.reset();
    document.getElementById('imagePreviewList').innerHTML = '';
    delete modal.dataset.editingId;
    modal.classList.add('active');
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        delete modal.dataset.editingId;
        modal.classList.remove('active');
    }
}

// ===== DELETE PRODUCT WITH CONFIRMATION =====
function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (confirm(`Are you sure you want to delete "${product.name}"?\nThis action cannot be undone.`)) {
        products = products.filter(p => p.id !== id);
        
        // Also remove specifications
        if (productSpecifications[id]) {
            delete productSpecifications[id];
            localStorage.setItem('productSpecifications', JSON.stringify(productSpecifications));
        }
        
        localStorage.setItem('adminProducts', JSON.stringify(products));
        loadProducts();
        showNotification('Product deleted successfully', 'success');
    }
}

// ===== LOAD SPECIFICATIONS ON INIT =====
document.addEventListener('DOMContentLoaded', function() {
    // Load saved specifications
    const savedSpecs = localStorage.getItem('productSpecifications');
    if (savedSpecs) {
        productSpecifications = JSON.parse(savedSpecs);
    }
});

// ===== VIEW PRODUCT WITH SPECIFICATIONS =====
function viewProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const specs = productSpecifications[id] || [];
    const specsHTML = specs.length > 0 
        ? specs.map(s => `<p><strong>${s.label}:</strong> ${s.value}</p>`).join('')
        : '<p style="color: var(--gray-500);">No specifications available</p>';
    
    showNotification(`Viewing: ${product.name} (${specs.length} specifications)`, 'info');
}

// ===== ORDERS MANAGEMENT =====
function loadOrders() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (!ordersTableBody) return;
    
    const extendedOrders = [
        ...sampleOrders,
        { id: 'ORD-1006', customer: 'Emily Davis', date: '2025-01-12', total: 345.67, status: 'shipped', payment: 'Credit Card', items: 3 },
        { id: 'ORD-1007', customer: 'David Lee', date: '2025-01-12', total: 567.89, status: 'paid', payment: 'PayPal', items: 5 },
        { id: 'ORD-1008', customer: 'Lisa Wang', date: '2025-01-11', total: 123.45, status: 'pending', payment: 'Credit Card', items: 2 },
    ];
    
    ordersTableBody.innerHTML = extendedOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.items || Math.floor(Math.random() * 5) + 1}</td>
            <td><strong>${order.total.toFixed(2)}</strong></td>
            <td>${order.payment || 'Credit Card'}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewOrderDetail('${order.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="updateOrderStatus('${order.id}')" title="Update">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchOrders() {
    showNotification('Searching orders...', 'info');
}

function filterOrders(status) {
    showNotification(`Filtering by: ${status}`, 'info');
}

function viewOrderDetail(orderId) {
    const modal = document.getElementById('orderDetailModal');
    const content = document.getElementById('orderDetailContent');
    const title = document.getElementById('orderModalTitle');
    
    if (!modal || !content) return;
    
    title.textContent = `Order ${orderId}`;
    
    content.innerHTML = `
        <div class="order-detail-grid">
            <div>
                <div class="order-section">
                    <h3>Order Items</h3>
                    <div class="order-items-list">
                        <div class="order-item">
                            <div class="order-item-image"></div>
                            <div class="order-item-details">
                                <h4>Wireless Headphones</h4>
                                <p>Quantity: 1</p>
                            </div>
                            <div class="order-item-price">
                                <span class="price">$79.99</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="order-section" style="margin-top: 20px;">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> John Doe</p>
                    <p><strong>Email:</strong> john@email.com</p>
                    <p><strong>Phone:</strong> +1 234-567-8900</p>
                    <p><strong>Address:</strong> 123 Main St, City, Country</p>
                </div>
            </div>
            
            <div>
                <div class="order-section">
                    <h3>Order Summary</h3>
                    <p><strong>Subtotal:</strong> $79.99</p>
                    <p><strong>Shipping:</strong> $10.00</p>
                    <p><strong>Tax:</strong> $9.00</p>
                    <p><strong>Total:</strong> $98.99</p>
                </div>
                
                <div class="order-section" style="margin-top: 20px;">
                    <h3>Order Timeline</h3>
                    <div class="order-timeline">
                        <div class="timeline-item">
                            <div class="timeline-icon"></div>
                            <div class="timeline-content">
                                <h4>Order Placed</h4>
                                <p>Jan 15, 2025 - 10:30 AM</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-icon"></div>
                            <div class="timeline-content">
                                <h4>Payment Confirmed</h4>
                                <p>Jan 15, 2025 - 10:32 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function updateOrderStatus(orderId) {
    showNotification(`Update status for ${orderId}`, 'info');
}

// ===== CATEGORIES MANAGEMENT =====
function loadCategories() {
    const categoriesList = document.getElementById('categoriesList');
    const categoryStatsList = document.getElementById('categoryStatsList');
    
    if (!categoriesList) return;
    
    const sampleCategories = [
        { id: 1, name: 'Electronics', icon: 'fa-laptop', products: 89, visible: true },
        { id: 2, name: 'Fashion', icon: 'fa-tshirt', products: 156, visible: true },
        { id: 3, name: 'Home & Furniture', icon: 'fa-couch', products: 67, visible: true },
        { id: 4, name: 'Beauty', icon: 'fa-spa', products: 45, visible: true },
        { id: 5, name: 'Sports', icon: 'fa-football-ball', products: 34, visible: true },
    ];
    
    categoriesList.innerHTML = sampleCategories.map(cat => `
        <div class="category-item">
            <div class="category-item-left">
                <div class="category-icon-display">
                    <i class="fas ${cat.icon}"></i>
                </div>
                <div class="category-item-info">
                    <h4>${cat.name}</h4>
                    <p>${cat.products} products</p>
                </div>
            </div>
            <div class="category-item-actions">
                <button class="action-btn edit" onclick="editCategory(${cat.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteCategory(${cat.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    if (categoryStatsList) {
        categoryStatsList.innerHTML = sampleCategories.map(cat => `
            <div class="stat-item">
                <span class="stat-item-name">${cat.name}</span>
                <span class="stat-item-value">${cat.products}</span>
            </div>
        `).join('');
    }
}

function showAddCategoryModal() {
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('categoryModalTitle');
    const form = document.getElementById('categoryForm');
    
    if (!modal || !form) return;
    
    title.textContent = 'Add New Category';
    form.reset();
    modal.classList.add('active');
}

function closeCategoryModal() {
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleCategorySubmit(event) {
    event.preventDefault();
    
    const categoryName = document.getElementById('categoryName').value;
    
    closeCategoryModal();
    showNotification(`Category "${categoryName}" added successfully!`, 'success');
    loadCategories();
}

function editCategory(id) {
    showNotification(`Edit category ${id}`, 'info');
}

function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        showNotification('Category deleted successfully', 'success');
        loadCategories();
    }
}

function searchCategories() {
    showNotification('Searching categories...', 'info');
}