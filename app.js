(() => {
  const progress = document.querySelector('.progress span');
  const voicePanel = document.querySelector('.voice-panel');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
    if (voicePanel) {
      const rect = voicePanel.getBoundingClientRect();
      // Reveal the whole image by the time the panel is centered in the viewport.
      const start = innerHeight * 0.9;
      const end = Math.max(0, (innerHeight - rect.height) / 2);
      const fraction = reducedMotion.matches ? 1 : Math.max(0, Math.min(1,
        (start - rect.top) / Math.max(1, start - end)));
      voicePanel.style.setProperty('--voice-progress', `${fraction * 100}%`);
    }
    scheduled = false;
  }
  function scheduleUpdate() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
  }
  addEventListener('scroll', scheduleUpdate, { passive: true });
  addEventListener('resize', scheduleUpdate);
  addEventListener('pageshow', scheduleUpdate);
  reducedMotion.addEventListener('change', scheduleUpdate);
  document.querySelectorAll('details').forEach(item => item.addEventListener('toggle', scheduleUpdate));
  if (voicePanel && 'ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(voicePanel);
  if (document.fonts) document.fonts.ready.then(scheduleUpdate);
  updateProgress();
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('main > .section, .dark .section, .honest .section').forEach(section => {
      section.classList.add('reveal'); observer.observe(section);
    });
    document.documentElement.classList.add('can-reveal');
  }
})();
