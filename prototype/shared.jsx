// shared.jsx — icons, atoms, sample recipe data

const FOOD = [
  { id: 'r1', title: 'Saffron Risotto',           sub: 'with brown butter & sage',     img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=80&auto=format&fit=crop', tone: '#D4A24C', time: 35, diff: 'Easy',   tags: ['Italian', 'Vegetarian'], fav: true,  ratio: 1.25 },
  { id: 'r2', title: 'Miso-Glazed Aubergine',     sub: 'sesame, scallion, jasmine rice',img: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=900&q=80&auto=format&fit=crop', tone: '#5C6B3F', time: 45, diff: 'Medium', tags: ['Japanese', 'Vegan'],     fav: false, ratio: 1.0 },
  { id: 'r3', title: 'Tartine, Heirloom Tomato',  sub: 'sourdough, basil, sea salt',   img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=900&q=80&auto=format&fit=crop', tone: '#B8543F', time: 12, diff: 'Easy',   tags: ['Summer', 'Vegetarian'],  fav: true,  ratio: 1.35 },
  { id: 'r4', title: 'Slow-Braised Short Rib',    sub: 'red wine, garlic confit',      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80&auto=format&fit=crop', tone: '#6B3F4C', time: 180, diff: 'Hard',  tags: ['Sunday', 'Comfort'],     fav: false, ratio: 1.1 },
  { id: 'r5', title: 'Lemon Olive-Oil Cake',      sub: 'rosemary, sea salt, mascarpone',img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&q=80&auto=format&fit=crop', tone: '#D4A24C', time: 55, diff: 'Easy',   tags: ['Dessert'],               fav: true,  ratio: 1.3 },
  { id: 'r6', title: 'Charred Broccolini',        sub: 'anchovy, chili, lemon',        img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80&auto=format&fit=crop', tone: '#5C6B3F', time: 18, diff: 'Easy',   tags: ['Side', 'Quick'],         fav: false, ratio: 0.95 },
  { id: 'r7', title: 'Buttermilk Pancakes',       sub: 'cultured butter, maple',       img: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=900&q=80&auto=format&fit=crop', tone: '#D4A24C', time: 25, diff: 'Easy',   tags: ['Breakfast'],             fav: false, ratio: 1.2 },
  { id: 'r8', title: 'Roast Chicken & Lemons',    sub: 'thyme, garlic, pan jus',       img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=900&q=80&auto=format&fit=crop', tone: '#B8543F', time: 90, diff: 'Medium', tags: ['Sunday'],                fav: true,  ratio: 1.0 },
];

// — Inline SVG icons (stroke 1.6, currentColor) —
const Icon = {
  search: (p={}) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="9" cy="9" r="6"/><path d="m14 14 4 4"/></svg>,
  filter: (p={}) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M3 5h14M5.5 10h9M8 15h4"/></svg>,
  plus:   (p={}) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M10 4v12M4 10h12"/></svg>,
  heart:  (p={}) => <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}><path d="M10 16.5s-6-3.7-6-8a3.5 3.5 0 0 1 6-2.45A3.5 3.5 0 0 1 16 8.5c0 4.3-6 8-6 8z"/></svg>,
  heartF: (p={}) => <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" {...p}><path d="M10 17s-7-4.2-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 17 8c0 4.8-7 9-7 9z"/></svg>,
  clock:  (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><circle cx="8" cy="8" r="6.2"/><path d="M8 4.5V8l2.4 1.5"/></svg>,
  flame:  (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" {...p}><path d="M8 1.5c2 2 3.5 3.5 3.5 6a3.5 3.5 0 1 1-7 0c0-1.4.6-2.3 1.5-3 0 1.2.5 1.6 1 1.6 0-1.7.4-3.2 1-4.6z"/></svg>,
  home:   (p={}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}><path d="M3 10 11 3l8 7v8a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1z"/></svg>,
  book:   (p={}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H17v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 1 5.5 18H17"/></svg>,
  user:   (p={}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="11" cy="8" r="3.6"/><path d="M4 19c1.4-3.2 4-4.8 7-4.8s5.6 1.6 7 4.8"/></svg>,
  chev:   (p={}) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m6 4 6 5-6 5"/></svg>,
  back:   (p={}) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m12 4-6 5 6 5"/></svg>,
  share:  (p={}) => <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 3v9M6.5 6 10 3l3.5 3M5 12v3.5A1.5 1.5 0 0 0 6.5 17h7a1.5 1.5 0 0 0 1.5-1.5V12"/></svg>,
  bookmark:(p={})=> <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}><path d="M5 3h10v15l-5-3-5 3z"/></svg>,
  doc:    (p={}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" {...p}><path d="M5 3h8l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M13 3v4h4M7 11h8M7 14h8M7 17h5"/></svg>,
  upload: (p={}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" {...p}><path d="M11 14V4M7 8l4-4 4 4M4 16v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2"/></svg>,
  camera: (p={}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" {...p}><path d="M4 7h3l1.5-2h5L15 7h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="11" cy="12.5" r="3.2"/></svg>,
  trash:  (p={}) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...p}><path d="M3 5h10M6 5V3.5A.5.5 0 0 1 6.5 3h3a.5.5 0 0 1 .5.5V5M5 5l.7 8a1 1 0 0 0 1 .9h2.6a1 1 0 0 0 1-.9L11 5"/></svg>,
  drag:   (p={}) => <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" {...p}><circle cx="4" cy="3" r="1.1"/><circle cx="8" cy="3" r="1.1"/><circle cx="4" cy="8" r="1.1"/><circle cx="8" cy="8" r="1.1"/><circle cx="4" cy="13" r="1.1"/><circle cx="8" cy="13" r="1.1"/></svg>,
  check:  (p={}) => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m2.5 6.5 2.5 2.5 4.5-5.5"/></svg>,
  minus:  (p={}) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M4 8h8"/></svg>,
  add:    (p={}) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M8 4v8M4 8h8"/></svg>,
  sparkle:(p={}) => <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" {...p}><path d="M7 0l1.4 4.2L13 6 8.4 7.4 7 12l-1.4-4.6L1 6l4.6-1.8z"/></svg>,
  x:      (p={}) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M4 4l8 8M12 4l-8 8"/></svg>,
};

// — Tag chip —
function Chip({ kind = '', children }) {
  return <span className={`chip ${kind}`}>{children}</span>;
}

// — Bottom nav (mobile) —
function BottomNav({ active = 'home', onNav }) {
  const items = [
    ['home',   'Home',     Icon.home],
    ['search', 'Search',   Icon.search],
    ['add',    '',         Icon.plus],   // center FAB-style
    ['book',   'Cookbook', Icon.book],
    ['profile','Profile',  Icon.user],
  ];
  return (
    <div style={{
      position:'absolute', left:0, right:0, bottom:0, paddingBottom: 28,
      background:'linear-gradient(180deg, rgba(240,233,220,0) 0%, rgba(240,233,220,0.95) 40%, var(--bg) 100%)',
      paddingTop: 14, zIndex: 30,
    }}>
      <div style={{
        margin:'0 14px', height:64, borderRadius:36,
        background:'rgba(251,247,239,0.85)',
        backdropFilter:'blur(20px) saturate(180%)',
        WebkitBackdropFilter:'blur(20px) saturate(180%)',
        border:'1px solid rgba(31,26,20,0.06)',
        boxShadow:'0 1px 2px rgba(31,26,20,0.04), 0 12px 30px rgba(31,26,20,0.10)',
        display:'flex', alignItems:'center', justifyContent:'space-around',
        padding:'0 6px',
      }}>
        {items.map(([k, label, I]) => {
          if (k === 'add') {
            return (
              <button key={k} onClick={() => onNav && onNav('add')}
                aria-label="Add recipe"
                style={{
                  width:50, height:50, borderRadius:'50%',
                  background:'var(--ink)', color:'var(--surface)',
                  border:'none', display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 6px 16px rgba(31,26,20,0.28)', flexShrink:0,
                }}>
                <I />
              </button>
            );
          }
          const on = k === active;
          return (
            <button key={k} onClick={() => onNav && onNav(k)}
              style={{
                background:'transparent', border:'none', color: on ? 'var(--terracotta)' : 'var(--ink-soft)',
                display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                padding:'6px 10px', minWidth:54,
              }}>
              <I />
              <span style={{ fontSize:10, fontWeight:600, letterSpacing:0.02, textTransform:'uppercase' }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// — Floating action button (alternate, used in non-tabbed views) —
function FAB({ onClick, label = 'New' }) {
  return (
    <button onClick={onClick}
      style={{
        position:'absolute', right:18, bottom:104, zIndex:25,
        height:54, padding:'0 22px 0 18px', borderRadius:32,
        background:'var(--terracotta)', color:'#fff', border:'none',
        display:'flex', alignItems:'center', gap:8,
        fontFamily:'var(--sans)', fontSize:14, fontWeight:700, letterSpacing:-0.01,
        boxShadow:'0 4px 10px rgba(184,84,63,0.25), 0 14px 30px rgba(184,84,63,0.30)',
      }}>
      <Icon.plus />
      <span>{label}</span>
    </button>
  );
}

// — Small generic search field —
function SearchField({ placeholder = 'Search recipes…', value, onChange }) {
  return (
    <label style={{
      display:'flex', alignItems:'center', gap:10,
      height:46, padding:'0 16px', borderRadius:14,
      background:'rgba(31,26,20,0.05)', color:'var(--ink-muted)',
    }}>
      <Icon.search />
      <input value={value || ''} onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:15, color:'var(--ink)' }} />
    </label>
  );
}

// — Robust image: gradient fallback if Unsplash 404s —
function FoodImg({ src, alt = '', tone = '#B8543F', style = {}, label }) {
  const [ok, setOk] = React.useState(true);
  if (!ok) {
    return (
      <div style={{
        width: '100%', height: '100%', ...style,
        background:
          `radial-gradient(120% 100% at 30% 20%, ${tone}33 0%, transparent 55%),` +
          `radial-gradient(120% 100% at 80% 80%, ${tone}66 0%, ${tone}22 60%),` +
          `linear-gradient(135deg, #d9c5a1 0%, #b89a75 100%)`,
        position: 'relative',
      }}>
        {label && (
          <div style={{
            position: 'absolute', left: 10, bottom: 8,
            fontFamily: 'var(--mono)', fontSize: 10,
            color: 'rgba(255,255,255,0.75)', letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>{label}</div>
        )}
      </div>
    );
  }
  return (
    <img src={src} alt={alt} onError={() => setOk(false)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />
  );
}

Object.assign(window, { FOOD, Icon, Chip, BottomNav, FAB, SearchField, FoodImg });
