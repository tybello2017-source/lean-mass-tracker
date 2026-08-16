const CACHE='lean-mass-v1-3-corrected-2';
const CORE=["./", "./index.html", "./styles.css", "./app.js", "./seed-data.json", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-180.png", "./assets/meals/oats-banana.jpg", "./assets/meals/pap-yoghurt-eggs.jpg", "./assets/meals/boiled-eggs.jpg", "./assets/meals/grilled-chicken.jpg", "./assets/meals/salmon-sweet-potato.jpg", "./assets/meals/whole-milk.jpg", "./assets/meals/pap-rice-yoghurt-hero.jpg", "./assets/workouts/goblet-squat.jpg", "./assets/workouts/barbell-bench-press.jpg", "./assets/workouts/one-arm-dumbbell-row.jpg", "./assets/workouts/romanian-deadlift.jpg", "./assets/workouts/dumbbell-shoulder-press.jpg", "./assets/workouts/dumbbell-curl.jpg", "./assets/workouts/bulgarian-split-squat.jpg", "./assets/workouts/barbell-bent-over-row.jpg", "./assets/workouts/incline-dumbbell-press.jpg", "./assets/workouts/hip-thrust.jpg", "./assets/workouts/dumbbell-lateral-raise.jpg", "./assets/workouts/overhead-triceps-extension.jpg", "./assets/workouts/reverse-lunge.jpg", "./assets/workouts/curl-triceps.jpg", "./assets/workouts/plank.jpg"];
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
