const CACHE='lean-mass-v1-2-1';
const CORE=['./','./index.html','./styles.css','./app.js','./seed-data.json','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-180.png','./demos/barbell-bench-press.svg','./demos/barbell-bent-over-row.svg','./demos/bulgarian-split-squat.svg','./demos/dumbbell-curl.svg','./demos/dumbbell-lateral-raise.svg','./demos/dumbbell-shoulder-press.svg','./demos/goblet-squat.svg','./demos/hip-thrust.svg','./demos/incline-dumbbell-press.svg','./demos/one-arm-dumbbell-row.svg','./demos/overhead-triceps-extension.svg','./demos/plank.svg','./demos/reverse-lunge.svg','./demos/romanian-deadlift.svg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)))});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))]))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 if(url.origin===location.origin && /\.(js|css|json|webmanifest)$/.test(url.pathname)){
   e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));return;
 }
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return resp}).catch(()=>caches.match('./index.html'))));
});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>cs[0]?cs[0].focus():clients.openWindow('./')))});
