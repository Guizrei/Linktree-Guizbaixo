(function(){
  var LINKS=Object.freeze({live:'https://livepix.gg/guizbaixo',discord:'https://discord.gg/v3FkMMccAS',youtube:'https://www.youtube.com/@guizbaixo'});
  function keyOf(a){return Object.keys(LINKS).filter(function(n){return a.classList.contains(n)})[0]}
  function lock(){
    [].slice.call(document.querySelectorAll('a')).forEach(function(a){
      var k=keyOf(a);
      if(!k||!a.classList.contains('row')){a.remove();return}
      if(a.getAttribute('href')!==LINKS[k]) a.setAttribute('href',LINKS[k]);
      if(a.getAttribute('target')!=='_blank') a.setAttribute('target','_blank');
      if(a.getAttribute('rel')!=='noopener noreferrer') a.setAttribute('rel','noopener noreferrer');
    });
  }
  lock();
  new MutationObserver(lock).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['href','target','rel','class']});
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a'); if(!a) return;
    var k=keyOf(a);
    if(!k||a.getAttribute('href')!==LINKS[k]) e.preventDefault();
  },true);
  var root=document.documentElement, ctx=null, muted=false, KEY='gz-sound';
  try{muted=localStorage.getItem(KEY)==='off'}catch(e){}
  var btn=document.getElementById('snd');
  function label(){btn.textContent=muted?'som: desligado':'som: ligado'; btn.setAttribute('aria-pressed',String(!muted))}
  label();

  function audio(){
    if(!ctx){var C=window.AudioContext||window.webkitAudioContext; if(C) ctx=new C()}
    if(ctx&&ctx.state==='suspended') ctx.resume().catch(function(){});
    return ctx;
  }
  function play(fn){
    if(muted||!ctx) return;
    if(ctx.state==='running') fn();
    else if(ctx.state==='suspended') ctx.resume().then(fn).catch(function(){});
  }
  function tone(f,d,v,type,delay,glide){
    var t=ctx.currentTime+(delay||0), o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type||'sine';
    o.frequency.setValueAtTime(f,t);
    if(glide) o.frequency.exponentialRampToValueAtTime(f*glide,t+d);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(v,t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t+d+0.05);
  }
  var notes=[523.25,659.25,783.99];
  function hoverSound(i){tone(notes[i],.25,.022,'sine',0,1.015)}
  function clickSound(i){tone(notes[i]/2,.3,.045,'triangle',0,.92); tone(notes[i],.35,.026,'sine',.05)}

  ['pointerdown','keydown','touchstart'].forEach(function(ev){addEventListener(ev,audio,{passive:true})});

  var rows=[].slice.call(document.querySelectorAll('a.row'));
  rows.forEach(function(a,i){
    a.addEventListener('pointerenter',function(e){ if(e.pointerType!=='touch') play(function(){hoverSound(i)}) });
    a.addEventListener('focus',function(){ if(a.matches(':focus-visible')) play(function(){hoverSound(i)}) });
    a.addEventListener('pointerdown',function(){ audio(); play(function(){clickSound(i)}); root.classList.add('down') });
    a.addEventListener('click',function(e){ if(e.detail===0){ audio(); play(function(){clickSound(i)}) } });
  });
  addEventListener('pointerup',function(){root.classList.remove('down')});
  addEventListener('pointercancel',function(){root.classList.remove('down')});

  btn.addEventListener('click',function(){
    muted=!muted;
    try{localStorage.setItem(KEY,muted?'off':'on')}catch(e){}
    label(); audio();
    if(!muted) play(function(){hoverSound(1)});
  });

  /* cursor e paralaxe suave do fundo (só com mouse) */
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(fine){
    root.classList.add('has-cursor');
    var dot=document.querySelector('.dot'), ring=document.querySelector('.ring'), bg=document.querySelector('.bg');
    var mx=innerWidth/2, my=innerHeight/2, rx=mx, ry=my, px=0, py=0;
    addEventListener('pointermove',function(e){
      mx=e.clientX; my=e.clientY;
      root.classList.add('show');
      dot.style.transform='translate('+mx+'px,'+my+'px)';
      root.classList.toggle('hot',!!(e.target.closest&&e.target.closest('a,button')));
    },{passive:true});
    root.addEventListener('mouseleave',function(){root.classList.remove('show')});
    (function loop(){
      rx+=(mx-rx)*.15; ry+=(my-ry)*.15;
      ring.style.transform='translate('+rx+'px,'+ry+'px)';
      if(!reduce){
        px+=((.5-mx/innerWidth)*26-px)*.05; py+=((.5-my/innerHeight)*26-py)*.05;
        bg.style.setProperty('--px',px.toFixed(2)+'px'); bg.style.setProperty('--py',py.toFixed(2)+'px');
      }
      requestAnimationFrame(loop);
    })();
  }
})();
