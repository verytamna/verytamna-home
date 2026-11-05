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

  // 가격·판매 상태는 구글 시트 "설정" 탭에서 읽어 온다. 못 읽으면 HTML에 적힌 값을 그대로 둔다.
  if(document.querySelector('[data-grade]')){
    window.__saleConfig=function(c){
      if(!c||!c.ok)return;
      document.querySelectorAll('[data-grade]').forEach(function(el){
        var k=el.dataset.grade;
        el.textContent=c.soldOut[k]?'품절':c.prices[k].toLocaleString('ko-KR')+'원';
      });
      document.getElementById('shipFee').textContent=c.shippingFee.toLocaleString('ko-KR')+'원';
      document.getElementById('freeMin').textContent=c.freeShippingMinQty+'kg 이상';
      if(!c.open){
        var notice=document.getElementById('saleNotice');
        notice.textContent=c.next?c.title+' · '+c.next:c.title;
        notice.hidden=false;
        notice.classList.add('in');
        document.getElementById('orderCtaLabel').textContent='판매 안내 · 수확 알림 신청';
      }
    };
    var url='https://script.google.com/macros/s/AKfycbzp5qsgoKn3804tUj1UseibUvTq7EC--GxkRj1P5iojoOHgHJjsn8tJh6J9JpUlNQo/exec?action=config&_='+Date.now();
    fetch(url,{credentials:'omit'}).then(function(r){return r.json()}).then(window.__saleConfig).catch(function(){
      var s=document.createElement('script');
      s.src=url+'&callback=__saleConfig';
      document.head.appendChild(s);
    });
  }

})();
