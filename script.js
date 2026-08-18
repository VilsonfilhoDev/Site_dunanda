/* =========================================
   1. ESTADO E CONFIGURAÇÕES GERAIS
========================================= */
// Carrega o carrinho salvo no navegador ou inicia um array vazio
let carrinho = JSON.parse(localStorage.getItem('dunanda_carrinho')) || [];

// Número oficial da DU NANDA STORE (Bariri)
const TELEFONE_WHATSAPP = '5514997062561';

/* =========================================
   2. ELEMENTOS DA INTERFACE (DOM)
========================================= */
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.querySelector('.checkout-btn');

/* =========================================
   3. FUNÇÕES AUXILIARES
========================================= */
// Formata números para o padrão BRL garantindo centavos (ex: 2800 -> R$ 2.800,00)
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
}

// Salva o estado atual do carrinho no LocalStorage
function salvarCarrinho() {
    localStorage.setItem('dunanda_carrinho', JSON.stringify(carrinho));
}

/* =========================================
   4. GERENCIAMENTO DO CARRINHO
========================================= */
// Adiciona itens ao carrinho capturando o tamanho selecionado no card
function adicionarAoCarrinhoComTamanho(button, id, nome, preco, imagemUrl) {
    const card = button.closest('.product-card');
    const sizeSelect = card ? card.querySelector('.size-select') : null;
    const tamanho = sizeSelect ? sizeSelect.value : 'Único';

    carrinho.push({ id, nome, preco: Number(preco), imagemUrl, tamanho });

    salvarCarrinho();
    atualizarCarrinho();
    abrirModal();
}

// Atualiza o HTML do carrinho e calcula o valor total
function atualizarCarrinho() {
    if (!cartCount || !cartItemsContainer || !cartTotalPrice) return;

    cartCount.innerText = carrinho.length;
    cartItemsContainer.innerHTML = '';

    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Sua sacola está vazia.</p>';
        cartTotalPrice.innerText = formatarMoeda(0);
        return;
    }

    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.imagemUrl}" alt="${item.nome}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.nome}</h4>
                <div class="cart-item-meta">
                    <span class="item-ref">Ref: ${item.id}</span> | 
                    <span class="item-size-badge">Tam: ${item.tamanho}</span>
                </div>
                <p>${formatarMoeda(item.preco)}</p>
            </div>
            <button onclick="removerDoCarrinho(${index})" class="cart-remove-btn" title="Remover item">&times;</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalPrice.innerText = formatarMoeda(total);
}

// Remover item específico do carrinho pelo índice
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
}

/* =========================================
   5. INTEGRAÇÃO WHATSAPP
========================================= */
function finalizarPedidoWhatsApp() {
    if (carrinho.length === 0) {
        alert("Sua sacola está vazia!");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer o pedido das seguintes peças na *DU NANDA STORE*:\n\n";

    let total = 0;
    carrinho.forEach((item) => {
        mensagem += `• *[${item.id}]* ${item.nome} — *Tamanho: ${item.tamanho}* — ${formatarMoeda(item.preco)}\n`;
        total += item.preco;
    });

    mensagem += `\n*Total:* ${formatarMoeda(total)}`;
    mensagem += "\n\nPodemos confirmar a disponibilidade das peças e combinar o pagamento e entrega?";

    const mensagemFormatada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${TELEFONE_WHATSAPP}?text=${mensagemFormatada}`;

    window.open(urlWhatsApp, '_blank');
}

/* =========================================
   6. FILTRO DE CATEGORIAS
========================================= */
function filtrarProdutos(categoria, buttonElement) {
    // Alterna a classe ativa nos botões
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (buttonElement) buttonElement.classList.add('active');

    // Filtra os cards na vitrine baseando-se no atributo data-category
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const productCategory = card.getAttribute('data-category');
        if (categoria === 'todos' || productCategory === categoria) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

/* =========================================
   7. CONTROLE DO MODAL E EVENTOS
========================================= */
function abrirModal() {
    if (cartModal) cartModal.classList.add('active');
}

function fecharModal() {
    if (cartModal) cartModal.classList.remove('active');
}

// Registra os ouvintes de eventos da interface
if (cartBtn) cartBtn.addEventListener('click', abrirModal);
if (closeCartBtn) closeCartBtn.addEventListener('click', fecharModal);
if (checkoutBtn) checkoutBtn.addEventListener('click', finalizarPedidoWhatsApp);

if (cartModal) {
    cartModal.addEventListener('click', (event) => {
        if (event.target === cartModal) fecharModal();
    });
}

// Inicializa a renderização do carrinho assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho();
});