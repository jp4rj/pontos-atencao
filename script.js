// Contador de cards virados
const cardsVirados = new Set();

function virarCard(card) {
  const video = card.querySelector('video');
  const indice = Array.from(document.querySelectorAll('.card')).indexOf(card);

  card.classList.toggle('flipped');

  if (card.classList.contains('flipped')) {
    cardsVirados.add(indice);
  } else {
    cardsVirados.delete(indice);
  }

  // Pausa vídeo ao voltar para a frente
  if (video && !card.classList.contains('flipped')) {
    video.pause();
    video.currentTime = 0;
  }

  atualizarContador();
}

function atualizarContador() {
  const total = document.querySelectorAll('.card').length;
  const virados = cardsVirados.size;
  const contadorEl = document.getElementById('contador');
  const numeroEl = document.getElementById('contador-numero');
  const totalEl = document.getElementById('contador-total');

  numeroEl.textContent = virados;
  totalEl.textContent = total;

  if (virados === total) {
    contadorEl.classList.add('completo');
    contadorEl.innerHTML = `🎉 Parabéns! Você viu todos os ${total} cards!`;
  } else {
    contadorEl.classList.remove('completo');
    contadorEl.innerHTML = `<span id="contador-numero">${virados}</span> de <span id="contador-total">${total}</span> cards virados`;
  }
}

// Inicializa o contador ao carregar
document.addEventListener('DOMContentLoaded', atualizarContador);
