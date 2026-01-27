import { CartItem, Product } from "../../../shared/types";

export const CartService = {
  getCart(): CartItem[] {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  },

  addToCart(product: Product, quantity = 1): void {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.product.id === product.id);

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
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
      this.saveCart(cart);
    }
  },

  clearCart(): void {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));
  },

  getTotal(): number {
    const cart = this.getCart();
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  },

  saveCart(cart: CartItem[]): void {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  },
};
