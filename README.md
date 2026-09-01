# A-ONE THRIFT — Shopping Website (WhatsApp Checkout)

Yeh ek Gen-Z/thrift-style shopping website hai, bina payment gateway ke. Customer product cart mein daalta hai, aur "Checkout on WhatsApp" dabate hi poori order list ke saath WhatsApp khul jaata hai.

## Files
- `index.html` — page ka structure
- `style.css` — design
- `products.js` — **aapke products yahan hain**
- `script.js` — cart aur WhatsApp logic
- `admin.html` — products manage karne ka panel
- `admin.js` — admin panel ka logic

## Shuru karne se pehle — sirf 2 cheezein badlein

### 1. Apna WhatsApp number daalein
`script.js` file kholein, sabse upar yeh line milegi:
```js
const WHATSAPP_NUMBER = "911234567890";
```
Ise apne number se replace karein — country code ke saath, bina `+` ya space ke.
Jaise agar number `98765 43210` hai, to India ke liye likhein: `919876543210`

### 2. Apne products daalein
`admin.html` panel se add karein (recommended), ya `products.js` file directly edit karein.

## GitHub Pages par deploy
1. GitHub par ek repository banayein aur saari 6 files upload karein
2. Repository ke Settings → Pages mein jayein
3. Branch mein `main` chunein, folder `/ (root)` rakhein, Save dabayein
4. Live link milega: `https://aapka-username.github.io/repo-name/`

## Admin Panel — products add/edit/delete karna
1. `admin.html` ko browser mein kholein: `https://aapka-username.github.io/repo-name/admin.html`
2. Password: `aone2026` (isse `admin.js` mein `ADMIN_PASSWORD` line se badal lein)
3. Products add/edit/delete karein, phir **"Download products.js"** dabayein
4. Downloaded file ko GitHub par purani `products.js` ki jagah upload/replace karein

## Product images ke liye Google Drive use karna
Admin panel ab **Google Drive links support karta hai** — koi alag image hosting service ki zaroorat nahi.

1. Photo ko Google Drive par upload karein
2. File par right-click → **Share** → access ko **"Anyone with the link"** (Viewer) par set karein — yeh step zaroori hai, warna image site par nahi dikhegi
3. **Copy link** dabayein — link kuch aisa dikhega: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
4. Poora link admin panel ke "Image URL" field mein paste kar dein — save karte hi yeh automatically sahi format mein convert ho jayega

Agar image publish hone ke baad na dikhe, to sabse pehle check karein ki sharing setting "Anyone with the link" par hai ya nahi.

## Search aur Category Filter
Website mein ab top par ek search bar hai (naam/description se dhundta hai) aur category pills hain (jaise Jackets, Tees, Bottoms) — dono automatically `products.js` mein diye gaye `category` field se banti hain. Admin panel se product add/edit karte waqt "Category" field bhi bharein taaki filter sahi kaam kare.

Mobile par jab bag mein koi item ho, to neeche ek sticky "View Bag" bar dikhta hai — Flipkart/Amazon jaisa.

## Aage koi bhi change karna
Har baar file edit karne ke baad: **Save → Commit → Sync (Push)** — VS Code ke Source Control panel se.
