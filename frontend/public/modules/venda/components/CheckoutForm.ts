import { CartService } from "../services/cart.service.js";
import { BalanceService } from "../services/balance.service.js";
import { SaleService } from "../services/sale.service.js";
import { ErrorModal } from "../../../shared/components/error-modal.js";
import { OrderReceiptModal } from "./order-receipt-modal.js";
import { CreateSaleDTO, SaleItem } from "../../../shared/types.js";

export const createCheckoutForm = (
  isAdminOrAttendant: boolean,
  user: any,
  allCustomers: any[],
  hasPrescriptionItems: boolean,
  onSuccess: () => void,
): HTMLElement => {
  const container = document.createElement("div");
  container.style.cssText =
    "margin-top: 2rem; background: var(--surface); padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);";

  const h3 = document.createElement("h3");
  h3.textContent = "Finalizar Pedido";
  h3.style.marginBottom = "1rem";
  container.appendChild(h3);

  const form = document.createElement("form");
  form.id = "checkout-form";

  // Admin POS
  if (isAdminOrAttendant) {
    const adminArea = document.createElement("div");
    adminArea.style.cssText =
      "background: #e3f2fd; padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; border-left: 4px solid #2196f3;";

    const adminH4 = document.createElement("h4");
    adminH4.textContent = "🛒 Área do Atendente (PDV)";
    adminH4.style.cssText = "color: #1565c0; margin-bottom: 1rem;";
    adminArea.appendChild(adminH4);

    // Customer Select
    const custDiv = document.createElement("div");
    custDiv.style.marginBottom = "0.5rem";
    const custLabel = document.createElement("label");
    custLabel.textContent = "👤 Selecione o Cliente (Admin)";
    custLabel.style.cssText = "display: block; margin-bottom: 0.5rem;";
    custDiv.appendChild(custLabel);

    const custSelect = document.createElement("select");
    custSelect.id = "admin-customer-select";
    custSelect.className = "input-field";
    custSelect.style.background = "white";

    const selfOption = document.createElement("option");
    selfOption.value = user.id;
    selfOption.textContent = `Eu mesmo (${user.name})`;
    custSelect.appendChild(selfOption);

    allCustomers.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.name} (CPF: ${c.cpf})`;
      custSelect.appendChild(opt);
    });
    custDiv.appendChild(custSelect);
    adminArea.appendChild(custDiv);

    // Payment Method
    const payDiv = document.createElement("div");
    payDiv.style.marginBottom = "1rem";
    const payLabel = document.createElement("label");
    payLabel.textContent = "💰 Método de Pagamento (PDV)";
    payLabel.style.cssText = "display: block; margin-bottom: 0.5rem;";
    payDiv.appendChild(payLabel);

    const paySelect = document.createElement("select");
    paySelect.name = "payment_method";
    paySelect.id = "admin-payment-method";
    paySelect.className = "input-field";
    paySelect.style.background = "white";
    const methods = [
      { v: "cash", l: "Dinheiro" },
      { v: "debit", l: "Cartão de Débito" },
      { v: "credit", l: "Cartão de Crédito" },
      { v: "pix", l: "Pix" },
    ];
    methods.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.v;
      opt.textContent = m.l;
      paySelect.appendChild(opt);
    });
    payDiv.appendChild(paySelect);
    adminArea.appendChild(payDiv);

    form.appendChild(adminArea);
  }

  // Delivery Type
  const typeDiv = document.createElement("div");
  typeDiv.style.marginBottom = "1rem";
  const typeLabel = document.createElement("label");
  typeLabel.textContent = "Tipo de Entrega";
  typeLabel.style.cssText = "display: block; margin-bottom: 0.5rem;";
  typeDiv.appendChild(typeLabel);

  const typeSelect = document.createElement("select");
  typeSelect.name = "type";
  typeSelect.className = "input-field";
  typeSelect.required = true;
  typeSelect.id = "delivery-type";
  const optDelivery = document.createElement("option");
  optDelivery.value = "delivery";
  optDelivery.textContent = "Entrega";
  const optPickup = document.createElement("option");
  optPickup.value = "pickup";
  optPickup.textContent = "Retirada";
  typeSelect.appendChild(optDelivery);
  typeSelect.appendChild(optPickup);
  typeDiv.appendChild(typeSelect);
  form.appendChild(typeDiv);

  // Address
  const addrDiv = document.createElement("div");
  addrDiv.style.marginBottom = "1rem";
  addrDiv.id = "address-group";
  const addrLabel = document.createElement("label");
  addrLabel.textContent = "Endereço de Entrega";
  addrLabel.style.cssText = "display: block; margin-bottom: 0.5rem;";
  addrDiv.appendChild(addrLabel);

  const addrInput = document.createElement("input");
  addrInput.type = "text";
  addrInput.name = "delivery_address";
  addrInput.className = "input-field";
  addrInput.placeholder = "Rua, Número, Bairro...";
  addrDiv.appendChild(addrInput);
  form.appendChild(addrDiv);

  // Toggle address visibility
  typeSelect.onchange = () => {
    addrDiv.style.display = typeSelect.value === "delivery" ? "block" : "none";
  };

  // Prescription Fields
  if (hasPrescriptionItems) {
    const prescDiv = document.createElement("div");
    prescDiv.style.cssText =
      "border: 1px dashed var(--error); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem;";

    const prescH4 = document.createElement("h4");
    prescH4.textContent = "Dados da Receita Obrigatórios";
    prescH4.style.cssText = "color: var(--error); margin-bottom: 0.5rem;";
    prescDiv.appendChild(prescH4);

    const gridDiv = document.createElement("div");
    gridDiv.style.cssText =
      "display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;";

    // CRM
    const crmDiv = document.createElement("div");
    const crmLabel = document.createElement("label");
    crmLabel.textContent = "CRM do Médico";
    crmLabel.style.cssText = "display: block; margin-bottom: 0.5rem;";
    crmDiv.appendChild(crmLabel);
    const crmInput = document.createElement("input");
    crmInput.type = "text";
    crmInput.name = "doctor_crm";
    crmInput.className = "input-field";
    crmInput.required = true;
    crmInput.placeholder = "Ex: 12345/SP";
    crmInput.value = CartService.getPrescriptionData()?.crm || "";
    crmDiv.appendChild(crmInput);
    gridDiv.appendChild(crmDiv);

    // Date
    const dateDiv = document.createElement("div");
    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Data da Receita";
    dateLabel.style.cssText = "display: block; margin-bottom: 0.5rem;";
    dateDiv.appendChild(dateLabel);
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.name = "prescription_date";
    dateInput.className = "input-field";
    dateInput.required = true;
    dateInput.value = CartService.getPrescriptionData()?.date || "";
    dateDiv.appendChild(dateInput);
    gridDiv.appendChild(dateDiv);

    // Doctor Name (Optional)
    const nameDiv = document.createElement("div");
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Nome do Médico (Opcional)";
    nameLabel.style.cssText = "display: block; margin-bottom: 0.5rem;";
    nameDiv.appendChild(nameLabel);
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "doctor_name";
    nameInput.className = "input-field";
    nameInput.placeholder = "Dr. Exemplo";
    nameDiv.appendChild(nameInput);
    gridDiv.appendChild(nameDiv);

    // Doctor UF (Optional)
    const ufDiv = document.createElement("div");
    const ufLabel = document.createElement("label");
    ufLabel.textContent = "UF (Opcional)";
    ufLabel.style.cssText = "display: block; margin-bottom: 0.5rem;";
    ufDiv.appendChild(ufLabel);

    const ufSelect = document.createElement("select");
    ufSelect.name = "doctor_uf";
    ufSelect.className = "input-field";
    ufSelect.style.background = "white"; // Ensure valid background for select

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Selecione...";
    ufSelect.appendChild(defaultOpt);

    const states = [
      "AC",
      "AL",
      "AP",
      "AM",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MT",
      "MS",
      "MG",
      "PA",
      "PB",
      "PR",
      "PE",
      "PI",
      "RJ",
      "RN",
      "RS",
      "RO",
      "RR",
      "SC",
      "SP",
      "SE",
      "TO",
    ];

    states.forEach((uf) => {
      const opt = document.createElement("option");
      opt.value = uf;
      opt.textContent = uf;
      ufSelect.appendChild(opt);
    });

    ufDiv.appendChild(ufSelect);
    gridDiv.appendChild(ufDiv);

    prescDiv.appendChild(gridDiv);
    form.appendChild(prescDiv);
  }

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "btn btn-primary";
  submitBtn.style.width = "100%";
  submitBtn.textContent = "Confirmar Pedido";
  form.appendChild(submitBtn);

  // Submit Logic
  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const type = formData.get("type") as string;
    const delivery_address = formData.get("delivery_address") as string;

    const rawData: any = Object.fromEntries(formData.entries());

    if (type === "delivery" && !delivery_address) {
      const errorModal = ErrorModal({
        title: "Endereço Não Informado",
        message: "Para entregas, é necessário informar o endereço completo.",
        type: "warning",
        details: ["Por favor, preencha o campo de endereço de entrega"],
      });
      document.body.appendChild(errorModal);
      return;
    }

    const total = CartService.getTotal();
    const currentBalance = BalanceService.getBalance();
    let paymentMethod = "balance"; // Default for users

    if (isAdminOrAttendant) {
      const payEl = document.getElementById(
        "admin-payment-method",
      ) as HTMLSelectElement;
      if (payEl) paymentMethod = payEl.value;
    }

    // Only check balance if paying with balance
    if (
      paymentMethod === "balance" &&
      !BalanceService.hasSufficientBalance(total)
    ) {
      const missing = total - currentBalance;
      const errorModal = ErrorModal({
        title: "Saldo Insuficiente",
        message: "Você não possui saldo suficiente para completar este pedido.",
        type: "error",
        details: [
          `Saldo atual: R$ ${currentBalance.toFixed(2)}`,
          `Valor do pedido: R$ ${total.toFixed(2)}`,
          `Faltam: R$ ${missing.toFixed(2)}`,
          "Clique no botão 'Adicionar' para adicionar saldo",
        ],
      });
      document.body.appendChild(errorModal);
      return;
    }

    try {
      if (!user) {
        alert("Usuário não autenticado.");
        return;
      }

      let customerId = user.id;

      if (isAdminOrAttendant) {
        const selectEl = document.getElementById(
          "admin-customer-select",
        ) as HTMLSelectElement;
        if (selectEl && selectEl.value) {
          customerId = parseInt(selectEl.value);
        }
      } else {
        try {
          const customers = await SaleService.getCustomers();
          const foundCustomer = customers.find(
            (c) => c.user_id === user.id || c.email === user.email,
          );
          if (foundCustomer) customerId = foundCustomer.id;
        } catch (e) {}
      }

      const cart = CartService.getCart();
      const items: SaleItem[] = cart.map((item) => ({
        medicine_id: item.product.id,
        quantity: item.quantity,
      }));

      const saleData: CreateSaleDTO = {
        customer_id: customerId,
        items: items,
        payment_method: paymentMethod,
      };

      if (hasPrescriptionItems) {
        saleData.doctor_crm = rawData.doctor_crm;
        saleData.prescription_date = rawData.prescription_date;
        if (rawData.doctor_name) saleData.doctor_name = rawData.doctor_name;
        if (rawData.doctor_uf) saleData.doctor_uf = rawData.doctor_uf;
      }

      await SaleService.createSale(saleData);

      if (paymentMethod === "balance") {
        BalanceService.deductBalance(total);
      }

      const newBalance = BalanceService.getBalance();
      const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
      const orderDate = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const receiptItems = cart.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      CartService.clearCart();
      onSuccess();

      const receiptModal = OrderReceiptModal({
        total,
        newBalance,
        items: receiptItems,
        orderNumber,
        date: orderDate,
      });
      document.body.appendChild(receiptModal);
    } catch (error: any) {
      const errorModal = ErrorModal({
        title: "Erro ao Finalizar Pedido",
        message:
          "Não foi possível processar seu pedido. Por favor, tente novamente.",
        type: "error",
        details: [error.message || "Erro desconhecido"],
      });
      document.body.appendChild(errorModal);
    }
  };

  container.appendChild(form);
  return container;
};
