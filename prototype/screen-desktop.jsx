// screen-desktop.jsx — Desktop home view (editorial-style)

function ScreenDesktop() {
  return (
    <div className="app fadein" style={{
      width:'100%', height:'100%', overflow:'hidden', background:'var(--bg)',
      display:'flex',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 232, flexShrink:0, padding:'28px 18px 24px',
        background:'var(--surface)', borderRight:'1px solid var(--rule)',
        display:'flex', flexDirection:'column',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'0 8px 22px' }}>
          <div style={{
            width:32, height:32, borderRadius:8, background:'var(--ink)',
            display:'flex', alignItems:'center', justifyContent:'center', color:'var(--honey)',
            fontFamily:'var(--serif)', fontSize:20, fontWeight:600, fontStyle:'italic',
          }}>m</div>
          <div>
            <div className="serif" style={{ fontSize:17, fontWeight:600, lineHeight:1 }}>Mise</div>
            <div style={{ fontSize:10, color:'var(--ink-soft)', letterSpacing:'0.14em', textTransform:'uppercase', marginTop:2 }}>Cookbook</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {[
            ['Home',        Icon.home,     true],
            ['Search',      Icon.search,   false],
            ['Favorites',   Icon.heart,    false],
            ['My Cookbook', Icon.book,     false],
          ].map(([label, I, on]) => (
            <button key={label} style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'9px 10px', borderRadius:10, border:'none',
              background: on ? 'var(--paper)' : 'transparent',
              color: on ? 'var(--ink)' : 'var(--ink-muted)',
              boxShadow: on ? '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)' : 'none',
              fontSize:13.5, fontWeight: on ? 700 : 500, textAlign:'left',
            }}>
              <I /> {label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop:24, fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-soft)', padding:'0 10px 8px' }}>
          Collections
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {[
            ['Weeknight quick',   '12'],
            ['Sunday slow',       '8'],
            ['Vegetarian',        '22'],
            ['Sweet things',      '14'],
            ['Imported · grandma','9'],
          ].map(([t, n]) => (
            <button key={t} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'8px 10px', borderRadius:10, border:'none',
              background:'transparent', color:'var(--ink-2)',
              fontSize:13, fontWeight:500, textAlign:'left',
            }}>
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--olive)', opacity:0.5 }} />
                {t}
              </span>
              <span style={{ fontSize:11, color:'var(--ink-soft)' }}>{n}</span>
            </button>
          ))}
        </div>

        <div style={{ flex:1 }} />

        {/* Import card */}
        <div style={{
          padding:'14px 14px', background:'var(--ink)', color:'var(--surface)',
          borderRadius:14, display:'flex', alignItems:'center', gap:10,
        }}>
          <div style={{ color:'var(--honey)' }}><Icon.upload /></div>
          <div style={{ flex:1, fontSize:12, lineHeight:1.3 }}>
            <div className="serif" style={{ fontSize:14, fontWeight:600 }}>Import .docx</div>
            <div style={{ opacity:0.6 }}>Bring in your archive</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, overflowY:'auto' }} className="scroll">
        {/* Header bar */}
        <div style={{
          position:'sticky', top:0, zIndex:5,
          padding:'18px 36px', display:'flex', alignItems:'center', gap:14,
          background:'rgba(240,233,220,0.85)', backdropFilter:'blur(12px)',
          borderBottom:'1px solid var(--rule)',
        }}>
          <div style={{ flex:1, maxWidth:520 }}>
            <SearchField placeholder="Search 56 recipes, ingredients, or tags…" />
          </div>
          <div style={{ flex:1 }} />
          <button style={{
            height:42, padding:'0 16px', borderRadius:12,
            background:'transparent', border:'1px solid var(--rule-2)', color:'var(--ink-2)',
            fontSize:13, fontWeight:600, display:'inline-flex', alignItems:'center', gap:8,
          }}>
            <Icon.filter /> Filters
          </button>
          <button style={{
            height:42, padding:'0 18px', borderRadius:12,
            background:'var(--terracotta)', color:'#fff', border:'none',
            fontSize:13, fontWeight:700, display:'inline-flex', alignItems:'center', gap:8,
          }}>
            <Icon.plus /> New recipe
          </button>
        </div>

        {/* Editorial hero */}
        <div style={{ padding:'34px 36px 24px' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--terracotta)' }}>Vol. 04 · Late Summer</div>
              <h1 className="serif" style={{ margin:'6px 0 0', fontSize:54, lineHeight:1, fontWeight:500, letterSpacing:-0.005 }}>
                The <em style={{ fontStyle:'italic', color:'var(--terracotta)' }}>kitchen</em> tonight
              </h1>
            </div>
            <div style={{ textAlign:'right' }} className="serif">
              <div style={{ fontSize:13, color:'var(--ink-muted)', fontStyle:'italic' }}>Friday, 22 August</div>
              <div style={{ fontSize:13, color:'var(--ink-muted)', fontStyle:'italic' }}>23° · clear · open windows</div>
            </div>
          </div>

          {/* Hero grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20 }}>
            <DesktopFeature r={FOOD[0]} />
            <div style={{ display:'grid', gridTemplateRows:'1fr 1fr', gap:20 }}>
              <DesktopRecipeWide r={FOOD[3]} />
              <DesktopRecipeWide r={FOOD[1]} />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ padding:'18px 36px 60px' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
            <h2 className="serif" style={{ margin:0, fontSize:28, fontWeight:500 }}>From your cookbook</h2>
            <div style={{ display:'flex', gap:6 }}>
              {['All','Quick','Vegetarian','Sweet','Sunday'].map((f, i) => (
                <button key={f} style={{
                  height:32, padding:'0 14px', borderRadius:999,
                  background: i===0 ? 'var(--ink)' : 'transparent',
                  color: i===0 ? 'var(--surface)' : 'var(--ink-2)',
                  border: i===0 ? 'none' : '1px solid var(--rule-2)',
                  fontSize:12.5, fontWeight:600,
                }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20 }}>
            {FOOD.slice(2).map(r => <DesktopCard key={r.id} r={r} />)}
          </div>
        </div>
      </main>
    </div>
  );
}

function DesktopFeature({ r }) {
  return (
    <div style={{
      position:'relative', borderRadius:22, overflow:'hidden',
      aspectRatio:'4/5', background:'#000', boxShadow:'var(--shadow-card)',
    }}>
      <FoodImg src={r.img} tone={r.tone} label={r.title} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(20,15,10,0.78) 100%)' }} />
      <div style={{ position:'absolute', top:18, left:18, display:'flex', gap:6 }}>
        <span className="chip dark">Editor's pick</span>
      </div>
      <button style={{
        position:'absolute', top:18, right:18, width:42, height:42, borderRadius:'50%',
        background:'rgba(0,0,0,0.32)', backdropFilter:'blur(12px)',
        border:'1px solid rgba(255,255,255,0.18)',
        color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
      }}><Icon.heartF /></button>
      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'28px 30px', color:'#fff' }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', opacity:0.85 }}>
          Recipe № 012 · Italian
        </div>
        <h3 className="serif" style={{ margin:'8px 0 6px', fontSize:46, lineHeight:1.0, fontWeight:500 }}>
          {r.title}
        </h3>
        <div className="serif" style={{ fontStyle:'italic', fontSize:17, opacity:0.85 }}>{r.sub}</div>
        <div style={{ marginTop:14, display:'flex', gap:14, fontSize:12, opacity:0.85 }}>
          <span style={{ display:'inline-flex', gap:5, alignItems:'center' }}><Icon.clock />{r.time} min</span>
          <span>·</span><span>{r.diff}</span>
          <span>·</span><span>4 servings</span>
        </div>
      </div>
    </div>
  );
}

function DesktopRecipeWide({ r }) {
  return (
    <div style={{
      position:'relative', borderRadius:18, overflow:'hidden',
      display:'flex', background:'var(--card)', boxShadow:'var(--shadow-card)',
      border:'1px solid var(--rule)',
    }}>
      <div style={{ width:'42%', flexShrink:0, position:'relative' }}>
        <FoodImg src={r.img} tone={r.tone} label={r.title} />
      </div>
      <div style={{ flex:1, padding:'20px 22px', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', gap:6, marginBottom:6 }}>
          {r.tags.slice(0,2).map(t => <span key={t} className="chip">{t}</span>)}
        </div>
        <h3 className="serif" style={{ margin:'2px 0 4px', fontSize:24, lineHeight:1.05, fontWeight:500 }}>
          {r.title}
        </h3>
        <div className="serif" style={{ fontStyle:'italic', fontSize:14, color:'var(--ink-muted)', lineHeight:1.35 }}>{r.sub}</div>
        <div style={{ flex:1 }} />
        <div style={{ display:'flex', gap:12, fontSize:12, color:'var(--ink-muted)' }}>
          <span style={{ display:'inline-flex', gap:5, alignItems:'center' }}><Icon.clock />{r.time} min</span>
          <span>·</span><span>{r.diff}</span>
        </div>
      </div>
    </div>
  );
}

function DesktopCard({ r }) {
  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'relative', aspectRatio:'4/5', borderRadius:14, overflow:'hidden', background:'#e9dfcd' }}>
        <FoodImg src={r.img} tone={r.tone} label={r.title} />
        <button style={{
          position:'absolute', top:10, right:10, width:32, height:32, borderRadius:'50%',
          background:'rgba(251,247,239,0.88)', backdropFilter:'blur(10px)',
          border:'1px solid rgba(31,26,20,0.06)', color: r.fav ? 'var(--terracotta)' : 'var(--ink-muted)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>{r.fav ? <Icon.heartF /> : <Icon.heart />}</button>
        <div style={{ position:'absolute', left:10, bottom:10 }}>
          <span style={{
            display:'inline-flex', alignItems:'center', gap:4,
            height:24, padding:'0 9px', borderRadius:999, fontSize:11, fontWeight:600,
            background:'rgba(31,26,20,0.7)', color:'#FBF7EF', backdropFilter:'blur(8px)',
          }}>
            <Icon.clock /> {r.time}m
          </span>
        </div>
      </div>
      <h4 className="serif" style={{ margin:'12px 0 4px', fontSize:21, fontWeight:500, lineHeight:1.1 }}>
        {r.title}
      </h4>
      <div style={{ fontSize:12, color:'var(--ink-muted)', display:'flex', gap:8 }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:3 }}><Icon.flame />{r.diff}</span>
        <span>·</span><span>{r.tags[0]}</span>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenDesktop });
