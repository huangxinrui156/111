import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import type { Card } from './deck'
import { asset, custom, Icon, Plate } from './UI'

export function Inspector({
  cards,
  initial,
  close,
}: {
  cards: Card[]
  initial: number
  close: () => void
}) {
  const [index, setIndex] = useState(initial),
    [back, setBack] = useState(false),
    [tilt, setTilt] = useState([0, 0])
  const dialog = useRef<HTMLDialogElement>(null),
    start = useRef<[number, number]>([0, 0])
  const fingers = useRef(new Map<number, [number, number]>()),
    multi = useRef(false),
    cancelled = useRef(false)
  const card = cards[index]
  function step(delta: number) {
    setIndex((i) => (i + delta + cards.length) % cards.length)
    setBack(false)
    setTilt([0, 0])
  }
  useEffect(() => {
    const node = dialog.current!,
      previous = document.activeElement as HTMLElement
    node.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      node.close()
      document.body.style.overflow = ''
      previous?.focus({ preventScroll: true })
    }
  }, [])
  function move(e: PointerEvent<HTMLButtonElement>) {
    if (e.pointerType !== 'mouse' && !fingers.current.has(e.pointerId)) return
    const rect = e.currentTarget.getBoundingClientRect()
    let x = e.clientX,
      y = e.clientY
    if (fingers.current.has(e.pointerId)) {
      fingers.current.set(e.pointerId, [x, y])
      const values = [...fingers.current.values()]
      x = values.reduce((a, p) => a + p[0], 0) / values.length
      y = values.reduce((a, p) => a + p[1], 0) / values.length
    }
    setTilt([
      Math.max(-1, Math.min(1, (2 * (x - rect.left)) / rect.width - 1)),
      Math.max(-1, Math.min(1, (2 * (y - rect.top)) / rect.height - 1)),
    ])
  }
  function end(e: PointerEvent<HTMLButtonElement>) {
    if (!fingers.current.has(e.pointerId)) return
    fingers.current.delete(e.pointerId)
    const dx = e.clientX - start.current[0],
      dy = e.clientY - start.current[1]
    if (
      !multi.current &&
      !cancelled.current &&
      (Math.hypot(dx, dy) < 9 ||
        (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5))
    )
      setBack((v) => !v)
    if (!fingers.current.size) setTilt([0, 0])
  }
  return (
    <dialog
      ref={dialog}
      className="inspector"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') step(-1)
        if (e.key === 'ArrowRight') step(1)
      }}
    >
      <div className="inspect-top">
        <span className="micro">
          PLATE INSPECTION <i /> 藏品检视
        </span>
        <button
          className="icon-btn"
          autoFocus
          aria-label="退出检视"
          onClick={close}
        >
          <Icon name="close" />
        </button>
      </div>
      <div className="inspect-layout">
        <section className="specimen">
          <button
            className="turn-card"
            aria-label="翻转当前牌"
            style={custom({
              '--tx': -tilt[1] * 13 + 'deg',
              '--ty': tilt[0] * 16 + 'deg',
              '--shine': 50 + tilt[0] * 45 + tilt[1] * 12 + '%',
            })}
            onPointerDown={(e) => {
              if (!fingers.current.size) {
                multi.current = false
                cancelled.current = false
                start.current = [e.clientX, e.clientY]
              }
              fingers.current.set(e.pointerId, [e.clientX, e.clientY])
              if (fingers.current.size > 1) multi.current = true
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={() => {
              if (!fingers.current.size) setTilt([0, 0])
            }}
            onPointerCancel={(e) => {
              fingers.current.delete(e.pointerId)
              cancelled.current = true
              setTilt([0, 0])
            }}
            onClick={(e) => {
              if (e.detail === 0) setBack((v) => !v)
            }}
          >
            <span className="tilter">
              <span className={'flipper ' + (back ? 'turned' : '')}>
                <span className="face">
                  <Plate card={card} />
                  <span
                    className="foil-light"
                    style={{
                      maskImage: 'url(' + asset(card.id + '-foil') + ')',
                    }}
                  />
                </span>
                <span className="face reverse">
                  <Plate card={card} back />
                  <span className="back-light" />
                </span>
              </span>
            </span>
          </button>
          <p className="gesture">轻触或横滑翻面 · 拖动倾斜观赏金箔</p>
        </section>
        <div className="inspect-notes">
          <span className="micro">
            CATALOGUE № {String(card.ordinal).padStart(3, '0')}
          </span>
          <h2>{card.name}</h2>
          <p className="latin">{card.english}</p>
          <div className="note-block">
            <h3>设计寓意</h3>
            <p>{card.meaning}</p>
            <h3>几何比例</h3>
            <p>{card.geometry} 统一画幅比例为 35∶51。</p>
            <h3>星象铭文</h3>
            <p className="latin">
              {card.latin} · {card.serial}
            </p>
          </div>
          <div className="inspect-actions">
            <button className="brass-button" onClick={() => setBack((v) => !v)}>
              <Icon name="flip" />
              {back ? '查看牌面' : '查看牌背'}
            </button>
            <button
              className="icon-btn"
              onClick={() => step(-1)}
              aria-label="上一张"
            >
              <Icon name="left" />
            </button>
            <button
              className="icon-btn"
              onClick={() => step(1)}
              aria-label="下一张"
            >
              <Icon name="right" />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
