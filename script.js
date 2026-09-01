// ============================================================
// SETTINGS — update these two things first
// ============================================================
const WHATSAPP_NUMBER = "911234567890"; // Include country code, no + or spaces. e.g. India: 91XXXXXXXXXX
const SHOP_NAME = "A-ONE THRIFT";
const CURRENCY_SYMBOL = "₹";

// ============================================================
// Nothing below this needs to change
// ============================================================
const CART_KEY = "aone_thrift_cart_v1";

// Converts a Google Drive share link into a direct-viewable image URL.
// Works with links like https://drive.google.com/file/d/FILE_ID/view?usp=sharing
function resolveImageUrl(url) {
  if (!url) return url;
  const match = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
    || url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/)
    || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match && url.includes("drive.google.com")) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
}

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
  grid.innerHTML = PRODUCTS.map((p, i) => `
    <article class="product-card" style="--tilt:${(i % 2 === 0 ? -1 : 1) * 1.5}deg">
      <div class="product-image" style="background-image:url('${resolveImageUrl(p.image)}')">
        <span class="product-badge">ONE OF ONE</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-row">
          <span class="product-price">${CURRENCY_SYMBOL}${p.price}</span>
          <button class="btn btn-add" data-id="${p.id}">Add to bag</button>
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
    itemsEl.innerHTML = `<p class="cart-empty">Your bag is empty.</p>`;
  } else {
    itemsEl.innerHTML = entries.map(([id, qty]) => {
      const p = PRODUCTS.find(prod => prod.id === id);
      if (!p) return "";
      return `
        <div class="cart-item">
          <div class="cart-item-image" style="background-image:url('${resolveImageUrl(p.image)}')"></div>
          <div class="cart-item-info">
            <p class="cart-item-name">${p.name}</p>
            <p class="cart-item-price">${CURRENCY_SYMBOL}${p.price}</p>
            <div class="qty-control">
              <button class="qty-btn" data-action="dec" data-id="${id}">&minus;</button>
              <span>${qty}</span>
              <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
              <button class="remove-btn" data-id="${id}">Remove</button>
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

  let lines = [`Hey ${SHOP_NAME}, I'd like to order:`, ""];
  entries.forEach(([id, qty]) => {
    const p = PRODUCTS.find(prod => prod.id === id);
    if (p) lines.push(`• ${p.name} x${qty} — ${CURRENCY_SYMBOL}${p.price * qty}`);
  });
  lines.push("");
  lines.push(`Total: ${CURRENCY_SYMBOL}${cartTotal(cart)}`);
  lines.push("");
  lines.push("Please share sizing, payment, and shipping details.");

  return lines.join("\n");
}

function goToWhatsapp() {
  const message = buildWhatsappMessage();
  if (!message) {
    alert("Your bag is empty — add something first.");
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
