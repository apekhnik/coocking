// screen-import.jsx — Import .docx (mobile)

function ScreenImport({ onBack, onImport }) {
  const [stage, setStage] = React.useState('drop'); // drop | parsing | preview | imported
  const [picked, setPicked] = React.useState({ r1:true, r2:true, r3:false });
  const [over, setOver] = React.useState(false);

  // Detected recipes shown in preview
  const detected = [
    { id:'r1', t:'Saffron Risotto',          n:9,  s:6, img: FOOD[0].img, time:35,  tags:['Italian','Vegetarian'] },
    { id:'r2', t:'Miso-Glazed Aubergine',    n:11, s:7, img: FOOD[1].img, time:45,  tags:['Japanese','Vegan'] },
    { id:'r3', t:'Lemon Olive-Oil Cake',     n:8,  s:5, img: FOOD[4].img, time:55,  tags:['Dessert'] },
    { id:'r4', t:'Charred Broccolini',       n:5,  s:3, img: FOOD[5].img, time:18,  tags:['Side','Quick'] },
  ];

  const start = () => {
    setStage('parsing');
    setTimeout(() => setStage('preview'), 1500);
  };

  return (
    <div className="app fadein" style={{ height:'100%', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      <div style={{ height: 54 }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 18px 14px' }}>
        <button onClick={onBack} style={{
          width:40, height:40, borderRadius:'50%',
          background:'var(--surface)', border:'1px solid var(--rule-2)',
          display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink)',
        }}><Icon.back /></button>
        <div className="serif" style={{ fontSize:18, fontWeight:600 }}>Import</div>
        <div style={{ width:40 }} />
      </div>

      <div className="scroll" style={{ flex:1, overflowY:'auto', padding:'0 18px 140px' }}>
        {/* Hero copy */}
        <div style={{ padding:'8px 4px 18px' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--terracotta)' }}>
            From your archives
          </div>
          <h1 className="serif" style={{ margin:'6px 0 0', fontSize:34, lineHeight:1.05, fontWeight:500 }}>
            Bring your <em style={{ fontStyle:'italic' }}>recipes</em> in
          </h1>
          <p className="serif" style={{ margin:'10px 0 0', fontSize:16, fontStyle:'italic', color:'var(--ink-muted)', lineHeight:1.4 }}>
            Drop a Word document — we'll read the formatting, split it into recipes, and let you pick what to save.
          </p>
        </div>

        {stage === 'drop' && (
          <>
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setOver(true); }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => { e.preventDefault(); setOver(false); start(); }}
              onClick={start}
              style={{
                position:'relative',
                padding:'34px 22px', borderRadius:20,
                background: over ? 'rgba(184,84,63,0.08)' : 'var(--card)',
                border: `1.5px dashed ${over ? 'var(--terracotta)' : 'var(--rule-2)'}`,
                textAlign:'center', cursor:'pointer',
                transition:'all .2s',
              }}>
              <div style={{
                width:64, height:64, borderRadius:18, margin:'0 auto 14px',
                background: 'var(--surface)', border:'1px solid var(--rule)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--terracotta)',
              }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 4h12l6 6v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                  <path d="M20 4v6h6M12 18h8M12 22h6M16 14v0" />
                  <path d="M16 12v6m-3-3l3 3 3-3" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="serif" style={{ fontSize:20, fontWeight:600, color:'var(--ink)' }}>
                Drop a .docx here
              </div>
              <div style={{ fontSize:13, color:'var(--ink-muted)', marginTop:6 }}>
                or tap to choose a file
              </div>
              <div style={{
                marginTop:18, display:'inline-flex', gap:6, padding:'6px 12px',
                background:'rgba(31,26,20,0.04)', borderRadius:999,
                fontSize:11, fontWeight:600, color:'var(--ink-muted)', letterSpacing:0.04,
              }}>
                <Icon.sparkle /> Smart recipe detection
              </div>
            </div>

            {/* Tips */}
            <div style={{ marginTop:22 }}>
              <SectionHeading>Tips for clean imports</SectionHeading>
              <div style={{ background:'var(--card)', borderRadius:16, border:'1px solid var(--rule)', overflow:'hidden' }}>
                {[
                  ['Use Heading 1 or Heading 2 for each recipe title.', '01'],
                  ['Put ingredients in a bullet list — quantities are detected.', '02'],
                  ['Number the steps, or write them as separate paragraphs.', '03'],
                ].map(([t, n], i, a) => (
                  <div key={n} style={{
                    display:'flex', gap:14, padding:'14px 16px',
                    borderBottom: i < a.length-1 ? '1px solid var(--rule)' : 'none',
                  }}>
                    <span className="serif" style={{
                      width:28, height:28, borderRadius:'50%', flexShrink:0,
                      background:'rgba(212,162,76,0.16)', color:'#8a651d',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:12, fontWeight:600,
                    }}>{n}</span>
                    <div className="serif" style={{ fontSize:15, lineHeight:1.4, color:'var(--ink-2)' }}>{t}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export */}
            <div style={{ marginTop:24, padding:'18px 18px',
              background:'var(--ink)', color:'var(--surface)', borderRadius:18,
              display:'flex', gap:14, alignItems:'center' }}>
              <div style={{
                width:48, height:48, borderRadius:12,
                background:'rgba(212,162,76,0.18)', color:'var(--honey)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}><Icon.upload /></div>
              <div style={{ flex:1 }}>
                <div className="serif" style={{ fontSize:18, fontWeight:500 }}>Export your cookbook</div>
                <div style={{ fontSize:12, opacity:0.6, marginTop:2 }}>Bundle everything back into a Word doc.</div>
              </div>
              <button style={{
                height:36, padding:'0 14px', borderRadius:999,
                background:'var(--surface)', color:'var(--ink)', border:'none',
                fontSize:12.5, fontWeight:700,
              }}>Export</button>
            </div>
          </>
        )}

        {stage === 'parsing' && (
          <div style={{ padding:'24px 0' }}>
            <div style={{
              padding:'34px 22px', borderRadius:20,
              background:'var(--card)', border:'1px solid var(--rule)',
              textAlign:'center',
            }}>
              <div style={{
                width:64, height:64, margin:'0 auto 18px',
                borderRadius:'50%', border:'3px solid rgba(184,84,63,0.18)',
                borderTopColor:'var(--terracotta)',
                animation:'spin 1s linear infinite',
              }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div className="serif" style={{ fontSize:22, fontWeight:500 }}>Reading the document…</div>
              <div style={{ marginTop:6, fontSize:13, color:'var(--ink-muted)' }}>
                Detecting headings, ingredients, and steps.
              </div>
            </div>
          </div>
        )}

        {stage === 'preview' && (
          <>
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'12px 14px', borderRadius:14,
              background:'rgba(92,107,63,0.10)', border:'1px solid rgba(92,107,63,0.18)',
              marginBottom:14,
            }}>
              <div style={{ width:32, height:32, borderRadius:'50%',
                background:'var(--olive)', color:'#fff',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon.check />
              </div>
              <div style={{ flex:1 }}>
                <div className="serif" style={{ fontSize:16, fontWeight:600, color:'var(--olive)' }}>
                  Found {detected.length} recipes
                </div>
                <div style={{ fontSize:12, color:'var(--ink-muted)' }}>in <span className="mono">grandmas-book.docx</span> · 14 KB</div>
              </div>
            </div>

            <SectionHeading>Preview · select to import</SectionHeading>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {detected.map(d => {
                const on = !!picked[d.id];
                return (
                  <button key={d.id} onClick={() => setPicked(p => ({ ...p, [d.id]: !p[d.id] }))}
                    style={{
                      display:'flex', alignItems:'stretch', gap:12, padding:10,
                      background:'var(--card)', borderRadius:16,
                      border: on ? '1.5px solid var(--terracotta)' : '1px solid var(--rule)',
                      textAlign:'left', cursor:'pointer',
                    }}>
                    <div style={{ width:74, height:74, borderRadius:10, overflow:'hidden', flexShrink:0, background:'#e9dfcd' }}>
                      <FoodImg src={d.img} tone="#B8543F" label={d.t} />
                    </div>
                    <div style={{ flex:1, paddingTop:2 }}>
                      <div className="serif" style={{ fontSize:17, fontWeight:600, lineHeight:1.1, color:'var(--ink)' }}>{d.t}</div>
                      <div style={{ marginTop:5, display:'flex', gap:6, flexWrap:'wrap' }}>
                        {d.tags.map(t => <span key={t} className="chip">{t}</span>)}
                      </div>
                      <div style={{ marginTop:7, fontSize:11.5, color:'var(--ink-soft)', display:'flex', gap:10, alignItems:'center' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:3 }}><Icon.clock />{d.time}m</span>
                        <span>·</span>
                        <span>{d.n} ingredients</span>
                        <span>·</span>
                        <span>{d.s} steps</span>
                      </div>
                    </div>
                    <div style={{
                      alignSelf:'center', width:24, height:24, borderRadius:'50%', flexShrink:0,
                      background: on ? 'var(--terracotta)' : 'transparent',
                      border: on ? 'none' : '1.5px solid var(--rule-2)',
                      color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                    }}>{on && <Icon.check />}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {stage === 'preview' && (
        <div style={{
          position:'absolute', left:0, right:0, bottom:0, padding:'14px 18px 32px',
          background:'linear-gradient(180deg, rgba(240,233,220,0) 0%, rgba(240,233,220,0.96) 30%, var(--bg) 100%)',
          display:'flex', gap:10, zIndex:30,
        }}>
          <button onClick={onBack} className="btn btn-ghost" style={{ flex:1, height:50, borderRadius:14 }}>Cancel</button>
          <button onClick={() => onImport && onImport()} className="btn btn-primary" style={{ flex:2, height:50, borderRadius:14 }}>
            Import {Object.values(picked).filter(Boolean).length} recipes
          </button>
        </div>
      )}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <div style={{
      fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase',
      color:'var(--ink-soft)', margin:'18px 4px 10px',
    }}>{children}</div>
  );
}

Object.assign(window, { ScreenImport });
