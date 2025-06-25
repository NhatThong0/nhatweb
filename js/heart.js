const container = document.getElementById('heart-container');

function createHeart(x, y) {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  container.appendChild(heart);

  // Tạo hiệu ứng nổ trái tim
  heart.addEventListener('click', () => {
    explodeHeart(x + 10, y + 10); // Tâm của trái tim
    heart.remove();
  });

  setTimeout(() => {
    if (heart.parentNode) heart.remove();
  }, 5000);
}

// Tạo particles theo hình trái tim
function explodeHeart(cx, cy) {
  const numParticles = 30;
  for (let i = 0; i < numParticles; i++) {
    const t = (Math.PI * 2 * i) / numParticles;

    // Parametric heart curve
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    const particle = document.createElement('div');
    particle.classList.add('particle');

    particle.style.left = cx + 'px';
    particle.style.top = cy + 'px';

    // scale for visual effect
    particle.style.setProperty('--x', `${x * 5}px`);
    particle.style.setProperty('--y', `${-y * 5}px`); // -y để hướng lên

    container.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
}

// Click để tạo trái tim
document.addEventListener('click', (e) => {
  createHeart(e.clientX - 10, e.clientY - 10);
});
