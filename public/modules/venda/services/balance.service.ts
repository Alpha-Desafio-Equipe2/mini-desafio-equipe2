// Serviço para gerenciar o saldo do usuário
export class BalanceService {
  private static STORAGE_KEY = 'user_balance';

  /**
   * Obtém o saldo atual do usuário
   */
  static getBalance(): number {
    const balance = localStorage.getItem(this.STORAGE_KEY);
    return balance ? parseFloat(balance) : 0;
  }

  /**
   * Adiciona valor ao saldo
   */
  static addBalance(amount: number): number {
    const currentBalance = this.getBalance();
    const newBalance = currentBalance + amount;
    localStorage.setItem(this.STORAGE_KEY, newBalance.toString());
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
    localStorage.setItem(this.STORAGE_KEY, newBalance.toString());
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
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
