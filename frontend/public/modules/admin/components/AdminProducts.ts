import { api } from "../../../shared/http/api.js";
import { Medicine } from "../../../shared/types.js";
import { openProductForm } from "./ProductFormModal.js";

export async function createAdminProducts(container: HTMLElement) {
  container.innerHTML = "";
  const header = document.createElement("div");
  header.style.cssText =
    "display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;";

  const h3 = document.createElement("h3");
  h3.textContent = "Gerenciar Produtos";
  header.appendChild(h3);

  const newBtn = document.createElement("button");
  newBtn.textContent = "Novo Produto";
  newBtn.className = "btn btn-primary";
  newBtn.onclick = () => openProductForm();
  header.appendChild(newBtn);
  container.appendChild(header);

  const table = document.createElement("table");
  table.style.cssText = "width: 100%; border-collapse: collapse;";

  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  trHead.style.cssText =
    "text-align: left; border-bottom: 2px solid var(--border);";
  ["ID", "Nome", "Preço", "Estoque", "Ações"].forEach((text) => {
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
    const products = await api.get<Medicine[]>("/medicines");
    products.forEach((p) => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";

      const appendTd = (text: string) => {
        const td = document.createElement("td");
        td.textContent = text;
        td.style.padding = "10px";
        tr.appendChild(td);
      };

      appendTd(p.id.toString());
      appendTd(p.name);
      appendTd(p.stock?.toString() || "0");

      const actionsTd = document.createElement("td");
      actionsTd.style.padding = "10px";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.className = "btn btn-secondary";
      editBtn.style.cssText =
        "font-size: 0.8rem; padding: 5px 10px; margin-right: 5px;";
      editBtn.onclick = () => openProductForm(p);
      // Note: openProductForm can take full object to save a fetch, or ID to fetch.
      // Our implementation previously fetched. Let's pass the object we have to start,
      // or fetch inside if needed. The previous implementation fetched by ID.
      // Let's optimize: if we have the object, use it. But ProductFormModal logic awaits fetching if ID is passed?
      // Actually my ProductFormModal implementation expects `product` object directly if editing.
      // Perfect.

      actionsTd.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.textContent = "Excluir";
      delBtn.className = "btn btn-secondary";
      delBtn.style.cssText =
        "font-size: 0.8rem; padding: 5px 10px; color: var(--error); border-color: var(--error);";
      delBtn.onclick = async () => {
        if (!confirm("Tem certeza que deseja excluir este medicamento?"))
          return;
        try {
          await api.delete(`/medicines/${p.id}`);
          createAdminProducts(container); // Refresh
        } catch (err: any) {
          alert(err.message);
        }
      };
      actionsTd.appendChild(delBtn);

      tr.appendChild(actionsTd);
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
