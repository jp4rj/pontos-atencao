// ===== ESTADO =====
let indiceAtual = 0;
const todosCards = document.querySelectorAll('.card:not(.card-final)');
const cardFinal = document.getElementById('cardFinal');
const totalCards = todosCards.length;
const visitados = new Set();
let finalMostrado = false;

// ===== INICIALIZAÇÃO =====
function init() {
  criarIndicador();
  mostrarCard(0);
  configurarTeclado();
  atualizarProgresso();
}

// ===== MOSTRAR CARD =====
function mostrarCard(novoIndice) {
  if (novoIndice < 0 || novoIndice >= totalCards) return;

  finalMostrado = false;
  cardFinal.classList.remove('ativo');

  // Pausa vídeo do card que está saindo
  const cardSaindo = todosCards[indiceAtual];
  const videoSaindo = cardSaindo.querySelector('video');
  if (videoSaindo) {
    videoSaindo.pause();
    videoSaindo.currentTime = 0;
  }

  // Remove classe ativo de todos
  todosCards.forEach(c => c.classList.remove('ativo'));

  // Ativa o novo
  indiceAtual = novoIndice;
  const cardNovo = todosCards[indiceAtual];
  cardNovo.classList.add('ativo');
  cardNovo.classList.remove('flipped');

  // Marca como visitado
  visitados.add(indiceAtual);

  atualizarIndicador();
  atualizarBotoes();
  atualizarProgresso();
}

// ===== VIRAR CARD =====
function virarCard(card) {
  if (!card.classList.contains('ativo')) return;
  if (card.classList.contains('card-final')) return;

  const video = card.querySelector('video');
  card.classList.toggle('flipped');

  if (video && !card.classList.contains('flipped')) {
    video.pause();
    video.currentTime = 0;
  }

  // Verifica se acabou de virar o último card
  verificarFim();
}

// ===== NAVEGAÇÃO =====
function proximoCard() {
  // Se já estamos no último card e ele foi virado, vai para o card final
  if (indiceAtual === totalCards - 1) {
    const ultimo = todosCards[totalCards - 1];
    if (ultimo.classList.contains('flipped') && !finalMostrado) {
      mostrarCardFinal();
      return;
    }
  }
  if (indiceAtual < totalCards - 1) {
    mostrarCard(indiceAtual + 1);
  }
}

function cardAnterior() {
  if (finalMostrado) {
    mostrarCard(totalCards - 1);
    return;
  }
  if (indiceAtual > 0) {
    mostrarCard(indiceAtual - 1);
  }
}

// ===== CARD FINAL =====
function mostrarCardFinal() {
  finalMostrado = true;
  todosCards.forEach(c => c.classList.remove('ativo'));
  cardFinal.classList.add('ativo');

  // Atualiza botões
  document.getElementById('btnNext').disabled = true;
  document.getElementById('btnPrev').disabled = false;

  // Atualiza progresso
  document.getElementById('posAtual').textContent = '✓';
  document.getElementById('posTotal').textContent = totalCards;

  // Indicador: nenhum ativo, todos visitados
  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => {
    dot.classList.remove('ativo');
    dot.classList.add('visitado');
  });
}

// ===== BOTÕES =====
function atualizarBotoes() {
  document.getElementById('btnPrev').disabled = indiceAtual === 0;
  document.getElementById('btnNext').disabled = indiceAtual === totalCards - 1;
}

// ===== PROGRESSO (X de Y) =====
function atualizarProgresso() {
  document.getElementById('posAtual').textContent = indiceAtual + 1;
  document.getElementById('posTotal').textContent = totalCards;
}

// ===== INDICADOR =====
function criarIndicador() {
  const indicador = document.getElementById('indicador');
  indicador.innerHTML = '';
  todosCards.forEach((_, i) => {
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
    dot.classList.toggle('ativo', i === indiceAtual && !finalMostrado);
    dot.classList.toggle('visitado', visitados.has(i) && (i !== indiceAtual || finalMostrado));
  });
}

// ===== TECLADO (desktop) =====
function configurarTeclado() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') proximoCard();
    if (e.key === 'ArrowLeft') cardAnterior();
    if (e.key === ' ') {
      e.preventDefault();
      const ativo = document.querySelector('.card.ativo');
      if (ativo && !ativo.classList.contains('card-final')) virarCard(ativo);
    }
  });
}

// ===== FIM =====
function verificarFim() {
  // Se o último card foi virado, programa para mostrar o card final
  const ultimo = todosCards[totalCards - 1];
  if (ultimo.classList.contains('flipped') && visitados.size === totalCards) {
    setTimeout(() => {
      mostrarCardFinal();
    }, 1500);
  }
}

function voltarAoInicio() {
  visitados.clear();
  finalMostrado = false;
  cardFinal.classList.remove('ativo');
  mostrarCard(0);
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
