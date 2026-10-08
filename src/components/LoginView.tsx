interface Props {
  onBack: () => void
}

const providers = [
  { icon: '🔵', label: 'Google' },
  { icon: '🍎', label: 'Apple' },
  { icon: '🪟', label: 'Microsoft' },
  { icon: '📘', label: 'Facebook' },
  { icon: '📸', label: 'Instagram' },
  { icon: '✖️', label: 'X' },
]

export function LoginView({ onBack }: Props) {
  return (
    <section className="section">
      <button className="section__back" onClick={onBack}>
        ← Voltar ao Menu
      </button>
      <h2 className="section__title">🔑 Entrar / Cadastrar</h2>
      <p className="section__desc">Acesse com seu e-mail ou conta de terceiros</p>

      <div className="content-list">
        <div className="content-item" style={{ flexDirection: 'column', gap: 16, alignItems: 'stretch' }}>
          <input
            type="email"
            placeholder="E-mail"
            style={{
              padding: '12px 16px',
              borderRadius: '999px',
              border: '2px solid #e0e0e0',
              fontSize: '0.95rem',
            }}
          />
          <input
            type="password"
            placeholder="Senha"
            style={{
              padding: '12px 16px',
              borderRadius: '999px',
              border: '2px solid #e0e0e0',
              fontSize: '0.95rem',
            }}
          />
          <button className="submenu__btn" style={{ width: '100%' }}>
            Entrar
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
          — ou acesse com —
        </div>

        <div className="submenu">
          {providers.map((p) => (
            <button key={p.label} className="submenu__btn" style={{ background: '#5d4037' }}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
