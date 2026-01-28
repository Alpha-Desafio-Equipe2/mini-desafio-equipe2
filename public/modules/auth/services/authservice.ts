export function login(email: string, pass: string): boolean {
  // Mock login logic
  if (email && pass) return true;
  return false;
}

export function logout() {
  if (confirm("Encerrar sessão?")) location.reload();
}
