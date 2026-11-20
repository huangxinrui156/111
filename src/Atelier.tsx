import { useEffect, useRef, useState } from 'react'
import { allLayers, CardArt, SkyChart } from './Art'
import type { Layers } from './Art'
import { archive, deck, sun } from './deck'
import { custom, Icon, Plate } from './UI'

function shuffled() {
  const pack = deck.slice()
  for (let i = pack.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const card = pack[i]
    pack[i] = pack[j]
    pack[j] = card
  }
  return pack
}
export function Spread() {
  const [mode, setMode] = useState(1),
    [pack, setPack] = useState(shuffled),
    [drawn, setDrawn] = useState(false)
  const [shown, setShown] = useState<number[]>([]),
    [mixing, setMixing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  function reset(count = mode) {
    setMode(count)
    setDrawn(false)
    setShown([])
    setPack(shuffled())
  }
  function mix() {
    reset()
    setMixing(true)
    timer.current = setTimeout(() => setMixing(false), 1050)
  }
  function reveal(i: number) {
    if (shown.includes(i)) return
    setShown((v) => [...v, i])
    navigator.vibrate?.(12)
  }
  return (
    <section className="workroom">
      <div className="work-title">
        <div className="eyebrow">
          <b />
          THE DRAWING TABLE
        </div>
        <h1>牌阵抽牌</h1>
        <p className="latin">The Celestial Spread</p>
      </div>
      <div className="work-desk">
        <SkyChart />
        <div className="desk-controls">
          <div className="segmented">
            {[1, 3].map((n) => (
              <button
                key={n}
                disabled={mixing}
                aria-pressed={mode === n}
                onClick={() => reset(n)}
              >
                {n === 1 ? '单张指引' : '三张时序'}
              </button>
            ))}
          </div>
        </div>
        <div
          className={'draw-field ' + (drawn ? 'dealt' : '')}
          aria-busy={mixing}
        >
          {drawn ? (
            pack.slice(0, mode).map((c, i) => (
              <div className="draw-place" key={c.id}>
                <button
                  className="draw-card"
                  aria-label={
                    shown.includes(i) ? c.name : '揭开' + (i + 1) + '号牌'
                  }
                  onClick={() => reveal(i)}
                >
                  <span
                    className={'flipper ' + (shown.includes(i) ? 'turned' : '')}
                  >
                    <span className="face">
                      <Plate card={c} back />
                    </span>
                    <span className="face reverse">
                      <Plate card={c} />
                    </span>
                  </span>
                </button>
                <span className="draw-label">
                  {mode === 3 ? ['过去', '现在', '未来'][i] : '指引'} ·{' '}
                  {shown.includes(i) ? c.name : '待揭示'}
                </span>
              </div>
            ))
          ) : (
            <div className={'pile ' + (mixing ? 'mixing' : '')}>
              {[-2, -1, 0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={custom({
                    '--angle': i * 7 + 'deg',
                    '--fan': i * 18 + 'deg',
                    '--shift': i * 5 + 'px',
                  })}
                >
                  <Plate card={sun} back />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="desk-buttons">
          <button className="outline-button" disabled={mixing} onClick={mix}>
            <Icon name="shuffle" />
            {mixing ? '洗牌中' : '洗牌'}
          </button>
          <button
            className="brass-button"
            disabled={mixing}
            onClick={() => {
              if (drawn) reset()
              else setDrawn(true)
            }}
          >
            {drawn ? '重新起牌' : mode === 1 ? '抽取一张' : '抽取三张'}
            <Icon name="arrow" />
          </button>
        </div>
      </div>
      <div className="reading" aria-live="polite">
        {mixing
          ? '正在展开并归拢牌组。'
          : drawn
            ? shown.length === 0
              ? '轻触牌背，揭开本次牌阵。'
              : pack.slice(0, mode).map(
                  (c, i) =>
                    shown.includes(i) && (
                      <p key={c.id}>
                        <strong>
                          {mode === 3
                            ? ['过去', '现在', '未来'][i] + ' · '
                            : ''}
                          {c.name}
                        </strong>
                        {c.meaning}
                      </p>
                    ),
                )
            : '选择牌阵，洗牌后抽取本次观测的指引。'}
      </div>
    </section>
  )
}
const processes: [keyof Layers, string, string, string][] = [
  ['line', '线稿层', 'Engraved linework', '以细线记录轮廓、刻度与星象坐标。'],
  [
    'ink',
    '油墨层',
    'Letterpress ink',
    '以墨黑与朱砂压印花色、角标与主体色块。',
  ],
  ['foil', '烫金箔层', 'Brass foil', '将黄铜光泽留给轮缘、星芒与边框。'],
]
export function Craft() {
  const [id, setId] = useState(sun.id),
    [layers, setLayers] = useState<Layers>(allLayers)
  const card = deck.find((c) => c.id === id)!
  return (
    <section className="workroom">
      <div className="work-title">
        <div className="eyebrow">
          <b />
          THE PRINTING ROOM
        </div>
        <h1>印刷工艺透视</h1>
        <p className="latin">Craft &amp; Foil</p>
      </div>
      <div className="craft-desk">
        <div className="craft-stage">
          <SkyChart />
          <div className="craft-plate">
            <CardArt card={card} l={layers} />
          </div>
          <span className="micro">{card.serial}</span>
        </div>
        <div className="craft-panel">
          <label className="micro" htmlFor="specimen">
            选择样张 · SPECIMEN
          </label>
          <select
            id="specimen"
            value={id}
            onChange={(e) => setId(e.target.value)}
          >
            {archive.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} / {c.english}
              </option>
            ))}
          </select>
          <h2>印版分层</h2>
          {processes.map(([key, cn, en, hint]) => (
            <button
              className="process"
              role="switch"
              aria-checked={layers[key]}
              key={key}
              onClick={() => setLayers((v) => ({ ...v, [key]: !v[key] }))}
            >
              <span>
                <strong>{cn}</strong> <i>{en}</i>
                <small>{hint}</small>
              </span>
              <span className="switch" />
            </button>
          ))}
          <p className="craft-count" aria-live="polite">
            已叠印 {Object.values(layers).filter(Boolean).length} / 3 层
          </p>
        </div>
      </div>
    </section>
  )
}
