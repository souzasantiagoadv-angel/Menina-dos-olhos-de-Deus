import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../App.jsx';

const AVATARS = ['🐝', '🐣', '🦄', '🐬', '🦕', '🐰', '🦋', '🌈'];

export default function Profile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '🐝');
  const [age, setAge] = useState(user?.age || 8);
  const [favs, setFavs] = useState(user?.favorite_categories || []);
  const [pin, setPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [msg, setMsg] = useState(null);
  const [children, setChildren] = useState([]);
  const [childForm, setChildForm] = useState({ name: '', age: 8 });
  const [childMsg, setChildMsg] = useState(null);

  if (!user) return <p className="error-text">Entre na sua conta para ver o perfil. <Link to="/entrar" className="back-link">Entrar</Link></p>;

  const isAdult = !user.parent_id;

  const loadChildren = () =>
    fetch('/api/auth/children').then((r) => (r.ok ? r.json() : [])).then(setChildren).catch(() => {});
  useEffect(() => { if (isAdult) loadChildren(); }, [user.id]);

  const createChild = async (e) => {
    e.preventDefault();
    setChildMsg(null);
    const res = await fetch('/api/auth/children', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(childForm),
    });
    const data = await res.json();
    if (res.ok) {
      setChildForm({ name: '', age: 8 });
      setChildMsg({ ok: true, text: `Conta de ${data.name} criada! 🐝` });
      loadChildren();
    } else setChildMsg({ ok: false, text: data.error });
  };

  const loginAs = async (child) => {
    const res = await fetch('/api/auth/login-as', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: child.id }),
    });
    if (res.ok) { setUser(await res.json()); navigate('/'); }
  };

  const saveProfile = async () => {
    setMsg(null);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, avatar, age, favorite_categories: favs }),
    });
    if (res.ok) { setUser(await res.json()); setMsg({ ok: true, text: 'Perfil salvo! 🍯' }); }
    else setMsg({ ok: false, text: 'Não foi possível salvar' });
  };

  const savePin = async () => {
    setMsg(null);
    const res = await fetch('/api/parental', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, current_pin: currentPin }),
    });
    const data = await res.json();
    if (res.ok) { setUser(data); setMsg({ ok: true, text: 'PIN dos pais salvo! 🔒' }); setPin(''); setCurrentPin(''); }
    else setMsg({ ok: false, text: data.error });
  };

  const toggleFilter = async () => {
    const turnOn = !user.parental_filter;
    setMsg(null);
    const res = await fetch('/api/parental', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toggle_filter: turnOn, current_pin: currentPin }),
    });
    const data = await res.json();
    if (res.ok) { setUser(data); setMsg({ ok: true, text: turnOn ? 'Filtro parental ligado 🔒' : 'Filtro parental desligado' }); }
    else setMsg({ ok: false, text: data.error });
  };

  const toggleFav = (c) => {
    setFavs(favs.includes(c) ? favs.filter((f) => f !== c) : [...favs, c]);
  };

  return (
    <div>
      <div className="section-title">
        <h1>⚙️ Meu Perfil</h1>
        <button className="btn ghost" onClick={() => navigate('/')}>Voltar</button>
      </div>

      <div className="form-card" style={{ margin: '20px 0', maxWidth: 'none' }}>
        <label>Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Seu bichinho</label>
        <div className="avatar-row">
          {AVATARS.map((a) => (
            <button key={a} type="button" className={`avatar-option ${avatar === a ? 'selected' : ''}`} onClick={() => setAvatar(a)}>
              {a}
            </button>
          ))}
        </div>

        <label>Idade</label>
        <input type="number" min="6" max="12" value={age} onChange={(e) => setAge(Number(e.target.value))} />

        <label>Categorias favoritas (preferências)</label>
        <div className="chip-row">
          {['Criação', 'Milagres', 'Parábolas', 'Coragem', 'Fé', 'Obediência', 'Perdão', 'Amizade', 'Natal', 'Páscoa'].map((c) => (
            <button key={c} type="button" className={`chip ${favs.includes(c) ? 'active' : ''}`} onClick={() => toggleFav(c)}>
              {favs.includes(c) ? '★ ' : ''}{c}
            </button>
          ))}
        </div>

        <button className="btn green" onClick={saveProfile}>Salvar perfil</button>
      </div>

      {isAdult && (
        <div className="form-card" style={{ margin: '0 0 20px', maxWidth: 'none' }}>
          <h2>🧒 Contas das crianças</h2>
          <p className="muted">Esta é a sua conta de responsável (18+). Crie um perfil para cada criança e entre como elas quando quiser.</p>
          <div className="chip-row">
            {children.map((c) => (
              <button key={c.id} type="button" className="chip" onClick={() => loginAs(c)} title="Entrar como esta criança">
                {c.avatar} {c.name} ({c.age}) →
              </button>
            ))}
            {children.length === 0 && <span className="muted">Nenhuma criança cadastrada ainda.</span>}
          </div>
          <form onSubmit={createChild}>
            <label>Nome da criança</label>
            <input value={childForm.name} onChange={(e) => setChildForm({ ...childForm, name: e.target.value })} placeholder="Como ela se chama?" />
            <label>Idade da criança</label>
            <input type="number" min="1" max="17" value={childForm.age} onChange={(e) => setChildForm({ ...childForm, age: Number(e.target.value) })} />
            <button className="btn blue" type="submit">Criar conta para criança</button>
          </form>
          {childMsg && <p className={childMsg.ok ? 'success-text' : 'error-text'}>{childMsg.text}</p>}
        </div>
      )}
      {!isAdult && <p className="muted">🧒 Você está numa conta infantil criada pelo seu responsável.</p>}

      <div className="form-card" style={{ margin: '0 0 20px', maxWidth: 'none' }}>
        <h2>🔒 Modo Pais</h2>
        <p className="muted">
          O filtro parental esconde conteúdos fora da faixa de idade. {user.parental_filter ? 'Estado: LIGADO ✅' : 'Estado: DESLIGADO ❌'}
        </p>
        <label>{user.parental_pin ? 'PIN atual (para mudanças)' : 'Crie um PIN de 4 números'}</label>
        <input value={currentPin} maxLength={4} inputMode="numeric" onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))} placeholder="••••" />
        <div className="chip-row">
          <button className="btn blue" onClick={toggleFilter}>
            {user.parental_filter ? 'Desligar filtro' : 'Ligar filtro'}
          </button>
        </div>
        <label>{user.parental_pin ? 'Novo PIN' : 'Confirme o PIN'}</label>
        <input value={pin} maxLength={4} inputMode="numeric" onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="••••" />
        <button className="btn blue" onClick={savePin}>Salvar PIN</button>
      </div>

      {msg && <p className={msg.ok ? 'success-text' : 'error-text'}>{msg.text}</p>}
    </div>
  );
}
