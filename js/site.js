(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero: pasek adresu przechodzi z localhost:3000 na publiczny adres (to jest obietnica warsztatu).
  const url = document.getElementById('url');
  if (url) reduce ? url.classList.add('is-prod') : setTimeout(() => url.classList.add('is-prod'), 1400);

  // Ile zostało do zamknięcia zapisów (19.10.2026, 20:00 czasu PL = 18:00 UTC). Po terminie nic nie pokazujemy.
  const left = document.getElementById('left');
  const ms = Date.UTC(2026, 9, 19, 18, 0) - Date.now();
  if (left && ms > 0) {
    const d = Math.floor(ms / 864e5);
    left.textContent = d >= 1 ? `zostało ${d} ${d === 1 ? 'dzień' : 'dni'}` : 'zapisy zamykają się dziś';
    left.hidden = false;
  }

  // Program: karta wdrożenia odhacza dzień, gdy jego opis przejdzie przez środek ekranu.
  const items = [...document.querySelectorAll('#dc-list li')];
  const pct = document.getElementById('dc-pct'), fill = document.getElementById('dc-fill');
  const setDone = n => {
    items.forEach(li => li.classList.toggle('done', +li.dataset.d <= n));
    if (pct) pct.textContent = `${n}/5`;
    if (fill) fill.style.width = `${n * 20}%`;
  };
  const days = [...document.querySelectorAll('.day')];
  if (items.length && days.length) {
    let raf = 0;
    const update = () => {
      raf = 0; const mid = innerHeight * 0.55; let n = 0;
      days.forEach(d => { if (d.getBoundingClientRect().top < mid) n = +d.dataset.d; });
      setDone(n);
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  }

  // Film: ładowany dopiero po kliknięciu (9,4 MB nie leci przy wejściu na stronę).
  const play = document.getElementById('play');
  play?.addEventListener('click', () => {
    const v = document.createElement('video');
    Object.assign(v, { src: 'media/demo-move-studio.mp4', poster: 'media/demo-poster.webp', controls: true, playsInline: true, autoplay: true, muted: true });
    v.setAttribute('aria-label', 'Film 49 sekund: strona, panel CMS, edycja treści i publikacja');
    play.replaceWith(v);
    v.focus();
  });

  // Podgląd zrzutów.
  const lb = document.getElementById('lb'), lbi = document.getElementById('lb-img');
  let opener = null;
  document.querySelectorAll('.shot-btn').forEach(b => b.addEventListener('click', () => {
    opener = b; lbi.src = b.dataset.full; lbi.alt = b.getAttribute('aria-label').replace('Powiększ: ', ''); lb.showModal();
  }));
  lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('close', () => opener?.focus());

  // Pasek CTA na mobile: schowany, gdy widać CTA w hero albo panel zakupu.
  const sticky = document.getElementById('sticky'), seen = new Map();
  const sync = () => { const off = [...seen.values()].some(Boolean); sticky.classList.toggle('off', off); sticky.toggleAttribute('inert', off); };
  const so = new IntersectionObserver(es => { es.forEach(e => seen.set(e.target, e.isIntersecting)); sync(); });
  [document.querySelector('.hero .btn'), document.getElementById('kup')].forEach(el => { if (el) { seen.set(el, true); so.observe(el); } });

})();
