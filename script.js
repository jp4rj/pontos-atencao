// ===== ESTADO =====
let indiceAtual = 0;
const todosCards = document.querySelectorAll('.card:not(.card-final)');
const cardFinal = document.getElementById('cardFinal');
const totalCards = todosCards.length;
const visitados = new Set();
let finalMostrado = false;
let timerCardFinal = null;

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

  if (timerCardFinal) {
    clearTimeout(timerCardFinal);
    timerCardFinal = null;
  }

  finalMostrado = false;
  cardFinal.classList.remove('ativo');

  const cardSaindo = todosCards[indiceAtual];
  const videoSaindo = cardSaindo.querySelector('video');
  if (videoSaindo) {
    videoSaindo.pause();
    videoSaindo.currentTime = 0;
  }

  todosCards.forEach(c => c.classList.remove('ativo'));

  indiceAtual = novoIndice;
  const cardNovo = todosCards[indiceAtual];
  cardNovo.classList.add('ativo');
  cardNovo.classList.remove('flipped');

  visitados.add(indiceAtual);

  atualizarIndicador();
  atualizarBotoes();
  atualizarProgresso();
  atualizarBarraTitulo();
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

  verificarFim();
}

// ===== NAVEGAÇÃO =====
function proximoCard() {
  if (finalMostrado) return;

  if (indiceAtual === totalCards - 1) {
    const ultimo = todosCards[totalCards - 1];
    if (ultimo.classList.contains('flipped')) {
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
  if (timerCardFinal) {
    clearTimeout(timerCardFinal);
    timerCardFinal = null;
  }

  finalMostrado = true;
  todosCards.forEach(c => c.classList.remove('ativo'));
  cardFinal.classList.add('ativo');

  document.getElementById('btnNext').disabled = true;
  document.getElementById('btnPrev').disabled = false;

  document.getElementById('posAtual').textContent = '✓';
  document.getElementById('posTotal').textContent = totalCards;

  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => {
    dot.classList.remove('ativo');
    dot.classList.add('visitado');
  });

  // Barra 100% com texto de concluído
  const barra = document.getElementById('barraPreenchimento');
  const texto = document.getElementById('barraTexto');
  barra.style.width = '100%';
  texto.textContent = '🎉 CONCLUÍDO!';
  texto.style.color = '#fff';
  texto.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
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

// ===== BARRA DE TÍTULO (progresso visual) =====
function atualizarBarraTitulo() {
  const total = totalCards + 1; // inclui o card final
  const progresso = ((indiceAtual + 1) / total) * 100;
  document.getElementById('barraPreenchimento').style.width = progresso + '%';

  // Restaura texto padrão se não estiver no card final
  const texto = document.getElementById('barraTexto');
  if (!finalMostrado) {
    texto.textContent = 'PONTOS DE ATENÇÃO';
    texto.style.color = '#1e3c72';
    texto.style.textShadow = '0 1px 2px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.6)';
  }
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

// ===== TECLADO =====
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
  const ultimo = todosCards[totalCards - 1];

  if (ultimo.classList.contains('flipped') && visitados.size === totalCards) {
    if (timerCardFinal) clearTimeout(timerCardFinal);

    timerCardFinal = setTimeout(() => {
      if (indiceAtual === totalCards - 1 &&
          todosCards[totalCards - 1].classList.contains('flipped') &&
          !finalMostrado) {
        mostrarCardFinal();
      }
      timerCardFinal = null;
    }, 10000);
  }
}

function voltarAoInicio() {
  if (timerCardFinal) {
    clearTimeout(timerCardFinal);
    timerCardFinal = null;
  }
  visitados.clear();
  finalMostrado = false;
  cardFinal.classList.remove('ativo');
  mostrarCard(0);
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
