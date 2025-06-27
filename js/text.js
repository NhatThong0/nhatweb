const textEl = document.getElementById('love-text');
const leftBar = document.querySelector('.left-bar');
const rightBar = document.querySelector('.right-bar');
const popSound = document.getElementById('pop-sound');
const heartSvg = document.getElementById('heart-svg');
const heartPath = heartSvg.querySelector('.heart');

const stages = [
  { from:'I love you', to:'I ❤️ you' },
  { from:'I ❤️ you', to:'I ❤️ u' },
  { from:'I ❤️ u', to:null }
];

let tl = gsap.timeline({ defaults:{ease:'power2.inOut'} });
let delay = 1;

stages.forEach((st,i)=>{
  tl.to([leftBar,rightBar], {duration:0.8, height:200}, delay);
  tl.call(()=>popSound.currentTime=0 && popSound.play(), null, `>${delay}`);
  tl.to(textEl, {duration:0.4, scale:0.8, opacity:0}, `>${delay+0.5}`);
  if(st.to){
    tl.call(()=>textEl.textContent=st.to, null, `>${delay+0.9}`);
    tl.to(textEl, {duration:0.6, scale:1.2, opacity:1}, `>${delay+0.9}`);
    tl.call(()=>popSound.currentTime=0 && popSound.play(), null, `>${delay+0.9}`);
    tl.to([leftBar,rightBar],{duration:0.8,height:100,ease:'bounce.out'},`>${delay+1.5}`);
  } else {
    tl.call(()=>textEl.style.opacity=0, null, `>${delay+0.5}`);
    tl.to([leftBar,rightBar],{duration:0.8,height:100,ease:'bounce.out'},`>${delay+1}`);
    tl.call(()=>{
      heartSvg.style.opacity=1;
      gsap.fromTo(heartPath,{scale:0},{duration:0.6, scale:1.2, transformOrigin:'center'});
      gsap.to(heartSvg,{duration:1, repeat:-1, yoyo:true, scale:1.1});
      popSound.currentTime=0; popSound.play();
    }, null, `>${delay+1}`);
  }
  delay += 3;
});

tl.to({}, {duration:delay+1, onComplete: ()=>tl.restart()});
window.addEventListener('resize', ()=>{
  textEl.style.fontSize=`${8 * window.innerWidth/100}px`;
});
