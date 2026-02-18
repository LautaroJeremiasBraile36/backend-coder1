import express, { json } from "express";
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";

const app = express();
//middleware para recibir data json en mis endpoints
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./src/data/products.json");
const cartManager = new CartManager("./src/data/carts.json");

//Endpoints === Rutas
//Obtengo info

app.get("/products", async (req, res) => {
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

app.get("/products/:pId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await productManager.getProductById(productId);
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// AGREGAR PRODUCTO - POST

app.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;

    const product = await productManager.addProduct(newProduct);
    res.status(201).json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ELIMINAR PRODUCT - DELETE

app.delete("/products/:productId", async (req, res) => {
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

// MODIFICAR UN PRODUCTO - PUT

app.put("/products/:productId", async (req, res) => {
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
/// Get Carts = Obtener carritos
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

/// Get Carts By Id = Obtener carts por ID
app.get("/api/carts/:cId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await cartManager.getCartById(cartId);
    res.status(200).json({ status: "success", cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

/// Post Cart = Creamos carrito
app.post("/api/carts", async (req, res) => {
  try {
    const newCart = req.body;
    const cart = await cartManager.addCart(newCart);
    res.status(201).json({ status: "success", newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

//manejador de rutas no encontradas - 404
app.use((req, res) => {
  res.json({
    message: "Ruta no encontrada",
  });
});

//PUERTO
app.listen(8080, () => {
  console.log(
    "🚀 Servidor corriendo en el servidor en http://localhost:8080",
  );
});
