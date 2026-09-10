import test from "node:test";

test.todo("register cria usuário, sessão e não retorna senha");
test.todo("login retorna token e rejeita credenciais inválidas");
test.todo("logout revoga somente a sessão atual");
test.todo("GET /me exige token e retorna o perfil sem senha");
