import type { CSSProperties } from 'react'
import type { Card } from './deck'
const paths = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx=".6" />
      <rect x="14" y="3" width="7" height="7" rx=".6" />
      <rect x="3" y="14" width="7" height="7" rx=".6" />
      <rect x="14" y="14" width="7" height="7" rx=".6" />
    </>
  ),
  spread: (
    <>
      <path d="m5 8-3 1 3 12 3-1M8 6l-2 1 3 13 3-1" />
      <rect x="11" y="3" width="10" height="16" rx="1.5" />
      <path d="m16 8 2 3-2 3-2-3Z" />
    </>
  ),
  craft: (
    <>
      <path d="m2 8 10-5 10 5-10 5ZM3 12l9 5 9-5M3 16l9 5 9-5" />
    </>
  ),
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  expand: (
    <>
      <path d="M14 4h6v6M4 14v6h6M20 4l-7 7M4 20l7-7" />
    </>
  ),
  flip: (
    <>
      <path d="M5 8a8 8 0 0 1 14-1l2 3m0-6v6h-6M19 16a8 8 0 0 1-14 1l-2-3m0 6v-6h6" />
    </>
  ),
  close: <path d="m5 5 14 14M19 5 5 19" />,
  left: <path d="m15 5-7 7 7 7" />,
  right: <path d="m9 5 7 7-7 7" />,
  shuffle: (
    <>
      <path d="M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c2 0 4-3 5-5m3-6 3-1h4m-4-4 4 4-4 4" />
    </>
  ),
  check: <path d="m4 12 5 5L20 6" />,
  list: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </>
  ),
}
export function Icon({ name }: { name: keyof typeof paths }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}
export const asset = (id: string) =>
  import.meta.env.BASE_URL + 'plates/' + id + '.svg'
export function Plate({
  card,
  back = false,
  lazy = false,
}: {
  card: Card
  back?: boolean
  lazy?: boolean
}) {
  return (
    <img
      className="plate"
      width="210"
      height="306"
      alt={back ? '星盘齿轮牌背' : card.name}
      src={asset(back ? 'back' : card.id)}
      loading={lazy ? 'lazy' : 'eager'}
      draggable={false}
    />
  )
}
export const custom = (vars: Record<string, string | number>) =>
  vars as CSSProperties
