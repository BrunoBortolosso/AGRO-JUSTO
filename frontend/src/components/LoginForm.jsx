import { useAgro } from '../agroCore.js';

export function LoginForm({ loginForm, setLoginForm, onSubmit }) {
  const { state } = useAgro();

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        E-mail
        <input
          type="email"
          autoComplete="email"
          required
          placeholder="produtor@agrojusto.com"
          value={loginForm.email}
          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
        />
      </label>
      <label>
        Senha
        <input
          type="password"
          autoComplete="current-password"
          required
          placeholder="Digite sua senha"
          value={loginForm.senha}
          onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
        />
      </label>
      <button className="btn" type="submit">Entrar na conta</button>
      {state.authMessage && <p className="badge auth-message">{state.authMessage}</p>}
    </form>
  );
}
