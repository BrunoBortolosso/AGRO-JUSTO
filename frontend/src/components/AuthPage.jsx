import { useState } from 'react';
import { useAgro } from '../agroCore.js';
import { apiClient, normalizeApiError, TOKEN_STORAGE_KEY } from '../apiClient.js';
import { LoginForm } from './LoginForm.jsx';
import { RegisterForm } from './RegisterForm.jsx';
import agroLogo from '../assets/images/agro-logo.svg';

export default function AuthPage() {
  const { state, dispatch } = useAgro();
  const [loginForm, setLoginForm] = useState({ email: '', senha: '' });
  const [registerForm, setRegisterForm] = useState({ nome: '', email: '', senha: '', confirm: '' });
  const [recoveryNotice, setRecoveryNotice] = useState('');

  async function login(event) {
    event.preventDefault();

    if (!loginForm.email || !loginForm.senha) {
      dispatch({ type: 'setAuthMessage', message: 'Preencha todos os campos' });
      return;
    }

    try {
      const response = await apiClient.post('/auth/login', {
        email: loginForm.email,
        senha: loginForm.senha
      });

      sessionStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      dispatch({ type: 'setSession', user: response.user, token: response.token });
    } catch (error) {
      const normalized = normalizeApiError(error, 'Não foi possível entrar no AgroJusto.');
      dispatch({ type: 'setAuthMessage', message: normalized.message });
    }
  }

  async function register(event) {
    event.preventDefault();

    if (!registerForm.nome || !registerForm.email || !registerForm.senha || !registerForm.confirm) {
      dispatch({ type: 'setAuthMessage', message: 'Preencha todos os campos' });
      return;
    }
    if (registerForm.senha.length < 8) {
      dispatch({ type: 'setAuthMessage', message: 'A senha deve ter pelo menos 8 caracteres' });
      return;
    }
    if (registerForm.senha !== registerForm.confirm) {
      dispatch({ type: 'setAuthMessage', message: 'Confirmacao divergente' });
      return;
    }

    try {
      const response = await apiClient.post('/auth/register', {
        nome: registerForm.nome,
        email: registerForm.email,
        senha: registerForm.senha
      });

      sessionStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      dispatch({ type: 'setSession', user: response.user, token: response.token });
    } catch (error) {
      const normalized = normalizeApiError(error, 'Não foi possível criar a conta.');
      dispatch({ type: 'setAuthMessage', message: normalized.message });
    }
  }

  return (
    <section className="auth-gate">
      <aside className="auth-visual" aria-label="AgroJusto, tecnologia no campo">
        <img
          className="auth-visual-image"
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85"
          alt="Plantação verde acompanhando as curvas de uma paisagem rural"
        />
        <div className="auth-visual-overlay" />
        <div className="auth-visual-content">
          <div className="auth-brand">
            <img src={agroLogo} alt="" />
            <span>AgroJusto</span>
          </div>
          <div className="auth-visual-copy">
            <span className="auth-visual-kicker">TECNOLOGIA NO CAMPO</span>
            <h1>Tecnologia que valoriza o agricultor.</h1>
            <p>Tenha mais controle sobre seus produtos, preços e oportunidades.</p>
          </div>
          <span className="auth-visual-caption">Feito para quem faz o campo acontecer.</span>
        </div>
      </aside>

      <div className="auth-panel">
        <article className="auth-card card">
          <div className="auth-mobile-brand">
            <img src={agroLogo} alt="" />
            <span>AgroJusto</span>
          </div>
          <div className="auth-heading">
            <span className="auth-kicker">Acesso do produtor</span>
            <h2 id="authTitle">{state.authMode === 'login' ? 'Entrar no AgroJusto' : 'Crie sua conta'}</h2>
            <p id="authSubtitle" className="muted">
              {state.authMode === 'login'
                ? 'Entre na sua conta para acessar sua área do produtor.'
                : 'Comece a cuidar da sua produção com o AgroJusto.'}
            </p>
          </div>

          {state.authMode === 'login' ? (
            <>
              <LoginForm loginForm={loginForm} setLoginForm={setLoginForm} onSubmit={login} />
              <div className="auth-recovery-row">
                <button className="auth-text-link" type="button" onClick={() => setRecoveryNotice('A recuperação de senha ainda não está disponível. Entre em contato com o suporte do AgroJusto.')}>Esqueci minha senha</button>
              </div>
              {recoveryNotice && <p className="auth-recovery-notice" role="status">{recoveryNotice}</p>}
              <button
                className="btn secondary auth-demo-btn"
                type="button"
                onClick={() => {
                  const demoUser = {
                    id: 'demo-user',
                    nome: 'Usuário de teste',
                    email: 'teste@agrojusto.com',
                    regiao: 'Região demo'
                  };
                  sessionStorage.setItem(TOKEN_STORAGE_KEY, 'demo-token');
                  dispatch({ type: 'setSession', user: demoUser, token: 'demo-token' });
                }}
              >
                Entrar sem conta
              </button>
            </>
          ) : (
            <RegisterForm registerForm={registerForm} setRegisterForm={setRegisterForm} onSubmit={register} />
          )}

          <div className="auth-footer">
            <span>{state.authMode === 'login' ? 'Ainda não possui uma conta?' : 'Já possui uma conta?'}</span>
            <button
              className="auth-text-link"
              type="button"
              onClick={() => {
                setRecoveryNotice('');
                dispatch({ type: 'setAuthMode', mode: state.authMode === 'login' ? 'register' : 'login' });
              }}
            >
              {state.authMode === 'login' ? 'Cadastre-se' : 'Entrar'}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
