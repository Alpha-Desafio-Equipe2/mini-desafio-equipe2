import { CustomerService } from "../services/customer.service.js";
import { Customer } from "../../../shared/types.js";

export const CustomerListPage = async (): Promise<HTMLElement> => {
  const div = document.createElement("div");
  div.className = "container fade-in";

  div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 style="color: var(--primary);">Gerenciar Clientes</h2>
            <button class="btn btn-primary" onclick="window.navigate('/server07/customers/new')">Novo Cliente</button>
        </div>
        
        <div class="card">
            <div class="table-container">
                <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                            <th style="padding: 10px;">ID</th>
                            <th style="padding: 10px;">Nome</th>
                            <th style="padding: 10px;">CPF</th>
                            <th style="padding: 10px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="customers-table-body">
                        <tr><td colspan="4" style="text-align: center; padding: 20px;">Carregando...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

  const tbody = div.querySelector("#customers-table-body") as HTMLElement;

  const renderTable = async () => {
    try {
      const customers = await CustomerService.getAll();
      if (customers.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="4" style="text-align: center; padding: 20px;">Nenhum cliente encontrado.</td></tr>';
        return;
      }

      tbody.innerHTML = customers
        .map(
          (c) => `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 10px;">${c.id}</td>
                    <td style="padding: 10px;">${c.name}</td>
                    <td style="padding: 10px;">${c.cpf}</td>
                    <td style="padding: 10px;">
                        <button class="btn btn-secondary" style="margin-right: 5px;" onclick="window.navigate('/server07/customers/edit/${c.id}')">Editar</button>
                        <button class="btn btn-secondary" style="color: var(--error); border-color: var(--error);" onclick="window.deleteCustomer(${c.id})">Excluir</button>
                    </td>
                </tr>
            `,
        )
        .join("");
    } catch (error) {
      tbody.innerHTML = `<tr><td colspan="4" style="color: var(--error); text-align: center; padding: 20px;">Erro ao carregar clientes.</td></tr>`;
    }
  };

  window.deleteCustomer = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await CustomerService.delete(id);
        renderTable();
        // Toast suggestion: alert("Cliente excluído!");
      } catch (error) {
        alert("Erro ao excluir cliente.");
      }
    }
  };

  renderTable();
  return div;
};

// Add to global window interface for types
declare global {
  interface Window {
    deleteCustomer?: (id: number) => void;
  }
}
