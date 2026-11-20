export const suits = ['spades', 'hearts', 'clubs', 'diamonds'] as const
export type Suit = (typeof suits)[number]
export type Family = Suit | 'jokers'
export type Card = {
  id: string
  rank: string
  family: Family
  name: string
  english: string
  latin: string
  meaning: string
  geometry: string
  serial: string
  ordinal: number
}
export const suitInfo: Record<
  Family,
  { cn: string; en: string; theme: string }
> = {
  spades: { cn: '黑桃', en: 'Spades', theme: '子午仪' },
  hearts: { cn: '红桃', en: 'Hearts', theme: '摆钟' },
  clubs: { cn: '梅花', en: 'Clubs', theme: '行星齿轮' },
  diamonds: { cn: '方片', en: 'Diamonds', theme: '测角规' },
  jokers: { cn: '王牌', en: 'Jokers', theme: '日月仪' },
}
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const names = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Jack',
  'Queen',
  'King',
]
const aceMotto = ['Ad astra', 'Cor temporis', 'Orbis mundi', 'Lux angularis']
const courts = [
  ['Custos meridiani', 'Domina noctis', 'Rex siderum'],
  ['Nuntius aurorae', 'Anima caeli', 'Sol invictus'],
  ['Faber orbium', 'Regina motus', 'Magister rotarum'],
  ['Signifer lucis', 'Mensura aurea', 'Arbiter polorum'],
]
const numberMotto = [
  '',
  'Gemini',
  'Triangulum',
  'Quadrans',
  'Pentagonum',
  'Sextans',
  'Septentrio',
  'Octans',
  'Novem stellae',
  'Decas',
]
export const deck: Card[] = suits.flatMap((family, s) =>
  ranks.map((rank, r) => {
    const info = suitInfo[family],
      ordinal = s * 13 + r + 1
    const latin =
      r === 0 ? aceMotto[s] : r >= 10 ? courts[s][r - 10] : numberMotto[r]
    const title = ['学徒', '测绘师', '守时者'][r - 10]
    return {
      id: family + '-' + rank,
      family,
      rank,
      ordinal,
      serial:
        ['SP', 'HE', 'CL', 'DI'][s] + ' · ' + String(ordinal).padStart(3, '0'),
      name: info.cn + ' ' + rank,
      english: names[r] + ' of ' + info.en,
      latin,
      meaning:
        r === 0
          ? [
              '以黑桃的尖端标定天极，内嵌的轮轴指向观测的起点。',
              '把心跳化为摆钟的节拍，一对弧线在同一个支点汇合。',
              '三枚叶瓣如同行星轮，共同环绕一枚固定的太阳轮。',
              '菱形的四个顶点构成测角规，以一束光校准方位。',
            ][s]
          : r >= 10
            ? '掌管' +
              info.theme +
              '的' +
              title +
              '执掌' +
              ['观测杆', '星盘', '权杖'][r - 10] +
              '，两端的人像代表同一星体的升起与落下。'
            : '将' +
              (r + 1) +
              '枚' +
              info.cn +
              '标入' +
              info.theme +
              '的坐标中，以点位的疏密描绘一个完整的观测周期。',
      geometry:
        r >= 10
          ? '两枚半身铜版像绕牌心旋转 180°，共用一条赤道。'
          : r === 0
            ? '主徽记置于纵横中轴的交点，三重同心圆约束外轮廓。'
            : r + 1 + ' 个点位沿纵轴配平，下半区的标记反向排列。',
    }
  }),
)
deck.push(
  {
    id: 'sun',
    family: 'jokers',
    rank: 'SOL',
    ordinal: 53,
    serial: 'SOL · 053',
    name: '太阳 · 观测者',
    english: 'The Sun',
    latin: 'Sol omnia videt',
    meaning: '两张金色日轮面孔相望，以明暗交替记录太阳的视运动。',
    geometry: '双日轮沿中心反向配对，放射线逐级收束于太阳的轮缘。',
  },
  {
    id: 'moon',
    family: 'jokers',
    rank: 'LUNA',
    ordinal: 54,
    serial: 'LUN · 054',
    name: '月亮 · 校准仪',
    english: 'The Moon',
    latin: 'Luna tempora regit',
    meaning: '相向的月牙构成月相校准仪，为夜间观测确立时间基准。',
    geometry: '以偏心圆弧切出月牙，两组刻度绕牌心旋转 180° 重合。',
  },
)
export const archive = [
  ...deck.filter((c) => c.rank === 'A'),
  ...deck.slice(-2),
  ...deck.filter((c) => c.family !== 'jokers' && c.rank !== 'A'),
]
export const sun = deck[52]
