(() => {
  const progress = document.querySelector('.progress span');
  if (!progress) return;

  let scheduled = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const percent = max > 0 ? Math.max(0, Math.min(100, scrollY / max * 100)) : 0;
    progress.style.width = `${percent}%`;
    scheduled = false;
  }
  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateProgress);
    }
  }

  addEventListener('scroll', scheduleUpdate, { passive: true });
  addEventListener('resize', scheduleUpdate);
  addEventListener('pageshow', scheduleUpdate);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(document.body);
  if (document.fonts) document.fonts.ready.then(scheduleUpdate);
  updateProgress();
})();
