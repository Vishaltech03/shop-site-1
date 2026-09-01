// ============================================================
// SETTINGS — yeh do cheezein sabse pehle apni details se badlein
// ============================================================
const WHATSAPP_NUMBER = "911234567890"; // Country code ke saath, bina + ya spaces ke. Jaise India: 91XXXXXXXXXX
const SHOP_NAME = "Basera";
const CURRENCY_SYMBOL = "₹";

// ============================================================
// Neeche kuch badalne ki zaroorat nahi hai
// ============================================================
const CART_KEY = "basera_cart_v1";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const cart = getCart();
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function cartCount(cart) {
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function cartTotal(cart) {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find(p => p.id === id);
    return product ? sum + product.price * qty : sum;
  }, 0);
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card">
      <div class="product-image" style="background-image:url('${p.image}')"></div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-row">
          <span class="product-price">${CURRENCY_SYMBOL}${p.price}</span>
          <button class="btn btn-add" data-id="${p.id}">Cart mein daalein</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".btn-add").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

function renderCart() {
  const cart = getCart();
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");

  const entries = Object.entries(cart);

  if (entries.length === 0) {
    itemsEl.innerHTML = `<p class="cart-empty">Cart abhi khaali hai.</p>`;
  } else {
    itemsEl.innerHTML = entries.map(([id, qty]) => {
      const p = PRODUCTS.find(prod => prod.id === id);
      if (!p) return "";
      return `
        <div class="cart-item">
          <div class="cart-item-image" style="background-image:url('${p.image}')"></div>
          <div class="cart-item-info">
            <p class="cart-item-name">${p.name}</p>
            <p class="cart-item-price">${CURRENCY_SYMBOL}${p.price}</p>
            <div class="qty-control">
              <button class="qty-btn" data-action="dec" data-id="${id}">&minus;</button>
              <span>${qty}</span>
              <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
              <button class="remove-btn" data-id="${id}">Hatayein</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    itemsEl.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        changeQty(btn.dataset.id, btn.dataset.action === "inc" ? 1 : -1);
      });
    });
    itemsEl.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
    });
  }

  totalEl.textContent = `${CURRENCY_SYMBOL}${cartTotal(cart)}`;
  countEl.textContent = cartCount(cart);
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

function buildWhatsappMessage() {
  const cart = getCart();
  const entries = Object.entries(cart);
  if (entries.length === 0) return null;

  let lines = [`Namaste ${SHOP_NAME}, mujhe yeh order karna hai:`, ""];
  entries.forEach(([id, qty]) => {
    const p = PRODUCTS.find(prod => prod.id === id);
    if (p) lines.push(`• ${p.name} x${qty} — ${CURRENCY_SYMBOL}${p.price * qty}`);
  });
  lines.push("");
  lines.push(`Total: ${CURRENCY_SYMBOL}${cartTotal(cart)}`);
  lines.push("");
  lines.push("Kripya delivery aur payment ki jaankari batayein.");

  return lines.join("\n");
}

function goToWhatsapp() {
  const message = buildWhatsappMessage();
  if (!message) {
    alert("Cart khaali hai — pehle kuch products chunein.");
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("checkoutBtn").addEventListener("click", goToWhatsapp);

  const footerLink = document.getElementById("footerWhatsapp");
  footerLink.href = `https://wa.me/${WHATSAPP_NUMBER}`;
});
