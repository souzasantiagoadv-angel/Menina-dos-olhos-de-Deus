import { useState } from 'react'
import type { View } from '../App'

interface Props {
  view: View
  onBack: () => void
}

type Category = 'velho' | 'novo' | 'aleatorio'

const labels: Record<View, { title: string; desc: string; icon: string }> = {
  videos: { title: 'Vídeos Bíblicos', desc: 'Assistir histórias em vídeo', icon: '🎬' },
  games: { title: 'Jogos Bíblicos', desc: 'Jogos de memorização e desafios', icon: '🎮' },
  quizzes: { title: 'Testes de Conhecimento', desc: 'Teste o que você aprendeu', icon: '📝' },
  stories: { title: 'Histórias Bíblicas', desc: 'Busca por categoria', icon: '📖' },
  menu: { title: '', desc: '', icon: '' },
  profile: { title: '', desc: '', icon: '' },
  parental: { title: '', desc: '', icon: '' },
  login: { title: '', desc: '', icon: '' },
}

const stories: Record<Category, { emoji: string; title: string; meta: string }[]> = {
  velho: [
    { emoji: ' Noah', title: 'A Arca de Noé', meta: 'Gênesis 6–9' },
    { emoji: '🔥', title: 'A Sarça Ardente', meta: 'Êxodo 3' },
    { emoji: '🦁', title: 'Daniel na Cova dos Leões', meta: 'Daniel 6' },
  ],
  novo: [
    { emoji: '🐟', title: 'Jesus Multiplica os Pães', meta: 'João 6' },
    { emoji: '🌊', title: 'Jesus Acalma a Tempestade', meta: 'Marcos 4' },
    { emoji: '🐑', title: 'A Parábola do Bom Pastor', meta: 'João 10' },
  ],
  aleatorio: [
    { emoji: '⭐', title: 'A Criação do Mundo', meta: 'Gênesis 1' },
    { emoji: '🚢', title: 'Jonas e a Baleia', meta: 'Jonas 1–4' },
    { emoji: '👼', title: 'O Anúncio a Maria', meta: 'Lucas 1' },
  ],
}

const categoryLabels: { key: Category; label: string }[] = [
  { key: 'velho', label: 'Velho Testamento' },
  { key: 'novo', label: 'Novo Testamento' },
  { key: 'aleatorio', label: 'Aleatórios' },
]

export function CategoryView({ view, onBack }: Props) {
  const [category, setCategory] = useState<Category | null>(null)
  const meta = labels[view]

  return (
    <section className="section">
      <button className="section__back" onClick={onBack}>
        ← Voltar ao Menu
      </button>
      <h2 className="section__title">
        {meta.icon} {meta.title}
      </h2>
      <p className="section__desc">{meta.desc}</p>

      <div className="submenu">
        {categoryLabels.map((cat) => (
          <button
            key={cat.key}
            className="submenu__btn"
            onClick={() => setCategory(cat.key)}
            style={category === cat.key ? { background: '#0d47a1' } : undefined}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {category && (
        <div className="content-list" style={{ marginTop: 20 }}>
          {stories[category].map((s) => (
            <div key={s.title} className="content-item">
              <span className="content-item__emoji">{s.emoji}</span>
              <div>
                <div className="content-item__title">{s.title}</div>
                <div className="content-item__meta">{s.meta}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
