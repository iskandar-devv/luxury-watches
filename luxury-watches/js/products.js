/* Product data. `image` files in assets/images/ are tried first
   (<id>-front.jpg, -angle.jpg, -detail.jpg); if missing, a generated SVG portrait is used. */
const PRODUCTS = [
 {id:'souverain',name:'Calibre Souverain',ref:'MA-01',price:48500,collection:'Grande Complication',material:'Rose gold',size:40,movement:'Manual, open-worked',strap:'Black alligator',dial:'#15110e',metal:'#c58f68',desc:'An open-worked calibre in rose gold, rhodium and blued steel. Six layers, one controlled reveal.',isNew:true},
 {id:'disco-verde',name:'Disco Verde',ref:'MA-02',price:2500,collection:'Everyday',material:'Steel',size:38,movement:'Manual, Peseux 7001',strap:'Green grained calf',dial:'#2f5a3a',metal:'#cfd2d4',desc:'A 38mm steel case with a two-level green dial and a running small seconds at six.',isNew:true},
 {id:'meridien',name:'Meridien GMT',ref:'MA-03',price:12800,collection:'Voyage',material:'Rose gold',size:41,movement:'Automatic, GMT',strap:'Chestnut calf',dial:'#e9e0cf',metal:'#c9966f',desc:'A second time zone on a skeleton-hand arc. Made for the long way home.',isNew:false},
 {id:'ivoire',name:'Ivoire Classique',ref:'MA-04',price:6400,collection:'Everyday',material:'Yellow gold',size:36,movement:'Automatic',strap:'Cream suede',dial:'#efe7d6',metal:'#d9b974',desc:'A quiet dress watch with a champagne dial and slim lugs.',isNew:false},
 {id:'nocturne',name:'Nocturne Tourbillon',ref:'MA-05',price:72000,collection:'Grande Complication',material:'Platinum',size:42,movement:'Manual, tourbillon',strap:'Black alligator',dial:'#0e0d0c',metal:'#d6d8da',desc:'A one-minute tourbillon seen through a sapphire aperture at six.',isNew:false},
 {id:'havane',name:'Havane Chronograph',ref:'MA-06',price:9200,collection:'Voyage',material:'Steel',size:40,movement:'Automatic chronograph',strap:'Tobacco calf',dial:'#6a4a33',metal:'#bfc3c6',desc:'Warm brown sub-dials, a tachymeter scale and a screw-down crown.',isNew:false},
 {id:'aube',name:'Aube Petite Seconde',ref:'MA-07',price:5900,collection:'Everyday',material:'Rose gold',size:37,movement:'Manual',strap:'Sand nubuck',dial:'#d8c7ab',metal:'#c58f68',desc:'A soft sand dial and a hand-wound movement in a case polished by hand over two days.',isNew:false},
 {id:'regent',name:'Regent Perpetual',ref:'MA-08',price:31500,collection:'Grande Complication',material:'Yellow gold',size:40,movement:'Automatic, perpetual calendar',strap:'Brown alligator',dial:'#1d1814',metal:'#d9b974',desc:'A perpetual calendar that will not need correcting until 2100.',isNew:false}
];
const money = n => '€' + n.toLocaleString('en-US');
const ROOT = () => document.body.dataset.root || '';

/* Generated watch portraits: view 0 face, 1 three-quarter, 2 movement macro */
function watchSVG(p, view = 0, live = false) {
  const light = ['#e9e0cf','#efe7d6','#d8c7ab'].includes(p.dial);
  const ink = light ? '#2a211a' : '#efe3cb', g = p.id + view + (live ? 'L' : '');
  const ticks = [...Array(12)].map((_, i) => `<rect x="198" y="186" width="${i%3?2:4}" height="${i%3?10:18}" fill="${ink}" opacity=".85" transform="rotate(${i*30} 200 300)"/>`).join('');
  const gears = [[200,300,70],[150,350,38],[255,255,30],[245,355,24]].map(([x,y,r]) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${p.metal}" stroke-width="5" stroke-dasharray="3 3"/><circle cx="${x}" cy="${y}" r="${r*.18}" fill="#b01e4f"/>`).join('');
  const hands = `<g class="hr" style="transform-origin:200px 300px"><path d="M200 300 L190 240 L200 208 L210 240Z" fill="${ink}"/></g>
   <g class="mn" style="transform-origin:200px 300px"><path d="M200 300 L195 220 L200 176 L205 220Z" fill="${ink}"/></g><circle cx="200" cy="300" r="6" fill="${p.metal}"/>`;
  const inner = view === 2 ? gears : `${ticks}<text x="200" y="256" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="3" fill="${ink}">MAISON AUREL</text><circle cx="200" cy="350" r="22" fill="none" stroke="${ink}" opacity=".5"/>${hands}`;
  const style = live ? '<style>.hr{animation:s 240s linear infinite}.mn{animation:s 20s linear infinite}@keyframes s{to{transform:rotate(360deg)}}</style>' : '<style>.hr{transform:rotate(305deg)}.mn{transform:rotate(60deg)}</style>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view===2?'110 190 180 180':'0 0 400 600'}" preserveAspectRatio="xMidYMid slice">${style}<defs>
   <radialGradient id="d${g}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="${p.dial}"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
   <linearGradient id="c${g}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".45" stop-color="${p.metal}"/><stop offset="1" stop-color="#2a1e16"/></linearGradient>
   <radialGradient id="g${g}" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#2b2420"/><stop offset="1" stop-color="#0a0908"/></radialGradient></defs>
   <rect width="400" height="600" fill="url(#g${g})"/>
   <g transform="${view===1?'rotate(-14 200 300)':''}"><path d="M150 0h100l8 190H142zM142 410h116l-8 190H150z" fill="#2a1d16"/><path d="M158 0v190M242 0v190M158 410v190M242 410v190" stroke="#c9a97a" stroke-opacity=".35" stroke-dasharray="4 4"/>
   <rect x="326" y="288" width="22" height="24" rx="5" fill="url(#c${g})"/>
   <circle cx="200" cy="300" r="134" fill="url(#c${g})"/><circle cx="200" cy="300" r="118" fill="#0a0908"/><circle cx="200" cy="300" r="112" fill="${view===2?'#14100d':`url(#d${g})`}"/>${inner}
   <path d="M110 220a120 120 0 0 1 120-60" stroke="#fff" stroke-opacity=".18" stroke-width="10" fill="none" stroke-linecap="round"/></g></svg>`;
}
const svgURI = s => 'data:image/svg+xml;utf8,' + encodeURIComponent(s);
function watchImg(p, view = 0, lazy = true) {
  const n = ['front','angle','detail'][view], alt = ['front view','three-quarter view','movement detail'][view];
  return `<img src="${ROOT()}assets/images/${p.id}-${n}.jpg" alt="${p.name}, ${alt}" ${lazy?'loading="lazy"':''} onerror="this.onerror=null;this.src='${svgURI(watchSVG(p,view))}'">`;
}
