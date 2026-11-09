const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const R = ROOT(), PG = document.body.dataset.page;
const href = p => R + (p === 'index' ? 'index.html' : `pages/${p}.html`);
function toast(msg){ let t=$('.toast'); if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.append(t);} t.textContent=msg; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),2200); }

/* ---------- shared chrome ---------- */
function chrome(){
  const links = [['index','Home'],['collection','Collection'],['craftsmanship','Craftsmanship'],['our-story','Our story'],['contact','Contact']];
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="site-header ${PG==='index'?'':'solid'}">
    <button class="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
    <nav class="nav" aria-label="Main">${links.map(([p,l])=>`<a href="${href(p)}" ${PG===p?'aria-current="page"':''}>${l}</a>`).join('')}</nav>
    <a class="logo" href="${href('index')}">Maison Aurel</a>
    <div class="tools">
      <button class="icon-btn" data-search aria-label="Search">Search</button>
      <a class="icon-btn" href="${href('wishlist')}">Wishlist <b data-wc></b></a>
      <a class="icon-btn pill" href="${href('cart')}">Cart <b data-cc>0</b></a>
    </div>
  </header>
  <div class="search" hidden><div class="search-box"><input type="search" placeholder="Search watches, materials, movements" aria-label="Search"><button class="icon-btn" data-close>Close</button><ul class="search-results"></ul></div></div>`);
  document.body.insertAdjacentHTML('beforeend', `<footer class="footer"><div><p class="logo">Maison Aurel</p><p class="muted">Watches assembled by hand in a Geneva atelier. Demo store: no real orders are taken.</p></div>
   <div><h4>Shop</h4>${['collection','wishlist','cart'].map(p=>`<a href="${href(p)}">${p[0].toUpperCase()+p.slice(1)}</a>`).join('')}</div>
   <div><h4>House</h4><a href="${href('our-story')}">Our story</a><a href="${href('craftsmanship')}">Craftsmanship</a><a href="${href('contact')}">Contact</a></div></footer>`);
  const b=$('.burger'); b.onclick=()=>{const o=document.body.classList.toggle('menu-open'); b.setAttribute('aria-expanded',o);};
  const s=$('.search'), inp=$('input',s), ul=$('.search-results',s);
  $('[data-search]').onclick=()=>{s.hidden=false;inp.focus();}; $('[data-close]',s).onclick=()=>s.hidden=true;
  addEventListener('keydown',e=>{if(e.key==='Escape')s.hidden=true;});
  inp.oninput=()=>{const q=inp.value.toLowerCase().trim(); ul.innerHTML = !q?'':(PRODUCTS.filter(p=>(p.name+p.material+p.movement+p.collection).toLowerCase().includes(q)).map(p=>`<li><a href="${href('product')}?id=${p.id}">${p.name}<span>${money(p.price)}</span></a></li>`).join('')||'<li class="muted">No watches match. Try “gold” or “automatic”.</li>');};
  const upd=()=>{$('[data-cc]').textContent=Cart.count(); $('[data-wc]').textContent=Wish.ids().length||'';};
  upd(); document.addEventListener('store',upd);
}

/* ---------- components ---------- */
const card = p => `<article class="card"><a class="card-img" href="${href('product')}?id=${p.id}">${watchImg(p,0)}${p.isNew?'<span class="tag">New</span>':''}</a>
  <button class="heart ${Wish.has(p.id)?'on':''}" data-wish="${p.id}" aria-label="Save ${p.name} to wishlist" aria-pressed="${Wish.has(p.id)}">♥</button>
  <div class="card-body"><div><h3><a href="${href('product')}?id=${p.id}">${p.name}</a></h3><p class="muted">${p.material}, ${p.size} mm</p></div><p class="price">${money(p.price)}</p></div>
  <button class="btn ghost" data-add="${p.id}">Add to cart</button></article>`;
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-add]'), w=e.target.closest('[data-wish]');
  if(a) Cart.add(a.dataset.add);
  if(w){ Wish.toggle(w.dataset.wish); if(PG==='wishlist') renderWishlist(); else {w.classList.toggle('on'); w.setAttribute('aria-pressed',w.classList.contains('on'));} }
});
const param = k => new URLSearchParams(location.search).get(k);

/* ---------- pages ---------- */
const pages = {
  index(){
    $('#hero-art').innerHTML = watchSVG(PRODUCTS[0],0,true);
    $('#featured').innerHTML = PRODUCTS.filter((_, i) => [1,2,3,5].includes(i)).map(card).join('');
    $('#craft-art').innerHTML = watchSVG(PRODUCTS[0],2,true);
  },
  collection(){
    const grid=$('#grid'), f={c:param('c')||'All',m:'All',s:'featured',q:param('q')||''};
    const cols=['All',...new Set(PRODUCTS.map(p=>p.collection))], mats=['All',...new Set(PRODUCTS.map(p=>p.material))];
    const chips=(id,arr,key)=>{ $(id).innerHTML=arr.map(v=>`<button class="chip ${f[key]===v?'on':''}" aria-pressed="${f[key]===v}">${v}</button>`).join(''); $$('button',$(id)).forEach(b=>b.onclick=()=>{f[key]=b.textContent;draw();}); };
    function draw(){
      chips('#f-col',cols,'c'); chips('#f-mat',mats,'m');
      let list=PRODUCTS.filter(p=>(f.c==='All'||p.collection===f.c)&&(f.m==='All'||p.material===f.m)&&(!f.q||(p.name+p.material+p.movement).toLowerCase().includes(f.q.toLowerCase())));
      if(f.s==='low') list.sort((a,b)=>a.price-b.price); if(f.s==='high') list.sort((a,b)=>b.price-a.price); if(f.s==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
      $('#count').textContent=`${list.length} watch${list.length===1?'':'es'}`;
      grid.innerHTML=list.map(card).join('')||'<p class="muted">No watches match these filters. Clear a filter to see more.</p>';
    }
    $('#sort').onchange=e=>{f.s=e.target.value;draw();}; draw();
  },
  product(){
    const p=PRODUCTS.find(x=>x.id===param('id'))||PRODUCTS[0]; document.title=`${p.name} — Maison Aurel`;
    const views=[0,1,2].map(v=>watchImg(p,v,false));
    $('#gallery').innerHTML=`<div class="gallery-main">${views[0]}</div><div class="thumbs">${views.map((h,i)=>`<button data-thumb data-html='${h.replace(/'/g,"&#39;")}' class="${i?'':'on'}" aria-label="View ${i+1}">${watchImg(p,i,false)}</button>`).join('')}</div>`;
    $('#info').innerHTML=`<p class="muted">${p.collection} · Ref. ${p.ref}</p><h1>${p.name}</h1><p class="price big">${money(p.price)}</p><p>${p.desc}</p>
     <dl class="specs">${[['Case',`${p.material}, ${p.size} mm`],['Movement',p.movement],['Strap',p.strap],['Water resistance','50 m']].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
     <div class="buy"><div class="qty"><button aria-label="Fewer">−</button><output>1</output><button aria-label="More">+</button></div><button class="btn" id="add">Add to cart</button><button class="btn ghost" data-wish="${p.id}">${Wish.has(p.id)?'Saved':'Save'}</button></div>`;
    let q=1; const o=$('output'); const [m,pl]=$$('.qty button'); m.onclick=()=>o.textContent=q=Math.max(1,q-1); pl.onclick=()=>o.textContent=q=Math.min(9,q+1);
    $('#add').onclick=()=>Cart.add(p.id,q);
    $('#related').innerHTML=PRODUCTS.filter(x=>x.id!==p.id&&x.collection===p.collection).concat(PRODUCTS.filter(x=>x.collection!==p.collection)).slice(0,3).map(card).join('');
  },
  wishlist(){ renderWishlist(); },
  cart(){ renderCart(); },
  contact(){ $('form').addEventListener('valid',()=>{ $('form').hidden=true; $('#sent').hidden=false; }); },
  'our-story'(){ $('#story-art').innerHTML=watchSVG(PRODUCTS[2],1); },
  craftsmanship(){ $('#macro-a').innerHTML=watchSVG(PRODUCTS[4],2,true); $('#macro-b').innerHTML=watchSVG(PRODUCTS[0],2); }
};
function renderWishlist(){
  const l=PRODUCTS.filter(p=>Wish.has(p.id));
  $('#wish-grid').innerHTML=l.map(card).join('')||`<p class="empty">Nothing saved yet. Tap the heart on any watch to keep it here.<br><a class="btn" href="${href('collection')}">Browse the collection</a></p>`;
}
function renderCart(){
  const items=Cart.items(), box=$('#cart-items');
  const done=!$('#done').hidden;
  $('#cart-layout').hidden=done||!items.length;
  $('#empty').hidden=done||!!items.length;
  box.innerHTML=items.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return `<li class="line"><a class="thumb" href="${href('product')}?id=${p.id}">${watchImg(p,0)}</a><div><h3>${p.name}</h3><p class="muted">${p.material}, ${p.strap}</p><button class="link" data-rm="${p.id}">Remove</button></div>
   <div class="qty"><button data-dec="${p.id}" aria-label="Fewer">−</button><output>${i.qty}</output><button data-inc="${p.id}" aria-label="More">+</button></div><p class="price">${money(p.price*i.qty)}</p></li>`;}).join('');
  const sub=Cart.total(), ship=sub>0?0:0;
  $('#sum').innerHTML=`<div><span>Subtotal</span><span>${money(sub)}</span></div><div><span>Insured delivery</span><span>Free</span></div><div class="tot"><span>Total</span><span>${money(sub+ship)}</span></div>`;
}
document.addEventListener('click',e=>{
  if(PG!=='cart') return; const t=e.target, id=t.dataset.rm||t.dataset.inc||t.dataset.dec; if(!id) return;
  const it=Cart.items().find(i=>i.id===id);
  if(t.dataset.rm) Cart.remove(id); else Cart.setQty(id,it.qty+(t.dataset.inc?1:-1)); renderCart();
});

chrome();
pages[PG]?.();
if(PG==='cart') $('#checkout').addEventListener('valid',()=>{ $('#order-no').textContent='MA-'+Math.floor(100000+Math.random()*900000); Cart.clear(); $('#cart-layout').hidden=true; $('#empty').hidden=true; $('#done').hidden=false; scrollTo(0,0); });
