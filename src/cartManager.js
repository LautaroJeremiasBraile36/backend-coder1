import { v4 as newId } from "uuid";
import fs from "fs/promises";
import ProductManager from "./productManager.js";

const productManager = new ProductManager("./src/data/products.json");

class CartManager {
  constructor(path) {
    this.path = path;
  }

  verifyId(id, carts) {
    return carts.some((cart) => cart.id === id);
  }
  verifyStock(stock, cart) {
    return cart.stock.value(stock);
  }

  async addCart(cart) {
    try {
      const carts = await this.getCarts();
      const id = newId();
      const newCart = {
        id: id,
        products: []
        
      };
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
      const filteredCart = carts.filter((cart) => cart.id !== cartId);
      await fs.writeFile(
        this.path,
        JSON.stringify(filteredCart, null, 2),
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
      const indexCart = carts.findIndex((cart) => cart.id === cartId);
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
  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) throw new Error("Carrito no encontrado");

      const product = await productManager.getProductById(productId);
      if (!product) throw new Error("Producto no encontrado");

      const productIndex = carts[cartIndex].products.findIndex(
        (p) => p.product === productId
      );
      if (productIndex === -1) {
        carts[cartIndex].products.push({
          product: productId,
          quantity: 1,
        });
      } else {
        carts[cartIndex].products[productIndex].quantity+=1;
      }

      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));

      return carts[cartIndex];
    } catch (error) {
       throw new Error(
        "Error al intentar agregar un producto al carrito",
        error.message,
      );
    }
  }
}

export default CartManager;
