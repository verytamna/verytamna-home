(function(){
  var nav=document.getElementById('nav');
  var sub=document.body.dataset.page!=='home';
  function onScroll(){nav.classList.toggle('solid',sub||window.scrollY>60)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  var m=document.getElementById('mMenu');
  document.getElementById('burger').onclick=function(){m.classList.add('open')};
  document.getElementById('mClose').onclick=function(){m.classList.remove('open')};
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open')})});

  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el){
    var to=parseFloat(el.dataset.to),dec=+(el.dataset.dec||0),t0=null,dur=1600;
    function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3),v=to*e;
      el.textContent=dec?v.toFixed(dec):Math.round(v).toLocaleString('ko-KR');if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  }

  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in');
        e.target.querySelectorAll('.count').forEach(countUp);
        io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
  }else{
    document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')});
  }

})();
