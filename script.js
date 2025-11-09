const API_BASE_URL = 'http://localhost:8090/api';

let currentProductId = null;
let currentSlide = 1;
let totalSlides = 3;

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const contentType = response.headers.get('content-type');
        const text = await response.text();
        
        if (response.status === 404) {
            return null;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
        }
        
        if (!text || text.trim() === '') {
            return null;
        }
        
        if (contentType && contentType.includes('application/json')) {
            try {
                return JSON.parse(text);
            } catch (parseError) {
                console.error('Failed to parse JSON response:', text);
                throw new Error('Invalid JSON response from server');
            }
        }
        
        return text;
    } catch (error) {
        if (!error.message.includes('404')) {
            console.error('Erro na requisição:', error);
            alert('Erro ao conectar com a API. Verifique se o servidor está rodando.');
        }
        throw error;
    }
}

async function loadProducts() {
    try {
        const products = await apiRequest('/products');
        
        if (products && products.length > 0) {
            console.log('Sample product structure:', products[0]);
            console.log('Product ID field:', products[0].ID, products[0].id, products[0].Id);
        }
        
        const lastProducts = products.slice(-12).reverse();
        
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        productsGrid.innerHTML = '';

        if (lastProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">Nenhum produto encontrado.</p>';
            return;
        }

        lastProducts.forEach(product => {
            const productCard = createProductCard(product);
            if (productCard) {
                productsGrid.appendChild(productCard);
            } else {
                console.warn('Skipping product with undefined ID:', product);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function getProductId(product) {
    return product.ID || product.id || product.Id || null;
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const productId = getProductId(product);
    
    if (!productId) {
        console.error('Product ID is undefined. Product object:', product);
        return null;
    }
    
    card.onclick = () => goToProductDetail(productId);

    card.innerHTML = `
        <div class="product-image">
            🏔️
        </div>
        <div class="product-info">
            <div class="product-title">${product.Name || product.name || 'Nome não informado'}</div>
            <div class="product-price">R$ ${parseFloat(product.Price || product.price || 0).toFixed(2)}</div>
            <div class="product-description">${product.Description || product.description || 'Sem descrição'}</div>
        </div>
    `;

    return card;
}

function goToProductDetail(productId) {
    window.location.href = `detail.html?id=${productId}`;
}

async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        document.getElementById('productDetail').innerHTML = '<p>Produto não encontrado.</p>';
        return;
    }

    try {
        const product = await apiRequest(`/products/${productId}`);
        
        if (!product) {
            document.getElementById('productDetail').innerHTML = '<p>Produto não encontrado.</p>';
            return;
        }

        currentProductId = productId;
        displayProductDetail(product);
    } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        document.getElementById('productDetail').innerHTML = '<p>Erro ao carregar produto.</p>';
    }
}

function displayProductDetail(product) {
    const productDetail = document.getElementById('productDetail');
    
    productDetail.innerHTML = `
        <div class="product-detail-image">
            🏔️
        </div>
        <div class="product-detail-info">
            <h2>Descrição</h2>
            <div class="detail-item">
                <div class="detail-label">Nome:</div>
                <div class="detail-value">${product.Name || product.name || 'Não informado'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Preço:</div>
                <div class="detail-value">R$ ${parseFloat(product.Price || product.price || 0).toFixed(2)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Quantidade:</div>
                <div class="detail-value">${product.Quantity || product.quantity || 'Não informado'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Descrição:</div>
                <div class="detail-value">${product.Description || product.description || 'Não informado'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Avaliação:</div>
                <div class="detail-value">${product.Rating || product.rating || 'Não informado'}/5</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Categoria:</div>
                <div class="detail-value">${product.Category || product.category || 'Não informado'}</div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="openEditModal()">Editar Produto</button>
                <button class="btn btn-danger" onclick="openDeleteModal()">Excluir Produto</button>
            </div>
        </div>
    `;
}

function changeSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide > totalSlides) {
        currentSlide = 1;
    } else if (currentSlide < 1) {
        currentSlide = totalSlides;
    }
    
    updateCarousel();
}

function goToSlide(slideNumber) {
    currentSlide = slideNumber;
    updateCarousel();
}

function updateCarousel() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === currentSlide);
    });
}

function openAddModal() {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('addProductForm').reset();
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

function openEditModal() {
    if (!currentProductId) return;
    
    loadProductForEdit();
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

async function loadProductForEdit() {
    try {
        const product = await apiRequest(`/products/${currentProductId}`);
        
        document.getElementById('editName').value = product.Name || product.name || '';
        document.getElementById('editPrice').value = product.Price || product.price || '';
        document.getElementById('editQuantity').value = product.Quantity || product.quantity || '';
        document.getElementById('editDescription').value = product.Description || product.description || '';
        document.getElementById('editRating').value = product.Rating || product.rating || '';
        document.getElementById('editCategory').value = product.Category || product.category || '';
    } catch (error) {
        console.error('Erro ao carregar produto para edição:', error);
        alert('Erro ao carregar dados do produto.');
    }
}

function openDeleteModal() {
    document.getElementById('deleteModal').style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

async function confirmDelete() {
    if (!currentProductId) return;
    
    try {
        await apiRequest(`/products/${currentProductId}`, {
            method: 'DELETE'
        });
        
        alert('Produto excluído com sucesso!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
        addForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const productData = {
                name: formData.get('name'),
                price: formData.get('price'),
                quantity: formData.get('quantity'),
                description: formData.get('description'),
                rating: formData.get('rating'),
                category: formData.get('category')
            };
            
            try {
                await apiRequest('/products', {
                    method: 'POST',
                    body: JSON.stringify(productData)
                });
                
                alert('Produto adicionado com sucesso!');
                closeAddModal();
                loadProducts();
            } catch (error) {
                console.error('Erro ao adicionar produto:', error);
                alert('Erro ao adicionar produto.');
            }
        });
    }
    
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const productData = {
                name: formData.get('name'),
                price: formData.get('price'),
                quantity: formData.get('quantity'),
                description: formData.get('description'),
                rating: formData.get('rating'),
                category: formData.get('category')
            };
            
            try {
                await apiRequest(`/products/${currentProductId}`, {
                    method: 'PATCH',
                    body: JSON.stringify(productData)
                });
                
                alert('Produto atualizado com sucesso!');
                closeEditModal();
                loadProductDetail();
            } catch (error) {
                console.error('Erro ao atualizar produto:', error);
                alert('Erro ao atualizar produto.');
            }
        });
    }
    
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    if (window.location.pathname.includes('detail.html')) {
        loadProductDetail();
    } else {
        loadProducts();
    }
});

function showLoading(element) {
    element.innerHTML = '<div class="loading">Carregando...</div>';
}

function showError(element, message) {
    element.innerHTML = `<div class="error">${message}</div>`;
}
