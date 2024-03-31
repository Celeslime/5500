/* 指定要缓存的内容，地址为相对于跟域名的访问路径 */
const cacheName = "5500 Words";
const contentToCache = [
    './',
    './index.html',
    './css/main.css',
    './icon.png',
    './manifest.webmanifest',
    './js/main.js',
    './js/dic.js',
    './js/5500.js',
    './serviceWorker.js',
];
/* 监听安装事件，install 事件一般是被用来设置你的浏览器的离线缓存逻辑 */
self.addEventListener("install", (e) => {
	console.log("Service Worker installed");
    /* 通过这个方法可以防止缓存未完成，就关闭serviceWorker */
	e.waitUntil(
		(async () => {
			const cache = await caches.open(cacheName);
			await cache.addAll(contentToCache).catch(err => console.log(err));
		})()
	);
});
/* 注册fetch事件，拦截全站的请求 */
self.addEventListener("fetch", function (event) {
	event.respondWith(fetch(event.request).then((res) => {
		let response = res.clone();
        caches.open(cacheName).then((cache) => {
          /* 在缓存中匹配对应请求资源直接返回 */
          cache.put(event.request, response);
        });
		return res
	}).catch((err) => {
		return caches.match(event.request)
	})
	);
});