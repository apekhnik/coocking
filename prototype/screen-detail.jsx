// screen-detail.jsx — Recipe detail (mobile)

const SAMPLE_INGREDIENTS = [
  { qty: 1.5,  unit: 'cups',  item: 'arborio rice' },
  { qty: 1,    unit: 'pinch', item: 'saffron threads' },
  { qty: 6,    unit: 'cups',  item: 'warm vegetable stock' },
  { qty: 1,    unit: 'small', item: 'shallot, finely diced' },
  { qty: 0.5,  unit: 'cup',   item: 'dry white wine' },
  { qty: 4,    unit: 'tbsp',  item: 'cultured butter' },
  { qty: 0.75, unit: 'cup',   item: 'grated Parmigiano-Reggiano' },
  { qty: 8,    unit: 'leaves',item: 'fresh sage' },
  { qty: 1,    unit: 'tsp',   item: 'flaky sea salt' },
];

const SAMPLE_STEPS = [
  { t: 'Bloom the saffron', body: 'Steep saffron threads in ¼ cup of the warm stock. Set aside while you prepare the soffritto — colour should deepen to a rich amber.' },
  { t: 'Soften the shallot', body: 'In a wide heavy-bottomed pan, melt 1 tbsp butter over medium heat. Add the shallot with a small pinch of salt; sweat 4 minutes until translucent, never coloured.' },
  { t: 'Toast the rice', body: 'Add rice and stir to coat. Toast 2 minutes until grains are glassy at the edges and warm to touch. Add wine; let it hiss and evaporate.' },
  { t: 'Add stock, ladle by ladle', body: 'Pour in saffron-stock first, then add stock one ladle at a time, stirring almost constantly. Wait until each addition is nearly absorbed before the next.' },
  { t: 'Finish — mantecatura', body: 'After ~18 minutes the rice should be al dente with a loose, wavy texture. Off heat, beat in remaining butter and Parmigiano. Cover; rest 2 minutes.' },
  { t: 'Brown the sage butter', body: 'Meanwhile, brown 2 tbsp butter with sage leaves until nutty and the leaves crisp. Spoon over each portion at the table.' },
];

function ScreenDetail({ recipe, onBack, onEdit }) {
  const r = recipe || FOOD[0];
  const [servings, setServings] = React.useState(4);
  const [checked, setChecked] = React.useState({});
  const [tab, setTab] = React.useState('ingredients'); // ingredients | steps
  const [stepDone, setStepDone] = React.useState({});

  const scale = servings / 4;
  const fmtQty = (n) => {
    const v = n * scale;
    if (v < 0.13) return '⅛';
    if (Math.abs(v - 0.25) < 0.05) return '¼';
    if (Math.abs(v - 0.33) < 0.05) return '⅓';
    if (Math.abs(v - 0.5)  < 0.05) return '½';
    if (Math.abs(v - 0.66) < 0.06) return '⅔';
    if (Math.abs(v - 0.75) < 0.05) return '¾';
    return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/,'');
  };

  return (
    <div className="app fadein" style={{ height:'100%', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      {/* Hero with parallax photo */}
      <div style={{ position:'relative', height: 360, overflow:'hidden', background:'#000' }}>
        <FoodImg src={r.img} tone={r.tone} label={r.title} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(20,15,10,0.8) 100%)' }} />

        {/* Top controls — status bar safe area */}
        <div style={{ position:'absolute', top:0, left:0, right:0, paddingTop:58, padding:'58px 16px 0', display:'flex', justifyContent:'space-between' }}>
          <CircBtn onClick={onBack}><Icon.back /></CircBtn>
          <div style={{ display:'flex', gap:8 }}>
            <CircBtn><Icon.share /></CircBtn>
            <CircBtn><Icon.bookmark /></CircBtn>
          </div>
        </div>

        {/* Title block */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'20px 22px 28px', color:'#fff' }}>
          <div style={{ display:'flex', gap:6, marginBottom:10 }}>
            {r.tags.map(t => <span key={t} className="chip dark">{t}</span>)}
          </div>
          <h1 className="serif" style={{ margin:0, fontSize:36, fontWeight:500, lineHeight:1.02 }}>{r.title}</h1>
          <div className="serif" style={{ marginTop:4, fontStyle:'italic', fontSize:15, opacity:0.85 }}>{r.sub}</div>
        </div>
      </div>

      {/* Body */}
      <div className="scroll" style={{ flex:1, overflowY:'auto', background:'var(--bg)' }}>
        {/* Meta strip */}
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:0,
          padding:'18px 22px', borderBottom:'1px solid var(--rule)',
          background:'var(--surface)',
        }}>
          <Meta label="Time" value={`${r.time}m`} />
          <Meta label="Difficulty" value={r.diff} />
          <Meta label="Yield" value={`${servings} pp`} />
          <Meta label="Cuisine" value={r.tags[0]} last />
        </div>

        {/* Servings adjuster */}
        <div style={{ padding:'18px 22px 6px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-soft)' }}>Servings</div>
            <div className="serif" style={{ fontSize:26, fontWeight:500, marginTop:2 }}>For {servings}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10,
            background:'var(--surface)', border:'1px solid var(--rule)', borderRadius:999, padding:'4px',
          }}>
            <RoundBtn onClick={() => setServings(Math.max(1, servings - 1))}><Icon.minus /></RoundBtn>
            <span className="serif" style={{ fontSize:22, minWidth:24, textAlign:'center' }}>{servings}</span>
            <RoundBtn onClick={() => setServings(Math.min(12, servings + 1))}><Icon.add /></RoundBtn>
          </div>
        </div>

        {/* Tab segment */}
        <div style={{ padding:'18px 22px 14px' }}>
          <div style={{ display:'flex', background:'rgba(31,26,20,0.05)', borderRadius:14, padding:4 }}>
            {[['ingredients','Ingredients'],['steps','Method']].map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)}
                style={{
                  flex:1, height:38, borderRadius:11, border:'none',
                  background: tab===k ? 'var(--paper)' : 'transparent',
                  color: tab===k ? 'var(--ink)' : 'var(--ink-muted)',
                  fontSize:13.5, fontWeight:700, letterSpacing:-0.01,
                  boxShadow: tab===k ? '0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)' : 'none',
                }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Ingredients list */}
        {tab === 'ingredients' && (
          <div style={{ padding:'0 22px 30px' }}>
            <div style={{
              background:'var(--card)', borderRadius:18, padding:'8px 4px',
              border:'1px solid var(--rule)',
            }}>
              {SAMPLE_INGREDIENTS.map((ing, i) => {
                const on = !!checked[i];
                return (
                  <button key={i} onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
                    style={{
                      width:'100%', background:'transparent', border:'none', cursor:'pointer',
                      display:'flex', alignItems:'center', gap:14,
                      padding:'14px 18px', borderBottom: i < SAMPLE_INGREDIENTS.length-1 ? '1px solid var(--rule)' : 'none',
                      textAlign:'left',
                    }}>
                    <span style={{
                      width:22, height:22, borderRadius:'50%',
                      border: on ? 'none' : '1.5px solid var(--rule-2)',
                      background: on ? 'var(--olive)' : 'transparent',
                      color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                      flexShrink:0, transition:'all .15s',
                    }}>
                      {on && <Icon.check />}
                    </span>
                    <span className="serif" style={{
                      fontSize:18, color: on ? 'var(--ink-soft)' : 'var(--ink)',
                      textDecoration: on ? 'line-through' : 'none', flex:1,
                    }}>
                      <strong style={{ fontWeight:600 }}>{fmtQty(ing.qty)}</strong>
                      <span style={{ opacity:0.7 }}> {ing.unit}</span>
                      <span style={{ fontStyle:'italic' }}> · {ing.item}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Notes / pull quote */}
            <div style={{
              marginTop:24, padding:'22px 22px',
              background:'rgba(184,84,63,0.06)', borderRadius:18,
              borderLeft:'3px solid var(--terracotta)',
            }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--terracotta)' }}>From the kitchen</div>
              <p className="serif" style={{ margin:'8px 0 0', fontSize:17, lineHeight:1.45, fontStyle:'italic', color:'var(--ink-2)' }}>
                "Use a wide pan — a narrow pot will steam the rice rather than evaporate the wine. Stir steadily, never frantically."
              </p>
            </div>
          </div>
        )}

        {/* Method steps */}
        {tab === 'steps' && (
          <div style={{ padding:'0 22px 30px' }}>
            {SAMPLE_STEPS.map((s, i) => {
              const on = !!stepDone[i];
              return (
                <div key={i}
                  onClick={() => setStepDone(d => ({ ...d, [i]: !d[i] }))}
                  style={{
                    display:'flex', gap:14, padding:'16px 16px',
                    background:'var(--card)', borderRadius:16, marginBottom:10,
                    border:'1px solid var(--rule)',
                    opacity: on ? 0.6 : 1,
                    transition:'opacity .2s',
                    cursor:'pointer',
                  }}>
                  <div className="serif" style={{
                    width:38, height:38, borderRadius:'50%', flexShrink:0,
                    background: on ? 'var(--olive)' : 'var(--ink)', color:'#FBF7EF',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:18, fontWeight:600,
                  }}>{on ? <Icon.check /> : (i+1)}</div>
                  <div>
                    <div className="serif" style={{ fontSize:18, fontWeight:600, lineHeight:1.1, color:'var(--ink)' }}>
                      {s.t}
                    </div>
                    <p style={{ margin:'6px 0 0', fontSize:14, lineHeight:1.55, color:'var(--ink-2)' }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Done card */}
            <div style={{
              marginTop:18, padding:'24px 20px', textAlign:'center',
              background:'var(--ink)', color:'var(--surface)', borderRadius:18,
            }}>
              <div className="serif" style={{ fontSize:22, fontWeight:500 }}>Buon appetito.</div>
              <div style={{ marginTop:6, fontSize:13, opacity:0.7 }}>Mark all steps when finished cooking.</div>
            </div>
          </div>
        )}

        <div style={{ height:120 }} />
      </div>

      {/* Bottom action bar */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, padding:'14px 18px 32px',
        background:'linear-gradient(180deg, rgba(240,233,220,0) 0%, rgba(240,233,220,0.96) 30%, var(--bg) 100%)',
        display:'flex', gap:10, zIndex:30,
      }}>
        <button onClick={onEdit} className="btn btn-ghost" style={{ flex:'0 0 auto', width:46, padding:0, height:50, borderRadius:14 }}>
          <Icon.bookmark />
        </button>
        <button onClick={onEdit} className="btn btn-primary" style={{ flex:1, height:50, borderRadius:14, background:'var(--ink)' }}>
          Start cooking
        </button>
      </div>
    </div>
  );
}

function Meta({ label, value, last }) {
  return (
    <div style={{ textAlign:'center', borderRight: last ? 'none' : '1px solid var(--rule)' }}>
      <div className="serif" style={{ fontSize:20, fontWeight:600, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-soft)', marginTop:4 }}>{label}</div>
    </div>
  );
}

function CircBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width:40, height:40, borderRadius:'50%',
      background:'rgba(20,15,10,0.36)', backdropFilter:'blur(14px)',
      border:'1px solid rgba(255,255,255,0.18)', color:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>{children}</button>
  );
}
function RoundBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width:32, height:32, borderRadius:'50%',
      background:'var(--paper)', border:'1px solid var(--rule)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'var(--ink)',
    }}>{children}</button>
  );
}

Object.assign(window, { ScreenDetail });
