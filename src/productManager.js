import { v4 as newId } from "uuid";
import fs from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  verifyCode(code, products) {
    return products.some((product) => product.code === code);
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      //antes que nada verificamos que el codigo no este repetido en ningun producto
      const codeUsed = this.verifyCode(product.code, products);
      if (codeUsed){
           return "Error, el código ya esta en uso"
      }

      const id = newId();
      
      const newProduct = { id, ...product };
      products.push(newProduct);

      await fs.writeFile(
        this.path,
        JSON.stringify(products, null, 2),
        "utf-8",
      );
      return newProduct;
    } catch (error) {
      throw new Error(
        "No se pudo insertar el producto",
        error.message,
      );
    }
  }

  async getProducts() {
    try {
      
      const productJson = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(productJson);
      
      return products;
    } catch (error) {
      throw new Error("No se pudo leer el archivo", error.message);
    }
  }

  async getProductById(productId) {
    try {
      const products = await this.getProducts();
      const productFound = products.find(
        (product) => product.id === productId,
      );
      if (!productFound) throw new Error("Producto no encontrado");

      return productFound;
    } catch (error) {
      throw new Error(
        "Error al traer un producto por su ID",
        error.message,
      );
    }
  }

  async deleteProductById(productId) {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter((product) => product.id !== productId)
    await fs.writeFile(this.path,JSON.stringify(filteredProducts, null, 2), "utf-8")
    return null
    } catch (error) {
      throw new Error("Error al borrar un producto por su ID", error.message)
    }
  }

  async updateProductById(productId, updates){
    try {
      const products = await this.getProducts();
      const indexProduct = products.findIndex((product) => productId === productId);
      if(indexProduct === -1) throw new Error("Producto no encontrado")
      
        products[indexProduct] = {...products[indexProduct], ...updates}
     await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8")
     return products[indexProduct]
    } catch (error) {
      throw new Error("Error al editar un producto por su ID", error.message)
    }
  }
}

export default ProductManager;
