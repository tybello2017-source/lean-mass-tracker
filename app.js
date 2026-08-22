const STORE='leanMassTrackerV1';
const VERSION='1.7';
const PHOTO_DB='LeanMassPhotos';
let seed,state,selectedDate=isoToday(),mealMode='recent',currentPhotoBlob=null,calendarAnchor=isoToday(),photoTarget=null,mealPhotoMap={bySlug:{}};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const demoMap={"Alternate dumbbell curl":["alternate-dumbbell-curl.svg","Curl one dumbbell at a time; keep elbow close to your side."],"Hammer curl":["hammer-curl.svg","Use a neutral grip and avoid swinging."],"Concentration curl":["concentration-curl.svg","Brace elbow against inner thigh and curl slowly."],"Dumbbell curl":["dumbbell-curl.svg","Keep elbows near ribs and avoid swinging."],"DB overhead triceps extension":["db-overhead-triceps-extension.svg","Keep upper arms still while extending the elbows."],"Lying dumbbell triceps extension":["lying-dumbbell-triceps-extension.svg","Keep upper arms steady; bend only at the elbows."],"Triceps kickback":["triceps-kickback.svg","Keep upper arm parallel to torso; fully extend elbow."],"Close-grip bench press":["close-grip-bench-press.svg","Use a comfortable close grip; keep elbows controlled."],"Dumbbell shoulder press":["dumbbell-shoulder-press.svg","Brace abdomen and press overhead without excessive back arch."],"Arnold press":["arnold-press.svg","Rotate smoothly through the press; do not force shoulder range."],"Dumbbell lateral raise":["dumbbell-lateral-raise.svg","Use light weight; raise to shoulder height without swinging."],"Dumbbell front raise":["dumbbell-front-raise.svg","Raise under control to about shoulder height."],"Barbell bench press":["barbell-bench-press.svg","Shoulder blades back/down, feet planted; lower under control."],"Incline dumbbell press":["incline-dumbbell-press.svg","Use a modest incline and keep shoulders back."],"Dumbbell bench fly":["dumbbell-bench-fly.svg","Keep a soft elbow bend; stop before shoulder discomfort."],"Incline dumbbell fly":["incline-dumbbell-fly.svg","Use light dumbbells and a modest incline."],"Dumbbell squeeze press":["dumbbell-squeeze-press.svg","Press dumbbells together throughout the movement."],"Dumbbell pullover":["dumbbell-pullover.svg","Keep ribs controlled and use a comfortable shoulder range."],"One-arm dumbbell row":["one-arm-dumbbell-row.svg","Support on bench, pull elbow toward hip, avoid torso twisting."],"Barbell bent-over row":["barbell-bent-over-row.svg","Hold a stable hip hinge and pull toward lower ribs."],"Reverse fly":["reverse-fly.svg","Use light weights and move from the rear shoulders."],"Dumbbell shrug":["dumbbell-shrug.svg","Lift shoulders straight up; pause briefly; do not roll."],"Goblet squat":["goblet-squat.svg","Hold a dumbbell at chest; sit hips down/back; keep heels down."],"Bulgarian split squat":["bulgarian-split-squat.svg","Rear foot on bench, lower with control, drive through front foot."],"Dumbbell reverse lunge":["dumbbell-reverse-lunge.svg","Step back and keep a stable shoulder-width stance."],"Barbell Romanian deadlift":["barbell-romanian-deadlift.svg","Soft knees, push hips back, keep bar close and spine neutral."],"Barbell/dumbbell hip thrust":["barbell-dumbbell-hip-thrust.svg","Upper back on bench; squeeze glutes at top without overextending."],"Standing calf raise":["standing-calf-raise.svg","Use full comfortable range and pause at the top."],"Plank":["plank.svg","Elbows under shoulders; squeeze abs/glutes and keep hips level."],"Lying leg raise":["lying-leg-raise.svg","Keep lower back controlled; lower legs slowly."],"Crunch":["crunch.svg","Lift shoulder blades with your abs; avoid pulling the neck."],"Mountain climber":["mountain-climber.svg","Keep shoulders over hands and hips steady."],"Bicycle crunch":["bicycle-crunch.svg","Rotate through the torso slowly; do not pull the neck."]};
const exerciseGifMap={"Barbell bench press":"gifs/barbell-bench-press.gif","Barbell bent-over row":"gifs/barbell-bent-over-row.gif","Barbell/dumbbell hip thrust":"gifs/barbell-hip-thrusts.gif","Barbell Romanian deadlift":"gifs/barbell-romanian-deadlift.gif","Dumbbell lateral raise":"gifs/dumbbell-lateral-raise.gif","Dumbbell reverse lunge":"gifs/dumbbell-reverse-lunge.gif","Dumbbell shoulder press":"gifs/dumbbell-shoulder-press.gif","Goblet squat":"gifs/goblet-squat.gif","Hammer curl":"gifs/hammer-curl.gif","Incline dumbbell press":"gifs/incline-dumbbell-press.gif","Lying leg raise":"gifs/lying-leg-raise.gif","One-arm dumbbell row":"gifs/one-arm-dumbbell-row.gif","Lying dumbbell triceps extension":"gifs/alternating-lying-dumbbell-triceps-extension.gif","Pull-up":"gifs/pull-up.gif","Close-grip chin-up":"gifs/close-grip-chin-up.gif"};
const exerciseImageMap={
 'Goblet squat':'goblet-squat.jpg',
 'Barbell bench press':'barbell-bench-press.jpg',
 'One-arm dumbbell row':'one-arm-dumbbell-row.jpg',
 'Barbell Romanian deadlift':'romanian-deadlift.jpg',
 'Dumbbell shoulder press':'dumbbell-shoulder-press.jpg',
 'Dumbbell curl':'dumbbell-curl.jpg',
 'Bulgarian split squat':'bulgarian-split-squat.jpg',
 'Barbell bent-over row':'barbell-bent-over-row.jpg',
 'Incline dumbbell press':'incline-dumbbell-press.jpg',
 'Barbell/dumbbell hip thrust':'hip-thrust.jpg',
 'Dumbbell lateral raise':'dumbbell-lateral-raise.jpg',
 'DB overhead triceps extension':'overhead-triceps-extension.jpg',
 'Dumbbell reverse lunge':'reverse-lunge.jpg',
 'DB curl + triceps extension':'curl-triceps.jpg',
 'Plank':'plank.jpg'
};
function mealImage(name=''){
 const sl=(name||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const map=mealPhotoMap?.bySlug||{};if(map[sl])return map[sl];
 const stop=new Set(['g','ml','with','and','the','portion','plus']);
 const toks=x=>new Set(x.split('-').filter(t=>t&&!stop.has(t)&&!/^[0-9]+$/.test(t)));
 const a=toks(sl);let best=null,score=0;
 for(const [k,p] of Object.entries(map)){const b=toks(k);let n=0;a.forEach(x=>{if(b.has(x))n++});const u=new Set([...a,...b]).size||1,sc=n>=2?n/u:0;if(sc>score){score=sc;best=p}}
 return score>=.42?best:null;
}
function mealEmoji(name=''){
 const n=name.toLowerCase();
 if(/egg/.test(n))return'🥚'; if(/milk|yoghurt|yogurt/.test(n))return'🥛'; if(/fish|tilapia|catfish|salmon/.test(n))return'🐟';
 if(/chicken/.test(n))return'🍗'; if(/rice/.test(n))return'🍚'; if(/yam|potato|plantain/.test(n))return'🍠'; if(/beans|moi moi|akara/.test(n))return'🫘';
 if(/oat|pap|ogi/.test(n))return'🥣'; if(/pasta|spaghetti/.test(n))return'🍝'; return'🍽️';
}
function mealCategory(name=''){
 const n=name.toLowerCase();
 if(/serious mass|shake/.test(n))return'shake';
 if(/fish|tilapia|catfish|salmon/.test(n))return'fish';
 if(/chicken|beef|goat|cowtail|meat|suya/.test(n))return'protein';
 if(/rice|jollof|basmati/.test(n))return'rice';
 if(/yam|potato|plantain|fries/.test(n))return'starch';
 if(/beans|moi moi|akara/.test(n))return'beans';
 if(/swallow|pounded|semo|corn|millet/.test(n))return'swallow';
 if(/oat|pap|ogi|bread|egg|milk|yoghurt|yogurt/.test(n))return'breakfast';
 if(/soup|stew|okro|egusi|bitterleaf|vegetable/.test(n))return'soup';
 if(/chips|snack|banana|peanut/.test(n))return'snack';
 return'mixed';
}
function mealVisual(m, cls='meal-thumb'){
 const pid=m?.photoId||state?.mealPhotoOverrides?.[m?.name||''];
 if(pid)return `<img class="${cls} photo-ref" data-photo="${esc(pid)}" alt="${esc(m.name)}">`;
 const src=mealImage(m?.name||'');if(src)return `<img class="${cls}" src="${src}" alt="${esc(m?.name||'Meal')}" loading="lazy">`;
 return `<div class="${cls} food-placeholder cat-${mealCategory(m?.name||'')}"><span class="food-emoji">${mealEmoji(m?.name||'')}</span><span class="placeholder-spark">✦</span></div>`;
}
const verifiedExercisePhotos={};
function exerciseVisual(name, cls='exercise-photo'){
 const gif=exerciseGifMap[name];
 if(gif)return `<div class="${cls} exercise-v17-media"><img src="demos/${gif}" alt="${esc(name)} animated exercise demo" loading="lazy"></div>`;
 const d=demoMap[name]?.[0];
 return `<div class="${cls} exercise-v17-media">${d?`<img src="demos/${d}" alt="${esc(name)} exercise guide" loading="lazy">`:''}</div>`;
}
function isoToday(){const d=new Date();return iso(d)}
function iso(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function dateObj(s){return new Date(s+'T12:00:00')}
function fmtDate(s,opts={weekday:'short',day:'numeric',month:'short'}){return dateObj(s).toLocaleDateString(undefined,opts)}
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function numOrNull(x){return x===''||x==null?null:+x}
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2200)}
function targetForDate(date){const start=dateObj(state.startDate),d=dateObj(date),week=Math.max(1,Math.min(12,Math.floor((d-start)/604800000)+1));return{week,kcal:week<=2?2500:week<=4?2600:week<=8?2650:2700,protein:+state.settings.proteinTarget||105}}
function blankLog(){return{meals:[],weight:null,waist:null,chest:null,arm:null,thigh:null,sleep:null,energy:'',training:'No',workout:'Rest',workoutLog:{}}}
function logFor(date){if(!state.logs[date])state.logs[date]=blankLog();const l=state.logs[date];for(const [k,v] of Object.entries(blankLog()))if(l[k]===undefined)l[k]=v;return l}
function totals(log){return(log.meals||[]).reduce((a,m)=>({kcal:a.kcal+(+m.kcal||0),protein:a.protein+(+m.protein||0)}),{kcal:0,protein:0})}

function exerciseCategory(name=''){
 const found=(state?.exerciseLibrary||seed?.exerciseLibrary||[]).find(x=>x.exercise===name);
 if(found?.category)return found.category;
 const n=name.toLowerCase();
 if(/bench press|incline.*press|fly|squeeze press|pullover/.test(n))return'Chest';
 if(/row|pull-up|chin-up|reverse fly|shrug/.test(n))return'Back';
 if(/shoulder|lateral raise|front raise|arnold/.test(n))return'Shoulders';
 if(/curl/.test(n))return'Biceps';
 if(/triceps|close-grip bench/.test(n))return'Triceps';
 if(/squat|lunge|deadlift|hip thrust|calf/.test(n))return'Legs';
 if(/plank|leg raise|crunch|mountain|bicycle/.test(n))return'Abs/Core';
 return'Other';
}
function exerciseNameForLog(key,v){
 if(v?.exerciseName)return v.exerciseName;
 const m=key.match(/^([ABC])-(\\d+)$/);return m?state.workouts?.[m[1]]?.[+m[2]]?.exercise||'Exercise':'Exercise';
}
function workoutStats(daysBack=7){
 const end=dateObj(selectedDate),start=new Date(end.getTime()-(daysBack-1)*86400000);
 const groups={'Biceps':{sets:0,volume:0},'Triceps':{sets:0,volume:0},'Shoulders':{sets:0,volume:0},'Chest':{sets:0,volume:0},'Back':{sets:0,volume:0},'Legs':{sets:0,volume:0},'Abs/Core':{sets:0,volume:0}};
 for(const [d,l] of Object.entries(state.logs||{})){
   const dt=dateObj(d);if(dt<start||dt>end)continue;
   for(const [key,v] of Object.entries(l.workoutLog||{})){
     const name=exerciseNameForLog(key,v),cat=v.category||exerciseCategory(name);if(!groups[cat])continue;
     for(const st of (v.sets||[])){if(st.done){groups[cat].sets++;groups[cat].volume+=(+st.load||0)*(+st.reps||0)}}
   }
 }
 const totalSets=Object.values(groups).reduce((a,x)=>a+x.sets,0),totalVolume=Object.values(groups).reduce((a,x)=>a+x.volume,0);
 return{groups,totalSets,totalVolume};
}
function weeklyNutritionAverages(){
 const base=dateObj(state.startDate),weeks=[];
 for(let w=0;w<12;w++){
   let kcal=0,protein=0,n=0;
   for(let i=0;i<7;i++){const d=iso(new Date(base.getTime()+(w*7+i)*86400000)),l=state.logs[d];if(l?.meals?.length){const t=totals(l);kcal+=t.kcal;protein+=t.protein;n++}}
   weeks.push({week:w+1,kcal:n?kcal/n:null,protein:n?protein/n:null,days:n,target:targetForDate(iso(new Date(base.getTime()+w*7*86400000))).kcal});
 }
 return weeks;
}

function pct(v,t){return Math.max(0,Math.min(100,Math.round((v/t)*100)||0))}
function allMeals(){return[...(state.meals||[]),...(state.customMeals||[])]}
function latestValue(field){const es=Object.entries(state.logs).filter(([,x])=>x[field]!=null).sort(([a],[b])=>b.localeCompare(a));return es.length?+es[0][1][field]:null}
function migrate(){
 const prior=state.version||'1.0';
 state.customMeals=state.customMeals||[];state.mealPhotoOverrides=state.mealPhotoOverrides||{};state.favorites=state.favorites||[];state.recentMeals=state.recentMeals||[];state.reminders=state.reminders||defaultReminders();state.reminderFired=state.reminderFired||{};state.settings=state.settings||{...seed.setup};
 // Preserve exercise identity in old indexed workout logs before changing the programme.
 Object.entries(state.logs||{}).forEach(([d,l])=>{
   l.workoutLog=l.workoutLog||{};
   Object.entries(l.workoutLog).forEach(([key,v])=>{
     if(!v)return;
     if(!v.exerciseName){
       const mm=key.match(/^([ABC])-(\d+)$/);
       if(mm){const old=state.workouts?.[mm[1]]?.[+mm[2]];if(old?.exercise)v.exerciseName=old.exercise}
     }
     if(v.exerciseName&&!v.category)v.category=exerciseCategory(v.exerciseName);
   });
 });
 state.exerciseLibrary=seed.exerciseLibrary||[];
 if(prior!=='1.7'){
   const added={};
   for(const k of ['A','B','C']) added[k]=(state.workouts?.[k]||[]).filter(x=>x.userAdded);
   state.workouts=JSON.parse(JSON.stringify(seed.workouts));
   for(const k of ['A','B','C']) for(const x of added[k])if(!state.workouts[k].some(y=>y.exercise===x.exercise))state.workouts[k].push(x);
 }
 state.version=VERSION;
 Object.values(state.logs||{}).forEach(l=>{
   for(const[k,v]of Object.entries(blankLog()))if(l[k]===undefined)l[k]=v;
   l.workoutLog=l.workoutLog||{};
   Object.values(l.workoutLog).forEach(v=>{if(v&&!v.sets&&(v.load!=null||v.reps!=null))v.sets=[{load:v.load??null,reps:v.reps??null,rir:null,done:true}]});
 });
 save();
}
function defaultReminders(){return{breakfast:{label:'Breakfast',enabled:false,time:'08:00'},lunch:{label:'Lunch',enabled:false,time:'13:00'},mass:{label:'Serious Mass',enabled:false,time:'16:00'},dinner:{label:'Dinner',enabled:false,time:'20:00'},workout:{label:'Workout',enabled:false,time:'18:30'},weigh:{label:'Weekly weigh-in',enabled:false,time:'08:00'}}}
async function boot(){
 seed=await fetch('seed-data.json',{cache:'no-store'}).then(r=>r.json());
mealPhotoMap=await fetch('assets/meal-photo-map-v15.json',{cache:'no-store'}).then(r=>r.json()).catch(()=>({bySlug:{}}));setupPhotoChooser();const stored=localStorage.getItem(STORE);
 if(stored){state=JSON.parse(stored);migrate()}else{state={version:VERSION,startDate:'2026-08-14',settings:{...seed.setup},meals:seed.meals,workouts:JSON.parse(JSON.stringify(seed.workouts)),exerciseLibrary:seed.exerciseLibrary||[],logs:{},customMeals:[],favorites:[],recentMeals:[],reminders:defaultReminders(),reminderFired:{}};for(const[date,x]of Object.entries(seed.historical))state.logs[date]={...blankLog(),...x,workoutLog:{}};save()}
 setupNav();setupMealDialog();setupReminders();renderAll();checkReminders();setInterval(checkReminders,60000);
 if('serviceWorker'in navigator){navigator.serviceWorker.register('./sw.js').then(reg=>{reg.update();if(reg.waiting)showUpdateBanner(reg)}).catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!sessionStorage.getItem('reloaded12')){sessionStorage.setItem('reloaded12','1');location.reload()}})}
}
function showUpdateBanner(reg){const host=$('.view.active');if(!host)return;host.insertAdjacentHTML('afterbegin',`<div class="update-banner">A new app version is ready. <button class="small-btn" id="applyUpdate">Refresh now</button></div>`);$('#applyUpdate').onclick=()=>reg.waiting.postMessage({type:'SKIP_WAITING'})}
function setupNav(){ $$('.bottom-nav button').forEach(b=>b.onclick=()=>showView(b.dataset.view));$('#todayBtn').onclick=()=>{selectedDate=isoToday();calendarAnchor=selectedDate;showView('today')};$('#bellBtn').onclick=()=>openReminderDialog() }
function showView(name){$$('.view').forEach(v=>v.classList.remove('active'));$(`#view-${name}`).classList.add('active');$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===name));renderAll()}
function renderAll(){renderToday();renderMeals();renderWorkouts();renderProgress();renderSettings();hydratePhotos()}
function workoutSuggestion(date){const d=dateObj(date).getDay();return({1:'Workout A · preferred',3:'Workout B · preferred',6:'Workout C · preferred',5:'Make-up option · A or C',0:'Make-up option · B or C'}[d]||'Recovery / rest day')}
function statusForDay(date){
 const l=state.logs[date]; if(!l)return{meal:false,workout:false,checkin:false};
 return{
   meal:!!(l.meals?.length),
   workout:l.training==='Yes',
   checkin:[l.weight,l.waist,l.chest,l.arm,l.thigh,l.sleep].some(v=>v!=null)||!!l.energy
 };
}
function weekDates(anchor){const d=dateObj(anchor),dow=(d.getDay()+6)%7,m=new Date(d);m.setDate(d.getDate()-dow);return Array.from({length:7},(_,i)=>{const x=new Date(m);x.setDate(m.getDate()+i);return iso(x)})}
function shiftWeek(n){const d=dateObj(calendarAnchor);d.setDate(d.getDate()+7*n);calendarAnchor=iso(d);renderToday();hydratePhotos()}
function renderWeekCalendar(){
 const days=weekDates(calendarAnchor);
 return`<div class="card"><div class="calendar-head"><button class="ghost" onclick="shiftWeek(-1)">‹</button><div><div class="muted">Weekly calendar</div><div class="month-title">${fmtDate(days[0],{month:'long',year:'numeric'})}</div></div><button class="ghost" onclick="shiftWeek(1)">›</button></div>
 <div class="week-grid">${days.map(d=>{const st=statusForDay(d);return`<button class="day-cell ${d===selectedDate?'selected':''}" onclick="selectedDate='${d}';calendarAnchor='${d}';renderAll()"><small>${fmtDate(d,{weekday:'short'})}</small><strong>${dateObj(d).getDate()}</strong><div class="dots">${st.meal?'<span class="day-dot meal"></span>':''}${st.workout?'<span class="day-dot workout"></span>':''}${st.checkin?'<span class="day-dot checkin"></span>':''}</div></button>`}).join('')}</div>
 <div class="calendar-legend"><span><i class="day-dot meal"></i> Meals</span><span><i class="day-dot workout"></i> Workout</span><span><i class="day-dot checkin"></i> Check-in</span></div>${weeklySummary(days)}</div>`
}
function weeklySummary(days){
 let kcal=0,prot=0,mealDays=0,w=0,checkins=0;
 days.forEach(d=>{const l=state.logs[d];if(!l)return;const t=totals(l);if(l.meals?.length){kcal+=t.kcal;prot+=t.protein;mealDays++}if(l.training==='Yes')w++;if(statusForDay(d).checkin)checkins++});
 return`<div class="weekly-summary four"><div><span class="muted">Avg kcal</span><b>${mealDays?Math.round(kcal/mealDays):'—'}</b><small>${mealDays} logged day${mealDays===1?'':'s'}</small></div><div><span class="muted">Avg protein</span><b>${mealDays?Math.round(prot/mealDays)+' g':'—'}</b><small>${mealDays} logged day${mealDays===1?'':'s'}</small></div><div><span class="muted">Workouts</span><b>${w}/3</b><small>completed</small></div><div><span class="muted">Check-ins</span><b>${checkins}</b><small>this week</small></div></div>`
}
function renderToday(){
 const log=logFor(selectedDate),t=targetForDate(selectedDate),sum=totals(log),weight=latestValue('weight'),gain=weight==null?0:weight-state.settings.startWeight,status=sum.kcal>=t.kcal*.9&&sum.protein>=t.protein?'On track':sum.kcal>t.kcal*1.15?'Above target':'Building';
 const mealHtml=log.meals.length?log.meals.map((m,i)=>`<div class="meal-row row between"><div class="meal-main">${m.photoId?`<button class="photo-button" onclick="openMealPhoto('${selectedDate}',${i})">${mealVisual(m,'meal-thumb')}</button>`:mealVisual(m,'meal-thumb')}<div><span class="pill">${esc(m.slot)}</span><strong>${esc(m.name)}</strong><span class="muted">${Math.round(m.kcal)} kcal · ${(+m.protein).toFixed((+m.protein)%1?1:0)} g protein ${m.photoId?'· 📷':''}</span>${m.notes?`<div class="tiny muted">${esc(m.notes)}</div>`:''}</div></div><button class="ghost tiny" onclick="deleteMeal('${selectedDate}',${i})">Delete</button></div>`).join(''):`<div class="empty">No meals logged yet.</div>`;
 $('#view-today').innerHTML=`${renderWeekCalendar()}<div class="card hero"><div class="row between"><div><div class="eyebrow">WEEK ${t.week} · ${fmtDate(selectedDate)}</div><h2>${status}</h2><div class="muted">Goal: ${state.settings.startWeight} → ${state.settings.goalWeight} kg</div></div><div class="right"><div class="big">${weight==null?'—':weight.toFixed(1)} kg</div><div class="muted">${weight==null?'No weigh-in yet':`${gain>=0?'+':''}${gain.toFixed(1)} kg from start`}</div></div></div></div>
 <div class="kpis"><div class="kpi"><span class="muted">Calories</span><div class="big">${Math.round(sum.kcal)}</div><div class="muted">of ${t.kcal} kcal</div><div class="progress"><i style="width:${pct(sum.kcal,t.kcal)}%"></i></div></div><div class="kpi"><span class="muted">Protein</span><div class="big">${Math.round(sum.protein)}g</div><div class="muted">of ${t.protein} g</div><div class="progress"><i style="width:${pct(sum.protein,t.protein)}%"></i></div></div></div>
 <div class="card"><div class="section-title"><div><span class="muted">Selected day</span><h2>${fmtDate(selectedDate)}</h2></div><input id="datePick" type="date" value="${selectedDate}" style="width:auto;margin:0"></div><div class="quick-grid"><button class="quick quick-breakfast" onclick="openMeal('Breakfast')"><strong>☀︎ Breakfast</strong><span class="muted">Log meal</span></button><button class="quick quick-snack" onclick="openMeal('Snack 1')"><strong>◉ Snack</strong><span class="muted">Log snack</span></button><button class="quick quick-lunch" onclick="openMeal('Lunch')"><strong>♨ Lunch</strong><span class="muted">Log meal</span></button><button class="quick quick-dinner" onclick="openMeal('Dinner')"><strong>◒ Dinner</strong><span class="muted">Log meal</span></button><button class="quick quick-mass" onclick="quickMass()"><strong>＋ Serious Mass</strong><span class="muted">631 kcal · 25g</span></button></div></div>
 <div class="card"><div class="row between"><h3>Meals</h3><button class="ghost" onclick="openMeal('Other')">+ Add</button></div>${mealHtml}<div class="metricline"><span>Total</span><b>${Math.round(sum.kcal)} kcal · ${Math.round(sum.protein)} g</b></div></div>
 <div class="card"><h3>Daily check-in</h3><div class="two-col"><label>Weight (kg)<input id="todayWeight" type="number" step="0.1" value="${log.weight??''}"></label><label>Sleep (hours)<input id="todaySleep" type="number" step="0.1" value="${log.sleep??''}"></label><label>Waist (cm)<input id="todayWaist" type="number" step="0.1" value="${log.waist??''}"></label><label>Chest (cm)<input id="todayChest" type="number" step="0.1" value="${log.chest??''}"></label><label>Upper arm (cm)<input id="todayArm" type="number" step="0.1" value="${log.arm??''}"></label><label>Thigh (cm)<input id="todayThigh" type="number" step="0.1" value="${log.thigh??''}"></label><label>Energy<select id="todayEnergy"><option></option>${['Low','Moderate','Good','High'].map(x=>`<option ${log.energy===x?'selected':''}>${x}</option>`).join('')}</select></label></div><button class="primary" onclick="saveCheckin()">Save check-in</button></div>
 <div class="card"><span class="muted">Workout</span><h3>${workoutSuggestion(selectedDate)}</h3><p class="muted">Target remains 3 resistance sessions/week. Friday evening and Sunday are make-up alternatives, not extra compulsory lifting days.</p><button class="primary" onclick="showView('workouts')">Open workout</button></div>`;
 $('#datePick').onchange=e=>{selectedDate=e.target.value;calendarAnchor=selectedDate;renderAll()};
}
function saveCheckin(){const l=logFor(selectedDate);l.weight=numOrNull($('#todayWeight').value);l.sleep=numOrNull($('#todaySleep').value);l.waist=numOrNull($('#todayWaist').value);l.chest=numOrNull($('#todayChest').value);l.arm=numOrNull($('#todayArm').value);l.thigh=numOrNull($('#todayThigh').value);l.energy=$('#todayEnergy').value;save();renderAll();toast('Check-in saved')}
function quickMass(){logFor(selectedDate).meals.push({slot:'Snack 2',name:'Serious Mass - 1 scoop',kcal:631,protein:25,notes:'168 g'});rememberMeal('Serious Mass - 1 scoop');save();renderAll();toast('Serious Mass added')}

function setupMealDialog(){
 $('#mealSearch').oninput=()=>populateMealSelect($('#mealSearch').value);$('#mealSelect').onchange=syncMealFields;$('#mealPortion').onchange=syncMealFields;$('#saveMeal').onclick=saveMealEntry;$('#favMealBtn').onclick=toggleCurrentFavorite;$('#seriousMassBtn').onclick=()=>{$('#mealSearch').value='Serious Mass - 1 scoop';populateMealSelect('Serious Mass - 1 scoop')};$$('#mealMode button').forEach(b=>b.onclick=()=>{mealMode=b.dataset.mode;$$('#mealMode button').forEach(x=>x.classList.toggle('active',x===b));populateMealSelect($('#mealSearch').value)})
}
function filteredMeals(q=''){let list=allMeals(),q2=q.toLowerCase();if(q2)list=list.filter(m=>m.name.toLowerCase().includes(q2));if(mealMode==='favorites')list=list.filter(m=>state.favorites.includes(m.name));if(mealMode==='recent'&&!q2){const by=new Map(allMeals().map(m=>[m.name,m]));list=state.recentMeals.map(n=>by.get(n)).filter(Boolean);if(!list.length)list=allMeals().slice(0,20)}return list.slice(0,120)}
function openMeal(slot='Other'){currentPhotoBlob=null;$('#mealSlot').value=slot;$('#mealSearch').value='';$('#mealPortion').value='1';$('#mealNotes').value='';populateMealSelect('');$('#mealDialog').showModal()}
function populateMealSelect(q=''){const list=filteredMeals(q);$('#mealSelect').innerHTML=list.map(m=>`<option value="${esc(m.name)}">${esc(m.name)} · ${Math.round(m.kcal)} kcal / ${m.protein}g</option>`).join('')+`<option value="__manual__">Other / manual entry</option>`;syncMealFields()}
function syncMealFields(){const v=$('#mealSelect').value,m=allMeals().find(x=>x.name===v),portion=+$('#mealPortion').value||1;if(m){$('#mealKcal').value=Math.round(m.kcal*portion);$('#mealProtein').value=Math.round(m.protein*portion*10)/10;$('#mealNotes').placeholder=m.notes||'optional'}else{$('#mealKcal').value='';$('#mealProtein').value='';$('#mealNotes').placeholder='Describe the meal'}$('#favMealBtn').textContent=state.favorites.includes(v)?'★ Favourite':'☆ Favourite'}
function toggleCurrentFavorite(){const n=$('#mealSelect').value;if(!n||n==='__manual__')return;const i=state.favorites.indexOf(n);if(i>=0)state.favorites.splice(i,1);else state.favorites.unshift(n);save();syncMealFields();toast(i>=0?'Removed from favourites':'Added to favourites')}
function rememberMeal(name){state.recentMeals=[name,...state.recentMeals.filter(x=>x!==name)].slice(0,15)}
async function previewPhoto(e){const f=e.target.files?.[0];if(!f)return;currentPhotoBlob=await compressImage(f);const u=URL.createObjectURL(currentPhotoBlob);const p=$('#photoPreview');p.style.backgroundImage=`url(${u})`;p.classList.remove('hidden')}
async function saveMealEntry(){
 const sel=$('#mealSelect').value, chosen=allMeals().find(x=>x.name===sel), name=sel==='__manual__'?($('#mealNotes').value.trim()||'Custom / manual meal'):sel,kcal=+$(`#mealKcal`).value||0,protein=+$(`#mealProtein`).value||0;
 const photoId=chosen?.photoId||state.mealPhotoOverrides?.[name]||null;
 logFor(selectedDate).meals.push({slot:$('#mealSlot').value,name,kcal,protein,notes:$('#mealNotes').value,photoId});
 rememberMeal(name);save();$('#mealDialog').close();renderAll();toast('Meal added')
}
async function deleteMeal(date,i){const l=logFor(date),m=l.meals[i];const shared=!!state.customMeals?.some(c=>c.photoId&&c.photoId===m?.photoId)||Object.values(state.mealPhotoOverrides||{}).includes(m?.photoId);if(m?.photoId&&!shared)await deletePhoto(m.photoId);l.meals.splice(i,1);save();renderAll()}

function renderMeals(){
 $('#view-meals').innerHTML=`<div class="section-title"><div><span class="muted">Photo-rich food library · V1.5</span><h2>Meals</h2></div><span class="pill blue">${allMeals().length} foods</span></div>
 <div class="card"><div class="segmented"><button class="active" onclick="mealLibraryMode('all',this)">All</button><button onclick="mealLibraryMode('favorites',this)">Favourites</button><button onclick="mealLibraryMode('recent',this)">Recent</button></div>
 <label>Search<input id="dbSearch" type="search" placeholder="Rice, yam, yoghurt, Serious Mass…"></label><div id="dbList" class="food-grid"></div></div>
 <div class="card custom-meal-card"><div class="row between"><div><span class="muted">Your meals only</span><h3>Create custom meal</h3></div><span class="pill">📷 photo</span></div>
 <p class="muted">You can now add or replace the photo for any meal. Where an exact built-in photo is not available, V1.3 leaves a clean photo placeholder instead of showing a misleading image.</p>
 <label>Meal photo<div class="photo-picker custom-photo photo-launch" onclick="openPhotoChooser('__custom__')"><span class="photo-picker-icon">📷</span><span><b>Add meal photo</b><small>Camera or Photo Library</small></span></div></label>
 <div id="customPhotoPreview" class="photo-preview hidden"></div>
 <div class="two-col"><label>Name<input id="customName"></label><label>Calories<input id="customKcal" type="number"></label><label>Protein (g)<input id="customProtein" type="number" step="0.5"></label><label>Notes<input id="customNotes"></label></div><button class="primary" onclick="addCustomMeal()">Save custom meal</button></div>`;
 state.libraryMode=state.libraryMode||'all';
 const renderList=()=>{const q=$('#dbSearch').value.toLowerCase();let items=allMeals().filter(m=>m.name.toLowerCase().includes(q));if(state.libraryMode==='favorites')items=items.filter(m=>state.favorites.includes(m.name));if(state.libraryMode==='recent'){const mp=new Map(items.map(m=>[m.name,m]));items=state.recentMeals.map(n=>mp.get(n)).filter(Boolean)}
 $('#dbList').innerHTML=items.slice(0,89).map(m=>`<article class="food-card cat-card-${mealCategory(m.name)}"><div class="food-media">${mealVisual(m,'food-img')}<span class="category-badge">${mealCategory(m.name)}</span><button class="food-star ${state.favorites.includes(m.name)?'favourite':''}" onclick="toggleFavoriteName('${encodeURIComponent(m.name)}')">${state.favorites.includes(m.name)?'★':'☆'}</button></div><div class="food-info"><strong>${esc(m.name)}</strong><span>${Math.round(m.kcal)} kcal · ${m.protein} g protein</span><button class="photo-link" onclick="openPhotoChooser('${encodeURIComponent(m.name)}')">${state.mealPhotoOverrides?.[m.name]?'Replace photo':'Add photo from camera or gallery'}</button></div></article>`).join('')||'<div class="empty">No match</div>';hydratePhotos()};
 state.renderDbList=renderList;$('#dbSearch').oninput=renderList;renderList();
}
function mealLibraryMode(m,b){state.libraryMode=m;save();b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));state.renderDbList?.()}
function toggleFavoriteName(encoded){const n=decodeURIComponent(encoded),i=state.favorites.indexOf(n);if(i>=0)state.favorites.splice(i,1);else state.favorites.unshift(n);save();renderMeals()}
function setupPhotoChooser(){
 const cam=$('#photoCameraInput'),gal=$('#photoGalleryInput');
 if(cam)cam.onchange=e=>handleChosenPhoto(e.target);
 if(gal)gal.onchange=e=>handleChosenPhoto(e.target);
}
function openPhotoChooser(encoded){
 photoTarget=encoded==='__custom__'?{type:'custom'}:{type:'meal',name:decodeURIComponent(encoded)};
 const cam=$('#photoCameraInput'),gal=$('#photoGalleryInput');
 if(cam)cam.value='';if(gal)gal.value='';
 $('#photoSourceDialog')?.showModal();
}
function closePhotoChooser(){photoTarget=null;$('#photoSourceDialog')?.close()}
async function handleChosenPhoto(input){
 const f=input?.files?.[0];if(!f||!photoTarget)return;
 const target={...photoTarget};$('#photoSourceDialog')?.close();photoTarget=null;
 const blob=await compressImage(f);
 if(target.type==='custom'){
   currentPhotoBlob=blob;
   const u=URL.createObjectURL(blob),p=$('#customPhotoPreview');
   if(p){p.style.backgroundImage=`url(${u})`;p.classList.remove('hidden')}
   toast('Photo selected');
   return;
 }
 await saveMealPhoto(target.name,blob);
}
async function saveMealPhoto(name,blob){
 const old=state.mealPhotoOverrides?.[name],id=crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random();
 await putPhoto(id,blob);state.mealPhotoOverrides=state.mealPhotoOverrides||{};state.mealPhotoOverrides[name]=id;
 if(old && old!==id && !Object.values(state.mealPhotoOverrides).filter(x=>x===old).length)await deletePhoto(old);
 save();renderAll();toast('Meal photo updated');
}
async function addCustomMeal(){
 const name=$('#customName').value.trim();if(!name)return;
 let photoId=null;if(currentPhotoBlob){photoId=crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random();await putPhoto(photoId,currentPhotoBlob)}
 state.customMeals.push({name,kcal:+$('#customKcal').value||0,protein:+$('#customProtein').value||0,notes:$('#customNotes').value||'Custom',photoId});currentPhotoBlob=null;save();renderMeals();toast('Custom meal saved')
}

function previousExerciseSets(k,i,date){
 const dates=Object.keys(state.logs).filter(d=>d<date).sort().reverse();
 for(const d of dates){const v=state.logs[d]?.workoutLog?.[`${k}-${i}`];if(v?.sets?.some(x=>x.done||x.load!=null||x.reps!=null))return{date:d,sets:v.sets};}
 return null;
}
function repRangeTop(repText){const m=String(repText).match(/(\d+)\D*$/);return m?+m[1]:null}
function progressionHint(k,x,i,date){
 const prev=previousExerciseSets(k,i,date);if(!prev)return'First logged session — choose a manageable load and leave 1–3 reps in reserve.';
 const done=prev.sets.filter(s=>s.done),top=repRangeTop(x.reps);
 if(done.length && top && done.every(s=>(+s.reps||0)>=top && (+s.rir||0)>=1))return'Previous session reached the top of the rep range. Consider a small load increase today.';
 return`Previous: ${fmtDate(prev.date)} · ${done.length||prev.sets.length} sets logged. Aim to add a rep, improve control, or repeat with better form.`;
}
function renderWorkouts(){
 const buttons=['A','B','C'].map(k=>`<button class="chip ${(state.uiWorkout||'A')===k?'active':''}" onclick="state.uiWorkout='${k}';renderWorkouts()">Workout ${k}</button>`).join(''),k=state.uiWorkout||'A',flex=seed.flex[k],ex=state.workouts[k],log=logFor(selectedDate);
 $('#view-workouts').innerHTML=`<div class="section-title"><div><span class="muted">GIF-guided home programme · V1.7</span><h2>Workout ${k}</h2></div><span class="pill">${log.training==='Yes'&&log.workout===k?'Completed':'3 / week'}</span></div>
 <div class="notice success"><b>Flexible:</b> preferred ${flex.preferred}; alternative ${flex.alternative}. Friday/Sunday remain make-up slots, not extra compulsory sessions.</div>
 <div class="tabbar">${buttons}</div>
 <div class="workout-library-strip"><div><b>Exercise Library</b><span>${(state.exerciseLibrary||[]).length} home-friendly exercises</span></div><button class="primary compact" onclick="openExerciseLibrary('${k}')">＋ Add exercise</button></div>
 <div class="muscle-chips">${['Chest','Back','Shoulders','Biceps','Triceps','Legs','Abs/Core'].map(c=>`<span>${c}</span>`).join('')}</div>
 <div class="card"><div class="row between"><div><span class="muted">${fmtDate(selectedDate)}</span><h3>Workout ${k}</h3></div><button class="ghost" onclick="selectedDate=isoToday();renderAll()">Today</button></div>${ex.map((x,i)=>exerciseHtml(k,x,i,log)).join('')}<button class="primary full" onclick="completeWorkout('${k}')">Mark Workout ${k} complete</button></div>
 <div class="notice"><b>V1.6:</b> expanded exercise choices inspired by the movements you already track on your phone. Pull-ups and close-grip chin-ups are now included for your incoming pull-up bar. Dips remain excluded. Where you supplied an exact GIF, V1.7 uses it as the exercise demo.</div>`;
}
function exerciseHtml(k,x,i,log){
 const key=`${k}-${i}`,v=log.workoutLog?.[key]||{},sets=Array.from({length:+x.sets||3},(_,si)=>v.sets?.[si]||{}),hint=progressionHint(k,x,i,selectedDate);
 return`<div class="exercise-row photo-exercise ${x.userAdded?'user-added':''}"><button class="exercise-photo-btn" onclick="openDemo('${encodeURIComponent(x.exercise)}')">${exerciseVisual(x.exercise,'exercise-photo')}<span class="play-badge">▶</span><span class="exercise-photo-label">${esc(x.exercise)}</span></button><div class="row between"><div><strong>${esc(x.exercise)}</strong><div class="muted">${x.sets} sets · ${esc(x.reps)}</div></div><button class="ghost tiny" onclick="openDemo('${encodeURIComponent(x.exercise)}')">Demo</button></div>${x.note?`<div class="tiny muted">${esc(x.note)}</div>`:''}<div class="progression-hint">${esc(hint)}</div>
 <div class="set-table"><div class="set-head"><span>Set</span><span>Load kg</span><span>Reps</span><span>RIR</span><span>Done</span></div>${sets.map((sv,si)=>`<div class="set-row"><b>${si+1}</b><input inputmode="decimal" type="number" step="0.5" id="load-${key}-${si}" value="${sv.load??''}" placeholder="kg"><input inputmode="numeric" type="number" id="reps-${key}-${si}" value="${sv.reps??''}" placeholder="${esc(x.reps)}"><select id="rir-${key}-${si}"><option value=""></option>${[0,1,2,3,4].map(n=>`<option value="${n}" ${String(sv.rir)===String(n)?'selected':''}>${n}</option>`).join('')}</select><input class="set-check" type="checkbox" id="done-${key}-${si}" ${sv.done?'checked':''}></div>`).join('')}</div>
 <div class="row between exercise-actions"><button class="secondary compact" onclick="copyPrevious('${k}',${i})">Copy previous</button><div class="row gap-sm"><button class="ghost" onclick="saveExerciseSets('${key}',${x.sets})">Save exercise</button>${x.userAdded?`<button class="ghost danger-text" onclick="removeWorkoutExercise('${k}',${i})">Remove</button>`:''}</div></div></div>`;
}

function openExerciseLibrary(k){
 state.libraryWorkout=k;state.libraryCategory='All';
 renderExerciseLibraryDialog();$('#exerciseLibraryDialog').showModal();
}
function renderExerciseLibraryDialog(){
 const k=state.libraryWorkout||state.uiWorkout||'A',cat=state.libraryCategory||'All',cats=['All','Chest','Back','Shoulders','Biceps','Triceps','Legs','Abs/Core'];
 const items=(state.exerciseLibrary||[]).filter(x=>cat==='All'||x.category===cat);
 $('#exerciseLibraryBody').innerHTML=`<div class="dialog-head"><button class="text-btn" onclick="$('#exerciseLibraryDialog').close()">Close</button><h3>Add to Workout ${k}</h3><span></span></div>
 <p class="muted">Choose an exercise for your dumbbells, barbell, bench or pull-up bar. Dips remain excluded.</p>
 <div class="library-categories">${cats.map(c=>`<button class="${c===cat?'active':''}" onclick="state.libraryCategory='${c}';renderExerciseLibraryDialog()">${c}</button>`).join('')}</div>
 <div class="exercise-library-grid">${items.map(x=>`<article class="library-card">${exerciseVisual(x.exercise,'library-exercise-img')}<div class="library-card-body"><span class="library-cat">${esc(x.category)}</span><h4>${esc(x.exercise)}</h4><div class="muted">${esc(x.equipment)} · ${x.sets} sets · ${esc(x.reps)}</div><p>${esc(x.cue)}</p><button class="primary compact full" onclick="addWorkoutExercise('${k}','${encodeURIComponent(x.exercise)}')">Add to Workout ${k}</button></div></article>`).join('')}</div>`;
}
function addWorkoutExercise(k,encoded){
 const name=decodeURIComponent(encoded),src=(state.exerciseLibrary||[]).find(x=>x.exercise===name);if(!src)return;
 if((state.workouts[k]||[]).some(x=>x.exercise===name)){toast('Already in this workout');return}
 state.workouts[k].push({exercise:src.exercise,sets:src.sets,reps:src.reps,note:`${src.category} · ${src.equipment}`,userAdded:true});
 save();$('#exerciseLibraryDialog').close();renderWorkouts();toast(`${name} added`);
}
function removeWorkoutExercise(k,i){
 const x=state.workouts[k]?.[i];if(!x?.userAdded)return;
 if(confirm(`Remove ${x.exercise} from Workout ${k}?`)){state.workouts[k].splice(i,1);save();renderWorkouts();toast('Exercise removed')}
}

function copyPrevious(k,i){const prev=previousExerciseSets(k,i,selectedDate);if(!prev){toast('No previous set log yet');return}const key=`${k}-${i}`;prev.sets.forEach((sv,si)=>{const a=$(`#load-${key}-${si}`),b=$(`#reps-${key}-${si}`),c=$(`#rir-${key}-${si}`);if(a)a.value=sv.load??'';if(b)b.value=sv.reps??'';if(c)c.value=sv.rir??''});toast(`Copied ${fmtDate(prev.date)}`)}
function openDemo(encoded){
 const name=decodeURIComponent(encoded),d=demoMap[name]||['','Use controlled form.'];
 $('#demoBody').innerHTML=`<div class="dialog-head"><button class="text-btn" onclick="$('#demoDialog').close()">Close</button><h3>${esc(name)}</h3><span></span></div>
 <div class="demo-hero">${exerciseVisual(name,'exercise-demo-photo')}${exerciseGifMap[name]?'<span class="gif-badge">ANIMATED DEMO</span>':'<span class="demo-play">▶</span>'}</div>
 <div class="demo-cue"><b>Key cue</b><div class="muted">${esc(d[1])}</div></div>
 <div class="notice success"><b>Tempo:</b> controlled lowering, smooth return, steady breathing. Start with a manageable load and stop if technique breaks down.</div>`;
 $('#demoDialog').showModal()
}
function saveExerciseSets(key,count){const l=logFor(selectedDate);l.workoutLog=l.workoutLog||{};const sets=[];for(let si=0;si<count;si++)sets.push({load:numOrNull($(`#load-${key}-${si}`).value),reps:numOrNull($(`#reps-${key}-${si}`).value),rir:numOrNull($(`#rir-${key}-${si}`).value),done:$(`#done-${key}-${si}`).checked});const mm=key.match(/^([ABC])-(\d+)$/),name=mm?state.workouts?.[mm[1]]?.[+mm[2]]?.exercise:null;
 l.workoutLog[key]={sets,exerciseName:name||l.workoutLog[key]?.exerciseName||'Exercise',category:exerciseCategory(name||l.workoutLog[key]?.exerciseName||'')};save();toast('Exercise sets saved')}
function completeWorkout(k){const l=logFor(selectedDate);l.training='Yes';l.workout=k;save();renderAll();toast(`Workout ${k} completed`)}
function renderProgress(){
 const entries=Object.entries(state.logs).sort(([a],[b])=>a.localeCompare(b)),weigh=entries.filter(([,x])=>x.weight!=null),latest=latestValue('weight'),goal=state.settings.goalWeight,start=state.settings.startWeight,week=weekDates(selectedDate);
 let kcal=0,prot=0,n=0;week.forEach(d=>{const l=state.logs[d];if(l?.meals?.length){const t=totals(l);kcal+=t.kcal;prot+=t.protein;n++}});
 state.progressRange=state.progressRange||7;const ws=workoutStats(state.progressRange),maxSets=Math.max(1,...Object.values(ws.groups).map(x=>x.sets));
 $('#view-progress').innerHTML=`<div class="section-title"><div><span class="muted">12-week trajectory · V1.7</span><h2>Progress</h2></div></div>
 <div class="stat3"><div class="kpi"><span class="muted">Latest</span><div class="big">${latest??'—'}</div><div class="muted">kg</div></div><div class="kpi"><span class="muted">Goal</span><div class="big">${goal}</div><div class="muted">kg</div></div><div class="kpi"><span class="muted">Logged</span><div class="big">${weigh.length}</div><div class="muted">weights</div></div></div>
 <div class="card"><h3>Weight trend</h3><div class="canvas-wrap"><canvas id="weightChart" width="760" height="320"></canvas></div><div class="muted">Target path: ${start} → ${goal} kg across 12 weeks.</div></div>
 <div class="card"><div class="row between"><div><h3>Training balance</h3><div class="muted">Completed sets by muscle group</div></div><div class="range-tabs">${[[7,'1 week'],[14,'2 weeks'],[28,'4 weeks']].map(([d,l])=>`<button class="${state.progressRange===d?'active':''}" onclick="state.progressRange=${d};renderProgress()">${l}</button>`).join('')}</div></div>
 <div class="muscle-progress">${Object.entries(ws.groups).map(([g,x])=>{const pc=ws.totalSets?Math.round(x.sets/ws.totalSets*100):0;return`<div class="muscle-progress-row"><span>${g.replace('/Core','')}</span><b>${pc}%</b><div class="muscle-track"><i style="width:${Math.max(pc,x.sets?4:0)}%"></i></div></div>`}).join('')}</div>
 <div class="volume-summary"><div><span class="muted">Completed sets</span><b>${ws.totalSets}</b></div><div><span class="muted">Logged training volume</span><b>${(ws.totalVolume/1000).toFixed(1)} t</b></div></div>
 <div class="volume-grid">${Object.entries(ws.groups).filter(([,x])=>x.volume>0).map(([g,x])=>`<div><span>${g}</span><b>${(x.volume/1000).toFixed(2)} t</b></div>`).join('')||'<div class="muted">Log load + reps + Done to build your volume chart.</div>'}</div>
 <p class="footer-note">Training volume = logged load × reps for completed sets. Use it mainly to compare your own trend over time.</p></div>
 <div class="card"><div class="row between"><div><h3>Weekly calorie intake</h3><div class="muted">Average calories on days with meals logged</div></div><span class="pill">${n?Math.round(kcal/n)+' kcal':'No data'}</span></div><div class="canvas-wrap nutrition-chart-wrap"><canvas id="calorieChart" width="760" height="340"></canvas></div><div class="chart-legend"><span><i class="legend-blue"></i>Weekly average</span><span><i class="legend-dash"></i>Calorie target</span></div></div>
 <div class="card"><h3>Body measurements</h3><div class="body-metrics">${['waist','chest','arm','thigh'].map(f=>metricCard(f)).join('')}</div><div class="canvas-wrap"><canvas id="bodyChart" width="760" height="320"></canvas></div></div>
 <div class="card"><h3>This week</h3><div class="weekly-summary"><div><span class="muted">Avg calories</span><b>${n?Math.round(kcal/n):'—'}</b></div><div><span class="muted">Avg protein</span><b>${n?Math.round(prot/n)+'g':'—'}</b></div><div><span class="muted">Workouts</span><b>${week.filter(d=>state.logs[d]?.training==='Yes').length}/3</b></div></div></div>
 <div class="card"><h3>Meal photos</h3><div id="photoGallery" class="photo-gallery"><div class="empty">Loading photos…</div></div></div>
 <div class="card"><h3>Recent check-ins</h3>${entries.slice(-12).reverse().map(([d,x])=>`<div class="history-row row between"><div><strong>${fmtDate(d)}</strong><div class="muted">${x.energy||'No energy rating'} · ${x.sleep??'—'} h sleep</div></div><div class="right"><b>${x.weight??'—'} kg</b><div class="muted">${Math.round(totals(x).kcal)} kcal</div></div></div>`).join('')||'<div class="empty">No logs yet</div>'}</div>`;
 requestAnimationFrame(()=>{drawWeightChart();drawCalorieChart();drawBodyChart();renderPhotoGallery()})
}
function metricCard(f){const label={waist:'Waist',chest:'Chest',arm:'Upper arm',thigh:'Thigh'}[f],v=latestValue(f);return`<div class="body-metric"><span class="muted">${label}</span><b>${v==null?'—':v.toFixed(1)}</b><span class="muted">cm</span></div>`}
function drawWeightChart(){const c=$('#weightChart');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height,p=44,startD=dateObj(state.startDate),end=new Date(startD.getTime()+83*86400000),weights=Object.entries(state.logs).filter(([,x])=>x.weight!=null).sort(([a],[b])=>a.localeCompare(b)),min=Math.min(61,state.settings.startWeight-2,...weights.map(x=>x[1].weight)),max=Math.max(70,state.settings.goalWeight+2,...weights.map(x=>x[1].weight)),x=d=>p+((dateObj(d)-startD)/(end-startD))*(W-2*p),y=v=>H-p-((v-min)/(max-min))*(H-2*p);ctx.clearRect(0,0,W,H);ctx.font='12px -apple-system';for(let v=Math.ceil(min);v<=max;v++){ctx.strokeStyle='#e3e8ee';ctx.beginPath();ctx.moveTo(p,y(v));ctx.lineTo(W-p,y(v));ctx.stroke();ctx.fillStyle='#7b8790';ctx.fillText(v,10,y(v)+4)}ctx.strokeStyle='#aab7c2';ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(p,y(state.settings.startWeight));ctx.lineTo(W-p,y(state.settings.goalWeight));ctx.stroke();ctx.setLineDash([]);if(weights.length){ctx.strokeStyle='#0a64d8';ctx.lineWidth=4;ctx.beginPath();weights.forEach(([d,l],i)=>i?ctx.lineTo(x(d),y(l.weight)):ctx.moveTo(x(d),y(l.weight)));ctx.stroke();weights.forEach(([d,l])=>{ctx.fillStyle='#103d61';ctx.beginPath();ctx.arc(x(d),y(l.weight),5,0,Math.PI*2);ctx.fill()})}}

function drawCalorieChart(){
 const c=$('#calorieChart');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height,pL=54,pR=24,pT=28,pB=46,data=weeklyNutritionAverages(),vals=data.flatMap(x=>[x.kcal,x.target]).filter(v=>v!=null);
 const max=Math.max(3000,...vals)+150,min=Math.max(0,Math.min(1800,...vals)-150),x=i=>pL+i*(W-pL-pR)/11,y=v=>H-pB-(v-min)/(max-min)*(H-pT-pB);
 ctx.clearRect(0,0,W,H);ctx.font='12px -apple-system';
 for(let v=Math.ceil(min/500)*500;v<=max;v+=500){ctx.strokeStyle='#e7edf3';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pL,y(v));ctx.lineTo(W-pR,y(v));ctx.stroke();ctx.fillStyle='#7b8790';ctx.fillText(v,8,y(v)+4)}
 // target
 ctx.strokeStyle='#a5b0bb';ctx.setLineDash([8,6]);ctx.lineWidth=2;ctx.beginPath();data.forEach((d,i)=>i?ctx.lineTo(x(i),y(d.target)):ctx.moveTo(x(i),y(d.target)));ctx.stroke();ctx.setLineDash([]);
 // average
 const pts=data.map((d,i)=>d.kcal==null?null:{i,v:d.kcal}).filter(Boolean);
 if(pts.length){ctx.strokeStyle='#176fd1';ctx.lineWidth=4;ctx.beginPath();pts.forEach((pt,j)=>j?ctx.lineTo(x(pt.i),y(pt.v)):ctx.moveTo(x(pt.i),y(pt.v)));ctx.stroke();pts.forEach(pt=>{ctx.fillStyle='#176fd1';ctx.beginPath();ctx.arc(x(pt.i),y(pt.v),6,0,Math.PI*2);ctx.fill()})}
 data.forEach((d,i)=>{ctx.fillStyle='#71808d';ctx.font='11px -apple-system';ctx.fillText('W'+(i+1),x(i)-8,H-18)});
}

function drawBodyChart(){const c=$('#bodyChart');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height,p=44,fields=['waist','chest','arm','thigh'],colors=['#0a64d8','#35ad70','#e58a23','#7959c7'],entries=Object.entries(state.logs).sort(([a],[b])=>a.localeCompare(b)),vals=[];entries.forEach(([,l])=>fields.forEach(f=>{if(l[f]!=null)vals.push(+l[f])}));ctx.clearRect(0,0,W,H);if(!vals.length){ctx.fillStyle='#7b8790';ctx.font='16px -apple-system';ctx.fillText('Add waist, chest, arm or thigh measurements to see trends.',30,80);return}const min=Math.max(0,Math.min(...vals)-4),max=Math.max(...vals)+4,start=dateObj(state.startDate),end=new Date(start.getTime()+83*86400000),x=d=>p+((dateObj(d)-start)/(end-start))*(W-2*p),y=v=>H-p-((v-min)/(max-min))*(H-2*p);fields.forEach((f,fi)=>{const pts=entries.filter(([,l])=>l[f]!=null);if(!pts.length)return;ctx.strokeStyle=colors[fi];ctx.lineWidth=3;ctx.beginPath();pts.forEach(([d,l],i)=>i?ctx.lineTo(x(d),y(l[f])):ctx.moveTo(x(d),y(l[f])));ctx.stroke();ctx.fillStyle=colors[fi];ctx.font='12px -apple-system';ctx.fillText({waist:'Waist',chest:'Chest',arm:'Arm',thigh:'Thigh'}[f],50+fi*115,22)})}

function renderSettings(){const s=state.settings;$('#view-settings').innerHTML=`<div class="section-title"><div><span class="muted">V1.7</span><h2>More</h2></div></div><div class="card"><h3>Targets</h3><div class="two-col"><label>Starting weight<input id="setStart" type="number" step="0.1" value="${s.startWeight}"></label><label>Goal weight<input id="setGoal" type="number" step="0.1" value="${s.goalWeight}"></label><label>Protein target<input id="setProtein" type="number" value="${s.proteinTarget}"></label><label>Programme start<input id="setDate" type="date" value="${state.startDate}"></label></div><button class="primary" onclick="saveSettings()">Save targets</button></div><div class="card"><div class="row between"><h3>Reminders</h3><button class="ghost" onclick="openReminderDialog()">Configure</button></div><p class="muted">Meal, Serious Mass, workout and weigh-in reminders. Notifications require permission.</p><button class="secondary" onclick="requestNotifications()">Enable notifications</button></div><div class="card"><h3>Serious Mass</h3><div class="metricline"><span>1 heaped scoop</span><b>631 kcal · 25 g</b></div><div class="muted">168 g powder; approximately 124 g carbohydrate and 1.5 g creatine.</div></div><div class="card"><h3>Backup & restore</h3><p class="muted">Export includes logs, settings, custom foods and meal photos. Keep a periodic backup outside Safari.</p><div class="actions"><button class="primary" onclick="exportBackup()">Export backup</button><label class="secondary" style="text-align:center;cursor:pointer">Import backup<input type="file" accept="application/json" hidden onchange="importBackup(this.files[0])"></label></div></div><div class="card"><h3>About V1.7</h3><p class="muted">Photo-rich meals, exact supplied workout GIF demos, pull-up/chin-up support, balanced A/B/C programming, muscle-group training balance, logged lifting-volume summaries and weekly calorie-average charts.</p><p class="footer-note">Reminder limitation: GitHub Pages has no notification server. V1.7 can notify while the app is active/recently opened and checks overdue reminders when reopened, but reliable background push while fully closed requires a later server-backed push service.</p></div><div class="card"><button class="secondary danger" onclick="resetApp()">Reset app data</button></div>`}
function saveSettings(){state.settings.startWeight=+$('#setStart').value;state.settings.goalWeight=+$('#setGoal').value;state.settings.proteinTarget=+$('#setProtein').value;state.startDate=$('#setDate').value;save();renderAll();toast('Targets saved')}

function setupReminders(){}
function openReminderDialog(){const r=state.reminders;$('#reminderBody').innerHTML=`<div class="dialog-head"><button class="text-btn" onclick="$('#reminderDialog').close()">Done</button><h3>Reminders</h3><button class="text-btn" onclick="requestNotifications()">Allow</button></div><p class="muted">Choose times. Workout reminder fires on Mon/Wed/Sat and make-up awareness on Fri/Sun; weigh-in reminder is Sunday.</p>${Object.entries(r).map(([k,v])=>`<div class="reminder-row"><div><b>${esc(v.label)}</b><input type="time" id="rt-${k}" value="${v.time}" onchange="updateReminder('${k}')"></div><input class="toggle" id="re-${k}" type="checkbox" ${v.enabled?'checked':''} onchange="updateReminder('${k}')"></div>`).join('')}<div class="actions"><button class="secondary" onclick="testNotification()">Test notification</button></div>`;$('#reminderDialog').showModal()}
function updateReminder(k){state.reminders[k].time=$(`#rt-${k}`).value;state.reminders[k].enabled=$(`#re-${k}`).checked;save()}
async function requestNotifications(){if(!('Notification'in window)){toast('Notifications are not supported here');return}const p=await Notification.requestPermission();toast(p==='granted'?'Notifications enabled':'Notification permission not granted')}
function dueForReminder(k,date){const day=dateObj(date).getDay();if(k==='workout')return[1,3,5,6,0].includes(day);if(k==='weigh')return day===0;return true}
async function testNotification(){if(Notification.permission!=='granted')await requestNotifications();if(Notification.permission==='granted')showNotification('Lean Mass Tracker','This is a test reminder.')}
function showNotification(title,body){if(navigator.serviceWorker?.controller){navigator.serviceWorker.ready.then(r=>r.showNotification(title,{body,icon:'icons/icon-192.png',badge:'icons/icon-192.png'}))}else if(Notification.permission==='granted')new Notification(title,{body})}
function checkReminders(){if(!state?.reminders||!('Notification' in window)||Notification.permission!=='granted')return;const now=new Date(),today=isoToday(),hm=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;for(const[k,r]of Object.entries(state.reminders)){if(!r.enabled||!dueForReminder(k,today))continue;const firedKey=`${today}-${k}`;if(state.reminderFired[firedKey])continue;const [h,m]=r.time.split(':').map(Number),target=new Date();target.setHours(h,m,0,0);const diff=(now-target)/60000;if(diff>=0&&diff<=90){showNotification('Lean Mass Tracker',`${r.label} reminder · ${r.time}`);state.reminderFired[firedKey]=Date.now();save()}}}

async function openPhotoDB(){return new Promise((res,rej)=>{const req=indexedDB.open(PHOTO_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('photos'))req.result.createObjectStore('photos')};req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error)})}
async function putPhoto(id,blob){const db=await openPhotoDB();return new Promise((res,rej)=>{const tx=db.transaction('photos','readwrite');tx.objectStore('photos').put(blob,id);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}
async function getPhoto(id){const db=await openPhotoDB();return new Promise((res,rej)=>{const r=db.transaction('photos').objectStore('photos').get(id);r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error)})}
async function deletePhoto(id){const db=await openPhotoDB();return new Promise(res=>{const tx=db.transaction('photos','readwrite');tx.objectStore('photos').delete(id);tx.oncomplete=res})}
async function allPhotoRecords(){const ids=[];Object.values(state.logs).forEach(l=>(l.meals||[]).forEach(m=>{if(m.photoId)ids.push(m.photoId)}));(state.customMeals||[]).forEach(m=>{if(m.photoId)ids.push(m.photoId)});Object.values(state.mealPhotoOverrides||{}).forEach(id=>{if(id)ids.push(id)});const out={};for(const id of [...new Set(ids)]){const b=await getPhoto(id);if(b)out[id]=b}return out}
async function hydratePhotos(){for(const img of $$('.photo-ref')){const b=await getPhoto(img.dataset.photo);if(b)img.src=URL.createObjectURL(b)}}
async function renderPhotoGallery(){const host=$('#photoGallery');if(!host)return;const refs=[];Object.entries(state.logs).sort(([a],[b])=>b.localeCompare(a)).forEach(([d,l])=>(l.meals||[]).forEach((m,i)=>{if(m.photoId)refs.push({id:m.photoId,date:d,name:m.name,index:i})}));if(!refs.length){host.innerHTML='<div class="empty">No meal photos yet.</div>';return}host.innerHTML=refs.slice(0,18).map(r=>`<button class="gallery-card" onclick="openMealPhoto('${r.date}',${r.index})"><img class="gallery-img photo-ref" data-photo="${r.id}" alt="${esc(r.name)}"><span>${fmtDate(r.date,{day:'numeric',month:'short'})}</span></button>`).join('');hydratePhotos()}
async function openMealPhoto(date,index){const m=state.logs[date]?.meals?.[index];if(!m?.photoId)return;const b=await getPhoto(m.photoId);if(!b)return;const url=URL.createObjectURL(b);$('#photoViewerBody').innerHTML=`<div class="dialog-head"><button class="text-btn" onclick="$('#photoViewer').close()">Close</button><h3>${esc(m.slot)}</h3><span></span></div><img class="photo-full" src="${url}" alt="${esc(m.name)}"><div class="photo-meta"><h3>${esc(m.name)}</h3><div class="muted">${fmtDate(date,{weekday:'long',day:'numeric',month:'long'})}</div><div class="metricline"><span>Estimated nutrition</span><b>${Math.round(m.kcal)} kcal · ${(+m.protein).toFixed((+m.protein)%1?1:0)} g protein</b></div>${m.notes?`<p class="muted">${esc(m.notes)}</p>`:''}</div>`;$('#photoViewer').showModal()}
function compressImage(file){return new Promise((res,rej)=>{const im=new Image(),u=URL.createObjectURL(file);im.onload=()=>{const max=1200,s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>{URL.revokeObjectURL(u);b?res(b):rej(new Error('Photo compression failed'))},'image/jpeg',.72)};im.onerror=rej;im.src=u})}
function blobToDataURL(blob){return new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result);r.readAsDataURL(blob)})}
function dataURLToBlob(s){const [h,b64]=s.split(','),mime=h.match(/:(.*?);/)[1],bin=atob(b64),arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return new Blob([arr],{type:mime})}
async function exportBackup(){const photos=await allPhotoRecords(),encoded={};for(const[id,b]of Object.entries(photos))encoded[id]=await blobToDataURL(b);const pack={app:'Lean Mass Tracker',version:VERSION,exportedAt:new Date().toISOString(),state,photos:encoded},blob=new Blob([JSON.stringify(pack)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`lean-mass-v1-7-backup-${isoToday()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);toast('Backup exported')}
function importBackup(file){if(!file)return;const r=new FileReader();r.onload=async()=>{try{const pack=JSON.parse(r.result);state=pack.state||pack;migrate();if(pack.photos)for(const[id,data]of Object.entries(pack.photos))await putPhoto(id,dataURLToBlob(data));save();renderAll();toast('Backup restored')}catch(e){alert('That backup could not be restored.')}};r.readAsText(file)}
function resetApp(){if(confirm('Reset all app data back to the starter tracker?')){localStorage.removeItem(STORE);indexedDB.deleteDatabase(PHOTO_DB);location.reload()}}

window.openMeal=openMeal;window.deleteMeal=deleteMeal;window.saveCheckin=saveCheckin;window.quickMass=quickMass;window.showView=showView;window.shiftWeek=shiftWeek;window.renderMeals=renderMeals;window.mealLibraryMode=mealLibraryMode;window.toggleFavoriteName=toggleFavoriteName;window.addCustomMeal=addCustomMeal;window.renderWorkouts=renderWorkouts;window.renderProgress=renderProgress;window.openExerciseLibrary=openExerciseLibrary;window.renderExerciseLibraryDialog=renderExerciseLibraryDialog;window.addWorkoutExercise=addWorkoutExercise;window.removeWorkoutExercise=removeWorkoutExercise;window.openDemo=openDemo;window.saveExerciseSets=saveExerciseSets;window.copyPrevious=copyPrevious;window.completeWorkout=completeWorkout;window.saveSettings=saveSettings;window.openReminderDialog=openReminderDialog;window.updateReminder=updateReminder;window.requestNotifications=requestNotifications;window.testNotification=testNotification;window.openMealPhoto=openMealPhoto;window.exportBackup=exportBackup;window.importBackup=importBackup;window.resetApp=resetApp;
boot();
