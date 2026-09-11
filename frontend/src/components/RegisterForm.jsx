import { useAgro } from '../agroCore.js';

export function RegisterForm({ registerForm, setRegisterForm, onSubmit }) {
  const { state } = useAgro();

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        Nome do produtor
        <input
          type="text"
          autoComplete="name"
          required
          placeholder="Ex: Maria da Silva"
          value={registerForm.nome}
          onChange={(e) => setRegisterForm({ ...registerForm, nome: e.target.value })}
        />
      </label>
      <label>
        E-mail
        <input
          type="email"
          autoComplete="email"
          required
          placeholder="voce@email.com"
          value={registerForm.email}
          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
        />
      </label>
      <label>
        Senha
        <input
          type="password"
          autoComplete="new-password"
          minLength="6"
          required
          placeholder="Crie uma senha segura"
          value={registerForm.senha}
          onChange={(e) => setRegisterForm({ ...registerForm, senha: e.target.value })}
        />
      </label>
      <div className="password-strength" aria-live="polite">
        <div className="password-strength-bar"><span></span></div>
        <strong>Digite uma senha</strong>
        <small>Use letras maiusculas, minusculas, numeros e simbolos.</small>
      </div>
      <label>
        Confirmar senha
        <input
          type="password"
          autoComplete="new-password"
          minLength="6"
          required
          placeholder="Repita sua senha"
          value={registerForm.confirm}
          onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
        />
      </label>
      <button className="btn" type="submit">Criar minha conta</button>
      {state.authMessage && <p className="badge auth-message">{state.authMessage}</p>}
    </form>
  );
}
