// Pakistan AI - Service Worker for Web Push (VAPID) notifications
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Pakistan AI Alert', body: event.data.text() };
    }
  }

  const title = data.title || 'Pakistan AI Notification';
  const options = {
    body: data.body || 'New contact inquiry or support ticket received.',
    icon: data.icon || '/favicon.ico',
    badge: '/favicon.ico',
    tag: data.data?.ticketId || data.data?.contactId || 'pakistan-ai-alert',
    data: {
      url: data.url || '/admin/tickets',
      ...data.data,
    },
    vibrate: [150, 100, 150, 100, 200],
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/admin/tickets';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
