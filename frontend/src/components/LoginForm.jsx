import { useState } from 'react';
import { useAgro } from '../agroCore.js';

export function LoginForm({ loginForm, setLoginForm, onSubmit }) {
  const { state } = useAgro();
  const [submitting, setSubmitting] = useState(false);
  const visibleAuthMessage = state.authMessage === 'Failed to fetch'
    ? 'Não foi possível conectar ao AgroJusto. Verifique sua conexão e tente novamente.'
    : state.authMessage;

  async function handleSubmit(event) {
    setSubmitting(true);
    try {
      await onSubmit(event);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span>E-mail</span>
        <span className="auth-input-wrap">
          <svg className="auth-input-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="m4.5 7 7.5 6 7.5-6" /></svg>
          <input
            type="email"
            autoComplete="email"
            required
            placeholder="produtor@agrojusto.com"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          />
        </span>
      </label>
      <label className="auth-field">
        <span>Senha</span>
        <span className="auth-input-wrap">
          <svg className="auth-input-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10" width="15" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" /></svg>
          <input
            type="password"
            autoComplete="current-password"
            required
            placeholder="Digite sua senha"
            value={loginForm.senha}
            onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
          />
        </span>
      </label>
      <button className="btn auth-submit-btn" type="submit" disabled={submitting} aria-busy={submitting}>
        {submitting && <span className="auth-spinner" aria-hidden="true" />}
        {submitting ? 'Entrando...' : 'Entrar'}
      </button>
      {visibleAuthMessage && <p className="badge auth-message" role="alert">{visibleAuthMessage}</p>}
    </form>
  );
}
