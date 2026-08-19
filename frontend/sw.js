/**
 * Service Worker for Daylytics
 * عامل الخدمة للتطبيق
 */

const CACHE_NAME = 'daylytics-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/api.js',
    '/js/translations.js',
    '/js/pushManager.js',
    '/manifest.json',
    '/assets/icons/icon-72.png',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching assets...');
                return cache.addAll(ASSETS);
            })
            .then(() => {
                console.log('✅ Assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Cache failed:', error);
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest)
                    .then((response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                try {
                                    cache.put(event.request, responseToCache);
                                } catch (error) {
                                    console.error('❌ Cache put failed:', error);
                                }
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('❌ Fetch failed:', error);
                        // You could return a fallback page here
                    });
            })
    );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
    let data = {};
    
    try {
        data = event.data ? event.data.json() : {};
    } catch (error) {
        console.error('❌ Push data parsing failed:', error);
        data = {
            title: 'Daylytics',
            body: 'تحديث جديد من تطبيق الإنتاجية',
            icon: '/assets/icons/icon-192.png',
            badge: '/assets/icons/badge-72.png'
        };
    }
    
    const options = {
        body: data.body || 'تحديث جديد من Daylytics',
        icon: data.icon || '/assets/icons/icon-192.png',
        badge: data.badge || '/assets/icons/badge-72.png',
        vibrate: [200, 100, 200],
        data: data.data || {},
        actions: [
            { action: 'view', title: '📊 عرض' },
            { action: 'dismiss', title: '❌ تجاهل' }
        ],
        tag: data.tag || 'daylytics-notification',
        requireInteraction: true
    };
    
    event.waitUntil(
        self.registration.showNotification(
            data.title || 'Daylytics',
            options
        )
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then((clientList) => {
                    // Check if there's already a window open
                    for (const client of clientList) {
                        if (client.url && client.url.includes('/')) {
                            return client.focus();
                        }
                    }
                    // If not, open a new window
                    return clients.openWindow('/');
                })
        );
    }
});

// Message event - for communication with the main script
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});