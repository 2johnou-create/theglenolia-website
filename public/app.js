'use strict';
(() => {
  const root = document.documentElement;
  const base = document.querySelector('meta[name="site-base"]')?.content || '';
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPreference = null;
  try { motionPreference = localStorage.getItem('glenolia-motion'); } catch {}
  let reduceMotion = reducedQuery.matches || motionPreference === 'reduce';
  const connection = navigator.connection;
  const saveData = !!connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType);
  const videos = [...document.querySelectorAll('[data-background-video]')];
  const applyMotion = () => {
    root.dataset.reduceMotion = String(reduceMotion);
    document.querySelectorAll('[data-motion-toggle]').forEach(b => { b.textContent = reduceMotion ? b.dataset.on : b.dataset.off; b.setAttribute('aria-pressed', String(reduceMotion)); });
    videos.forEach(v => { if (reduceMotion) { v.pause(); v.classList.remove('is-playing'); } else if (v.dataset.inView === 'true' && v.dataset.userPaused !== 'true' && !document.hidden && !saveData) startVideo(v); });
  };
  const syncVideoButton = (v) => {
    const b = v.closest('figure')?.querySelector('[data-video-toggle]');
    if (b) { b.hidden = !v.src || reduceMotion; b.textContent = v.paused ? b.dataset.resume : b.dataset.pause; b.setAttribute('aria-pressed', String(!v.paused)); }
  };
  const startVideo = (v) => {
    if (reduceMotion || saveData || document.hidden || v.dataset.userPaused === 'true') return;
    if (!v.src) { v.src = window.innerWidth < 650 ? v.dataset.mobile : v.dataset.desktop; v.muted = true; v.load(); }
    const result = v.play();
    if (result?.catch) result.catch(() => { v.classList.remove('is-playing'); syncVideoButton(v); });
  };
  videos.forEach(v => {
    v.addEventListener('playing', () => { v.classList.add('is-playing'); syncVideoButton(v); });
    v.addEventListener('pause', () => syncVideoButton(v));
    v.addEventListener('error', () => { v.classList.remove('is-playing'); const b = v.closest('figure')?.querySelector('[data-video-toggle]'); if (b) b.hidden = true; });
    v.closest('figure')?.querySelector('[data-video-toggle]')?.addEventListener('click', () => { if (v.paused) { v.dataset.userPaused = 'false'; startVideo(v); } else { v.dataset.userPaused = 'true'; v.pause(); } syncVideoButton(v); });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { const v = entry.target; v.dataset.inView = String(entry.isIntersecting); if (entry.isIntersecting) startVideo(v); else v.pause(); }), { threshold: .15 });
    videos.forEach(v => observer.observe(v));
  }
  document.addEventListener('visibilitychange', () => { videos.forEach(v => { if (document.hidden) v.pause(); else if (v.dataset.inView === 'true') startVideo(v); }); });
  document.querySelectorAll('[data-motion-toggle]').forEach(b => b.addEventListener('click', () => {
    reduceMotion = !reduceMotion;
    // A system reduced-motion preference remains respected even if a visitor toggles this setting.
    if (reducedQuery.matches) reduceMotion = true;
    motionPreference = reduceMotion ? 'reduce' : 'allow';
    try { localStorage.setItem('glenolia-motion', motionPreference); } catch {}
    applyMotion();
  }));
  reducedQuery.addEventListener?.('change', () => { reduceMotion = reducedQuery.matches || motionPreference === 'reduce'; applyMotion(); });
  applyMotion();

  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  if (header && menu) {
    header.classList.add('js-nav');
    menu.addEventListener('click', () => { const open = !header.classList.contains('is-open'); header.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', String(open)); menu.firstChild.textContent = open ? menu.dataset.close : menu.dataset.open; });
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && header.classList.contains('is-open')) { header.classList.remove('is-open'); menu.setAttribute('aria-expanded','false'); menu.firstChild.textContent = menu.dataset.open; menu.focus(); } });
  }
  if (matchMedia('(hover: hover) and (pointer: fine) and (min-width: 651px)').matches) {
    document.querySelectorAll('.hero-art[data-depth]').forEach(el => {
      el.addEventListener('pointermove', event => {
        if (reduceMotion) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--depth-x', `${-((event.clientY-r.top)/r.height-.5)*5}deg`);
        el.style.setProperty('--depth-y', `${((event.clientX-r.left)/r.width-.5)*6}deg`);
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--depth-x','0deg'); el.style.setProperty('--depth-y','0deg'); });
      let scheduled = false;
      const updateDepth = () => { scheduled = false; const r=el.getBoundingClientRect(); if (!reduceMotion && r.bottom>0 && r.top<innerHeight) el.style.setProperty('--scroll-depth', `${Math.max(-16, Math.min(16, (r.top - innerHeight*.28)*.04))}px`); };
      window.addEventListener('scroll', () => { if (!scheduled) { scheduled=true; requestAnimationFrame(updateDepth); } }, {passive:true});
    });
  }

  document.querySelectorAll('[data-instagram-feed]').forEach(async container => {
    try {
      const response = await fetch(base + '/instagram.json', {cache:'no-cache'});
      if (!response.ok) throw new Error('feed unavailable');
      const data = await response.json();
      if (!Array.isArray(data.posts) || !data.posts.length) return;
      const items = data.posts.slice(0,6).map(post => {
        const url = new URL(post.permalink);
        if (!['www.instagram.com','instagram.com'].includes(url.hostname) || url.protocol !== 'https:') return null;
        const article = document.createElement('a'); article.className='ig-item'; article.href=url.href; article.target='_blank'; article.rel='noopener noreferrer';
        const img = document.createElement('img');
        // Only our cached images are loaded, so no third-party request is made while browsing.
        if (!/^\/assets\/instagram\/[-a-zA-Z0-9_.]+$/.test(post.image)) return null;
        img.src=base+post.image; img.alt=post.alt || ''; img.width=600; img.height=600; img.loading='lazy';
        const time = document.createElement('time'); const date = new Date(post.timestamp); if (!Number.isFinite(date.getTime())) return null;
        time.dateTime=date.toISOString(); time.textContent=new Intl.DateTimeFormat(root.lang,{year:'numeric',month:'short',day:'numeric'}).format(date);
        const caption = document.createElement('p'); caption.textContent = (post.captions?.[root.dataset.language] || post.caption || '').slice(0,240);
        const link = document.createElement('span'); link.textContent=container.dataset.linkLabel+' ↗';
        article.append(img,time,caption,link); return article;
      }).filter(Boolean);
      if (items.length) container.replaceChildren(...items);
    } catch { /* Keep the truthful empty state and official account link. */ }
  });

  const form = document.getElementById('newsletter-form');
  if (form) form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    const setStatus = text => { status.textContent=text; status.focus(); };
    if (!form.dataset.endpoint) { setStatus(form.dataset.unconnected); return; }
    const email = form.elements.email; const consent = form.elements.consent;
    email.setAttribute('aria-invalid', String(!email.validity.valid));
    if (!email.validity.valid) { setStatus(form.dataset.emailError); email.focus(); return; }
    if (!consent.checked) { setStatus(form.dataset.consentError); consent.focus(); return; }
    const button = form.querySelector('button[type=submit]'); const oldLabel=button.textContent;
    button.disabled=true; button.textContent=form.dataset.sending;
    const fd=new FormData(form);
    try {
      const response=await fetch(form.dataset.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:fd.get('email'),firstName:fd.get('firstName'),language:fd.get('language'),interests:fd.getAll('interests'),consent:true,consentVersion:'2026-10-12-v1',website:fd.get('website') || ''}),signal:AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error('registration failed');
      const result=await response.json(); if (result.status !== 'confirmation_sent') throw new Error('confirmation missing');
      form.reset(); setStatus(form.dataset.success);
    } catch { setStatus(form.dataset.error); }
    finally { button.disabled=false; button.textContent=oldLabel; }
  });
})();
