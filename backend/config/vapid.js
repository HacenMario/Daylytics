const webpush = require('web-push');

let publicKey = process.env.VAPID_PUBLIC_KEY;
let privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
  console.warn('⚠️ VAPID keys not set in environment, generating temporary keys. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env for persistent push notifications.');
  const keys = webpush.generateVAPIDKeys();
  publicKey = keys.publicKey;
  privateKey = keys.privateKey;
}

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:contact@daylytics.com',
  publicKey,
  privateKey
);

module.exports = webpush;
module.exports.vapidPublicKey = publicKey;
