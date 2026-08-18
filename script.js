// Array para armazenar os itens selecionados
let carrinho = [];

// Número oficial da DU NANDA STORE (Bariri)
const TELEFONE_WHATSAPP = '5514997062561';

// Elementos da interface
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.querySelector('.checkout-btn');

// Função para adicionar itens à sacola capturando o tamanho selecionado no card
function adicionarAoCarrinhoComTamanho(button, id, nome, preco, imagemUrl) {
    // Encontra o card pai do botão
    const card = button.closest('.product-card');
    const sizeSelect = card.querySelector('.size-select');
    const tamanho = sizeSelect ? sizeSelect.value : 'Único';

    carrinho.push({ id, nome, preco, imagemUrl, tamanho });
    atualizarCarrinho();
    abrirModal();
}

// Atualizar o visual do carrinho
function atualizarCarrinho() {
    cartCount.innerText = carrinho.length;
    cartItemsContainer.innerHTML = '';

    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Sua sacola está vazia.</p>';
        cartTotalPrice.innerText = 'R$ 0';
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
          <span class="item-ref">Ref: ${item.id}</span>
          <span class="item-size-badge">Tam: ${item.tamanho}</span>
        </div>
        <p>R$ ${item.preco.toLocaleString('pt-BR')}</p>
      </div>
      <button onclick="removerDoCarrinho(${index})" class="cart-remove-btn">&times;</button>
    `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalPrice.innerText = `R$ ${total.toLocaleString('pt-BR')}`;
}

// Remover item específico do carrinho
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

// Enviar pedido direto para o WhatsApp incluindo os tamanhos e referências
function finalizarPedidoWhatsApp() {
    if (carrinho.length === 0) {
        alert("Sua sacola está vazia!");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer o pedido das seguintes peças na *DU NANDA STORE*:\n\n";

    let total = 0;
    carrinho.forEach((item) => {
        mensagem += `• *[${item.id}]* ${item.nome} — *Tamanho: ${item.tamanho}* — R$ ${item.preco.toLocaleString('pt-BR')}\n`;
        total += item.preco;
    });

    mensagem += `\n*Total:* R$ ${total.toLocaleString('pt-BR')}`;
    mensagem += "\n\nPodemos confirmar a disponibilidade das peças e combinar o pagamento e entrega?";

    const mensagemFormatada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${TELEFONE_WHATSAPP}?text=${mensagemFormatada}`;

    window.open(urlWhatsApp, '_blank');
}

// Controle do Modal
function abrirModal() { cartModal.classList.add('active'); }
function fecharModal() { cartModal.classList.remove('active'); }

// Eventos de clique
cartBtn.addEventListener('click', abrirModal);
closeCartBtn.addEventListener('click', fecharModal);
checkoutBtn.addEventListener('click', finalizarPedidoWhatsApp);

cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) fecharModal();
}); 