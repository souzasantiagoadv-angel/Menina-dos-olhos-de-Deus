interface Props {
  onBack: () => void
}

export function ProfileView({ onBack }: Props) {
  return (
    <section className="section">
      <button className="section__back" onClick={onBack}>
        ← Voltar ao Menu
      </button>
      <h2 className="section__title">👤 Perfil e Conta</h2>
      <p className="section__desc">Configurações do perfil da criança</p>

      <div className="content-list">
        <div className="content-item">
          <span className="content-item__emoji">🧒</span>
          <div>
            <div className="content-item__title">Nome da Criança</div>
            <div className="content-item__meta">Não definido</div>
          </div>
        </div>
        <div className="content-item">
          <span className="content-item__emoji">🎂</span>
          <div>
            <div className="content-item__title">Idade</div>
            <div className="content-item__meta">6–12 anos</div>
          </div>
        </div>
        <div className="content-item">
          <span className="content-item__emoji">🌍</span>
          <div>
            <div className="content-item__title">Idioma Regional</div>
            <div className="content-item__meta">Português (Brasil)</div>
          </div>
        </div>
        <div className="content-item">
          <span className="content-item__emoji">📝</span>
          <div>
            <div className="content-item__title">Anotações de Preferências</div>
            <div className="content-item__meta">Nenhuma anotação ainda</div>
          </div>
        </div>
      </div>
    </section>
  )
}
