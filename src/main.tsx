import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { archive, deck, suits, suitInfo, sun } from './deck'
import type { Card, Family } from './deck'
import { ObservatoryMark, SkyChart, SuitIcon } from './Art'
import { Icon, Plate } from './UI'
import { Inspector } from './Inspector'
import { Spread, Craft } from './Atelier'
import './style.css'

const tabs = [
  ['grid', '全副图鉴', 'Deck Archive'],
  ['spread', '牌阵抽牌', 'Spread Draw'],
  ['craft', '工艺透视', 'Craft & Foil'],
] as const
type Tab = (typeof tabs)[number][0]
function App() {
  const [tab, setTab] = useState<Tab>('grid'),
    [family, setFamily] = useState<Family | 'all'>('all')
  const [viewer, setViewer] = useState<{
    cards: Card[]
    initial: number
  } | null>(null)
  const cards =
    family === 'all' ? archive : deck.filter((c) => c.family === family)
  function navigate(next: Tab) {
    setTab(next)
    window.scrollTo(0, 0)
  }
  const navigation = (mobile: boolean) => (
    <nav
      className={mobile ? 'mobile-nav' : 'top-nav'}
      aria-label={mobile ? '移动导航' : '主导航'}
    >
      {tabs.map(([id, cn, en]) => (
        <button
          key={id}
          aria-current={id === tab ? 'page' : undefined}
          onClick={() => navigate(id)}
        >
          <Icon name={id} />
          <span>
            {cn}
            <small>{en}</small>
          </span>
        </button>
      ))}
    </nav>
  )
  return (
    <>
      <header className="site-head">
        <div className="head-inner">
          <button
            className="wordmark"
            onClick={() => navigate('grid')}
            aria-label="星象典藏馆首页"
          >
            <ObservatoryMark />
            <span>
              星象典藏馆<small>CELESTIAL ARCHIVE</small>
            </span>
          </button>
          {navigation(false)}
          <span className="edition">
            <i /> 数字典藏 <b>/</b> VOL. I
          </span>
        </div>
      </header>
      <main>
        {tab === 'grid' ? (
          <>
            <section className="hero">
              <SkyChart />
              <div className="hero-hair" />
              <div className="hero-content">
                <div className="eyebrow">
                  <b />
                  典藏系列 <span>/</span> COLLECTION № 001
                </div>
                <h1>星象与机械历法</h1>
                <p className="hero-en">Celestial Horology Playing Cards</p>
                <p className="hero-desc">
                  以星图为经，齿轮为纬。
                  <br />
                  一副镌刻于象牙棉纸之上的天文台典藏扑克牌。
                </p>
                <button
                  className="brass-button"
                  onClick={() =>
                    setViewer({ cards: archive, initial: archive.indexOf(sun) })
                  }
                >
                  <Icon name="expand" />
                  检视典藏牌
                  <Icon name="arrow" />
                </button>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="fan-card fan-ace">
                  <Plate card={deck[0]} />
                </div>
                <div className="fan-card fan-back">
                  <Plate card={sun} back />
                </div>
                <div className="fan-card fan-sun">
                  <Plate card={sun} />
                </div>
              </div>
              <span className="figure-note">
                FIG. 01 <i /> SOLAR STUDY
              </span>
            </section>
            <section
              className="archive-section"
              aria-labelledby="archive-title"
            >
              <div className="section-row">
                <div>
                  <div className="eyebrow">
                    <b />
                    THE DECK ARCHIVE
                  </div>
                  <h2 id="archive-title">全副图鉴</h2>
                </div>
                <span className="catalogue-count">
                  <span>{String(cards.length).padStart(2, '0')}</span> / 54{' '}
                  <i /> 张藏牌
                </span>
              </div>
              <div className="filters" aria-label="筛选花色">
                {(['all', ...suits, 'jokers'] as const).map((f) => (
                  <button
                    key={f}
                    aria-pressed={family === f}
                    onClick={() => setFamily(f)}
                  >
                    {f === 'all' ? (
                      <Icon name="grid" />
                    ) : (
                      <SuitIcon family={f} />
                    )}
                    <span>{f === 'all' ? '全部' : suitInfo[f].cn}</span>
                  </button>
                ))}
              </div>
              <div className="gallery">
                {cards.map((c, i) => (
                  <button
                    className="entry"
                    key={c.id}
                    onClick={() => setViewer({ cards, initial: i })}
                    aria-label={'检视' + c.name}
                  >
                    <div className="mount">
                      <Plate card={c} lazy={i > 5} />
                      <span className="open-mark">
                        <Icon name="expand" />
                      </span>
                    </div>
                    <div className="caption">
                      <span>
                        <strong>{c.name}</strong>
                        <em>{c.english}</em>
                      </span>
                      <small>№ {String(c.ordinal).padStart(3, '0')}</small>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : tab === 'spread' ? (
          <Spread />
        ) : (
          <Craft />
        )}
      </main>
      <footer>
        <ObservatoryMark />
        <span>星象与机械历法</span>
        <i />
        Celestial Horology Playing Cards
      </footer>
      {navigation(true)}
      {viewer && <Inspector {...viewer} close={() => setViewer(null)} />}
    </>
  )
}
createRoot(document.getElementById('root')!).render(<App />)
