export class Validators {
  /**
   * Valida CPF nos formatos:
   * - xxx.xxx.xxx-xx
   * - xxxxxxxxxxx
   * Aceita exatamente 11 dígitos numéricos
   */
  static validateCPF(cpf: string): boolean {
    if (!cpf) return false;
    
    // Remove pontos, traços e espaços
    const cleanCPF = cpf.replace(/[.\-\s]/g, '');
    
    // Verifica se tem exatamente 11 dígitos
    return /^\d{11}$/.test(cleanCPF);
  }

  /**
   * Valida CRM no formato: ^[A-Z]{2}[0-9]{4,6}$
   * Exemplo: SP123456, RJ1234
   */
  static validateCRM(crm: string): boolean {
    if (!crm) return false;
    
    return /^[A-Z]{2}[0-9]{4,6}$/.test(crm);
  }

  /**
   * Valida CEP nos formatos:
   * - xxxxxxxx
   * - xx.xxx-xxx
   * Aceita exatamente 8 dígitos numéricos
   */
  static validateCEP(cep: string): boolean {
    if (!cep) return false;
    
    // Remove pontos, traços e espaços
    const cleanCEP = cep.replace(/[.\-\s]/g, '');
    
    // Verifica se tem exatamente 8 dígitos
    return /^\d{8}$/.test(cleanCEP);
  }

  /**
   * Valida email com regras mínimas:
   * - contém @
   * - contém .
   * - tamanho mínimo de 5 caracteres
   */
  static validateEmail(email: string): boolean {
    if (!email) return false;
    
    return (
      email.includes('@') &&
      email.includes('.') &&
      email.length >= 5
    );
  }

  /**
   * Valida nome com as regras:
   * - mínimo 3 caracteres
   * - apenas letras e espaços
   * - aceita acentuação
   */
  static validateName(name: string): boolean {
    if (!name) return false;
    
    // Remove espaços extras
    const trimmedName = name.trim();
    
    // Mínimo 3 caracteres, apenas letras (com acentos) e espaços
    return /^[a-zA-ZÀ-ÿ\s]{3,}$/.test(trimmedName);
  }

  /**
   * Valida data da receita médica:
   * - não pode ser futura
   * - não pode ter mais de 30 dias
   */
  static validatePrescriptionDate(date: Date): boolean {
    if (!date) return false;
    
    const now = new Date();
    const prescriptionDate = new Date(date);
    
    // Não pode ser futura
    if (prescriptionDate > now) return false;
    
    // Calcula a data de 30 dias atrás
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    // Deve estar dentro dos últimos 30 dias
    return prescriptionDate >= thirtyDaysAgo;
  }

  /**
   * Valida se o valor é positivo (para preços)
   */
  static validatePositiveValue(value: number): boolean {
    return value > 0;
  }

  /**
   * Valida se a quantidade é não-negativa (para estoque)
   */
  static validateNonNegativeQuantity(quantity: number): boolean {
    return quantity >= 0;
  }

  /**
   * Valida se a quantidade é positiva (para itens de venda)
   */
  static validatePositiveQuantity(quantity: number): boolean {
    return quantity > 0;
  }

  /**
   * Remove formatação do CPF
   * Retorna apenas números
   */
  static cleanCPF(cpf: string): string {
    return cpf.replace(/[.\-\s]/g, '');
  }

  /**
   * Remove formatação do CEP
   * Retorna apenas números
   */
  static cleanCEP(cep: string): string {
    return cep.replace(/[.\-\s]/g, '');
  }

  /**
   * Formata CPF para xxx.xxx.xxx-xx
   */
  static formatCPF(cpf: string): string {
    const clean = this.cleanCPF(cpf);
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Formata CEP para xxxxx-xxx
   */
  static formatCEP(cep: string): string {
    const clean = this.cleanCEP(cep);
    return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  /**
   * Valida campos de endereço obrigatórios
   */
  static validateAddress(address: {
    cidade?: string;
    bairro?: string;
    rua?: string;
    numero?: number;
    cep?: string;
  }): { valid: boolean; missingField?: string } {
    if (!address.cidade || address.cidade.trim().length === 0) {
      return { valid: false, missingField: 'cidade' };
    }

    if (!address.bairro || address.bairro.trim().length === 0) {
      return { valid: false, missingField: 'bairro' };
    }

    if (!address.rua || address.rua.trim().length === 0) {
      return { valid: false, missingField: 'rua' };
    }

    if (!address.numero || address.numero <= 0) {
      return { valid: false, missingField: 'numero' };
    }

    if (!address.cep || !this.validateCEP(address.cep)) {
      return { valid: false, missingField: 'cep' };
    }

    return { valid: true };
  }

  /**
   * Valida número da receita (opcional, mas se existir deve ser válido)
   * Aceita string ou number
   */
  static validatePrescriptionNumber(numero: string | number | undefined): boolean {
    // Se não foi informado, é válido (campo opcional)
    if (numero === undefined || numero === null) return true;

    // Se foi informado, não pode ser vazio
    if (typeof numero === 'string') {
      return numero.trim().length > 0;
    }

    // Se for número, deve ser positivo
    return numero > 0;
  }
}