import express, { json } from "express";
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";

const app = express();

//
//////// middleware para recibir data json en mis endpoints
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
//////// PUERTO
//
const PORT = 8080;

//
//////// MANAGERS
//
const productManager = new ProductManager("./src/data/products.json");
const cartManager = new CartManager("./src/data/carts.json");

//
//////// PRODUCTOS
//
app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.status(200).json({
      status: "success",
      products,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.get("/api/products/:pId", async (req, res) => {
  try {
    const productId = req.params.pId;

    const product = await productManager.getProductById(pId);
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.post("/api/products", async (req, res) => {
  try {
    const newProduct = req.body;

    const product = await productManager.addProduct(newProduct);
    res.status(201).json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.delete("/api/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    await productManager.deleteProductById(productId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
app.put("/api/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;

    const product = await productManager.updateProductById(
      productId,
      updates,
    );
    res.status(200).json({
      status: "success",
      product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

//
//////// CART
//
app.get("/api/carts", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).json({
      status: "success",
      carts,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.get("/api/carts/:cId", async (req, res) => {
  try {
    const cartId = req.params.cId;
    const cart = await cartManager.getCartById(cartId);
    res.status(200).json({ status: "success", cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.post("/api/carts", async (req, res) => {
  try {
    const newCart = req.body;
    const cart = await cartManager.addCart(newCart);
    res.status(201).json({ status: "success", cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.post("/api/carts/:cId/products/:pId", async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(
      req.params.cId,
      req.params.pId,
    );
    res.status(201).json({ status: "succes", cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.put("/api/carts/:cId", async (req, res) => {
  try {
    const cartId = req.params.cId;
    const updates = req.body;

    const cart = await cartManager.updateCarritoById(cartId, updates);

    res.status(200).json({
      status: "success",
      cart,
    });
    return cart;
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
app.delete("/api/carts/:cId", async (req, res) => {
  try {
    const cartId = req.params.cId;
    await cartManager.deleteCartById(cartId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

//manejador de rutas no encontradas - 404
app.use((req, res) => {
  res.json({
    message: "Ruta no encontrada",
  });
});

//PUERTO
app.listen(PORT, () => {
  console.log(
    `🚀 Servidor corriendo en el servidor en http://localhost:${PORT}`,
  );
});
