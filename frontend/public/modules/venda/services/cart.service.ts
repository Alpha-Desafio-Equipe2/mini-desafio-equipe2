import { CartItem, Product } from "../../../shared/types";

export const CartService = {
  getCartKey(): string {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return user ? `cart_${user.id}` : "cart_guest";
  },

  getCart(): CartItem[] {
    const stored = localStorage.getItem(this.getCartKey());
    return stored ? JSON.parse(stored) : [];
  },

  addToCart(product: Product, quantity = 1): void {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.product.id === product.id);

    const currentQty = existingItem ? existingItem.quantity : 0;

    // Validar Estoque (Stock Validation)
    if (currentQty + quantity > product.quantity) {
      alert(`Estoque insuficiente! Disponível: ${product.quantity}`);
      return;
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    this.saveCart(cart);
  },

  removeFromCart(productId: number): void {
    const cart = this.getCart().filter((item) => item.product.id !== productId);
    this.saveCart(cart);
  },

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCart();
    const item = cart.find((item) => item.product.id === productId);

    if (item) {
      // Validar Estoque
      if (quantity > item.product.quantity) {
        alert(`Quantidade excede o estoque! Máximo: ${item.product.quantity}`);
        // Reset to max
        quantity = item.product.quantity;
      }

      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
      this.saveCart(cart);
    }
  },

  getPrescriptionKey(): string {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return user ? `cart_prescription_${user.id}` : "cart_prescription_guest";
  },

  clearCart(): void {
    localStorage.removeItem(this.getCartKey());
    localStorage.removeItem(this.getPrescriptionKey());
    window.dispatchEvent(new Event("cart-updated"));
  },

  setPrescriptionData(data: { crm: string; date: string }): void {
    localStorage.setItem(this.getPrescriptionKey(), JSON.stringify(data));
  },

  getPrescriptionData(): { crm: string; date: string } | null {
    const stored = localStorage.getItem(this.getPrescriptionKey());
    return stored ? JSON.parse(stored) : null;
  },

  getTotal(): number {
    const cart = this.getCart();
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  },

  saveCart(cart: CartItem[]): void {
    localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  },
};
