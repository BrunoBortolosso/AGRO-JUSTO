import { prisma } from "../db/prisma.js";
import { unauthorized } from "../utils/errors.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { createSessionToken } from "../utils/token.js";

const userSelect = {
  id: true,
  nome: true,
  email: true,
  tipoUsuario: true,
  telefone: true,
  regiao: true,
  dataCadastro: true
};

function serializeUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    tipoUsuario: user.tipoUsuario,
    telefone: user.telefone,
    regiao: user.regiao,
    createdAt: user.dataCadastro
  };
}

async function createSession(tx, usuarioId) {
  const session = createSessionToken();
  await tx.session.create({
    data: {
      usuarioId,
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt
    }
  });
  return session;
}

async function registerUser({ nome, email, senha, regiao }) {
  const passwordHash = await hashPassword(senha);
  const session = createSessionToken();

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.usuario.create({
      data: {
        nome,
        email,
        senha: passwordHash,
        tipoUsuario: "PRODUTOR",
        regiao
      },
      select: userSelect
    });
    await tx.session.create({
      data: {
        usuarioId: createdUser.id,
        tokenHash: session.tokenHash,
        expiresAt: session.expiresAt
      }
    });
    return createdUser;
  });

  return { token: session.token, user: serializeUser(user) };
}

async function loginUser({ email, senha }) {
  const user = await prisma.usuario.findUnique({
    where: { email },
    select: { ...userSelect, senha: true }
  });
  if (!user || !(await verifyPassword(senha, user.senha))) {
    throw unauthorized("E-mail ou senha inválidos.");
  }

  const session = await createSession(prisma, user.id);
  return { token: session.token, user: serializeUser(user) };
}

async function updateUser(userId, data) {
  const user = await prisma.usuario.update({
    where: { id: userId },
    data,
    select: userSelect
  });
  return serializeUser(user);
}

export { loginUser, registerUser, serializeUser, updateUser, userSelect };