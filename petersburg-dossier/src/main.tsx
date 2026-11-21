import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Balance, CanalMap, Icon, type IconName } from './Art'
import { places, romans, themes, topics, voices } from './archive'
import { NightSound } from './sound'
import './style.css'

const sections: {title: string; nav: string; en: string; icon: IconName}[] = [
  { title: '意识天平', nav: '意识天平', en: 'The Scale of Conscience', icon: 'scale' },
  { title: '1866 圣彼得堡漫游', nav: '圣彼得堡漫游', en: 'Petersburg Walk', icon: 'map' },
  { title: '复调人物志', nav: '复调人物志', en: 'Polyphonic Voices', icon: 'voices' }
]
const number = (i: number) => String(i+1).padStart(2,'0')
function Corners() { return <span className="corners" aria-hidden="true"><i/><i/><i/><i/></span> }

function ScalePage({index, setIndex, view, setView}: {index: number; setIndex:(n:number)=>void; view:number; setView:(n:number)=>void}) {
  const t = topics[index], r = t.readings[view]
  return <>
    <div className="reading-desk">
      <div className="instrument framed">
        <Corners/>
        <div className="plate-label"><span>FIG. I</span><span>黄铜衡器</span></div>
        <div className="plate-ident">PL. 01</div>
        <Balance target={r.tilt}/>
        <div className="scale-key"><span><i/>狂热理性</span><b>⟡</b><span>良知震颤<i/></span></div>
      </div>
      <article className="paper analysis" aria-live="polite">
        <div className="folio-line"><span><b>№ {number(index)}</b> / 06</span><span>ЧАСТЬ {t.part} · {t.chapter}</span></div>
        <h3>{t.name}</h3>
        <div className="perspectives" aria-label="阅读视角">{(['狂热理性', '良知震颤'] as const).map((v,i)=><button key={v} className={view===i?'chosen':''} aria-pressed={view===i} onClick={()=>setView(i)}><Icon name={i?'drop':'flame'} size={14}/>{v}</button>)}</div>
        <p className="reading">{r.text}</p>
        <div className="stats" aria-label="心理状态文学拟值">{([
          ['temp','体温',r.temp.toFixed(1),'°C', (r.temp-35)*18],
          ['pulse','焦虑值',r.anxiety,'/100',r.anxiety],
          ['eye','清醒度',r.clarity,'/100',r.clarity]
        ] as const).map(([icon,label,value,unit,percent])=><div className="stat" key={label}><div className="stat-label"><Icon name={icon} size={14}/>{label}</div><div className="stat-value">{value}<small>{unit}</small></div><div className="track"><i style={{width:percent+'%'}}/></div></div>)}</div>
      </article>
    </div>
    <div className="index-heading"><h3>精神命题索引</h3><span>THESIS INDEX</span><i/><b>06 则</b></div>
    <div className="theses">{topics.map((topic,i)=><button key={topic.name} className={i===index?'thesis active':'thesis'} aria-pressed={i===index} onClick={()=>setIndex(i)}><span className="thesis-no">命题 {romans[i]}</span><span className="dot"/><strong>{topic.name}</strong></button>)}</div>
  </>
}
function WalkPage({index, setIndex}: {index:number; setIndex:(n:number)=>void}) {
  const [flipped, setFlipped] = useState(false)
  const start = useRef<[number,number] | null>(null)
  const p = places[index]
  function choose(i:number) { setIndex(i); setFlipped(false) }
  return <>
    <div className="walking-grid">
      <div className="framed map-frame"><Corners/><div className="map-title"><span>FIG. II</span><small>运河与街巷 · 文学路线示意</small></div><CanalMap selected={index} choose={choose}/></div>
      <article className="paper scene" aria-live="polite"><div className="folio-line"><b>地点 {number(index)} / 05</b><span>{p.ru}</span></div><h3>{p.name}</h3><h4>{p.light}</h4><p className="reading">{p.scene}</p><div className="weather"><Icon name="sun" size={16}/>{p.weather}</div></article>
    </div>
    <div className="waypoints" aria-label="漫游地点" onTouchStart={e=>{start.current=[e.touches[0].clientX,e.touches[0].clientY]}} onTouchEnd={e=>{
      if(!start.current)return
      const dx=e.changedTouches[0].clientX-start.current[0],dy=e.changedTouches[0].clientY-start.current[1]
      if(Math.abs(dx)>36&&Math.abs(dx)>Math.abs(dy)*1.3)choose(Math.max(0,Math.min(4,index+(dx<0?1:-1))))
      start.current=null
    }}>{places.map((p,i)=><button key={p.name} aria-pressed={index===i} onClick={()=>choose(i)} className={i===index?'active':''}><small>{romans[i]}</small>{p.name}</button>)}</div>
    <div className="index-heading"><h3>随地物证</h3><span>COLLECTED EVIDENCE</span><i/></div>
    <button className={'evidence'+(flipped?' turned':'')} aria-pressed={flipped} onClick={()=>setFlipped(!flipped)}>
      <span className="evidence-faces"><span className="evidence-front"><span className="specimen">物证 {number(index)}</span><strong>{p.object}</strong></span><span className="evidence-back"><span className="specimen">{p.object} · 意象批注</span><span>{p.evidence}</span></span></span><span className="flip"><Icon name="flip" size={17}/>{flipped?'查看正面':'翻面检视'}</span>
    </button>
  </>
}
function VoicesPage({theme, setTheme, person, setPerson}:{theme:number;setTheme:(n:number)=>void;person:number;setPerson:(n:number)=>void}) {
  const v=voices[person]
  return <>
    <div className="theme-list" aria-label="主题">{themes.map((t,i)=><button className={i===theme?'active':''} aria-pressed={i===theme} key={t} onClick={()=>setTheme(i)}>{t}<span>{['GUILT','PUNISHMENT','LOVE','NIHILISM'][i]}</span></button>)}</div>
    <div className="voice-desk"><div className="voice-list framed"><div className="smallcap">人物档案 <span>/ PERSONAE</span></div>{voices.map((p,i)=><button className={i===person?'active':''} key={p.name} onClick={()=>setPerson(i)} aria-pressed={i===person}><span>{romans[i]}</span>{p.name}<Icon name="arrow" size={15}/></button>)}</div>
    <article className="paper voice-text" aria-live="polite"><div className="folio-line"><b>人物 {number(person)} / 04</b><span>主题 · {themes[theme]}</span></div><div className="ru-name">{v.ru}</div><h3>{v.name}</h3><p className="role">{v.role}</p><p className="reading">{v.entries[theme]}</p><div className="voice-sign"><i/>人物立场批注</div></article></div>
  </>
}
function App() {
  const [tab,setTab]=useState(0),[index,setIndex]=useState(0),[view,setView]=useState(0)
  const [place,setPlace]=useState(0),[theme,setTheme]=useState(0),[person,setPerson]=useState(0)
  const [sound,setSound]=useState(false),[audioError,setAudioError]=useState('')
  const engine=useRef<NightSound|null>(null),busy=useRef(false)
  const tilt=topics[index].readings[view].tilt
  useEffect(()=>{if(engine.current)engine.current.tilt=tilt},[tilt])
  useEffect(()=>()=>engine.current?.stop(),[])
  async function toggleSound() {
    if(busy.current)return
    if(engine.current){engine.current.stop();engine.current=null;setSound(false);return}
    busy.current=true
    let ctx: AudioContext | undefined
    try {
      ctx=new AudioContext()
      await ctx.resume()
      engine.current=new NightSound(ctx);engine.current.tilt=tilt
      setSound(true);setAudioError('')
    } catch { if(ctx)void ctx.close();setAudioError('此浏览器暂时无法播放环境声。') }
    finally {busy.current=false}
  }
  const s=sections[tab]
  return <><header className="topbar"><div className="inner masthead"><div className="brand"><span className="brand-mark"><Icon name="feather" size={21}/></span><strong>文学档案馆</strong><i/><small>LITERARY ARCHIVES</small></div><button className={'sound'+(sound?' on':'')} onClick={toggleSound} aria-pressed={sound}><Icon name={sound?'audio':'mute'} size={16}/><span>环境音</span><i/><b>{sound?'开启':'关闭'}</b></button>{audioError&&<span role="alert" className="audio-error">{audioError}</span>}</div></header>
    <div className="hero"><div className="city"/><div className="inner hero-copy"><div className="dateline"><i/>САНКТ-ПЕТЕРБУРГ · 1866</div><h1>圣彼得堡的七月</h1><p>《罪与罚》意识流档案</p><div className="english-title">Crime and Punishment: St. Petersburg Dossier</div></div></div>
    <main className="inner" id="reading-room"><div className="section-title"><span className="section-numeral">{romans[tab]}</span><h2>{s.title}</h2><span className="section-en">{s.en}</span><span className="volume">卷 {romans[tab]} <i>/</i> III</span></div>
    {tab===0?<ScalePage index={index} setIndex={setIndex} view={view} setView={setView}/>:tab===1?<WalkPage index={place} setIndex={setPlace}/>:<VoicesPage theme={theme} setTheme={setTheme} person={person} setPerson={setPerson}/>}
    </main>
    <nav className="bottom" aria-label="档案分卷"><div className="nav-inner">{sections.map((item,i)=><button aria-current={tab===i?'page':undefined} className={tab===i?'selected':''} key={item.nav} onClick={()=>{if(tab!==i){setTab(i);window.scrollTo({top:0,behavior:'instant'})}}}><Icon name={item.icon} size={23}/><span><strong>{item.nav}</strong><small>{item.en}</small></span></button>)}</div></nav>
  </>
}
createRoot(document.getElementById('root')!).render(<App/>)
