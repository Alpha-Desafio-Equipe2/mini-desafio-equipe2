import { api } from "../../../shared/http/api.js";
import { Customer } from "../../../shared/types.js";

export async function createAdminCustomers(container: HTMLElement) {
  container.innerHTML = "";
  const header = document.createElement("div");
  header.style.cssText =
    "display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;";

  const h3 = document.createElement("h3");
  h3.textContent = "Gerenciar Clientes";
  header.appendChild(h3);

  const newBtn = document.createElement("button");
  newBtn.textContent = "Novo Cliente";
  newBtn.className = "btn btn-primary";
  newBtn.onclick = () => window.navigate && window.navigate("/customers/new");
  header.appendChild(newBtn);
  container.appendChild(header);

  const table = document.createElement("table");
  table.style.cssText =
    "width: 100%; border-collapse: collapse; margin-top: 1rem;";

  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  trHead.style.cssText =
    "text-align: left; border-bottom: 2px solid var(--border);";
  ["ID", "Nome", "CPF", "Email"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    th.style.padding = "10px";
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  container.appendChild(table);

  try {
    const customers = await api.get<Customer[]>("/customers");
    customers.forEach((c) => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";

      const appendTd = (text: string) => {
        const td = document.createElement("td");
        td.textContent = text;
        td.style.padding = "10px";
        tr.appendChild(td);
      };
      appendTd(c.id.toString());
      appendTd(c.name);
      appendTd(c.cpf);
      appendTd(c.email || "-");
      tbody.appendChild(tr);
    });
  } catch (err: any) {
    const errP = document.createElement("p");
    errP.style.color = "var(--error)";
    errP.textContent = `Erro: ${err.message}`;
    container.appendChild(errP);
  }
  table.appendChild(tbody);

  const hint = document.createElement("p");
  hint.style.cssText =
    "margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;";
  hint.textContent =
    "* Certifique-se de que existe um Cliente com ID correspondente ao usuário logado para evitar erros de venda.";
  container.appendChild(hint);
}
