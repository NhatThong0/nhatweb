const scene = document.getElementById('scene');
const total = 300; // số lượng dấu chấm
let angle = 0;

// Hàm tạo vị trí hình trái tim 3D theo công thức tham số
function heartFunction3D(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  const z = Math.sin(t * 3) * 5;
  return { x, y, z };
}

// Tạo các particle
const particles = [];
for (let i = 0; i < total; i++) {
  const t = (i / total) * 2 * Math.PI;
  const { x, y, z } = heartFunction3D(t);

  const particle = document.createElement('div');
  particle.className = 'particle';

  // Lưu vị trí gốc
  particle.dataset.x = x;
  particle.dataset.y = y;
  particle.dataset.z = z;

  scene.appendChild(particle);
  particles.push(particle);
}

// Hàm render xoay trái tim
function animate() {
  angle += 0.01; // tăng góc để quay từ từ

  particles.forEach(p => {
    const x = parseFloat(p.dataset.x);
    const y = parseFloat(p.dataset.y);
    const z = parseFloat(p.dataset.z);

    // Xoay điểm quanh trục Y
    const rotatedX = x * Math.cos(angle) - z * Math.sin(angle);
    const rotatedZ = x * Math.sin(angle) + z * Math.cos(angle);

    // Scale và vẽ
    p.style.transform = `translate3d(${rotatedX * 10}px, ${-y * 10}px, ${rotatedZ * 10}px)`;
  });

  requestAnimationFrame(animate);
}

animate();
