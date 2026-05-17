// screen-edit.jsx — Add / Edit recipe form (mobile)

function ScreenEdit({ onBack, onSave }) {
  const [title, setTitle] = React.useState('Saffron Risotto');
  const [sub, setSub]     = React.useState('with brown butter & sage');
  const [time, setTime]   = React.useState(35);
  const [diff, setDiff]   = React.useState('Easy');
  const [tags, setTags]   = React.useState(['Italian','Vegetarian']);
  const [ings, setIngs]   = React.useState([
    { q:'1½', u:'cups',  i:'arborio rice' },
    { q:'1',  u:'pinch', i:'saffron threads' },
    { q:'6',  u:'cups',  i:'warm vegetable stock' },
    { q:'',   u:'',      i:'' },
  ]);
  const [steps, setSteps] = React.useState([
    'Bloom the saffron in ¼ cup of the warm stock — set aside while you prepare the shallot.',
    'Melt butter, sweat the shallot until translucent, 4 min. Add rice and toast 2 min.',
    '',
  ]);

  const addIng = () => setIngs([...ings, { q:'', u:'', i:'' }]);
  const rmIng  = (i) => setIngs(ings.filter((_,k) => k !== i));
  const setIng = (i, f, v) => setIngs(ings.map((row, k) => k === i ? { ...row, [f]: v } : row));

  const addStep = () => setSteps([...steps, '']);
  const rmStep  = (i) => setSteps(steps.filter((_,k) => k !== i));
  const setStep = (i, v) => setSteps(steps.map((s, k) => k === i ? v : s));

  const toggleTag = (t) => setTags(tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t]);
  const TAG_OPTS = ['Italian','Japanese','French','Mexican','Vegetarian','Vegan','Gluten-free','Quick','Sunday','Comfort','Dessert','Breakfast'];

  return (
    <div className="app fadein" style={{ height:'100%', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      {/* Header */}
      <div style={{ height: 54 }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 18px 14px' }}>
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:'50%',
          background:'var(--surface)', border:'1px solid var(--rule-2)',
          display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink)',
        }}><Icon.back /></button>
        <div className="serif" style={{ fontSize:18, fontWeight:600 }}>New recipe</div>
        <button onClick={onSave} style={{
          height:38, padding:'0 16px', borderRadius:999,
          background:'var(--ink)', color:'var(--surface)', border:'none',
          fontSize:13, fontWeight:700, letterSpacing:-0.01,
        }}>Save</button>
      </div>

      <div className="scroll" style={{ flex:1, overflowY:'auto', paddingBottom:160 }}>
        {/* Photo uploader */}
        <div style={{ padding:'4px 18px 18px' }}>
          <div style={{
            position:'relative', aspectRatio:'4/3', borderRadius:18, overflow:'hidden',
            background:'#e9dfcd',
          }}>
            <FoodImg src="https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=80&auto=format&fit=crop" tone="#D4A24C" label="Saffron Risotto" style={{ opacity: 0.92 }} />
            <div style={{ position:'absolute', inset:0,
              background:'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)' }} />
            <div style={{ position:'absolute', right:12, bottom:12, display:'flex', gap:8 }}>
              <button style={{
                height:38, padding:'0 14px', borderRadius:999, border:'none',
                background:'rgba(20,15,10,0.55)', color:'#fff', backdropFilter:'blur(12px)',
                display:'flex', alignItems:'center', gap:6, fontSize:12.5, fontWeight:600,
              }}><Icon.camera /> Replace</button>
            </div>
            <div style={{ position:'absolute', left:12, top:12,
              fontFamily:'var(--mono)', fontSize:10, color:'rgba(255,255,255,0.85)', letterSpacing:0.04, textTransform:'uppercase',
              background:'rgba(0,0,0,0.32)', padding:'4px 8px', borderRadius:6,
            }}>cover · 4:3</div>
          </div>
        </div>

        {/* Title + subtitle */}
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="serif"
            style={{
              width:'100%', border:'none', outline:'none', background:'transparent',
              fontSize:30, fontWeight:500, lineHeight:1.05, color:'var(--ink)',
              padding:'2px 0',
            }} />
        </Field>
        <Field label="Subtitle">
          <input value={sub} onChange={(e) => setSub(e.target.value)}
            className="serif"
            style={{
              width:'100%', border:'none', outline:'none', background:'transparent',
              fontSize:17, fontStyle:'italic', color:'var(--ink-2)',
              padding:'2px 0',
            }} />
        </Field>

        {/* Time + difficulty row */}
        <div style={{ padding:'4px 18px 6px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <BoxField label="Cook time">
            <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
              <input type="number" value={time} onChange={(e) => setTime(+e.target.value)}
                style={{ width:60, border:'none', outline:'none', background:'transparent',
                  fontSize:22, fontWeight:600, fontFamily:'var(--serif)' }} />
              <span style={{ color:'var(--ink-soft)', fontSize:13 }}>min</span>
            </div>
          </BoxField>
          <BoxField label="Difficulty">
            <div style={{ display:'flex', gap:4, marginTop:2 }}>
              {['Easy','Medium','Hard'].map(d => (
                <button key={d} onClick={() => setDiff(d)} style={{
                  flex:1, height:32, padding:0, borderRadius:8, fontSize:12, fontWeight:600,
                  background: diff===d ? 'var(--ink)' : 'transparent',
                  color: diff===d ? 'var(--surface)' : 'var(--ink-muted)',
                  border: diff===d ? 'none' : '1px solid var(--rule-2)',
                }}>{d}</button>
              ))}
            </div>
          </BoxField>
        </div>

        {/* Tags */}
        <SectionHeader label="Tags" />
        <div style={{ padding:'0 18px 18px' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {TAG_OPTS.map(t => {
              const on = tags.includes(t);
              return (
                <button key={t} onClick={() => toggleTag(t)} style={{
                  height:30, padding:'0 12px', borderRadius:999, fontSize:12, fontWeight:600,
                  background: on ? 'var(--terracotta)' : 'transparent',
                  color: on ? '#fff' : 'var(--ink-2)',
                  border: on ? 'none' : '1px solid var(--rule-2)',
                  display:'inline-flex', alignItems:'center', gap:6,
                }}>
                  {on && <Icon.check />} {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ingredients */}
        <SectionHeader label="Ingredients" count={ings.length} actionLabel="Add" onAction={addIng} />
        <div style={{ padding:'0 18px 18px' }}>
          <div style={{
            background:'var(--card)', borderRadius:16, border:'1px solid var(--rule)',
            overflow:'hidden',
          }}>
            {ings.map((row, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:8, padding:'10px 10px 10px 8px',
                borderBottom: i < ings.length-1 ? '1px solid var(--rule)' : 'none',
              }}>
                <span style={{ color:'var(--ink-soft)', cursor:'grab', padding:'4px 2px' }}><Icon.drag /></span>
                <input value={row.q} onChange={(e) => setIng(i,'q',e.target.value)} placeholder="1½"
                  style={{ width:48, border:'none', outline:'none', background:'transparent', fontSize:15, fontWeight:600, fontFamily:'var(--serif)' }} />
                <input value={row.u} onChange={(e) => setIng(i,'u',e.target.value)} placeholder="cup"
                  style={{ width:54, border:'none', outline:'none', background:'transparent', fontSize:13, color:'var(--ink-muted)' }} />
                <input value={row.i} onChange={(e) => setIng(i,'i',e.target.value)} placeholder="ingredient"
                  className="serif"
                  style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:15, fontStyle: row.i ? 'italic' : 'normal', color:'var(--ink)' }} />
                <button onClick={() => rmIng(i)} style={{
                  width:26, height:26, borderRadius:'50%',
                  border:'none', background:'transparent', color:'var(--ink-soft)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}><Icon.trash /></button>
              </div>
            ))}
          </div>
          <button onClick={addIng} style={{
            marginTop:10, width:'100%', height:42, borderRadius:12,
            background:'transparent', border:'1px dashed var(--rule-2)',
            color:'var(--ink-muted)', fontSize:13, fontWeight:600,
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
          }}><Icon.add /> Add ingredient</button>
        </div>

        {/* Steps */}
        <SectionHeader label="Method" count={steps.length} actionLabel="Add" onAction={addStep} />
        <div style={{ padding:'0 18px 26px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display:'flex', gap:12, padding:'14px 14px',
              background:'var(--card)', border:'1px solid var(--rule)',
              borderRadius:14, marginBottom:8,
            }}>
              <div className="serif" style={{
                width:32, height:32, borderRadius:'50%', flexShrink:0,
                background:'var(--ink)', color:'var(--surface)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:15, fontWeight:600,
              }}>{i+1}</div>
              <textarea value={s} onChange={(e) => setStep(i, e.target.value)}
                placeholder="Describe this step…"
                rows={2}
                style={{
                  flex:1, border:'none', outline:'none', background:'transparent',
                  resize:'vertical', minHeight: 44, fontSize:14, lineHeight:1.5, color:'var(--ink-2)',
                  fontFamily:'var(--sans)',
                }} />
              <button onClick={() => rmStep(i)} style={{
                width:26, height:26, borderRadius:'50%',
                border:'none', background:'transparent', color:'var(--ink-soft)',
                display:'flex', alignItems:'center', justifyContent:'center', alignSelf:'flex-start',
              }}><Icon.trash /></button>
            </div>
          ))}
          <button onClick={addStep} style={{
            marginTop:4, width:'100%', height:42, borderRadius:12,
            background:'transparent', border:'1px dashed var(--rule-2)',
            color:'var(--ink-muted)', fontSize:13, fontWeight:600,
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
          }}><Icon.add /> Add step</button>
        </div>
      </div>

      {/* Sticky save bar */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, padding:'14px 18px 32px',
        background:'linear-gradient(180deg, rgba(240,233,220,0) 0%, rgba(240,233,220,0.96) 30%, var(--bg) 100%)',
        display:'flex', gap:10, zIndex:30,
      }}>
        <button onClick={onBack} className="btn btn-ghost" style={{ flex:1, height:50, borderRadius:14 }}>Cancel</button>
        <button onClick={onSave} className="btn btn-primary" style={{ flex:2, height:50, borderRadius:14 }}>
          Save recipe
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{
      margin:'0 18px 14px', padding:'14px 16px',
      background:'var(--card)', borderRadius:14, border:'1px solid var(--rule)',
    }}>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-soft)', marginBottom:6 }}>{label}</div>
      {children}
    </div>
  );
}

function BoxField({ label, children }) {
  return (
    <div style={{
      padding:'12px 14px', background:'var(--card)', borderRadius:14, border:'1px solid var(--rule)',
    }}>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-soft)', marginBottom:4 }}>{label}</div>
      {children}
    </div>
  );
}

function SectionHeader({ label, count, actionLabel, onAction }) {
  return (
    <div style={{ padding:'10px 22px 10px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
      <h3 className="serif" style={{ margin:0, fontSize:20, fontWeight:500 }}>
        {label} {count !== undefined && <span style={{ fontSize:13, color:'var(--ink-soft)', marginLeft:4 }}>· {count}</span>}
      </h3>
      {actionLabel && (
        <button onClick={onAction} style={{
          background:'transparent', border:'none', color:'var(--terracotta)',
          fontSize:13, fontWeight:700,
        }}>{actionLabel}</button>
      )}
    </div>
  );
}

Object.assign(window, { ScreenEdit });
