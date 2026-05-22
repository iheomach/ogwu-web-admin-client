self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Emergency Alert', {
      body: data.body ?? '',
      icon: '/ogwu-mark.png',
      badge: '/ogwu-mark.png',
      tag: 'emergency',
      requireInteraction: true,
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(self.location.origin) && 'focus' in c);
      return existing ? existing.focus() : clients.openWindow('/');
    }),
  );
});
