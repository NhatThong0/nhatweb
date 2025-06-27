const textEl = document.getElementById('love-text');
const topBar = document.querySelector('.top-bar');
const bottomBar = document.querySelector('.bottom-bar');

const stages = [
  { phase: 'explodeLOVE', from: 'I love you', to: 'I ❤️ you' },
  { phase: 'explodeYOU', from: 'I ❤️ you', to: 'I ❤️ u' },
  { phase: 'explodeALL', from: 'I ❤️ u', to: '💖' }
];

let tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
let delay = 1;

stages.forEach((st, i) => {
  tl.addLabel(st.phase, delay);

  // 1. Di chuyển thanh từ trên & dưới vào giữa
  tl.to(topBar, {
    duration: 0.6,
    y: 100
  }, st.phase);
  tl.to(bottomBar, {
    duration: 0.6,
    y: -100
  }, st.phase);

  //
