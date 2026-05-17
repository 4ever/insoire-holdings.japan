/* ============================================
   Inspire Holdings - main interactions
   Lightweight, no dependencies
   ============================================ */
(function(){
  'use strict';

  // Mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  if(menuBtn && navLinks){
    menuBtn.addEventListener('click', function(){
      navLinks.classList.toggle('show');
    });
    navLinks.addEventListener('click', function(e){
      if(e.target.tagName === 'A') navLinks.classList.remove('show');
    });
  }

  // Nav scroll shadow
  var nav = document.querySelector('.nav');
  if(nav){
    var ticking = false;
    window.addEventListener('scroll', function(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        nav.classList.toggle('scrolled', window.scrollY > 30);
        ticking = false;
      });
    }, {passive:true});
  }

  // Reveal on scroll - mark sections as reveal targets
  var sections = document.querySelectorAll('.section, .hero-content > *');
  sections.forEach(function(el){ el.classList.add('reveal'); });

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.08, rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  // Contact / Request form
  var lang = (document.documentElement.lang || 'ja').toLowerCase().indexOf('en') === 0 ? 'en' : 'ja';
  var thanksMsg = lang === 'en'
    ? 'Thank you for your inquiry. Our team will contact you within 2 business days.'
    : 'お問い合わせありがとうございます。担当より2営業日以内にご連絡いたします。';
  ['contactForm','requestForm'].forEach(function(id){
    var f = document.getElementById(id);
    if(f){
      f.addEventListener('submit', function(e){
        e.preventDefault();
        alert(thanksMsg);
        f.reset();
      });
    }
  });

  // Callout tabs (BGC / PEZA)
  document.querySelectorAll('.callout-tabs').forEach(function(tabs){
    tabs.querySelectorAll('.tab-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        tabs.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
        tabs.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
        btn.classList.add('active');
        var panel = document.getElementById('callout-' + btn.dataset.tab);
        if(panel) panel.classList.add('active');
      });
    });
  });

  // Sparklines (lightweight, no Chart.js dependency for these)
  function drawSpark(canvas){
    var data = canvas.dataset.spark.split(',').map(parseFloat);
    var color = canvas.dataset.color || '#b8945a';
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.offsetWidth, h = canvas.offsetHeight || 36;
    canvas.width = w * dpr; canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    var range = max - min || 1;
    var step = w / (data.length - 1);

    // Area
    ctx.beginPath();
    data.forEach(function(v,i){
      var x = i * step;
      var y = h - ((v - min) / range) * (h - 4) - 2;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    var grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0, color + '40');
    grad.addColorStop(1, color + '00');
    ctx.fillStyle = grad; ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach(function(v,i){
      var x = i * step;
      var y = h - ((v - min) / range) * (h - 4) - 2;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.strokeStyle = color; ctx.lineWidth = 1.6;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.stroke();
  }
  document.querySelectorAll('.spark').forEach(drawSpark);
  window.addEventListener('resize', function(){
    document.querySelectorAll('.spark').forEach(drawSpark);
  });
})();
