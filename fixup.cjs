const fs = require('fs');
const files = ['src/App.tsx', 'src/components/ListingCard.tsx', 'src/components/BookingModal.tsx', 'src/components/UserProfile.tsx', 'src/components/Reviews.tsx'];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(f, content);
});
