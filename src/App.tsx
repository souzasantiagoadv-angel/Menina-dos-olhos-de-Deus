import { useState } from 'react'
import { MainMenu } from './components/MainMenu'
import { CategoryView } from './components/CategoryView'
import { ProfileView } from './components/ProfileView'
import { ParentalControlView } from './components/ParentalControlView'
import { LoginView } from './components/LoginView'

export type View =
  | 'menu'
  | 'videos'
  | 'games'
  | 'quizzes'
  | 'stories'
  | 'profile'
  | 'parental'
  | 'login'

export default function App() {
  const [view, setView] = useState<View>('menu')

  return (
    <div className="app">
      {view === 'menu' && <MainMenu onNavigate={setView} />}
      {(view === 'videos' || view === 'games' || view === 'quizzes' || view === 'stories') && (
        <CategoryView view={view} onBack={() => setView('menu')} />
      )}
      {view === 'profile' && <ProfileView onBack={() => setView('menu')} />}
      {view === 'parental' && <ParentalControlView onBack={() => setView('menu')} />}
      {view === 'login' && <LoginView onBack={() => setView('menu')} />}
      <footer className="footer">
        🐝 Abelhinhas — Histórias Bíblicas para Crianças (6–12 anos)
      </footer>
    </div>
  )
}
