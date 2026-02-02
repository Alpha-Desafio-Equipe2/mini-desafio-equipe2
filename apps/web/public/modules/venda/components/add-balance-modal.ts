import { api } from '../../../shared/http/api.js';
import { SuccessModal } from '../../../shared/components/success-modal.js';
import { ErrorModal } from '../../../shared/components/error-modal.js';

/**
 * Modal para adicionar saldo à conta do usuário
 */
export const AddBalanceModal = (onBalanceAdded: () => void): HTMLElement => {
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'balance-modal-overlay';
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: var(--surface);
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    max-width: 400px;
    width: 90%;
    animation: slideIn 0.3s ease-out;
  `;

  modal.innerHTML = `
    <style>
      @keyframes slideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    </style>
    <h3 style="margin-bottom: 1.5rem; color: var(--primary);">💰 Adicionar Saldo</h3>
    <form id="add-balance-form">
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Valor (R$)</label>
        <input 
          type="number" 
          id="balance-amount" 
          name="amount" 
          min="1" 
          step="0.01" 
          required
          placeholder="Digite o valor"
          class="input-field"
          style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 1rem;"
          autofocus
        />
      </div>
      <div style="display: flex; gap: 1rem;">
        <button 
          type="submit" 
          class="btn btn-primary" 
          style="flex: 1; padding: 0.75rem;"
        >
          Adicionar
        </button>
        <button 
          type="button" 
          id="cancel-btn" 
          class="btn btn-secondary" 
          style="flex: 1; padding: 0.75rem;"
        >
          Cancelar
        </button>
      </div>
    </form>
    <div style="margin-top: 1rem; padding: 1rem; background: var(--background); border-radius: var(--radius-md); border-left: 4px solid var(--primary);">
      <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;">
        💡 <strong>Dica:</strong> Você pode adicionar qualquer valor acima de R$ 1,00
      </p>
    </div>
  `;

  modalOverlay.appendChild(modal);

  // Fechar ao clicar fora do modal
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Botão de cancelar
  const cancelBtn = modal.querySelector('#cancel-btn');
  cancelBtn?.addEventListener('click', closeModal);

  // Submit do formulário
  const form = modal.querySelector('#add-balance-form') as HTMLFormElement;
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const amount = parseFloat(formData.get('amount') as string);
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
        alert("Erro: Usuário não identificado.");
        return;
    }

    if (amount > 0) {
      try {
        // Use API to add balance
        const response = await api.post<{newBalance: number}>(`/users/${user.id}/balance`, { amount });
        
        // Update local user
        user.balance = response.newBalance;
        localStorage.setItem("user", JSON.stringify(user));

        closeModal();
      
        const successModal = SuccessModal({
            title: "Saldo Adicionado!",
            message: "Seu saldo foi atualizado com sucesso.",
            icon: "💰",
            details: [`Novo saldo: R$ ${response.newBalance.toFixed(2)}`]
        });
        document.body.appendChild(successModal);
      
        onBalanceAdded();
      } catch (error: any) {
        const errorModal = ErrorModal({
            title: "Erro ao adicionar saldo",
            message: "Não foi possível atualizar seu saldo.",
            type: "error",
            details: [error.message || "Erro de conexão"]
        });
        document.body.appendChild(errorModal);
      }
    } else {
      const errorModal = ErrorModal({
        title: "Valor Inválido",
        message: "Por favor, insira um valor válido maior que zero.",
        type: "warning"
      });
      document.body.appendChild(errorModal);
    }
  });

  function closeModal() {
    modalOverlay.remove();
  }

  // Fechar com ESC
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  return modalOverlay;
};
