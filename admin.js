// ============================================================
// Admin password — sirf casual protection, real security nahi hai
// (kyunki yeh static site hai, koi bhi page ka code dekh sakta hai)
// ============================================================
const ADMIN_PASSWORD = "basera123";

const DRAFT_KEY = "basera_admin_draft_products_v1";
let editingId = null;

function loadDraftProducts() {
  const saved = localStorage.getItem(DRAFT_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch { /* fall through */ }
  }
  // pehli baar: products.js se shuru karein
  return JSON.parse(JSON.stringify(PRODUCTS));
}

function saveDraftProducts(list) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(list));
}

let draftProducts = [];

function renderAdminList() {
  const container = document.getElementById("productListAdmin");
  document.getElementById("productCountLabel").textContent = draftProducts.length;

  if (draftProducts.length === 0) {
    container.innerHTML = `<p style="color:#5a5349;">Koi product nahi hai. Upar se add karein.</p>`;
    return;
  }

  container.innerHTML = draftProducts.map(p => `
    <div class="product-row-admin">
      <div class="thumb" style="background-image:url('${p.image}')"></div>
      <div class="row-info">
        <p class="row-name">${p.name}</p>
        <p class="row-price">₹${p.price}</p>
      </div>
      <div class="row-actions">
        <button class="edit-btn" data-id="${p.id}">Edit</button>
        <button class="delete-btn" data-id="${p.id}">Delete</button>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => startEdit(btn.dataset.id));
  });
  container.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
  });
}

function clearForm() {
  document.getElementById("fName").value = "";
  document.getElementById("fPrice").value = "";
  document.getElementById("fImage").value = "";
  document.getElementById("fDesc").value = "";
  document.getElementById("formTitle").textContent = "Naya product add karein";
  document.getElementById("cancelBtn").style.display = "none";
  editingId = null;
}

function startEdit(id) {
  const p = draftProducts.find(prod => prod.id === id);
  if (!p) return;
  document.getElementById("fName").value = p.name;
  document.getElementById("fPrice").value = p.price;
  document.getElementById("fImage").value = p.image;
  document.getElementById("fDesc").value = p.desc;
  document.getElementById("formTitle").textContent = "Product edit karein";
  document.getElementById("cancelBtn").style.display = "inline-block";
  editingId = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(id) {
  if (!confirm("Yeh product delete karna hai?")) return;
  draftProducts = draftProducts.filter(p => p.id !== id);
  saveDraftProducts(draftProducts);
  renderAdminList();
}

function nextId() {
  let n = draftProducts.length + 1;
  while (draftProducts.some(p => p.id === `p${n}`)) n++;
  return `p${n}`;
}

function saveProduct() {
  const name = document.getElementById("fName").value.trim();
  const price = parseFloat(document.getElementById("fPrice").value);
  const image = document.getElementById("fImage").value.trim();
  const desc = document.getElementById("fDesc").value.trim();

  if (!name || !price || !image) {
    alert("Naam, price aur image URL zaroori hai.");
    return;
  }

  if (editingId) {
    const p = draftProducts.find(prod => prod.id === editingId);
    Object.assign(p, { name, price, image, desc });
  } else {
    draftProducts.push({ id: nextId(), name, price, image, desc });
  }

  saveDraftProducts(draftProducts);
  renderAdminList();
  clearForm();
}

function downloadProductsFile() {
  const header = `// ============================================================
// PRODUCTS — apne products yahan add/edit/remove karein
// Har product ke liye: id (unique), name, price (number), image (URL), desc
// ============================================================
const PRODUCTS = `;
  const body = JSON.stringify(draftProducts, null, 2) + ";\n";
  const blob = new Blob([header + body], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products.js";
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
  // ---- Lock screen ----
  const lockScreen = document.getElementById("lockScreen");
  const adminApp = document.getElementById("adminApp");
  const unlockBtn = document.getElementById("unlockBtn");
  const passwordInput = document.getElementById("passwordInput");
  const lockError = document.getElementById("lockError");

  function tryUnlock() {
    if (passwordInput.value === ADMIN_PASSWORD) {
      lockScreen.style.display = "none";
      adminApp.style.display = "block";
      draftProducts = loadDraftProducts();
      renderAdminList();
    } else {
      lockError.style.display = "block";
    }
  }

  unlockBtn.addEventListener("click", tryUnlock);
  passwordInput.addEventListener("keydown", e => {
    if (e.key === "Enter") tryUnlock();
  });

  // ---- Form actions ----
  document.getElementById("saveBtn").addEventListener("click", saveProduct);
  document.getElementById("cancelBtn").addEventListener("click", clearForm);
  document.getElementById("downloadBtn").addEventListener("click", downloadProductsFile);
});
