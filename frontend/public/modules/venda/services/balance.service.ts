// Serviço para gerenciar o saldo do usuário
export class BalanceService {
  private static getStorageKey(): string {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return user ? `balance_${user.id}` : "balance_guest";
  }

  /**
   * Obtém o saldo atual do usuário
   */
  static getBalance(): number {
    const balance = localStorage.getItem(this.getStorageKey());
    return balance ? parseFloat(balance) : 0;
  }

  /**
   * Adiciona valor ao saldo
   */
  static addBalance(amount: number): number {
    const currentBalance = this.getBalance();
    const newBalance = currentBalance + amount;
    localStorage.setItem(this.getStorageKey(), newBalance.toString());
    return newBalance;
  }

  /**
   * Deduz valor do saldo
   */
  static deductBalance(amount: number): boolean {
    const currentBalance = this.getBalance();
    if (currentBalance < amount) {
      return false; // Saldo insuficiente
    }
    const newBalance = currentBalance - amount;
    localStorage.setItem(this.getStorageKey(), newBalance.toString());
    return true;
  }

  /**
   * Verifica se há saldo suficiente
   */
  static hasSufficientBalance(amount: number): boolean {
    return this.getBalance() >= amount;
  }

  /**
   * Limpa o saldo (útil para logout ou reset)
   */
  static clearBalance(): void {
    localStorage.removeItem(this.getStorageKey());
  }
}
