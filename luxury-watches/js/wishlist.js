const Wish = {
  ids: () => Store.get('maison-wish'),
  has: id => Wish.ids().includes(id),
  toggle(id){ const a=Wish.ids(), on=a.includes(id); Store.set('maison-wish', on?a.filter(x=>x!==id):[...a,id]); toast(on?'Removed from wishlist':'Saved to wishlist'); }
};
