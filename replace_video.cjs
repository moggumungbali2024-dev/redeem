const fs = require('fs');

let content = fs.readFileSync('src/views/UserApp.tsx', 'utf8');

// Replace VIP Ad Image
const oldVipAd = `<img src={ad.adBannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="VIP Ad" />`;
const newVipAd = `{(ad.adBannerUrl || '').endsWith('.mp4') ? (
                    <video src={ad.adBannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-80" autoPlay loop muted playsInline />
                  ) : (
                    <img src={ad.adBannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="VIP Ad" />
                  )}`;

content = content.replace(oldVipAd, newVipAd);

// Replace Event Detail Image
const oldEventImg = `<img src={event.image} className="w-full h-full object-cover" alt="Event Banner" />`;
const newEventImg = `{(event.image || '').endsWith('.mp4') ? (
            <video src={event.image} className="w-full h-full object-cover" autoPlay loop muted playsInline />
          ) : (
            <img src={event.image} className="w-full h-full object-cover" alt="Event Banner" />
          )}`;

content = content.replace(oldEventImg, newEventImg);

fs.writeFileSync('src/views/UserApp.tsx', content);
console.log("Updated video support");
