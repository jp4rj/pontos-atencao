// ===== ESTADO =====
let indiceAtual = 0;
const cards = document.querySelectorAll('.card');
const totalCards = cards.length;
const visitados = new Set();
let swipeStartX = 0;
let swipeStartY = 0;
let swipeAtivo = false;

// ===== INICIALIZAÇÃO =====
function init() {
  criarIndicador();
  mostrarCard(0);
  configurarSwipe();
  configurarTeclado();
}

// ===== MOSTRAR CARD =====
function mostrarCard(novoIndice) {
  if (novoIndice < 0 || novoIndice >= totalCards) return;

  // Pausa vídeo do card que está saindo
  const cardSaindo = cards[indiceAtual];
  const videoSaindo = cardSaindo.querySelector('video');
  if (videoSaindo) {
    videoSaindo.pause();
    videoSaindo.currentTime = 0;
  }

  // Remove classe ativo de todos
  cards.forEach(c => c.classList.remove('ativo'));

  // Ativa o novo
  indiceAtual = novoIndice;
  const cardNovo = cards[indiceAtual];
  cardNovo.classList.add('ativo');

  // Se o card não tem classe flipped, reseta para a frente
  cardNovo.classList.remove('flipped');

  atualizarIndicador();
  atualizarBotoes();

  // Marca como visitado
  visitados.add(indiceAtual);
  atualizarIndicador();

  // Verifica se acabou
  verificarFim();
}

// ===== VIRAR CARD =====
function virarCard(card) {
  // Só permite virar se for o card ativo
  if (!card.classList.contains('ativo')) return;

  const video = card.querySelector('video');
  card.classList.toggle('flipped');

  // Pausa o vídeo se voltar para a frente
  if (video && !card.classList.contains('flipped')) {
    video.pause();
    video.currentTime = 0;
  }
}

// ===== NAVEGAÇÃO =====
function proximoCard() {
  if (indiceAtual < totalCards - 1) {
    mostrarCard(indiceAtual + 1);
  }
}

function cardAnterior() {
  if (indiceAtual > 0) {
    mostrarCard(indiceAtual - 1);
  }
}

// ===== BOTÕES =====
function atualizarBotoes() {
  document.querySelector('.nav-prev').disabled = indiceAtual === 0;
  document.querySelector('.nav-next').disabled = indiceAtual === totalCards - 1;
}

// ===== INDICADOR =====
function criarIndicador() {
  const indicador = document.getElementById('indicador');
  indicador.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Ir para card ${i + 1}`);
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      mostrarCard(i);
    });
    indicador.appendChild(dot);
  });
}

function atualizarIndicador() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('ativo', i === indiceAtual);
    dot.classList.toggle('visitado', visitados.has(i) && i !== indiceAtual);
  });
}

// ===== SWIPE (ARRastar) =====
function configurarSwipe() {
  const viewport = document.getElementById('viewport');

  viewport.addEventListener('touchstart', (e) => {
    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
    swipeAtivo = true;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!swipeAtivo) return;
    swipeAtivo = false;

    const fimX = e.changedTouches[0].clientX;
    const fimY = e.changedTouches[0].clientY;
    const deltaX = fimX - swipeStartX;
    const deltaY = fimY - swipeStartY;

    // Só considera swipe horizontal se for maior que vertical
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0) {
      proximoCard();  // arrastou para a esquerda → próximo
    } else {
      cardAnterior(); // arrastou para a direita → anterior
    }
  }, { passive: true });
}

// ===== TECLADO (desktop) =====
function configurarTeclado() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') proximoCard();
    if (e.key === 'ArrowLeft') cardAnterior();
    if (e.key === ' ') {
      e.preventDefault();
      const ativo = document.querySelector('.card.ativo');
      if (ativo) virarCard(ativo);
    }
  });
}

// ===== FIM =====
function verificarFim() {
  // Mostra mensagem se todos foram visitados
  if (visitados.size === totalCards) {
    setTimeout(() => {
      document.getElementById('finalMsg').classList.add('visivel');
    }, 800);
  } else {
    document.getElementById('finalMsg').classList.remove('visivel');
  }
}

function voltarAoInicio() {
  visitados.clear();
  document.getElementById('finalMsg').classList.remove('visivel');
  mostrarCard(0);
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
