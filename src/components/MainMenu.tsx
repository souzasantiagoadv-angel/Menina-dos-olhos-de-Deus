import type { View } from '../App'

interface Props {
  onNavigate: (view: View) => void
}

const items: { view: View; icon: string; label: string }[] = [
  { view: 'videos', icon: '🎬', label: 'Assistir Vídeos' },
  { view: 'games', icon: '🎮', label: 'Jogos Bíblicos' },
  { view: 'quizzes', icon: '📝', label: 'Testes de Conhecimento' },
  { view: 'stories', icon: '📖', label: 'Histórias Bíblicas' },
  { view: 'profile', icon: '👤', label: 'Perfil e Conta' },
  { view: 'parental', icon: '🛡️', label: 'Controle Parental' },
  { view: 'login', icon: '🔑', label: 'Entrar / Cadastrar' },
]

export function MainMenu({ onNavigate }: Props) {
  return (
    <>
      <header className="header">
        <div className="header__logo">🐝</div>
        <h1 className="header__title">Abelhinhas</h1>
        <p className="header__subtitle">Histórias Bíblicas para Crianças (6–12 anos)</p>
      </header>
      <nav className="menu">
        {items.map((item) => (
          <button key={item.view} className="menu__card" onClick={() => onNavigate(item.view)}>
            <span className="menu__icon">{item.icon}</span>
            <span className="menu__label">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
