// ===== ESTADO =====
let indiceAtual = 0;
const todosCards = document.querySelectorAll('.card:not(.card-final)');
const cardFinal = document.getElementById('cardFinal');
const totalCards = todosCards.length;
const visitados = new Set();
let finalMostrado = false;
let timerCardFinal = null;

// ===== ESTADO DO CARD ATA (revelação progressiva) =====
let ataRevelados = 0;
const ataTotalItens = 5;

// ===== INICIALIZAÇÃO =====
function init() {
  criarIndicador();
  mostrarCard(0);
  configurarTeclado();
  atualizarProgresso();
  resetarAta();
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

  // Atualiza a seta de navegação (bloqueia até virar)
  atualizarBotoes();

  verificarFim();
}

// ===== NAVEGAÇÃO =====
function proximoCard() {
  if (finalMostrado) return;

  // Bloqueia se o card atual não foi virado
  const cardAtual = todosCards[indiceAtual];
  if (!cardAtual.classList.contains('flipped')) {
    return;
  }

  if (indiceAtual === totalCards - 1) {
    if (cardAtual.classList.contains('flipped')) {
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

  const barra = document.getElementById('barraPreenchimento');
  const texto = document.getElementById('barraTexto');
  barra.style.width = '100%';
  texto.textContent = '🎉 CONCLUÍDO!';
  texto.style.color = '#fff';
  texto.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
}

// ===== BOTÕES =====
function atualizarBotoes() {
  const cardAtual = todosCards[indiceAtual];
  const foiVirado = cardAtual.classList.contains('flipped');

  document.getElementById('btnPrev').disabled = indiceAtual === 0;
  // Seta avançar só habilita se o card foi virado (exceto no card final)
  document.getElementById('btnNext').disabled = !foiVirado;
}

// ===== PROGRESSO (X de Y) =====
function atualizarProgresso() {
  document.getElementById('posAtual').textContent = indiceAtual + 1;
  document.getElementById('posTotal').textContent = totalCards;
}

// ===== BARRA DE TÍTULO =====
function atualizarBarraTitulo() {
  const total = totalCards + 1;
  const progresso = ((indiceAtual + 1) / total) * 100;
  document.getElementById('barraPreench
