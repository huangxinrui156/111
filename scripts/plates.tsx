import { mkdirSync, writeFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { CardArt } from '../src/Art'
import { deck } from '../src/deck'

const directory = new URL('../public/plates/', import.meta.url)
mkdirSync(directory, { recursive: true })
for (const card of deck) {
  writeFileSync(
    new URL(card.id + '.svg', directory),
    renderToStaticMarkup(<CardArt card={card} />),
  )
  writeFileSync(
    new URL(card.id + '-foil.svg', directory),
    renderToStaticMarkup(
      <CardArt card={card} l={{ line: false, ink: false, foil: true }} plate />,
    ),
  )
}
writeFileSync(
  new URL('back.svg', directory),
  renderToStaticMarkup(<CardArt card={deck[0]} back />),
)
