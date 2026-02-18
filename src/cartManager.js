import { v4 as newId } from "uuid";
import fs from "fs/promises";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  verifyId(id, carts) {
    return carts.some((cart) => cart.id === id);
  }
  verifyStock(stock, cart){
    return cart.stock.value(stock)
  }

  async addCart(cart) {
    try {
      const carts = await this.getCarts();
      //antes que nada verificamos que el id no este repetido en ningun cart
      const idUsed = this.verifyId(cart.id, carts);
      if (idUsed) return "Error. Ya existe un carrito con ese ID"

      const id = newId();

      const newCart = { id, ...cart };
      carts.push(newCart);

      await fs.writeFile(
        this.path,
        JSON.stringify(carts, null, 2),
        "utf-8",
      );
      return newCart;
    } catch (error) {
      throw new Error("No se pudo crear el carrito", error.message);
    }
  }

  async getCarts() {
    try {
      const cartsJson = await fs.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartsJson);

      return carts;
    } catch (error) {
      throw new Error("No se pudo leer el archivo", error.message);
    }
  }

  async getCartById(cartId) {
    try {
      const carts = await this.getCarts();
      const cartFound = carts.find((cart) => cart.id === cartId);
      if (!cartFound) throw new Error("Carrito no encontrado");

      return cartFound;
    } catch (error) {
      throw new Error(
        "Error al traer un carrito por su ID",
        error.message,
      );
    }
  }

  async deleteCartById(cartId) {
    try {
      const carts = await this.getCarts();
      const filteredCarts = carts.filter(
        (cart) => cart.id !== cartId,
      );
      await fs.writeFile(
        this.path,
        JSON.stringify(filteredCarts, null, 2),
        "utf-8",
      );
      return null;
    } catch (error) {
      throw new Error(
        "Error al borrar un carrito por su ID",
        error.message,
      );
    }
  }

  async updateCarritoById(cartId, updates) {
    try {
      const carts = await this.getCarts();
      const indexCart = carts.findIndex((cart) => cartId === cartId);
      if (indexCart === -1) throw new Error("Carrito no encontrado");

      carts[indexCart] = { ...carts[indexCart], ...updates };
      await fs.writeFile(
        this.path,
        JSON.stringify(carts, null, 2),
        "utf-8",
      );
      return carts[indexCart];
    } catch (error) {
      throw new Error(
        "Error al editar un carrito por su ID",
        error.message,
      );
    }
  }
}

export default CartManager;
