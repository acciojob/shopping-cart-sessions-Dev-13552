// script.js

// Product data
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

// DOM elements
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const clearCartBtn = document.getElementById("clear-cart-btn");

// Load cart from sessionStorage, or start with an empty array
let cart = [];
try {
  const saved = sessionStorage.getItem("cart");
  cart = saved ? JSON.parse(saved) : [];
} catch (err) {
  cart = [];
}

/**
 * Save current cart to sessionStorage (stringified)
 */
function saveCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Render the product list (each product with "Add to Cart" button)
 */
function renderProducts() {
  productList.innerHTML = ""; // clear existing
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${product.name} - $${product.price}
      <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;
    productList.appendChild(li);
  });
}

/**
 * Render the cart contents into ul#cart-list
 * Each cart item shows name - price and a Remove button
 */
function renderCart() {
  cartList.innerHTML = ""; // clear existing

  if (cart.length === 0) {
    // Keep it empty (tests expect no child elements when empty)
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price} `;

    // Optional: a Remove button to remove a specific instance
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-from-cart-btn";
    removeBtn.dataset.index = index; // use index so duplicate items can be handled

    li.appendChild(removeBtn);
    cartList.appendChild(li);
  });
}

/**
 * Add product (by id) to cart and persist
 * If id is invalid, does nothing.
 */
function addToCart(productId) {
  const id = Number(productId);
  const product = products.find((p) => p.id === id);
  if (!product) return;

  // Add a copy of the product (id, name, price) to the cart
  cart.push({ id: product.id, name: product.name, price: product.price });

  // Persist and re-render
  saveCart();
  renderCart();
}

/**
 * Remove a cart item by index (not product id) so duplicates are handled correctly
 */
function removeFromCartByIndex(index) {
  const i = Number(index);
  if (Number.isNaN(i) || i < 0 || i >= cart.length) return;
  cart.splice(i, 1);
  saveCart();
  renderCart();
}

/**
 * Clear entire cart
 */
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

/* -------------------------
   Event listeners (delegation)
   ------------------------- */

// Add to cart buttons (delegated from productList)
productList.addEventListener("click", (e) => {
  const btn = e.target;
  if (btn && btn.matches(".add-to-cart-btn")) {
    const id = btn.dataset.id;
    addToCart(id);
  }
});

// Remove item buttons (delegated from cartList)
cartList.addEventListener("click", (e) => {
  const btn = e.target;
  if (btn && btn.matches(".remove-from-cart-btn")) {
    const idx = btn.dataset.index;
    removeFromCartByIndex(idx);
  }
});

// Clear cart button
clearCartBtn.addEventListener("click", clearCart);

/* -------------------------
   Initial render
   ------------------------- */
renderProducts();
renderCart();
