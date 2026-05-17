// screen-home.jsx — Recipe feed (mobile)

function ScreenHome({ onOpenRecipe, onNav, navActive = 'home' }) {
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('All');
  const filters = ['All', 'Favorites', 'Quick', 'Vegetarian', 'Dessert', 'Sunday'];

  const list = FOOD.filter(r => {
    if (filter === 'Favorites' && !r.fav) return false;
    if (filter === 'Quick' && r.time > 30) return false;
    if (filter !== 'All' && filter !== 'Favorites' && filter !== 'Quick') {
      if (!r.tags.some(t => t === filter)) return false;
    }
    if (q && !r.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="app fadein" style={{ height:'100%', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      {/* Status bar spacer */}
      <div style={{ height: 54 }} />

      {/* Header */}
      <div style={{ padding:'8px 22px 14px' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--terracotta)' }}>Vol. 04 · Late Summer</div>
            <h1 className="serif" style={{ margin:'4px 0 0', fontSize:42, lineHeight:1, fontWeight:500, letterSpacing:-0.01 }}>
              Your <em style={{ fontStyle:'italic', color:'var(--terracotta)' }}>cookbook</em>
            </h1>
          </div>
          <button style={{
            width:42, height:42, borderRadius:'50%', border:'1px solid var(--rule-2)',
            background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center',
            color:'var(--ink)',
          }}>
            <Icon.user />
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding:'0 22px 12px' }}>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ flex:1 }}><SearchField value={q} onChange={setQ} /></div>
          <button style={{
            width:46, height:46, borderRadius:14, border:'none',
            background:'var(--ink)', color:'var(--surface)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon.filter />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="scroll" style={{ overflowX:'auto', padding:'4px 22px 14px' }}>
        <div style={{ display:'flex', gap:8, width:'max-content' }}>
          {filters.map(f => {
            const on = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  height:34, padding:'0 14px', borderRadius:999,
                  border: on ? 'none' : '1px solid var(--rule-2)',
                  background: on ? 'var(--ink)' : 'transparent',
                  color: on ? 'var(--surface)' : 'var(--ink-2)',
                  fontSize:12.5, fontWeight:600, letterSpacing:-0.01,
                  whiteSpace:'nowrap',
                }}>{f}</button>
            );
          })}
        </div>
      </div>

      {/* Section: featured (single tall card) */}
      <div className="scroll" style={{ flex:1, overflowY:'auto', paddingBottom: 120 }}>
        <div style={{ padding:'0 22px 22px' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12 }}>
            <h2 className="serif" style={{ margin:0, fontSize:22, fontWeight:500 }}>Tonight's pick</h2>
            <span style={{ fontSize:11, color:'var(--ink-soft)', fontWeight:600, letterSpacing:0.04, textTransform:'uppercase' }}>Editor</span>
          </div>

          {/* Featured card */}
          <div onClick={() => onOpenRecipe && onOpenRecipe(list[0] || FOOD[0])}
            role="button" tabIndex={0}
            style={{
              width:'100%', cursor:'pointer',
              borderRadius:22, overflow:'hidden', position:'relative',
              background:'#000', boxShadow:'var(--shadow-card)',
            }}>
            <div style={{ position:'relative', aspectRatio:'4/5', overflow:'hidden' }}>
              <FoodImg src={(list[0]||FOOD[0]).img} tone={(list[0]||FOOD[0]).tone} label={(list[0]||FOOD[0]).title} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(20,15,10,0.75) 100%)' }} />
              {/* Favorite */}
              <button onClick={(e) => e.stopPropagation()} style={{
                position:'absolute', top:14, right:14,
                width:38, height:38, borderRadius:'50%',
                background:'rgba(0,0,0,0.32)', backdropFilter:'blur(12px)',
                border:'1px solid rgba(255,255,255,0.18)',
                color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon.heartF />
              </button>
              {/* Tags overlay */}
              <div style={{ position:'absolute', top:14, left:14, display:'flex', gap:6 }}>
                <span className="chip dark">{(list[0]||FOOD[0]).tags[0]}</span>
                <span className="chip dark">{(list[0]||FOOD[0]).time} min</span>
              </div>
              {/* Title block */}
              <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'18px 20px 20px', color:'#fff' }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', opacity:0.85 }}>
                  Recipe № {String(FOOD.indexOf(list[0]||FOOD[0])+12).padStart(3,'0')}
                </div>
                <h3 className="serif" style={{ margin:'4px 0 4px', fontSize:30, lineHeight:1.05, fontWeight:500 }}>
                  {(list[0]||FOOD[0]).title}
                </h3>
                <div style={{ fontSize:13, opacity:0.85, fontStyle:'italic' }} className="serif">{(list[0]||FOOD[0]).sub}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: From your cookbook (grid) */}
        <div style={{ padding:'0 22px' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
            <h2 className="serif" style={{ margin:0, fontSize:22, fontWeight:500 }}>From your cookbook</h2>
            <span style={{ fontSize:12, color:'var(--ink-muted)', fontWeight:600 }}>{list.length} recipes</span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, columnGap:12 }}>
            {list.slice(1).map((r, i) => (
              <SmallCard key={r.id} r={r} onClick={() => onOpenRecipe && onOpenRecipe(r)} tall={i % 3 === 1} />
            ))}
          </div>
        </div>

        <div style={{ height: 40 }} />
      </div>

      <BottomNav active={navActive} onNav={onNav} />
    </div>
  );
}

function SmallCard({ r, onClick, tall }) {
  return (
    <div onClick={onClick} role="button" tabIndex={0} style={{
      cursor:'pointer', borderRadius:18, overflow:'hidden', position:'relative',
    }}>
      <div style={{ position:'relative', aspectRatio: tall ? '3/4.2' : '3/3.4', borderRadius:18, overflow:'hidden', background:'#e9dfcd' }}>
        <FoodImg src={r.img} tone={r.tone} label={r.title} />
        <button onClick={(e) => e.stopPropagation()} style={{
          position:'absolute', top:8, right:8, width:30, height:30, borderRadius:'50%',
          background:'rgba(251,247,239,0.85)', backdropFilter:'blur(10px)',
          border:'1px solid rgba(31,26,20,0.06)', color: r.fav ? 'var(--terracotta)' : 'var(--ink-muted)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {r.fav ? <Icon.heartF /> : <Icon.heart />}
        </button>
        <div style={{
          position:'absolute', left:8, bottom:8, display:'flex', gap:4,
        }}>
          <span style={{
            display:'inline-flex', alignItems:'center', gap:4,
            height:22, padding:'0 8px', borderRadius:999, fontSize:10.5, fontWeight:600,
            background:'rgba(31,26,20,0.7)', color:'#FBF7EF',
            backdropFilter:'blur(8px)',
          }}>
            <Icon.clock /> {r.time}m
          </span>
        </div>
      </div>
      <div style={{ padding:'10px 4px 4px' }}>
        <h4 className="serif" style={{ margin:0, fontSize:18, lineHeight:1.12, fontWeight:500, color:'var(--ink)' }}>
          {r.title}
        </h4>
        <div style={{ marginTop:4, fontSize:11.5, color:'var(--ink-soft)', display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:3 }}><Icon.flame />{r.diff}</span>
          <span>·</span>
          <span>{r.tags[0]}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenHome, SmallCard });
