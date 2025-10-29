// Configuração da API
const API_BASE_URL = 'http://localhost:8090/api';

// Variáveis globais
let currentProductId = null;
let currentSlide = 1;
let totalSlides = 3;

// Função para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao conectar com a API. Verifique se o servidor está rodando.');
        throw error;
    }
}

// Função para carregar produtos na página inicial
async function loadProducts() {
    try {
        const products = await apiRequest('/products');
        
        // Pegar apenas os últimos 12 produtos
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
            productsGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Função para criar um card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => goToProductDetail(product.ID);

    card.innerHTML = `
        <div class="product-image">
            🏔️
        </div>
        <div class="product-info">
            <div class="product-title">${product.Name || 'Nome não informado'}</div>
            <div class="product-price">R$ ${parseFloat(product.Price || 0).toFixed(2)}</div>
            <div class="product-description">${product.Description || 'Sem descrição'}</div>
        </div>
    `;

    return card;
}

// Função para navegar para a página de detalhes
function goToProductDetail(productId) {
    window.location.href = `detail.html?id=${productId}`;
}

// Função para carregar detalhes do produto
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

// Função para exibir detalhes do produto
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
                <div class="detail-value">${product.Name || 'Não informado'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Preço:</div>
                <div class="detail-value">R$ ${parseFloat(product.Price || 0).toFixed(2)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Quantidade:</div>
                <div class="detail-value">${product.Quantity || 'Não informado'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Descrição:</div>
                <div class="detail-value">${product.Description || 'Não informado'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Avaliação:</div>
                <div class="detail-value">${product.Rating || 'Não informado'}/5</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Categoria:</div>
                <div class="detail-value">${product.Category || 'Não informado'}</div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="openEditModal()">Editar Produto</button>
                <button class="btn btn-danger" onclick="openDeleteModal()">Excluir Produto</button>
            </div>
        </div>
    `;
}

// Funções do carousel
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

// Funções dos modais - Adicionar Produto
function openAddModal() {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('addProductForm').reset();
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

// Funções dos modais - Editar Produto
function openEditModal() {
    if (!currentProductId) return;
    
    // Carregar dados do produto atual
    loadProductForEdit();
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

async function loadProductForEdit() {
    try {
        const product = await apiRequest(`/products/${currentProductId}`);
        
        document.getElementById('editName').value = product.Name || '';
        document.getElementById('editPrice').value = product.Price || '';
        document.getElementById('editQuantity').value = product.Quantity || '';
        document.getElementById('editDescription').value = product.Description || '';
        document.getElementById('editRating').value = product.Rating || '';
        document.getElementById('editCategory').value = product.Category || '';
    } catch (error) {
        console.error('Erro ao carregar produto para edição:', error);
        alert('Erro ao carregar dados do produto.');
    }
}

// Funções dos modais - Excluir Produto
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

// Event listeners para formulários
document.addEventListener('DOMContentLoaded', function() {
    // Formulário de adicionar produto
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
                loadProducts(); // Recarregar lista de produtos
            } catch (error) {
                console.error('Erro ao adicionar produto:', error);
                alert('Erro ao adicionar produto.');
            }
        });
    }
    
    // Formulário de editar produto
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
                loadProductDetail(); // Recarregar detalhes do produto
            } catch (error) {
                console.error('Erro ao atualizar produto:', error);
                alert('Erro ao atualizar produto.');
            }
        });
    }
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Carregar conteúdo baseado na página atual
    if (window.location.pathname.includes('detail.html')) {
        loadProductDetail();
    } else {
        loadProducts();
    }
});

// Função para mostrar loading
function showLoading(element) {
    element.innerHTML = '<div class="loading">Carregando...</div>';
}

// Função para mostrar erro
function showError(element, message) {
    element.innerHTML = `<div class="error">${message}</div>`;
}
