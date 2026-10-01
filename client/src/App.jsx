import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Stories from './components/Stories.jsx';
import StoryView from './components/StoryView.jsx';
import Videos from './components/Videos.jsx';
import Games from './components/Games.jsx';
import MemoryGame from './components/MemoryGame.jsx';
import QuizGame from './components/QuizGame.jsx';
import Quizzes from './components/Quizzes.jsx';
import QuizView from './components/QuizView.jsx';
import Auth from './components/Auth.jsx';
import Profile from './components/Profile.jsx';

const UserContext = createContext({ user: null, setUser: () => {}, refresh: () => {} });
export const useUser = () => useContext(UserContext);

export default function App() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = async () => {
    try {
      const res = await fetch('/api/auth/me');
      setUser(res.ok ? await res.json() : null);
    } catch {
      setUser(null);
    }
    setLoaded(true);
  };

  useEffect(() => { refresh(); }, []);

  if (!loaded) return <div className="page-loading">🐝 Carregando...</div>;

  return (
    <UserContext.Provider value={{ user, setUser, refresh }}>
      <BrowserRouter>
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/historias" element={<Stories />} />
            <Route path="/historias/:id" element={<StoryView />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/jogos" element={<Games />} />
            <Route path="/jogos/memoria" element={<MemoryGame />} />
            <Route path="/jogos/quiz" element={<QuizGame />} />
            <Route path="/testes" element={<Quizzes />} />
            <Route path="/testes/:id" element={<QuizView />} />
            <Route path="/entrar" element={<Auth />} />
            <Route path="/perfil" element={<Profile />} />
          </Routes>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
