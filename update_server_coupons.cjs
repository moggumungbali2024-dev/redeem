const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  '      { id: "c1", type: "free", title: { ko: "전체 메뉴 10% 할인", en: "10% off all menu", id: "Diskon 10% semua menu" }, code: "MOGGU-LIMA" }',
  '      { id: "c1", type: "free", title: { ko: "전체 메뉴 10% 할인", en: "10% off all menu", id: "Diskon 10% semua menu" }, code: "MOGGU-LIMA" },\n      { id: "c1-redeem", type: "redeem", cost: 500, title: { ko: "무료 음료 교환권", en: "Free Drink Voucher", id: "Voucher Minuman Gratis" }, code: "LIMA-FREE-DRINK" }'
);
code = code.replace(
  '      { id: "c2", type: "free", title: { ko: "음료 주문 시 쿠키 증정", en: "Free cookie with drink", id: "Kue gratis dengan minuman" }, code: "MOGGU-WORD" }',
  '      { id: "c2", type: "free", title: { ko: "음료 주문 시 쿠키 증정", en: "Free cookie with drink", id: "Kue gratis dengan minuman" }, code: "MOGGU-WORD" },\n      { id: "c2-redeem", type: "redeem", cost: 1200, title: { ko: "무료 디저트 세트", en: "Free Dessert Set", id: "Set Makanan Penutup Gratis" }, code: "WORD-DESSERT" }'
);

fs.writeFileSync('server.ts', code);
