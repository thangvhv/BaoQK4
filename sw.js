const PRECACHE = 'vcnet-cache-v1';
const RUNTIME = 'vcnet-runtime';

const PRECACHE_URLS = [
  '/?page=Mobile.home',
  '/3rdparty/font-awesome-4.7.0/css/font-awesome.min.css', // Alias for index.html
  '/css/1.521336/20893/2618/mobile.css',
  '/publish/js/lib2-1.521.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.url.startsWith(self.location.origin) && !event.request.url.match(/(\.mp3|\.mp4|\.mpg|\.flv|\?EIO=|\/api\/)/i) && event.request.method == "GET") {
    //console.log(event.request.destination+' '+event.request.url);
    if(event.request.url.match(/\.(jpg|png|gif|ico|bmp|jpeg)/i))
    {
      event.respondWith(
          caches.open(RUNTIME).then(function(cache) {
            return cache.match(event.request).then(function (response) {
              return response || fetch(event.request).then(function(response) {
                cache.put(event.request, response.clone());
                return response;
              });
            });
          })
      );
    }
    else
    {
      event.respondWith(
          fetch(event.request).then(function (response) {
            return caches.open(RUNTIME).then(function (cache) {
              return cache.put(event.request, response.clone()).then(function () {
                return response
              })
            })
          }).catch(function () {
            return caches.match(event.request)
          })
      );
    }
  }
});
