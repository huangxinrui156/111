import { useEffect, useRef, useState } from 'react'
import { places, romans } from './archive'

const icons = {
  feather: 'M3 22l13-14M6 17C5 9 13 3 22 2c-1 5-3 9-6 12l-5 1 2 1-7 3M9 15l1-5m3 2 4-1',
  scale: 'M12 3v17m-5 1h10M3 7l9-2 9 2M5 7l-3 7h6L5 7Zm14 0-3 7h6l-3-7ZM2 14q3 5 6 0m8 0q3 5 6 0',
  map: 'M2 5l7-3 7 3 6-3v17l-6 3-7-3-7 3V5Zm7-3v17m7-14v17',
  voices: 'M9 13c3 0 4-3 4-5a4 4 0 0 0-8 0c0 3 1 5 4 5Zm-7 8v-2c0-3 3-5 7-5s7 2 7 5v2H2Zm13-17a4 4 0 0 1 0 8m3 2c3 1 4 3 4 6',
  audio: 'M3 10h4l5-5v14l-5-5H3zM16 9q3 3 0 6m3-9q6 6 0 12',
  mute: 'M3 10h4l5-5v14l-5-5H3zM16 9l6 6m0-6-6 6',
  flame: 'M13 2c2 5-1 6 1 9 2 0 3-2 3-4 6 7 4 15-5 15-8 0-11-7-7-12 0 3 2 4 3 4 2-4 0-7 5-12Z',
  drop: 'M12 2c-2 5-8 10-8 14a8 8 0 0 0 16 0c0-4-6-9-8-14Zm-4 14c0 2 1 4 4 4',
  temp: 'M10 14V5a2 2 0 1 1 4 0v9a5 5 0 1 1-4 0Zm2-6v10',
  pulse: 'M1 12h5l3-6 4 13 3-9 2 2h5',
  eye: 'M2 12q10-13 20 0-10 13-20 0Zm13 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0',
  book: 'M12 6q-4-4-10-3v16q5-1 10 3 5-4 10-3V3q-6-1-10 3v16',
  flip: 'M3 11a9 9 0 0 1 16-6l2 3m0-5v5h-5M21 13a9 9 0 0 1-16 6l-2-3m0 5v-5h5',
  arrow: 'M4 12h16m-6-6 6 6-6 6', sun: 'M12 3v3m0 12v3M3 12h3m12 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2m-3 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0'
}
export type IconName = keyof typeof icons
export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45"><path d={icons[name]}/></svg>
}
function useAngle(target: number) {
  const [angle, setAngle] = useState(target)
  const motion = useRef({ angle: target, velocity: 0 })
  useEffect(() => {
    const m = motion.current
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      m.angle = target; m.velocity = 0; setAngle(target); return
    }
    let frame = 0, last = performance.now()
    function tick(time: number) {
      const dt = Math.min((time - last) / 1000, 0.025)
      last = time
      m.velocity += ((target - m.angle) * 85 - 9 * m.velocity) * dt
      m.angle += m.velocity * dt
      setAngle(m.angle)
      if (Math.abs(target - m.angle) + Math.abs(m.velocity) > 0.015) frame = requestAnimationFrame(tick)
      else { m.angle = target; m.velocity = 0; setAngle(target) }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return angle
}
function Pan({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <g fill="none" stroke="#b99e74" strokeWidth="1.15">{[-45, -13, 4, 45].map((n,i)=><g key={n}><path d={`M0 5L${n} ${91+(i===1?2:0)}`}/><path d={`M2 6L${n+2} 91`} opacity=".6" strokeDasharray="2 2"/></g>)}</g>
    <path d="M-47 90Q0 81 47 90Q32 112 0 113Q-31 111-47 90Z" fill="url(#metal)" stroke="#d0ad74" strokeWidth="1.2"/>
    <path d="M-47 90Q0 100 47 90Q27 109 0 111Q-28 106-47 90Z" fill="url(#incised)"/>
    <path d="M-47 90Q0 99 47 90M-39 96Q2 110 39 96M-26 103Q2 112 26 103" fill="none" stroke="#463b2e" strokeWidth="1.25"/>
    <ellipse cy="90" rx="46.5" ry="4" fill="none" stroke="#d0b183" strokeWidth="1.3"/><circle r="3.4" cy="3" fill="#393329" stroke="#cfb282"/>
  </g>
}
export function Balance({ target }: { target: number }) {
  const a = useAngle(target), r = a * Math.PI / 180
  return <svg className="apparatus" role="img" aria-label="随阅读视角倾斜的黄铜天平" viewBox="0 0 460 242">
    <defs><linearGradient id="metal"><stop stopColor="#453a29"/><stop offset=".2" stopColor="#bb9b63"/><stop offset=".34" stopColor="#dfc99c"/><stop offset=".48" stopColor="#7b6241"/><stop offset=".68" stopColor="#453b2e"/><stop offset=".86" stopColor="#b99a63"/><stop offset="1" stopColor="#645138"/></linearGradient>
    <pattern id="incised" width="3" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(23)"><path d="M0 0V4" stroke="#231f19" strokeWidth="1"/></pattern></defs>
    <g stroke="#b59c73" fill="none" opacity=".23" strokeWidth=".7">
      <circle cx="230" cy="115" r="95" strokeDasharray="2 5"/><circle cx="230" cy="115" r="87" strokeDasharray="90 8 2 8"/>
      <path d="M45 148H413M230 5V232" strokeDasharray="7 4 1 4"/>
      {Array.from({length:65},(_,i)=><path key={i} d={`M230 17v${i%4===0?6:2.5}`} transform={`rotate(${i*4-128} 230 115)`}/>)}
    </g>
    <g fill="url(#metal)" stroke="#ba9a69" strokeWidth="1">
      <path d="M223 188Q228 177 227 155l1-84h4l1 84q-1 24 5 33Z"/>
      <path d="M225 78q-6-6-3-10l5-8h6l5 8q3 5-3 10Z"/>
      <path d="M227 49q-3-7 0-12l3-8 3 8q3 5 0 12Z"/><ellipse cx="230" cy="49" rx="6" ry="4"/>
      <path d="M222 184q8-4 16 0l2 5-4 5q2 8 14 11v5h-40v-5q13-4 15-11l-5-5Z"/>
      <path d="M209 205q21 4 42 0l6 5-3 3h-48l-3-3Z"/>
      <path d="M204 212q26 4 52 0l9 6v4h-70v-4Z"/><path d="M192 221q38 4 76 0l4 5q-42 5-84 0Z"/>
    </g>
    <path d="M229 84l-1 94m3-94 1 94m-7 10h11m-12 4h12m-21 17h31m-41 9h50m-58 6h66" stroke="#e3c99b" opacity=".68" fill="none"/>
    <g transform={`rotate(${a} 230 62)`} fill="url(#metal)" stroke="#d4b482" strokeWidth="1">
      <path d="M106 61q11 6 22 0l69-10q14-2 26 4l7 2 7-2q12-6 26-4l69 10q11 6 22 0l-2 8q-10 4-22-1l-69-10q-15-2-24 6l-7 4-7-4q-9-8-24-6l-69 10q-12 5-22 1Z"/>
      <path d="M108 62Q98 51 104 49q6-1 5 6m243 7q10-11 4-13-6-1-5 6M127 65l74-11m59 0 73 11" fill="none" strokeWidth="1.7"/>
    </g>
    <circle cx="230" cy="62" r="8" fill="url(#metal)" stroke="#ddc396"/><circle cx="230" cy="62" r="3.5" fill="#433b2b" stroke="#c5a670"/>
    {[-123,123].map(n=><Pan key={n} x={230+n*Math.cos(r)-3*Math.sin(r)} y={62+n*Math.sin(r)+3*Math.cos(r)}/>)}
    <g fill="none" stroke="#a88d66" opacity=".5" strokeWidth=".7">{Array.from({length:10},(_,i)=><path key={i} d={`M${173+i*2} ${229+i*.46}q48 ${i%3} ${112-i*3} 0`}/>)}</g>
  </svg>
}

export function CanalMap({ selected, choose }: { selected: number; choose: (i:number)=>void }) {
  return <svg className="canal-map" viewBox="0 0 500 228" aria-label="圣彼得堡文学地点示意图">
    <defs><pattern id="blocks" width="43" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)"><rect x="3" y="3" width="34" height="24" fill="#383a34" stroke="#777260" strokeWidth=".7"/><rect x="8" y="7" width="24" height="15" fill="url(#blockHatch)" stroke="#5b594c"/></pattern><pattern id="blockHatch" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 4l4-4" stroke="#77705a" strokeWidth=".7"/></pattern></defs>
    <rect width="500" height="228" fill="url(#blocks)"/>
    <g fill="none"><path d="M-20 146C77 80 135 192 218 120S299 31 364 62s107 5 155-44" stroke="#a69a7a" strokeWidth="25"/><path d="M-20 146C77 80 135 192 218 120S299 31 364 62s107 5 155-44" stroke="#303d3d" strokeWidth="22"/><path d="M-20 146C77 80 135 192 218 120S299 31 364 62s107 5 155-44" stroke="#66726a" strokeWidth="1" strokeDasharray="8 4"/>
    <path d="M84 78L136 60 247 52 224 95 173 133 209 162 318 149 365 127 411 82" stroke="#d6b689" strokeWidth="2" strokeDasharray="4 4"/></g>
    <g fill="#c9ba9c" fontFamily="Georgia" fontSize="9"><text x="16" y="202" letterSpacing="2">САНКТ-ПЕТЕРБУРГЪ</text><text x="17" y="216">1866</text><text x="468" y="182">N</text><path d="m471 188-4 17 4-4 4 4Z" fill="#c9ba9c"/></g>
    {places.map((p,i)=><g key={p.name} onClick={()=>choose(i)} role="button" tabIndex={0} aria-label={p.name} aria-pressed={i===selected} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(i)}}} className="map-point">
      <circle cx={p.x} cy={p.y} r="22" fill="transparent"/><circle cx={p.x} cy={p.y} r={i===selected?15:11} fill={i===selected?'#8c2d28':'#212423'} stroke="#d2bb91"/><text x={p.x} y={p.y+4} textAnchor="middle" fill="#f1e4cb" fontFamily="Georgia" fontSize="12">{romans[i]}</text>
    </g>)}
  </svg>
}
