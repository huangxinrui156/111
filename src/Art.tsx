import { useId } from 'react'
import type { Card, Family } from './deck'
import { suits } from './deck'

const ink = '#1A1D20',
  red = '#9E3B33',
  brass = '#B88A44',
  paper = '#F4EFE6'
const seq = (n: number) => Array.from({ length: n }, (_, i) => i)
const point = (r: number, a: number) =>
  [
    +(Math.sin((a * Math.PI) / 180) * r).toFixed(2),
    +(-Math.cos((a * Math.PI) / 180) * r).toFixed(2),
  ].join(',')
const star = (r: number, inside: number, n = 4) =>
  seq(2 * n)
    .map((i) => point(i % 2 ? inside : r, (i * 180) / n))
    .join(' ')
function Ticks({
  r,
  n = 60,
  length = 3,
}: {
  r: number
  n?: number
  length?: number
}) {
  return (
    <path
      fill="none"
      d={seq(n)
        .map(
          (i) =>
            'M' +
            point(r, (i * 360) / n) +
            'L' +
            point(r - (i % 5 === 0 ? length * 2 : length), (i * 360) / n),
        )
        .join('')}
    />
  )
}
function Gear({
  r = 16,
  n = 18,
  spokes = true,
}: {
  r?: number
  n?: number
  spokes?: boolean
}) {
  const edge = seq(n)
    .flatMap((i) =>
      [0, 0.15, 0.55, 0.7].map((f, j) =>
        point(j === 0 || j === 3 ? r * 0.89 : r, ((i + f) * 360) / n),
      ),
    )
    .join(' ')
  return (
    <g fill="none">
      <polygon points={edge} />
      <circle r={r * 0.71} />
      <circle r={r * 0.56} />
      <circle r={r * 0.18} />
      {spokes &&
        seq(8).map((i) => (
          <path
            key={i}
            transform={'rotate(' + i * 45 + ')'}
            d={`M0 ${-r * 0.2}L0 ${-r * 0.54}`}
          />
        ))}
    </g>
  )
}
const silhouettes: Record<Family, string> = {
  spades:
    'M0-44C-7-28-33-17-35 2C-38 23-16 34-3 16C-5 27-9 34-17 39Q0 35 17 39C9 32 6 24 4 16C18 33 39 22 35 1C31-18 9-30 0-44Z',
  hearts:
    'M0 41C-6 28-36 11-37-10C-39-34-13-44 0-22C15-45 41-32 37-9C34 12 10 27 0 41Z',
  clubs:
    'M0-42C-21-43-28-19-14-9C-39-18-48 8-34 21C-24 31-9 24-3 15C-4 26-9 34-17 40Q0 35 17 40C9 31 5 23 3 15C15 34 42 27 42 7C42-10 27-16 14-9C29-24 18-42 0-42Z',
  diamonds: 'M0-47Q13-20 35 0Q14 19 0 47Q-14 19-35 0Q-14-20 0-47Z',
  jokers:
    'M0-43 8-12 34-26 18-4 43 3 15 12 24 36 0 20-24 36-15 11-43 3-17-5-34-26-8-12Z',
}
export function SuitIcon({ family }: { family: Family }) {
  const color =
    family === 'hearts' || family === 'diamonds' ? '#c77a6b' : 'currentColor'
  return (
    <svg className="suit-icon" viewBox="-50 -50 100 100" aria-hidden="true">
      <path d={silhouettes[family]} fill={color} />
      <g stroke="var(--icon-cut, #202326)" strokeWidth="4" fill="none">
        <circle r="11" />
        <path d="M0-30V-11M0 11V26M-18 0H18" />
      </g>
    </svg>
  )
}
export type Layers = { line: boolean; ink: boolean; foil: boolean }
export const allLayers: Layers = { line: true, ink: true, foil: true }
function Emblem({ family, l }: { family: Family; l: Layers }) {
  const color = family === 'hearts' || family === 'diamonds' ? red : ink
  return (
    <g>
      <path
        d={silhouettes[family]}
        fill={l.ink ? color : 'none'}
        stroke={l.line ? color : 'none'}
        strokeWidth="1.2"
      />
      {l.foil && (
        <g stroke="#c09c60" strokeWidth=".67" fill="none">
          <path d={silhouettes[family]} transform="scale(.88)" />
          <path
            d={silhouettes[family]}
            transform="scale(.78)"
            strokeWidth=".4"
          />
          <path d="M0-32V29M-24 0H24M-16-11 16 11M-16 11 16-11" />
          <Gear r={12.7} n={17} />
          <circle r="4" fill={brass} />
          <circle r="1.8" fill={color} />
          {[-1, 1].map((k) => (
            <g key={k} transform={'scale(' + k + ' 1)'}>
              <path d="M5-8Q13-16 19-19M7 10Q14 14 21 14M6-12 12-22" />
              <circle cx="19" cy="-19" r="1.4" />
              <circle cx="21" cy="14" r="1.2" />
            </g>
          ))}
        </g>
      )}
    </g>
  )
}
function Compass({ r = 12 }: { r?: number }) {
  return (
    <g fill="none">
      <circle r={r * 0.63} />
      <polygon points={star(r, r * 0.18)} />
      <polygon points={star(r * 0.7, r * 0.14)} transform="rotate(45)" />
      <circle r={r * 0.11} fill="currentColor" stroke="none" />
    </g>
  )
}
export function ObservatoryMark() {
  return (
    <svg
      viewBox="-35 -35 70 70"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      <circle r="24" />
      <circle r="20" />
      <Ticks r={24} n={40} length={1.5} />
      <Compass r={32} />
      <path d="M-18-18 18 18M18-18-18 18" />
    </svg>
  )
}
function Corner({ l }: { l: Layers }) {
  return (
    <g fill="none">
      {l.foil && (
        <g stroke={brass} strokeWidth=".85">
          <path d="M7 32V8H34M10 26V11H28M9 35Q15 30 15 17Q27 17 34 10M17 15 25 13M13 23 12 30" />
          <path d="M10 40V45M37 10H46" />
          <circle cx="16.5" cy="16.5" r="2.5" />
          <circle cx="32" cy="10" r="1.2" />
        </g>
      )}
    </g>
  )
}
function Frame({ l }: { l: Layers }) {
  return (
    <>
      {l.line && (
        <g fill="none" stroke="#766c59" strokeWidth=".5">
          <rect x="5" y="5" width="200" height="296" rx="5" />
          <rect x="8" y="8" width="194" height="290" rx="3" />
        </g>
      )}
      {l.foil && (
        <g stroke={brass} fill="none" strokeWidth=".55">
          <path d="M40 11H170M40 295H170M11 49V257M199 49V257" />
          <path d="M88 13H98L105 16 112 13H122M88 293H98L105 290 112 293H122" />
          <path d="m105 11 2 2-2 2-2-2Z" />
        </g>
      )}
      {[
        ['0 0', 1, 1],
        ['210 0', -1, 1],
        ['0 306', 1, -1],
        ['210 306', -1, -1],
      ].map(([t, x, y], i) => (
        <g key={i} transform={`translate(${t}) scale(${x} ${y})`}>
          <Corner l={l} />
        </g>
      ))}
    </>
  )
}
function Instrument({ l, variant = 0 }: { l: Layers; variant?: number }) {
  return (
    <g fill="none" strokeWidth=".62">
      {l.line && (
        <g stroke="#746b5e" opacity=".76">
          <circle r="61" />
          <circle r="57" />
          <circle r="49" strokeDasharray="1 3" />
          <ellipse
            rx="73"
            ry="33"
            transform={`rotate(${-46 + variant * 12})`}
          />
          <ellipse
            rx="42"
            ry="74"
            transform="rotate(34)"
            strokeDasharray="2 3"
          />
          <path d="M-78 0H78M0-91V86M-53-52 53 52" strokeDasharray="11 3 1 3" />
          <Ticks r={61} n={72} length={2} />
        </g>
      )}
      {l.foil && (
        <g stroke={brass}>
          <circle r="65" />
          <circle r="66.8" strokeDasharray="60 5 19 5" />
          {seq(8).map((i) => (
            <g key={i} transform={'rotate(' + i * 45 + ') translate(0 -65)'}>
              <polygon points={star(i % 2 === 0 ? 5 : 3, 1)} fill={brass} />
            </g>
          ))}
          <circle cy="-78" r="3" />
          <circle cy="77" r="2" />
        </g>
      )}
    </g>
  )
}
function Specks({ l }: { l: Layers }) {
  return (
    <g>
      {seq(32).map((i) => {
        const x = 22 + ((i * 67) % 167),
          y = 50 + ((i * 83) % 201)
        return i % 4 === 0
          ? l.foil && (
              <g key={i} transform={`translate(${x} ${y})`}>
                <polygon points={star(3.2, 0.65)} fill={brass} />
              </g>
            )
          : l.line && (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i % 2 ? 0.55 : 0.8}
                fill="#84755d"
              />
            )
      })}
    </g>
  )
}
function Solar({ moon, l }: { moon: boolean; l: Layers }) {
  const edge = moon
    ? 'M11-19C-17-26-29 1-16 15Q-4 27 13 17C2 18-7 13-9 6L-3 4-8 0Q-9-5-4-8C-3-14 5-19 11-19Z'
    : 'M0-20C12-21 20-11 19 1C18 14 11 21 0 21C-13 20-19 11-19 0C-19-11-12-20 0-20Z'
  return (
    <g>
      {l.foil && (
        <g stroke={brass} strokeWidth=".65" fill="none">
          {moon ? (
            <>
              <circle r="30" strokeDasharray="1 3" />
              <ellipse rx="36" ry="25" transform="rotate(-28)" />
              {[0, 90, 180, 270].map((a) => (
                <g key={a} transform={'rotate(' + a + ') translate(0 -34)'}>
                  <polygon points={star(3.8, 0.9)} fill={brass} />
                </g>
              ))}
            </>
          ) : (
            seq(32).map((i) => (
              <g key={i} transform={'rotate(' + (i * 360) / 32 + ')'}>
                <path
                  d={
                    i % 2
                      ? 'M-1.8-23Q-3-29 1-34Q3-38 1-42Q6-34 2-29L2-23'
                      : 'M-2-23 0-47 2-23Z'
                  }
                  fill={i % 2 ? 'none' : '#e4c88e'}
                />
              </g>
            ))
          )}
          <circle r="23" />
          <circle r="25.5" strokeDasharray="1.3 2" />
        </g>
      )}
      <path
        d={edge}
        fill={l.ink ? (moon ? '#abaca7' : '#e6ce97') : 'none'}
        stroke={l.line ? ink : 'none'}
        strokeWidth="1"
      />
      {l.line && (
        <g stroke={ink} strokeWidth=".8" fill="none">
          {moon ? (
            <>
              <path d="M-17-5Q-12-10-8-6M-16-4Q-12-2-9-5M-11 9Q-8 11-6 9" />
              <path d="M-20-5Q-24 9-12 16M-19-8Q-23 3-20 7" />
            </>
          ) : (
            <>
              <path d="M-16-4Q-9-11-3-5M3-5Q10-11 16-4M-15-2Q-9-7-4-2Q-9 2-15-2ZM4-2Q10-7 15-2Q9 2 4-2ZM0-7Q-2 0-3 5Q0 7 3 5M-7 11Q-3 9 0 10Q3 9 7 11Q0 14-7 11ZM-3 15Q0 17 4 15" />
              <circle cx="-9" cy="-2" r="1.6" fill={ink} />
              <circle cx="9" cy="-2" r="1.6" fill={ink} />
              {seq(6).map((i) => (
                <path
                  key={i}
                  d={`M${-17 + i * 0.6} ${i}l3 3M${17 - i * 0.6} ${i}l-3 3M${-11 + i * 2} -15l1 -2`}
                />
              ))}
            </>
          )}
        </g>
      )}
    </g>
  )
}
function CourtHalf({ card, l }: { card: Card; l: Layers }) {
  const f = suits.indexOf(card.family as (typeof suits)[number]),
    k = ['J', 'Q', 'K'].indexOf(card.rank)
  const coat = f % 2 ? red : ink,
    stroke = l.line ? ink : 'none',
    fill = (c: string) => (l.ink ? c : 'none')
  return (
    <g transform={'scale(' + [1, -1, -1, 1][f] + ' 1)'}>
      {l.foil && (
        <g fill="none" stroke={brass} strokeWidth=".8">
          <circle cx="1" cy="-45" r={28 + f * 2} />
          <path d="M-50 0V-69M-52-55V-68L-50-76-48-68V-55Z" />
          <g transform="translate(40 -37)">
            {f === 0 && (
              <>
                <circle r="14" />
                <ellipse rx="6" ry="14" transform="rotate(-20)" />
                <ellipse rx="14" ry="5" transform="rotate(-20)" />
                <path d="m-7 18 14-36M0 14v7m-7 0H7" />
              </>
            )}
            {f === 1 && (
              <>
                <path d="M-13 9a16 16 0 0 0 26 0M-10 6a13 13 0 0 0 20 0M0-19 6 8" />
                <circle cy="-19" r="2" />
                <circle cx="6" cy="9" r="5" />
                <circle cx="6" cy="9" r="3" />
              </>
            )}
            {f === 2 && (
              <>
                <Gear r={12} n={16} />
                <g transform="translate(-8 16)">
                  <Gear r={7} n={12} />
                </g>
              </>
            )}
            {f === 3 && (
              <>
                <path d="m0-17-13 34 4-3L0-9 10 14l4 4ZM-9 5q9 7 18 0M-10 8q10 7 20 0" />
                <circle cy="-16" r="4" />
                <circle cy="-16" r="1.6" />
              </>
            )}
          </g>
        </g>
      )}
      <g stroke={stroke} strokeWidth="1" strokeLinejoin="round">
        <path
          d="M-40-2Q-38-17-22-23L-12-28-10-42 7-43 8-27Q25-23 33-13L41 0H-41Z"
          fill={fill(coat)}
        />
        <path d="M-18-24Q-4-15 10-27L22-23Q10-6-5-3Z" fill={fill('#d7c49d')} />
        <path
          d="M-7-31Q-18-31-18-47C-24-64-14-75 0-75C14-76 21-66 18-56L22-49 17-47 17-43 14-42 15-40Q14-36 7-36L6-28"
          fill={fill('#e7dbc5')}
        />
        <path
          d="M-16-39Q-29-48-22-60Q-22-74-7-77Q12-80 18-66Q9-66 5-60Q-4-63-6-54L-9-47-8-37Z"
          fill={fill(coat)}
        />
        <path
          d="M7-56Q13-60 18-55M8-54Q13-56 16-53Q11-52 8-54ZM14-43 18-43M9-39 14-40M-6-51Q-12-58-14-51Q-14-47-10-45"
          fill="none"
        />
        {k === 2 && (
          <path
            d="M-8-45Q-2-38 5-43Q13-45 15-41L12-30 1-21-8-31Z"
            fill={fill(coat)}
          />
        )}
        <path
          d={
            [
              'M-24-65Q-24-81-6-82Q6-94 22-83L13-72-17-65Z',
              'M-22-67Q-12-84-15-91L-5-82 1-94 5-81 19-87 16-70Z',
              'M-21-67-26-88-15-80-12-92-3-82 4-95 10-82 22-90 16-70Z',
            ][k]
          }
          fill={fill(k === 0 ? coat : '#dec69b')}
        />
        <path
          d="M-22-71Q-4-71 17-76L16-70Q-1-65-20-65Z"
          fill={fill('#cbb487')}
        />
        {k === 1 && (
          <path
            d="M-21-64Q-39-43-25-28Q-36-46-15-61L-14-35-21-21-29-24"
            fill={fill('#ceb889')}
          />
        )}
      </g>
      {l.line && (
        <g fill="none" stroke={ink} strokeWidth=".6">
          {seq(8).map((i) => (
            <path
              key={i}
              d={`M${-5 + i * 1.2} ${-52 + i * 0.5}q4 4 5 8M${-11 + i * 2} -67q0-4 3-7`}
            />
          ))}
        </g>
      )}
      {l.foil && (
        <g fill="none" stroke="#ba995f" strokeWidth=".75">
          {seq(9).map((i) => (
            <path
              key={i}
              d={`M${-33 + i * 2} -3q1 -8 ${7 + i * 0.25} -14M${11 + i * 2} -2l8 -9M${-22 + i * 1.5} -49q-3 -9 5 -14`}
            />
          ))}
          <path d="M-22-19Q-9-8 1-7Q12-10 19-21M-2-23 1-10 7-22" />
          <g transform="translate(2 -10)">
            <Compass r={5} />
          </g>
          {seq(5).map((i) => (
            <circle key={i} cx={-15 + i * 6} cy={-69 - i * 0.8} r="1.2" />
          ))}
        </g>
      )}
      <g
        transform={`translate(-35 -34) rotate(${-16 + f * 7})`}
        stroke={l.line ? ink : 'none'}
        fill="none"
      >
        <path d="M0 28V-15" />
        {k === 0 ? (
          <path d="M-2 4V-25L0-36 2-25V4Z" fill={fill('#ba9e67')} />
        ) : k === 1 ? (
          <>
            <circle cy="-15" r="10" />
            <ellipse cy="-15" rx="5" ry="10" />
            <path d="m-9-10 18-10" />
          </>
        ) : (
          <g transform="translate(0 -19)">
            <Compass r={12} />
          </g>
        )}
      </g>
    </g>
  )
}
const pipPositions: Record<number, number[][]> = {
  2: [
    [0, -48],
    [0, 48],
  ],
  3: [
    [0, -51],
    [0, 0],
    [0, 51],
  ],
  4: [
    [-31, -43],
    [31, -43],
    [-31, 43],
    [31, 43],
  ],
  5: [
    [-31, -49],
    [31, -49],
    [0, 0],
    [-31, 49],
    [31, 49],
  ],
  6: [
    [-31, -50],
    [31, -50],
    [-31, 0],
    [31, 0],
    [-31, 50],
    [31, 50],
  ],
  7: [
    [-31, -53],
    [31, -53],
    [0, -27],
    [-31, 0],
    [31, 0],
    [-31, 53],
    [31, 53],
  ],
  8: [
    [-31, -55],
    [31, -55],
    [0, -28],
    [-31, 0],
    [31, 0],
    [0, 28],
    [-31, 55],
    [31, 55],
  ],
  9: [
    [-31, -60],
    [31, -60],
    [-31, -20],
    [31, -20],
    [0, 0],
    [-31, 20],
    [31, 20],
    [-31, 60],
    [31, 60],
  ],
  10: [
    [-31, -62],
    [31, -62],
    [0, -41],
    [-31, -21],
    [31, -21],
    [-31, 21],
    [31, 21],
    [0, 41],
    [-31, 62],
    [31, 62],
  ],
}
export function CardArt({
  card,
  l = allLayers,
  back = false,
  plate = false,
}: {
  card: Card
  l?: Layers
  back?: boolean
  plate?: boolean
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const joker = card.family === 'jokers',
    court = ['J', 'Q', 'K'].includes(card.rank)
  const color =
    card.family === 'hearts' || card.family === 'diamonds' ? red : ink
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 210 306"
      className="card-art"
      role="img"
      aria-label={back ? '星盘齿轮牌背' : card.name}
    >
      <defs>
        <pattern
          id={uid + 'p'}
          width="9"
          height="11"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="m1 2 1.5-.3m3 5 1 .3"
            stroke="#806c4c"
            opacity=".18"
            strokeWidth=".42"
          />
        </pattern>
        <linearGradient
          id={uid + 'g'}
          x2=".9"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop stopColor="#9c783d" />
          <stop offset=".35" stopColor="#e2ca90" />
          <stop offset=".53" stopColor="#ae8648" />
          <stop offset=".86" stopColor="#d4b97b" />
          <stop offset="1" stopColor="#957543" />
        </linearGradient>
      </defs>
      {back ? (
        <CardBack gradient={uid + 'g'} />
      ) : (
        <>
          {!plate && (
            <>
              <rect width="210" height="306" rx="8" fill={paper} />
              <rect
                width="210"
                height="306"
                rx="8"
                fill={'url(#' + uid + 'p)'}
              />
            </>
          )}
          <Frame l={l} />
          <Specks l={l} />
          {[false, true].map((rot) => (
            <g
              key={String(rot)}
              transform={rot ? 'rotate(180 105 153)' : undefined}
            >
              {joker ? (
                l.ink && (
                  <text
                    transform="translate(27 55) rotate(-90)"
                    fontSize="9"
                    letterSpacing="1.4"
                    textAnchor="middle"
                    fill={ink}
                  >
                    JOKER
                  </text>
                )
              ) : (
                <>
                  {l.ink && (
                    <text
                      x="26"
                      y="43"
                      textAnchor="middle"
                      fill={color}
                      fontSize={card.rank === '10' ? 24 : 30}
                    >
                      {card.rank}
                    </text>
                  )}
                  <g transform="translate(26 54) scale(.15)">
                    <Emblem family={card.family} l={l} />
                  </g>
                </>
              )}
              {l.foil && (
                <g
                  transform={rot ? 'translate(105 24)' : 'translate(105 36)'}
                  stroke={brass}
                  strokeWidth=".7"
                >
                  <Compass r={7} />
                </g>
              )}
            </g>
          ))}
          <g transform="translate(105 153)">
            {card.rank === 'A' ? (
              <>
                <Instrument
                  l={l}
                  variant={suits.indexOf(card.family as (typeof suits)[number])}
                />
                <g transform="scale(1.22)">
                  <Emblem family={card.family} l={l} />
                </g>
              </>
            ) : joker ? (
              <>
                <Instrument l={l} />
                {[0, 180].map((a) => (
                  <g key={a} transform={`rotate(${a}) translate(0 -36)`}>
                    <Solar moon={card.id === 'moon'} l={l} />
                  </g>
                ))}
              </>
            ) : court ? (
              <>
                <Instrument l={l} />
                {[0, 180].map((a) => (
                  <g key={a} transform={'rotate(' + a + ')'}>
                    <CourtHalf card={card} l={l} />
                  </g>
                ))}
              </>
            ) : (
              <>
                {l.line && (
                  <g
                    fill="none"
                    stroke="#aa9b82"
                    opacity=".6"
                    strokeWidth=".55"
                  >
                    <ellipse rx="52" ry="79" strokeDasharray="1 4" />
                    <path d="M-62 0H62M0-87V87" strokeDasharray="8 4 1 4" />
                  </g>
                )}
                {pipPositions[Number(card.rank)].map(([x, y], i) => (
                  <g
                    key={i}
                    transform={`translate(${x} ${y}) rotate(${y > 0 ? 180 : 0}) scale(${Number(card.rank) < 4 ? 0.45 : 0.34})`}
                  >
                    <Emblem family={card.family} l={l} />
                  </g>
                ))}
              </>
            )}
          </g>
          {l.line && (
            <g textAnchor="middle" fill={color}>
              <text x="105" y="57" fontSize="6.3" letterSpacing="1.8">
                {joker
                  ? card.id === 'sun'
                    ? 'FIG. SOLIS'
                    : 'FIG. LUNAE'
                  : 'TAB. ' + String(card.ordinal).padStart(3, '0')}
              </text>
              <text
                x="105"
                y="261"
                fontSize={card.latin.length > 15 ? 9 : 10.5}
                letterSpacing="1.1"
              >
                {card.latin.toUpperCase()}
              </text>
              <text x="105" y="273" fontSize="5.3" letterSpacing="1.9">
                {card.english.toUpperCase()}
              </text>
            </g>
          )}
        </>
      )}
    </svg>
  )
}
function CardBack({ gradient }: { gradient: string }) {
  const metal = 'url(#' + gradient + ')'
  return (
    <>
      <rect width="210" height="306" rx="8" fill="#1b292c" />
      <g stroke={metal} fill="none" strokeWidth=".8">
        {[4, 7, 10, 14, 18].map((p) => (
          <rect
            key={p}
            x={p}
            y={p}
            width={210 - 2 * p}
            height={306 - 2 * p}
            rx={p > 12 ? 15 : 4}
          />
        ))}
        {[0, 180].map((a) => (
          <g key={a} transform={'rotate(' + a + ' 105 153)'}>
            {seq(18).map((i) => (
              <path
                key={i}
                strokeWidth=".48"
                d={`M${14 + i * 3} 16Q${105 + i * 2} ${64 + i * 2} ${196 - i * 3} 16M14 ${25 + i * 3}Q${70 + i * 2} ${94 + i * 2} 14 ${128 + i * 2}M196 ${25 + i * 3}Q${140 - i * 2} ${94 + i * 2} 196 ${128 + i * 2}`}
              />
            ))}
            {[26, 184].map((x) => (
              <g key={x} transform={`translate(${x} 29)`}>
                <Gear r={13} />
                <Compass r={17} />
              </g>
            ))}
            <g transform="translate(105 50)">
              <circle r="25" />
              <circle r="22" />
              <Ticks r={22} n={48} length={2} />
              <Compass r={18} />
            </g>
            <g transform="translate(105 88)">
              <Gear r={15} n={16} />
            </g>
          </g>
        ))}
        <g transform="translate(105 153)">
          <circle r="80" fill="#1b292c" />
          {[79, 76, 72, 65, 59, 52, 48, 39, 32, 23, 18, 10].map((r) => (
            <circle key={r} r={r} />
          ))}
          <Ticks r={76} n={120} length={3.5} />
          <Ticks r={47} n={72} length={2} />
          {seq(24).map((i) => (
            <g key={i} transform={'rotate(' + i * 15 + ')'}>
              <path d="M0-66Q10-49 0-33Q-10-49 0-66ZM0-65V-52" />
              <circle cy="-69" r="1" />
            </g>
          ))}
          <Gear r={37} n={32} spokes={false} />
          <Compass r={31} />
        </g>
      </g>
    </>
  )
}
export function SkyChart() {
  return (
    <svg
      className="sky-chart"
      viewBox="0 0 750 340"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="#c3aa75" fill="none" strokeWidth=".6" opacity=".35">
        <g transform="translate(438 176) rotate(-18)">
          {[111, 131, 148, 153, 174, 210, 222, 254].map((r) => (
            <circle
              key={r}
              r={r}
              strokeDasharray={r === 174 ? '2 6' : undefined}
            />
          ))}
          <Ticks r={153} n={144} length={3} />
          <Ticks r={222} n={90} length={3} />
          <ellipse rx="302" ry="95" />
          <ellipse rx="300" ry="85" transform="rotate(68)" />
          <path
            d="M-410 0H400M0-360V360M-300-300 300 300"
            strokeDasharray="12 5 1 5"
          />
        </g>
        <path d="m38 119 49-53 39 10 33-32 37 42M580 241l34-34 48 8 32-55" />
      </g>
      {seq(140).map((i) => (
        <g
          key={i}
          fill={i % 7 ? '#eadab6' : '#d1b26e'}
          opacity={0.25 + (i % 6) * 0.11}
          transform={`translate(${(i * 103.79 + 19) % 750} ${(i * i * 17.21 + 23) % 340})`}
        >
          {i % 11 === 0 ? (
            <polygon points={star(3.4, 0.64)} />
          ) : (
            <circle r={0.5 + (i % 3) * 0.23} />
          )}
        </g>
      ))}
    </svg>
  )
}
