import { useState } from 'react';
import { useAgro, defaultProfile, demoUser } from '../agroCore.js';
import { LoginForm } from './LoginForm.jsx';
import { RegisterForm } from './RegisterForm.jsx';

export default function AuthPage() {
  const { state, dispatch } = useAgro();
  const [loginForm, setLoginForm] = useState({ email: '', senha: '' });
  const [registerForm, setRegisterForm] = useState({ nome: '', email: '', senha: '', confirm: '' });

  function login(event) {
    event.preventDefault();
    const user = (state.users || []).find((item) => item.email === loginForm.email && item.senha === loginForm.senha);
    if (!user) {
      dispatch({ type: 'setAuthMessage', message: 'Credenciais invalidas' });
      return;
    }
    dispatch({ type: 'login', user });
  }

  function register(event) {
    event.preventDefault();
    if (!registerForm.nome || !registerForm.email || !registerForm.senha || !registerForm.confirm) {
      dispatch({ type: 'setAuthMessage', message: 'Preencha todos os campos' });
      return;
    }
    if (registerForm.senha.length < 6) {
      dispatch({ type: 'setAuthMessage', message: 'Senha muito curta' });
      return;
    }
    if (registerForm.senha !== registerForm.confirm) {
      dispatch({ type: 'setAuthMessage', message: 'Confirmacao divergente' });
      return;
    }
    if ((state.users || []).some((u) => u.email === registerForm.email)) {
      dispatch({ type: 'setAuthMessage', message: 'E-mail repetido' });
      return;
    }

    const newUser = { nome: registerForm.nome, email: registerForm.email, senha: registerForm.senha, profile: defaultProfile };
    dispatch({ type: 'register', user: newUser });
  }

  return (
    <section className="auth-gate">
      <article className="auth-card card">
        <div className="auth-heading">
          <span className="auth-kicker">Acesso do produtor</span>
          <h2 id="authTitle">Entrar no AgroJusto</h2>
          <p id="authSubtitle" className="muted">Acesse sua conta para cuidar da sua producao.</p>
        </div>

        <div className="auth-switch" role="tablist" aria-label="Modo de acesso">
          <button className={`auth-switch-btn ${state.authMode === 'login' ? 'active' : ''}`} type="button" role="tab" aria-selected={state.authMode === 'login'} onClick={() => dispatch({ type: 'setAuthMode', mode: 'login' })}>Entrar</button>
          <button className={`auth-switch-btn ${state.authMode === 'register' ? 'active' : ''}`} type="button" role="tab" aria-selected={state.authMode === 'register'} onClick={() => dispatch({ type: 'setAuthMode', mode: 'register' })}>Criar conta</button>
        </div>

        {state.authMode === 'login' ? (
          <LoginForm loginForm={loginForm} setLoginForm={setLoginForm} onSubmit={login} />
        ) : (
          <RegisterForm registerForm={registerForm} setRegisterForm={setRegisterForm} onSubmit={register} />
        )}

        <button className="btn secondary" type="button" onClick={() => dispatch({ type: 'login', user: demoUser })}>Entrar com dados de demonstracao</button>
      </article>
    </section>
  );
}
