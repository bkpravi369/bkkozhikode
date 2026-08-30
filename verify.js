const assert = require('assert');

// Mock browser global environment
global.window = {};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

require('./js/store.js');
const store = window.bkStore;

console.log('--- 1. Testing Navigation Tabs Configuration ---');
const tabs = store.getTabs();
console.log('Tabs:', tabs.map(t => `${t.id}: ${t.label}`));
assert(tabs.find(t => t.id === 'about' && t.label === 'About Us'), 'About Us tab must exist');
assert(tabs.find(t => t.id === 'gallery' && t.label === 'Gallery'), 'Gallery tab must exist');
assert(tabs.find(t => t.id === 'murali' && t.label === 'Daily Murali'), 'Daily Murali tab must exist');
assert(tabs.find(t => t.id === 'contact' && t.label === 'Contact Us'), 'Contact Us tab must exist');
assert(tabs.find(t => t.id === 'centers' && t.label === 'Center List'), 'Center List tab must exist');
assert(tabs.find(t => t.id === 'media' && t.type === 'media-dropdown'), 'Media dropdown must exist');
assert(tabs.find(t => t.id === 'events' && t.type === 'events-dropdown'), 'Events dropdown must exist');
console.log('✅ Navigation Tabs passed!');

console.log('\n--- 2. Testing About Us Model & CRUD ---');
const about = store.getAboutData();
assert(about.aboutBk && about.aboutBk.heading, 'About BK must have heading');
assert(about.aboutKozhikode && about.aboutKozhikode.heading, 'About Kozhikode must have heading');
store.updateAboutData({
  aboutBk: { ...about.aboutBk, heading: 'About Brahma Kumaris (Updated)' }
});
assert(store.getAboutData().aboutBk.heading === 'About Brahma Kumaris (Updated)', 'Update About BK failed');
console.log('✅ About Us Model passed!');

console.log('\n--- 3. Testing Daily Murali Model & CRUD ---');
const murali = store.getDailyMurali();
assert(murali.title && murali.essence && murali.blessing, 'Daily Murali must have title, essence, blessing');
store.updateDailyMurali({ title: 'Supreme Light Wisdom' });
assert(store.getDailyMurali().title === 'Supreme Light Wisdom', 'Update Daily Murali failed');
console.log('✅ Daily Murali Model passed!');

console.log('\n--- 4. Testing Center List Model & Click-to-Call Fields ---');
const centers = store.getCenters();
assert(centers.length >= 6, 'Must have at least 6 default centers');
const mainCenter = centers.find(c => c.isPrimary);
assert(mainCenter, 'Must have primary center (Light Palace)');
assert(mainCenter.phone && mainCenter.phone.includes('+91'), 'Main center must have click-to-call mobile phone');
assert(mainCenter.whatsapp, 'Main center must have WhatsApp');

// Test Add Center
store.saveCenter({
  id: 'test_center_kzk',
  name: 'Test Center Nadakkavu',
  area: 'Nadakkavu',
  phone: '+91 9847000000',
  whatsapp: '+91 9847000000',
  published: true
});
assert(store.getCenter('test_center_kzk').name === 'Test Center Nadakkavu', 'Add center failed');

// Test Toggle Publish & Delete
store.togglePublishCenter('test_center_kzk');
assert(store.getCenter('test_center_kzk').published === false, 'Toggle publish center failed');
store.deleteCenter('test_center_kzk');
assert(!store.getCenter('test_center_kzk'), 'Delete center failed');
console.log('✅ Center List Model & CRUD passed!');

console.log('\n--- 5. Testing YouTube 4-Channels Model ---');
const channels = store.getYouTubeChannels();
assert(channels.length === 4, 'Must have 4 channels');
assert(channels.find(c => c.id === 'supreme-light-creations' && c.contentType === 'Podcast'), 'Supreme Light Creations podcast failed');
assert(channels.find(c => c.id === 'bks-calicut' && c.contentType === 'Latest Live'), 'BKs Calicut live failed');
assert(channels.find(c => c.id === 'bk-sheeba' && c.contentType === 'Latest Video'), 'BK Sheeba video failed');
assert(channels.find(c => c.id === 'bk-sheeja' && c.contentType === 'Latest Video'), 'BK Sheeja video failed');
console.log('✅ YouTube 4-Channels Model passed!');

console.log('\n🌟 ALL SYSTEM CHECKS COMPLETED & VERIFIED 100%! 🌟');
