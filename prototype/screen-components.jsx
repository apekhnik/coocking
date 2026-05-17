// screen-components.jsx — Component showcase artboard

function ScreenComponents() {
  const [checked, setChecked] = React.useState({ 0: true, 2: true });

  return (
    <div className="app scroll" style={{ height:'100%', overflowY:'auto', background:'var(--surface)', padding:'40px 36px' }}>
      <div style={{ maxWidth: 880, margin:'0 auto' }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--terracotta)' }}>System</div>
        <h1 className="serif" style={{ margin:'8px 0 30px', fontSize:48, fontWeight:500, lineHeight:1 }}>Components</h1>

        {/* Color */}
        <Sub label="Palette" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:10, marginBottom:36 }}>
          {[
            ['#F0E9DC','Cream BG'],
            ['#FBF7EF','Paper'],
            ['#1F1A14','Ink'],
            ['#B8543F','Terracotta'],
            ['#5C6B3F','Olive'],
            ['#D4A24C','Honey'],
          ].map(([c, n]) => (
            <div key={c}>
              <div style={{ aspectRatio:'1/1', borderRadius:12, background:c, border:'1px solid var(--rule)' }} />
              <div style={{ marginTop:8, fontSize:11.5, fontWeight:600, color:'var(--ink)' }}>{n}</div>
              <div style={{ fontSize:10, color:'var(--ink-soft)' }} className="mono">{c}</div>
            </div>
          ))}
        </div>

        {/* Type */}
        <Sub label="Type" />
        <div style={{ background:'var(--paper)', border:'1px solid var(--rule)', borderRadius:14, padding:'24px 26px', marginBottom:36 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-soft)', marginBottom:4 }}>EYEBROW · MANROPE 700</div>
          <div className="serif" style={{ fontSize:48, fontWeight:500, lineHeight:1.0 }}>
            Cormorant <em style={{ fontStyle:'italic' }}>Garamond</em>
          </div>
          <div className="serif" style={{ fontSize:18, fontStyle:'italic', color:'var(--ink-muted)', marginTop:6 }}>
            an editorial pairing — for recipe titles, pull quotes, ingredient lines
          </div>
          <hr style={{ border:'none', borderTop:'1px solid var(--rule)', margin:'18px 0' }}/>
          <div style={{ fontSize:14, color:'var(--ink-2)', lineHeight:1.55, maxWidth:520 }}>
            Manrope handles UI, body, and metadata. It pairs with Cormorant for an editorial-magazine feel without becoming precious. Sentence case throughout. Numbers use tabular figures wherever they're stacked (servings, timers, quantities).
          </div>
        </div>

        {/* Tags */}
        <Sub label="Tag chips" />
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:36 }}>
          <span className="chip">Italian</span>
          <span className="chip veg">Vegetarian</span>
          <span className="chip quick">Quick · 15 min</span>
          <span className="chip diet">Gluten-free</span>
          <span className="chip plum">Sunday</span>
          <span className="chip dark">Editor's pick</span>
        </div>

        {/* Recipe card */}
        <Sub label="Recipe card" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:36 }}>
          {[FOOD[0], FOOD[2], FOOD[4]].map(r => (
            <div key={r.id} style={{ background:'var(--paper)', border:'1px solid var(--rule)', borderRadius:14, padding:10 }}>
              <div style={{ position:'relative', aspectRatio:'4/4.3', borderRadius:10, overflow:'hidden', background:'#e9dfcd' }}>
                <FoodImg src={r.img} tone={r.tone} label={r.title} />
                <button style={{
                  position:'absolute', top:8, right:8, width:28, height:28, borderRadius:'50%',
                  background:'rgba(251,247,239,0.88)', backdropFilter:'blur(10px)',
                  border:'1px solid rgba(31,26,20,0.06)', color: r.fav ? 'var(--terracotta)' : 'var(--ink-muted)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{r.fav ? <Icon.heartF /> : <Icon.heart />}</button>
              </div>
              <h4 className="serif" style={{ margin:'10px 4px 4px', fontSize:18, fontWeight:500, lineHeight:1.1 }}>{r.title}</h4>
              <div style={{ padding:'0 4px 4px', fontSize:11, color:'var(--ink-soft)' }}>
                {r.time}m · {r.diff} · {r.tags[0]}
              </div>
            </div>
          ))}
        </div>

        {/* Ingredient row */}
        <Sub label="Ingredient row · checkable" />
        <div style={{ background:'var(--paper)', border:'1px solid var(--rule)', borderRadius:14, padding:'4px 4px', marginBottom:36 }}>
          {[
            { q:'1½',  u:'cups',  i:'arborio rice' },
            { q:'1',   u:'pinch', i:'saffron threads' },
            { q:'6',   u:'cups',  i:'warm vegetable stock' },
          ].map((ing, i) => {
            const on = !!checked[i];
            return (
              <button key={i} onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
                style={{ display:'flex', alignItems:'center', gap:14,
                  width:'100%', textAlign:'left', padding:'14px 18px',
                  background:'transparent', border:'none', cursor:'pointer',
                  borderBottom: i < 2 ? '1px solid var(--rule)' : 'none' }}>
                <span style={{
                  width:22, height:22, borderRadius:'50%',
                  border: on ? 'none' : '1.5px solid var(--rule-2)',
                  background: on ? 'var(--olive)' : 'transparent',
                  color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0,
                }}>{on && <Icon.check />}</span>
                <span className="serif" style={{
                  fontSize:18, color: on ? 'var(--ink-soft)' : 'var(--ink)',
                  textDecoration: on ? 'line-through' : 'none',
                }}>
                  <strong style={{ fontWeight:600 }}>{ing.q}</strong>
                  <span style={{ opacity:0.7 }}> {ing.u}</span>
                  <span style={{ fontStyle:'italic' }}> · {ing.i}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Step card */}
        <Sub label="Step card · numbered" />
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:36 }}>
          {[
            { t:'Bloom the saffron', b:'Steep the threads in ¼ cup of warm stock.' },
            { t:'Soften the shallot', b:'In a wide pan, melt 1 tbsp butter and sweat the shallot until translucent.' },
          ].map((s, i) => (
            <div key={i} style={{
              display:'flex', gap:14, padding:'16px 16px',
              background:'var(--paper)', borderRadius:14, border:'1px solid var(--rule)',
            }}>
              <div className="serif" style={{
                width:38, height:38, borderRadius:'50%', flexShrink:0,
                background:'var(--ink)', color:'var(--surface)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18, fontWeight:600,
              }}>{i+1}</div>
              <div>
                <div className="serif" style={{ fontSize:18, fontWeight:600, lineHeight:1.1 }}>{s.t}</div>
                <p style={{ margin:'6px 0 0', fontSize:14, lineHeight:1.55, color:'var(--ink-2)' }}>{s.b}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action sheet */}
        <Sub label="Import / export action sheet" />
        <div style={{
          background:'var(--paper)', borderRadius:22, padding:'12px 12px 20px',
          border:'1px solid var(--rule)', maxWidth:420, marginBottom:60,
        }}>
          <div style={{ width:44, height:5, borderRadius:3, background:'var(--rule-2)', margin:'6px auto 16px' }} />
          {[
            ['Import from .docx',  Icon.doc,    'Read a Word document'],
            ['Export to .docx',    Icon.upload, 'Save cookbook as Word'],
            ['Share recipe',       Icon.share,  'Send a single recipe'],
          ].map(([t, I, sub], i, a) => (
            <button key={t} style={{
              width:'100%', textAlign:'left', padding:'14px 14px',
              background:'transparent', border:'none', display:'flex', alignItems:'center', gap:14,
              borderBottom: i < a.length-1 ? '1px solid var(--rule)' : 'none',
            }}>
              <div style={{
                width:42, height:42, borderRadius:11,
                background:'rgba(184,84,63,0.10)', color:'var(--terracotta)',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}><I /></div>
              <div style={{ flex:1 }}>
                <div className="serif" style={{ fontSize:17, fontWeight:600, lineHeight:1.15 }}>{t}</div>
                <div style={{ fontSize:12, color:'var(--ink-soft)' }}>{sub}</div>
              </div>
              <Icon.chev />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sub({ label }) {
  return (
    <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-soft)', margin:'0 0 12px' }}>
      {label}
    </div>
  );
}

Object.assign(window, { ScreenComponents });
