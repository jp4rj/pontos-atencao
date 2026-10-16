function virarCard(card) {
  // Se o card contém um vídeo e está sendo virado para o verso,
  // pausa o vídeo ao voltar para a frente.
  const video = card.querySelector('video');

  card.classList.toggle('flipped');

  if (video && !card.classList.contains('flipped')) {
    video.pause();
    video.currentTime = 0;
  }
}
