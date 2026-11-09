const Store = {
  get(k){ try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } },
  set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} document.dispatchEvent(new Event('store')); }
};
const Cart = {
  items: () => Store.get('maison-cart'),
  count: () => Cart.items().reduce((n,i)=>n+i.qty,0),
  total: () => Cart.items().reduce((s,i)=>s+i.qty*PRODUCTS.find(p=>p.id===i.id).price,0),
  add(id,qty=1){ const a=Cart.items(), f=a.find(i=>i.id===id); f?f.qty+=qty:a.push({id,qty}); Store.set('maison-cart',a); toast('Added to cart'); },
  setQty(id,q){ Store.set('maison-cart',Cart.items().map(i=>i.id===id?{...i,qty:Math.max(1,Math.min(9,q))}:i)); },
  remove(id){ Store.set('maison-cart',Cart.items().filter(i=>i.id!==id)); },
  clear(){ Store.set('maison-cart',[]); }
};
