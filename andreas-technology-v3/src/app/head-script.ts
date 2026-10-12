/**
 * Runs in <head> before first paint:
 *  - marks that JavaScript runs (`data-js`), which arms the reveal styles in globals.css;
 *  - paints the stored or system theme, so the page never flashes the wrong one;
 *  - reveals each slide as it enters the viewport (`data-revealed`), with no framework
 *    needed, so entrances run on the compositor and never wait for hydration.
 * Storage access is guarded: it throws when site data is blocked.
 */
export const HEAD_SCRIPT = `(function () {
  var d = document.documentElement;
  d.setAttribute('data-js', '');
  var t = null;
  try { t = localStorage.getItem('theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  d.classList.add(t);
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', t === 'dark' ? '#000000' : '#ffffff'); });
    if (!('IntersectionObserver' in window)) { d.removeAttribute('data-js'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.setAttribute('data-revealed', ''); io.unobserve(e.target); } });
    }, { rootMargin: '0px -12% -12% 0px' });
    document.querySelectorAll('.slide').forEach(function (s) { io.observe(s); });
  });
})();`
