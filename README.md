# Basera — Shopping Website (WhatsApp Checkout)

Yeh ek simple shopping website hai jisme koi payment gateway nahi hai. Customer products ko cart mein daalta hai, aur "WhatsApp par order karein" dabate hi poori order list ke saath WhatsApp khul jaata hai — aage payment/delivery aap WhatsApp par confirm karte hain.

## Files
- `index.html` — page ka structure
- `style.css` — design
- `products.js` — **aapke products yahan hain**
- `script.js` — cart aur WhatsApp logic

## Shuru karne se pehle — sirf 2 cheezein badlein

### 1. Apna WhatsApp number daalein
`script.js` file kholein, sabse upar yeh line milegi:
```js
const WHATSAPP_NUMBER = "911234567890";
```
Ise apne number se replace karein — **country code ke saath, bina `+` ya space ke.**
Jaise agar number `98765 43210` hai, to India ke liye likhein: `919876543210`

### 2. Apne products daalein
`products.js` file kholein — har product ka ek block hai:
```js
{
  id: "p1",
  name: "Product ka naam",
  price: 899,
  image: "https://example.com/image.jpg",
  desc: "Chhota sa description"
}
```
- Naya product add karna ho to poora block copy karke `id` unique rakhein (p7, p8...)
- Product hatana ho to us block ko delete kar dein
- Image ke liye apni photo ka URL daalein (ya Google Drive/Imgur par upload karke link lein)

Bas — baaki sab automatically kaam karega.

## GitHub par deploy kaise karein (GitHub Pages — free)

1. GitHub par login karein aur ek naya repository banayein (jaise `my-shop`)
2. Is folder ki saari files (`index.html`, `style.css`, `script.js`, `products.js`) us repository mein upload kar dein
   - Repository page par "Add file" → "Upload files" se seedhe upload kar sakte hain
3. Repository ke **Settings** tab mein jayein
4. Left sidebar mein **Pages** par click karein
5. "Branch" mein `main` chunein aur folder `/ (root)` rakhein, phir **Save** dabayein
6. Kuch minute baad wahin par ek link mil jayega, jaisa:
   ```
   https://aapka-username.github.io/my-shop/
   ```
   Yahi aapki live website hai — isko customers ke saath share kar sakte hain.

## Test kaise karein
Website open karke koi bhi product "Cart mein daalein" dabayein, phir upar "Cart" button se drawer khulega, aur "WhatsApp par order karein" dabane par WhatsApp (mobile par app, computer par WhatsApp Web) khul jayega — order details pehle se likhi hui milengi.

## Admin Panel — products add/edit/delete karna

`admin.html` ek chhota admin page hai jahan aap **bina coding ke** products add, edit ya delete kar sakte hain.

1. `admin.html` ko browser mein kholein (site deploy hone ke baad: `https://aapka-username.github.io/my-shop/admin.html`)
2. Password daalein — default password hai `basera123` (ise `admin.js` file ke top mein `ADMIN_PASSWORD` line se badal lein)
3. Products add/edit/delete karein — yeh sirf **is browser mein** save hote hain
4. Jab kaam ho jaye, **"Download products.js"** button dabayein — ek naya `products.js` file download hoga
5. Us download hui file ko GitHub repository mein purani `products.js` ki jagah upload kar dein (replace kar dein) — website turant update ho jayegi

**Zaroori baat:** Yeh admin panel real "backend" nahi hai — kyunki poori website static (bina server ke) hai, is se kiye gaye changes sirf tabhi live hote hain jab aap file download karke GitHub par dobara upload karte hain. Password bhi sirf casual protection ke liye hai, real security nahi — kyunki static site ka poora code kisi ke bhi liye dekhna possible hota hai.

### Orders ek jagah dekhne ke baare mein
Abhi order seedha WhatsApp chat mein jata hai — website khud koi order "list" store nahi karti (kyunki koi database nahi hai). Agar aapko chahiye ki har order automatically ek Google Sheet ya kisi list mein bhi save ho jaye (WhatsApp ke sath-sath), to uske liye ek free backend (jaise Google Sheets + Apps Script, ya Firebase) connect karna padega — yeh agla step ho sakta hai, bata dein to main woh bhi bana deta hoon.

## Aage kya badal sakte hain
- `index.html` mein "Basera" naam ko apne shop ke naam se badal dein (do jagah: `<title>` aur `.brand`)
- `style.css` ke sabse upar `:root { }` mein rangon ke hex codes hain — inhe badal kar poora look change kar sakte hain
- Hero section ka text (`index.html` mein `.hero-copy`) apne brand ke hisaab se likh sakte hain
