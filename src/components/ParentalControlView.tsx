import { useState } from 'react'

interface Props {
  onBack: () => void
}

const filters = [
  'Filtro de conteúdo violento',
  'Filtro de linguagem inadequada',
  'Notificações por e-mail aos pais',
  'Limite de tempo de uso diário',
]

export function ParentalControlView({ onBack }: Props) {
  const [states, setStates] = useState(filters.map(() => true))

  const toggle = (i: number) =>
    setStates((prev) => prev.map((s, idx) => (idx === i ? !s : s)))

  return (
    <section className="section">
      <button className="section__back" onClick={onBack}>
        ← Voltar ao Menu
      </button>
      <h2 className="section__title">🛡️ Controle Parental</h2>
      <p className="section__desc">
        Filtro que inibe conteúdos que firam os direitos e garantias das crianças
      </p>

      <div className="parental">
        {filters.map((label, i) => (
          <div key={label} className="parental__row">
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</span>
            <button
              className={`toggle ${states[i] ? 'toggle--on' : ''}`}
              onClick={() => toggle(i)}
              aria-label={label}
            >
              <span className="toggle__knob" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
