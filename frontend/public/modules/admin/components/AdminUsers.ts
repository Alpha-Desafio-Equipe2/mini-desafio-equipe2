import { api } from "../../../shared/http/api.js";
import { User } from "../../../shared/types.js";

export async function createAdminUsers(container: HTMLElement) {
  container.innerHTML = "";
  const h3 = document.createElement("h3");
  h3.textContent = "Usuários";
  container.appendChild(h3);

  const table = document.createElement("table");
  table.style.cssText =
    "width: 100%; border-collapse: collapse; margin-top: 1rem;";

  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  trHead.style.cssText =
    "text-align: left; border-bottom: 2px solid var(--border);";
  ["ID", "Nome", "Email", "Role"].forEach((text) => {
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
    const users = await api.get<User[]>("/users");
    users.forEach((u) => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";

      const appendTd = (text: string) => {
        const td = document.createElement("td");
        td.textContent = text;
        td.style.padding = "10px";
        tr.appendChild(td);
      };
      appendTd(u.id.toString());
      appendTd(u.name);
      appendTd(u.email);
      appendTd(u.role);
      tbody.appendChild(tr);
    });
  } catch (err: any) {
    const errP = document.createElement("p");
    errP.style.color = "var(--error)";
    errP.textContent = `Erro: ${err.message}`;
    container.appendChild(errP);
  }
  table.appendChild(tbody);
}
