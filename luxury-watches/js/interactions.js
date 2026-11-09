addEventListener('scroll', () => document.querySelector('.site-header')?.classList.toggle('solid', scrollY > 40), {passive:true});
document.addEventListener('click', e => {
  const t = e.target.closest('[data-thumb]'); if (!t) return;
  document.querySelector('.gallery-main').innerHTML = t.dataset.html;
  document.querySelectorAll('[data-thumb]').forEach(b => b.classList.toggle('on', b === t));
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-validate]'); if (!f) return;
  e.preventDefault(); let ok = true;
  f.querySelectorAll('[required]').forEach(i => {
    const v = i.value.trim(); let msg = '';
    if (!v) msg = 'This field is required.';
    else if (i.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) msg = 'Enter an email like name@example.com.';
    else if (i.dataset.card && v.replace(/\s/g,'').length < 12) msg = 'Enter the full card number (demo only).';
    i.closest('label').querySelector('.err').textContent = msg; if (msg) ok = false;
  });
  if (ok) f.dispatchEvent(new CustomEvent('valid'));
});
