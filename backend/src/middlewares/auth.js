import { prisma } from "../db/prisma.js";
import { unauthorized } from "../utils/errors.js";
import { hashSessionToken } from "../utils/token.js";
import { serializeUser } from "../services/auth.js";

function getBearerToken(req) {
  const header = req.get("authorization") || "";
  const match = /^Bearer ([^\s]+)$/i.exec(header);
  if (!match) throw unauthorized("Sessão inválida.");
  return match[1];
}

async function auth(req, _res, next) {
  try {
    const token = getBearerToken(req);
    const session = await prisma.session.findUnique({
      where: { tokenHash: hashSessionToken(token) },
      include: { usuario: true }
    });

    if (!session || session.expiresAt <= new Date()) {
      throw unauthorized("Sessão inválida ou expirada.");
    }

    req.user = serializeUser(session.usuario);
    req.session = session;
    return next();
  } catch (error) {
    return next(error);
  }
}

export { auth };