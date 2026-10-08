import api, { unwrap } from './api';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export async function getExistingSubscription() {
  if (!('serviceWorker' in navigator)) return null;
  const reg = await navigator.serviceWorker.getRegistration('/sw.js');
  if (!reg) return null;
  return reg.pushManager.getSubscription();
}

export async function subscribeToPush() {
  if (!(await isPushSupported())) {
    throw new Error('Web Push is not supported by your current browser.');
  }

  // 1. Request browser notification permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was denied.');
  }

  // 2. Fetch public VAPID key from backend
  const { publicKey } = await unwrap(api.get('/notifications/vapid-key'));
  if (!publicKey) {
    throw new Error('VAPID public key not found on server.');
  }

  // 3. Register service worker
  const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await navigator.serviceWorker.ready;

  // 4. Subscribe to push manager with VAPID key
  const convertedKey = urlBase64ToUint8Array(publicKey);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  });

  // 5. Send subscription to server
  await unwrap(api.post('/notifications/subscribe', { subscription }));

  return subscription;
}

export async function unsubscribeFromPush() {
  if (!('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.getRegistration('/sw.js');
  if (!reg) return;
  const subscription = await reg.pushManager.getSubscription();
  if (subscription) {
    await unwrap(api.post('/notifications/unsubscribe', { endpoint: subscription.endpoint })).catch(() => {});
    await subscription.unsubscribe();
  }
}

export async function sendTestPush() {
  return unwrap(api.post('/notifications/test'));
}

export default {
  isPushSupported,
  getExistingSubscription,
  subscribeToPush,
  unsubscribeFromPush,
  sendTestPush,
};
