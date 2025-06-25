const container = document.getElementById('heart-container');

function createHeart(x, y) {
  const heart = document.createElement('div');
  heart.classList.add('heart');

  heart.style.left = x + 'px';
  heart.style.top = y + 'px';

  container.appendChild(heart);

  // Click để nổ tung
  heart.addEventListener('click', () => {
    heart.style.animation = 'explode 0.6s ease-out forwards';
    setTimeout(() => {
      heart.remove();
    }, 600);
  });

  // Tự biến mất sau 6s nếu không click
  setTimeout(() => {
    if (heart.parentNode) heart.remove();
  }, 6000);
}

// Click bất kỳ để tạo trái tim
document.addEventListener('click', (e) => {
  createHeart(e.clientX - 10, e.clientY - 10);
});
