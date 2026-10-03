const STORE='leanMassTrackerV1';
const VERSION='2.1';
const BUILD='concept-ui-2026-10-03';
const PHOTO_DB='LeanMassPhotos';
let seed,state,selectedDate=isoToday(),mealMode='recent',currentPhotoBlob=null,calendarAnchor=isoToday(),photoTarget=null,mealPhotoMap={bySlug:{}};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const demoMap={"Alternate dumbbell curl":["alternate-dumbbell-curl.svg","Curl one dumbbell at a time; keep elbow close to your side."],"Hammer curl":["hammer-curl.svg","Use a neutral grip and avoid swinging."],"Concentration curl":["concentration-curl.svg","Brace elbow against inner thigh and curl slowly."],"Dumbbell curl":["dumbbell-curl.svg","Keep elbows near ribs and avoid swinging."],"DB overhead triceps extension":["db-overhead-triceps-extension.svg","Keep upper arms still while extending the elbows."],"Lying dumbbell triceps extension":["lying-dumbbell-triceps-extension.svg","Keep upper arms steady; bend only at the elbows."],"Triceps kickback":["triceps-kickback.svg","Keep upper arm parallel to torso; fully extend elbow."],"Close-grip bench press":["close-grip-bench-press.svg","Use a comfortable close grip; keep elbows controlled."],"Dumbbell shoulder press":["dumbbell-shoulder-press.svg","Brace abdomen and press overhead without excessive back arch."],"Arnold press":["arnold-press.svg","Rotate smoothly through the press; do not force shoulder range."],"Dumbbell lateral raise":["dumbbell-lateral-raise.svg","Use light weight; raise to shoulder height without swinging."],"Dumbbell front raise":["dumbbell-front-raise.svg","Raise under control to about shoulder height."],"Barbell bench press":["barbell-bench-press.svg","Shoulder blades back/down, feet planted; lower under control."],"Incline dumbbell press":["incline-dumbbell-press.svg","Use a modest incline and keep shoulders back."],"Dumbbell bench fly":["dumbbell-bench-fly.svg","Keep a soft elbow bend; stop before shoulder discomfort."],"Incline dumbbell fly":["incline-dumbbell-fly.svg","Use light dumbbells and a modest incline."],"Dumbbell squeeze press":["dumbbell-squeeze-press.svg","Press dumbbells together throughout the movement."],"Dumbbell pullover":["dumbbell-pullover.svg","Keep ribs controlled and use a comfortable shoulder range."],"One-arm dumbbell row":["one-arm-dumbbell-row.svg","Support on bench, pull elbow toward hip, avoid torso twisting."],"Barbell bent-over row":["barbell-bent-over-row.svg","Hold a stable hip hinge and pull toward lower ribs."],"Reverse fly":["reverse-fly.svg","Use light weights and move from the rear shoulders."],"Dumbbell shrug":["dumbbell-shrug.svg","Lift shoulders straight up; pause briefly; do not roll."],"Goblet squat":["goblet-squat.svg","Hold a dumbbell at chest; sit hips down/back; keep heels down."],"Bulgarian split squat":["bulgarian-split-squat.svg","Rear foot on bench, lower with control, drive through front foot."],"Dumbbell reverse lunge":["dumbbell-reverse-lunge.svg","Step back and keep a stable shoulder-width stance."],"Barbell Romanian deadlift":["barbell-romanian-deadlift.svg","Soft knees, push hips back, keep bar close and spine neutral."],"Barbell/dumbbell hip thrust":["barbell-dumbbell-hip-thrust.svg","Upper back on bench; squeeze glutes at top without overextending."],"Standing calf raise":["standing-calf-raise.svg","Use full comfortable range and pause at the top."],"Plank":["plank.svg","Elbows under shoulders; squeeze abs/glutes and keep hips level."],"Lying leg raise":["lying-leg-raise.svg","Keep lower back controlled; lower legs slowly."],"Crunch":["crunch.svg","Lift shoulder blades with your abs; avoid pulling the neck."],"Mountain climber":["mountain-climber.svg","Keep shoulders over hands and hips steady."],"Bicycle crunch":["bicycle-crunch.svg","Rotate through the torso slowly; do not pull the neck."]};
const exerciseGifMap={"Barbell bench press":"gifs/barbell-bench-press.gif","Barbell bent-over row":"gifs/barbell-bent-over-row.gif","Barbell/dumbbell hip thrust":"gifs/barbell-hip-thrusts.gif","Barbell Romanian deadlift":"gifs/barbell-romanian-deadlift.gif","Dumbbell lateral raise":"gifs/dumbbell-lateral-raise.gif","Dumbbell reverse lunge":"gifs/dumbbell-reverse-lunge.gif","Dumbbell shoulder press":"gifs/dumbbell-shoulder-press.gif","Goblet squat":"gifs/goblet-squat.gif","Hammer curl":"gifs/hammer-curl.gif","Incline dumbbell press":"gifs/incline-dumbbell-press.gif","Lying leg raise":"gifs/lying-leg-raise.gif","One-arm dumbbell row":"gifs/one-arm-dumbbell-row.gif","Lying dumbbell triceps extension":"gifs/alternating-lying-dumbbell-triceps-extension.gif","Pull-up":"gifs/pull-up.gif","Close-grip chin-up":"gifs/close-grip-chin-up.gif","Alternate dumbbell curl":"gifs/alternate-dumbbell-curl.gif","Concentration curl":"gifs/concentration-curl.gif","Dumbbell curl":"gifs/dumbbell-curl.gif","DB overhead triceps extension":"gifs/db-overhead-triceps-extension.gif","Triceps kickback":"gifs/triceps-kickback.gif","Close-grip bench press":"gifs/close-grip-bench-press.gif","Arnold press":"gifs/arnold-press.gif","Dumbbell front raise":"gifs/dumbbell-front-raise.gif","Dumbbell bench fly":"gifs/dumbbell-bench-fly.gif","Incline dumbbell fly":"gifs/incline-dumbbell-fly.gif","Dumbbell squeeze press":"gifs/dumbbell-squeeze-press.gif","Dumbbell pullover":"gifs/dumbbell-pullover.gif","Reverse fly":"gifs/reverse-fly.gif","Dumbbell shrug":"gifs/dumbbell-shrug.gif","Bulgarian split squat":"gifs/bulgarian-split-squat.gif","Standing calf raise":"gifs/standing-calf-raise.gif","Plank":"gifs/plank.gif","Crunch":"gifs/crunch.gif","Mountain climber":"gifs/mountain-climber.gif","Bicycle crunch":"gifs/bicycle-crunch.gif"};
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
function blankLog(){return{meals:[],weight:null,waist:null,chest:null,arm:null,thigh:null,sleep:null,energy:'',waterMl:0,training:'No',workout:'Rest',workoutLog:{}}}
function sleepParts(v){if(v==null||v==='')return{h:'',m:''};const total=Math.max(0,Math.round((+v||0)*60));return{h:Math.floor(total/60),m:total%60}}
function sleepText(v){if(v==null||v==='')return'—';const p=sleepParts(v);return `${p.h}h ${String(p.m).padStart(2,'0')}m`}
function sleepFromInputs(h,m){h=parseInt(h||0,10)||0;m=parseInt(m||0,10)||0;return(h===0&&m===0)?null:+(h+m/60).toFixed(4)}
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
function defaultRestSeconds(name=''){
 const c=exerciseCategory(name);return ['Chest','Back','Legs'].includes(c)?90:['Shoulders'].includes(c)?75:60;
}
function migrate(){
 state.customMeals=state.customMeals||[];
 state.mealPhotoOverrides=state.mealPhotoOverrides||{};
 state.favorites=state.favorites||[];
 state.recentMeals=state.recentMeals||[];
 state.reminders=state.reminders||defaultReminders();
 state.reminderFired=state.reminderFired||{};
 state.settings=state.settings||{...seed.setup};
 if(state.settings.waterTarget==null)state.settings.waterTarget=3000;
 state.mealsTab=state.mealsTab||'today';
 state.uiWorkout=state.uiWorkout||'A';
 state.workoutExerciseIndex=state.workoutExerciseIndex||{A:0,B:0,C:0};
 state.workoutSetsOpen=state.workoutSetsOpen||{A:false,B:false,C:false};
 state.progressChartRange=state.progressChartRange||30;
 // Preserve exercise identity in historical indexed workout logs before any programme edits.
 Object.entries(state.logs||{}).forEach(([d,l])=>{
   l.workoutLog=l.workoutLog||{};
   if(l.waterMl==null)l.waterMl=0;
   Object.entries(l.workoutLog).forEach(([key,v])=>{
     if(!v)return;
     if(!v.exerciseName){
       const mm=key.match(/^([ABC])-(\d+)$/);
       if(mm){const old=state.workouts?.[mm[1]]?.[+mm[2]];if(old?.exercise)v.exerciseName=old.exercise}
     }
     if(v.exerciseName&&!v.category)v.category=exerciseCategory(v.exerciseName);
   });
 });
 // Keep the user's programme exactly as stored. Add only missing V2.1 fields.
 if(!state.workouts)state.workouts=JSON.parse(JSON.stringify(seed.workouts));
 Object.values(state.workouts||{}).forEach(list=>(list||[]).forEach(x=>{if(x.rest==null)x.rest=defaultRestSeconds(x.exercise)}));
 // Merge the current library with the shipped library without deleting anything the user may already have.
 const merged=new Map();
 [...(state.exerciseLibrary||[]),...(seed.exerciseLibrary||[])].forEach(x=>{if(x?.exercise)merged.set(x.exercise,{...x,rest:x.rest??defaultRestSeconds(x.exercise)})});
 state.exerciseLibrary=[...merged.values()];
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
 if(stored){state=JSON.parse(stored);migrate()}else{state={version:VERSION,startDate:'2026-08-14',settings:{...seed.setup,waterTarget:3000},meals:seed.meals,workouts:JSON.parse(JSON.stringify(seed.workouts)),exerciseLibrary:seed.exerciseLibrary||[],logs:{},customMeals:[],favorites:[],recentMeals:[],reminders:defaultReminders(),reminderFired:{},mealsTab:'today',uiWorkout:'A',workoutExerciseIndex:{A:0,B:0,C:0},workoutSetsOpen:{A:false,B:false,C:false},progressChartRange:30};for(const[date,x]of Object.entries(seed.historical))state.logs[date]={...blankLog(),...x,workoutLog:{}};save()}
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
function weeklyWorkoutCount(days=weekDates(selectedDate)){return days.filter(d=>state.logs[d]?.training==='Yes').length}
function waterText(ml){return `${((+ml||0)/1000).toFixed(1)} L`}
function addWater(ml){const l=logFor(selectedDate);l.waterMl=Math.max(0,(+l.waterMl||0)+(+ml||0));save();renderAll();toast(`Water ${ml>0?'+':''}${ml} ml`)}
function setWater(){const l=logFor(selectedDate),v=prompt('Total water for this day (ml)',String(l.waterMl||0));if(v==null)return;const n=Math.max(0,+v||0);l.waterMl=n;save();renderAll();toast('Water updated')}
function openCheckin(){
 const l=logFor(selectedDate),p=sleepParts(l.sleep);
 $('#checkinBody').innerHTML=`<div class="dialog-head"><button class="text-btn" onclick="$('#checkinDialog').close()">Cancel</button><h3>Daily Check-in</h3><button class="text-btn strong" onclick="saveCheckin()">Save</button></div>
 <div class="checkin-datebar"><button class="ghost" onclick="shiftCheckinDate(-1)">‹</button><b>${fmtDate(selectedDate,{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</b><button class="ghost" onclick="shiftCheckinDate(1)">›</button></div>
 <div class="two-col"><label>Weight (kg)<input id="todayWeight" type="number" step="0.1" value="${l.weight??''}"></label><label class="sleep-field">Sleep duration<div class="sleep-inputs"><span><input id="todaySleepH" inputmode="numeric" type="number" min="0" max="24" step="1" value="${p.h}" placeholder="5"><small>hr</small></span><span><input id="todaySleepM" inputmode="numeric" type="number" min="0" max="59" step="1" value="${p.m}" placeholder="58"><small>min</small></span></div></label><label>Waist (cm)<input id="todayWaist" type="number" step="0.1" value="${l.waist??''}"></label><label>Chest (cm)<input id="todayChest" type="number" step="0.1" value="${l.chest??''}"></label><label>Upper arm (cm)<input id="todayArm" type="number" step="0.1" value="${l.arm??''}"></label><label>Thigh (cm)<input id="todayThigh" type="number" step="0.1" value="${l.thigh??''}"></label></div>
 <label>Energy level<select id="todayEnergy"><option></option>${['Low','Moderate','Good','High'].map(x=>`<option ${l.energy===x?'selected':''}>${x}</option>`).join('')}</select></label>
 <button class="primary full" onclick="saveCheckin()">Save check-in</button>`;
 if(!$('#checkinDialog').open)$('#checkinDialog').showModal();
}
function shiftCheckinDate(n){const d=dateObj(selectedDate);d.setDate(d.getDate()+n);selectedDate=iso(d);calendarAnchor=selectedDate;openCheckin();renderToday()}
function renderToday(){
 const log=logFor(selectedDate),t=targetForDate(selectedDate),sum=totals(log),weight=latestValue('weight'),gain=weight==null?0:weight-state.settings.startWeight,week=weekDates(selectedDate),wcount=weeklyWorkoutCount(week),waterTarget=+state.settings.waterTarget||3000;
 const mealHtml=log.meals.length?log.meals.map((m,i)=>`<div class="today-meal-line"><button class="today-meal-visual" ${m.photoId?`onclick="openMealPhoto('${selectedDate}',${i})"`:''}>${mealVisual(m,'meal-thumb')}</button><div><span>${esc(m.slot)}${m.time?` · ${esc(m.time)}`:''}</span><b>${esc(m.name)}</b><small>${Math.round(m.kcal)} kcal · ${Math.round(+m.protein||0)} g protein</small></div><button class="icon-more" onclick="deleteMeal('${selectedDate}',${i})">•••</button></div>`).join(''):`<div class="empty compact-empty">No meals logged for this day.</div>`;
 $('#view-today').innerHTML=`${renderWeekCalendar()}
 <div class="dashboard-grid">
   <div class="dash-card calorie"><span>Calories</span><b>${Math.round(sum.kcal).toLocaleString()}</b><small>/ ${t.kcal.toLocaleString()} kcal</small><div class="mini-progress"><i style="width:${pct(sum.kcal,t.kcal)}%"></i></div><em>${pct(sum.kcal,t.kcal)}%</em></div>
   <div class="dash-card protein"><span>Protein</span><b>${Math.round(sum.protein)} g</b><small>/ ${t.protein} g</small><div class="mini-progress"><i style="width:${pct(sum.protein,t.protein)}%"></i></div><em>${pct(sum.protein,t.protein)}%</em></div>
   <div class="dash-card workout"><span>Workouts</span><b>${wcount}/3</b><small>completed this week</small><div class="metric-icon">🏋️</div></div>
   <div class="dash-card water"><span>Water</span><b>${waterText(log.waterMl)}</b><small>/ ${(waterTarget/1000).toFixed(1)} L</small><div class="mini-progress"><i style="width:${pct(log.waterMl,waterTarget)}%"></i></div><button class="water-drop" onclick="addWater(250)">💧</button></div>
 </div>
 <div class="concept-card checkin-summary"><div class="card-title-row"><b>Today's Check-in</b><button class="link-btn" onclick="openCheckin()">Edit</button></div><div class="checkin-mini-grid"><div><span>Weight</span><b>${log.weight==null?'—':(+log.weight).toFixed(1)+' kg'}</b>${weight!=null&&log.weight!=null?`<small>${(+log.weight-weight)>=0?'+':''}${(+log.weight-weight).toFixed(1)} latest</small>`:''}</div><div><span>Sleep</span><b>${sleepText(log.sleep)}</b><small>🌙 recovery</small></div></div></div>
 <div class="quick-actions-bar"><button onclick="openMeal('Breakfast')"><span>＋</span><small>Log Meal</small></button><button onclick="showView('workouts')"><span>🏋︎</span><small>Log Workout</small></button><button onclick="openCheckin()"><span>✓</span><small>Check-in</small></button><button onclick="addWater(250)"><span>💧</span><small>+250 ml</small></button></div>
 <div class="concept-card"><div class="card-title-row"><div><b>Today's meals</b><small>${fmtDate(selectedDate,{weekday:'short',day:'numeric',month:'short'})}</small></div><button class="add-pill" onclick="openMeal('Other')">＋ Add</button></div>${mealHtml}<div class="meal-total-line"><span>Total</span><b>${Math.round(sum.kcal)} kcal · ${Math.round(sum.protein)} g protein</b></div></div>
 <div class="concept-card water-panel"><div class="card-title-row"><div><b>Hydration</b><small>Daily target ${(waterTarget/1000).toFixed(1)} L</small></div><b>${waterText(log.waterMl)}</b></div><div class="hydration-buttons"><button onclick="addWater(250)">+250 ml</button><button onclick="addWater(500)">+500 ml</button><button onclick="setWater()">Set total</button></div></div>
 <div class="concept-card workout-next"><span>Suggested training</span><b>${workoutSuggestion(selectedDate)}</b><small>Target remains 3 resistance sessions/week. Friday and Sunday can be make-up days.</small><button class="primary full" onclick="showView('workouts')">Open workout</button></div>`;
}
function saveCheckin(){
 const l=logFor(selectedDate);
 const get=id=>document.querySelector(id);
 if(get('#todayWeight'))l.weight=numOrNull(get('#todayWeight').value);
 if(get('#todaySleepH'))l.sleep=sleepFromInputs(get('#todaySleepH').value,get('#todaySleepM').value);
 if(get('#todayWaist'))l.waist=numOrNull(get('#todayWaist').value);
 if(get('#todayChest'))l.chest=numOrNull(get('#todayChest').value);
 if(get('#todayArm'))l.arm=numOrNull(get('#todayArm').value);
 if(get('#todayThigh'))l.thigh=numOrNull(get('#todayThigh').value);
 if(get('#todayEnergy'))l.energy=get('#todayEnergy').value;
 save();$('#checkinDialog')?.close();renderAll();toast('Check-in saved')
}
function quickMass(){const now=new Date();logFor(selectedDate).meals.push({slot:'Snack 2',name:'Serious Mass - 1 scoop',kcal:631,protein:25,notes:'168 g',time:selectedDate===isoToday()?`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`:''});rememberMeal('Serious Mass - 1 scoop');save();renderAll();toast('Serious Mass added')}
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
 const photoId=chosen?.photoId||state.mealPhotoOverrides?.[name]||null,now=new Date();
 const time=selectedDate===isoToday()?`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`:'';
 logFor(selectedDate).meals.push({slot:$('#mealSlot').value,name,kcal,protein,notes:$('#mealNotes').value,photoId,time});
 rememberMeal(name);save();$('#mealDialog').close();renderAll();toast('Meal added')
}
async function deleteMeal(date,i){const l=logFor(date),m=l.meals[i];const shared=!!state.customMeals?.some(c=>c.photoId&&c.photoId===m?.photoId)||Object.values(state.mealPhotoOverrides||{}).includes(m?.photoId);if(m?.photoId&&!shared)await deletePhoto(m.photoId);l.meals.splice(i,1);save();renderAll()}

function mealsTab(mode){state.mealsTab=mode;save();renderMeals()}
function mealListCard(m,extra=''){
 return `<article class="meal-list-card">${mealVisual(m,'meal-list-img')}<div class="meal-list-body"><div class="meal-list-top"><b>${esc(m.name)}</b>${extra}</div><small>${Math.round(m.kcal)} kcal · ${(+m.protein).toFixed((+m.protein)%1?1:0)} g protein</small>${m.notes?`<p>${esc(m.notes)}</p>`:''}</div></article>`;
}
function renderMeals(){
 const tab=state.mealsTab||'today',log=logFor(selectedDate),tabs=['today','favorites','custom','recent'];
 const header=`<div class="page-head"><h2>Meals</h2><button class="add-pill" onclick="openMeal('Other')">＋ Add</button></div><div class="search-shell">⌕ <input id="mealPageSearch" type="search" placeholder="Search meals..."></div><div class="concept-tabs">${tabs.map(t=>`<button class="${tab===t?'active':''}" onclick="mealsTab('${t}')">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div><div id="mealSearchResults"></div>`;
 let body='';
 if(tab==='today'){
   const items=log.meals||[];
   body=`<div class="meal-day-summary"><span>${fmtDate(selectedDate,{weekday:'long',day:'numeric',month:'long'})}</span><b>${Math.round(totals(log).kcal)} kcal · ${Math.round(totals(log).protein)} g protein</b></div><div class="meal-log-list">${items.map((m,i)=>`<article class="meal-log-card">${m.photoId?`<button onclick="openMealPhoto('${selectedDate}',${i})">${mealVisual(m,'meal-log-img')}</button>`:mealVisual(m,'meal-log-img')}<div><span>${esc(m.slot)}${m.time?` · ${esc(m.time)}`:''}</span><b>${esc(m.name)}</b><small>${Math.round(m.kcal)} kcal | ${Math.round(+m.protein||0)} g protein</small></div><button class="icon-more" onclick="deleteMeal('${selectedDate}',${i})">•••</button></article>`).join('')||'<div class="empty">No meals logged yet. Tap + Add.</div>'}</div>`;
 } else if(tab==='custom'){
   body=`<div class="concept-card custom-meal-card"><div class="card-title-row"><div><b>Create custom meal</b><small>Save your own meal with a photo</small></div><span class="pill">📷</span></div><div class="photo-picker custom-photo photo-launch" onclick="openPhotoChooser('__custom__')"><span class="photo-picker-icon">📷</span><span><b>Add meal photo</b><small>Camera or Photo Library</small></span></div><div id="customPhotoPreview" class="photo-preview hidden"></div><div class="two-col"><label>Name<input id="customName"></label><label>Calories<input id="customKcal" type="number"></label><label>Protein (g)<input id="customProtein" type="number" step="0.5"></label><label>Notes<input id="customNotes"></label></div><button class="primary full" onclick="addCustomMeal()">Save custom meal</button></div><div class="meal-library-list">${(state.customMeals||[]).map(m=>mealListCard(m)).join('')||'<div class="empty">No custom meals yet.</div>'}</div>`;
 } else {
   let items=tab==='favorites'?allMeals().filter(m=>state.favorites.includes(m.name)):state.recentMeals.map(n=>allMeals().find(m=>m.name===n)).filter(Boolean);
   body=`<div id="mealLibraryResults" class="meal-library-list">${items.map(m=>mealListCard(m,`<button class="mini-star" onclick="toggleFavoriteName('${encodeURIComponent(m.name)}')">${state.favorites.includes(m.name)?'★':'☆'}</button>`)).join('')||'<div class="empty">Nothing here yet.</div>'}</div>`;
 }
 $('#view-meals').innerHTML=header+`<div id="mealTabContent">${body}</div>`;
 const search=$('#mealPageSearch');if(search)search.oninput=()=>{const q=search.value.trim().toLowerCase(),results=$('#mealSearchResults'),content=$('#mealTabContent');if(!q){results.innerHTML='';content.style.display='';return}const items=allMeals().filter(m=>m.name.toLowerCase().includes(q)).slice(0,40);results.innerHTML=`<div class="meal-library-list search-results">${items.map(m=>mealListCard(m,`<button class="mini-add" onclick="openMeal('Other')">＋</button>`)).join('')||'<div class="empty">No matching meals.</div>'}</div>`;content.style.display='none';hydratePhotos()};
 hydratePhotos();
}
function mealLibraryMode(m,b){mealsTab(m==='all'?'recent':m)}
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
 const currentName=state.workouts?.[k]?.[i]?.exercise,dates=Object.keys(state.logs).filter(d=>d<date).sort().reverse();
 for(const d of dates){
   const wl=state.logs[d]?.workoutLog||{};
   let v=Object.values(wl).find(x=>x?.exerciseName===currentName);
   if(!v)v=wl[`${k}-${i}`];
   if(v?.sets?.some(x=>x.done||x.load!=null||x.reps!=null))return{date:d,sets:v.sets};
 }
 return null;
}
function repRangeTop(repText){const m=String(repText).match(/(\d+)\D*$/);return m?+m[1]:null}
function progressionHint(k,x,i,date){
 const prev=previousExerciseSets(k,i,date);if(!prev)return'First logged session — choose a manageable load and leave 1–3 reps in reserve.';
 const done=prev.sets.filter(s=>s.done),top=repRangeTop(x.reps);
 if(done.length && top && done.every(s=>(+s.reps||0)>=top && (+s.rir||0)>=1))return'Previous session reached the top of the rep range. Consider a small load increase today.';
 return`Previous: ${fmtDate(prev.date)} · ${done.length||prev.sets.length} sets logged. Aim to add a rep, improve control, or repeat with better form.`;
}
function exerciseInstructions(name){
 const primary=demoMap[name]?.[1]||'Use controlled form through a comfortable range.';
 return [primary,'Brace your core and keep the movement controlled.','Use a load that lets you finish the prescribed reps with good form.','Stop the set if technique breaks down or you feel sharp pain.'];
}
function exerciseSubtag(name){const c=exerciseCategory(name);return c==='Abs/Core'?'Core':c}
function setWorkoutExercise(k,i){state.workoutExerciseIndex=state.workoutExerciseIndex||{A:0,B:0,C:0};state.workoutExerciseIndex[k]=i;state.workoutSetsOpen[k]=false;save();renderWorkouts()}
function shiftWorkoutExercise(k,dir){const a=state.workouts[k]||[],i=Math.max(0,Math.min(a.length-1,(state.workoutExerciseIndex?.[k]||0)+dir));setWorkoutExercise(k,i)}
function toggleWorkoutSets(k){state.workoutSetsOpen[k]=!state.workoutSetsOpen[k];save();renderWorkouts()}
function renderWorkouts(){
 const k=state.uiWorkout||'A',ex=state.workouts[k]||[],log=logFor(selectedDate);state.workoutExerciseIndex=state.workoutExerciseIndex||{A:0,B:0,C:0};state.workoutSetsOpen=state.workoutSetsOpen||{A:false,B:false,C:false};
 const idx=Math.max(0,Math.min(ex.length-1,state.workoutExerciseIndex[k]||0));state.workoutExerciseIndex[k]=idx;const x=ex[idx];
 const buttons=['A','B','C'].map(v=>`<button class="${k===v?'active':''}" onclick="state.uiWorkout='${v}';state.workoutSetsOpen[v]=false;renderWorkouts()">Workout ${v}</button>`).join('');
 if(!x){$('#view-workouts').innerHTML=`<div class="page-head"><h2>Workout</h2><button class="programme-btn" onclick="openWorkoutEditor('${k}')">⚙ Programme</button></div><div class="concept-tabs workout-tabs">${buttons}</div><div class="empty">No exercises in Workout ${k}.</div>`;return}
 const cat=exerciseCategory(x.exercise),inst=exerciseInstructions(x.exercise),key=`${k}-${idx}`,v=log.workoutLog?.[key]||{},sets=Array.from({length:+x.sets||3},(_,si)=>v.sets?.[si]||{}),rest=x.rest??defaultRestSeconds(x.exercise);
 const setTable=state.workoutSetsOpen[k]?`<div class="concept-set-table"><div><span>Set</span><span>Load kg</span><span>Reps</span><span>RIR</span><span>Done</span></div>${sets.map((sv,si)=>`<div><b>${si+1}</b><input inputmode="decimal" type="number" step="0.5" id="load-${key}-${si}" value="${sv.load??''}" placeholder="kg"><input inputmode="numeric" type="number" id="reps-${key}-${si}" value="${sv.reps??''}" placeholder="${esc(x.reps)}"><select id="rir-${key}-${si}"><option value=""></option>${[0,1,2,3,4].map(n=>`<option value="${n}" ${String(sv.rir)===String(n)?'selected':''}>${n}</option>`).join('')}</select><input class="set-check" type="checkbox" id="done-${key}-${si}" ${sv.done?'checked':''}></div>`).join('')}</div><div class="set-actions"><button class="secondary" onclick="copyPrevious('${k}',${idx})">Copy previous</button><button class="primary" onclick="saveExerciseSets('${key}',${x.sets})">Save sets</button></div>`:'';
 $('#view-workouts').innerHTML=`<div class="page-head"><h2>Workout</h2><button class="programme-btn" onclick="openWorkoutEditor('${k}')">⚙ Programme</button></div><div class="concept-tabs workout-tabs">${buttons}</div>
 <div class="exercise-focus-card"><div class="focus-title"><div><h3>${esc(x.exercise)}</h3><div class="tag-row"><span>${esc(cat.replace('/Core',''))}</span><span>${esc(exerciseSubtag(x.exercise))}</span></div></div><span class="gif-chip">GIF</span></div><div class="focus-media">${exerciseVisual(x.exercise,'focus-gif')}<button class="exercise-arrow left" onclick="shiftWorkoutExercise('${k}',-1)">‹</button><button class="exercise-arrow right" onclick="shiftWorkoutExercise('${k}',1)">›</button></div><ul class="instruction-list">${inst.map(y=>`<li>${esc(y)}</li>`).join('')}</ul><div class="exercise-rx"><div><span>Sets</span><b>${x.sets}</b></div><div><span>Reps</span><b>${esc(x.reps)}</b></div><div><span>Rest</span><b>${rest}s</b></div></div><button class="primary full log-set-btn" onclick="toggleWorkoutSets('${k}')">${state.workoutSetsOpen[k]?'Hide Set Log':'Log Sets'}</button>${setTable}<button class="view-exercises-btn" onclick="document.querySelector('#exerciseStrip')?.scrollIntoView({behavior:'smooth'})">⌕ View all exercises (${ex.length}) ›</button></div>
 <div id="exerciseStrip" class="exercise-strip">${ex.map((e,i)=>`<button class="${i===idx?'active':''}" onclick="setWorkoutExercise('${k}',${i})">${exerciseVisual(e.exercise,'strip-gif')}<span>${i+1}. ${esc(e.exercise)}</span></button>`).join('')}</div>
 <div class="workout-bottom-actions"><button class="secondary" onclick="openExerciseLibrary('${k}')">＋ Add exercise</button><button class="primary" onclick="completeWorkout('${k}')">Mark Workout ${k} complete</button></div>`;
}
function exerciseHtml(k,x,i,log){return''}
function openWorkoutEditor(k){state.editWorkout=k;renderWorkoutEditor();$('#workoutEditorDialog').showModal()}
function renderWorkoutEditor(){
 const k=state.editWorkout||state.uiWorkout||'A',items=state.workouts[k]||[];
 $('#workoutEditorBody').innerHTML=`<div class="dialog-head"><button class="text-btn" onclick="$('#workoutEditorDialog').close()">Cancel</button><h3>Edit Workout ${k}</h3><button class="text-btn strong" onclick="$('#workoutEditorDialog').close();renderWorkouts()">Save</button></div><div class="editor-list concept-editor">${items.map((x,i)=>`<div class="editor-row"><div class="editor-row-head"><span class="drag-dots">⋮⋮</span>${exerciseVisual(x.exercise,'editor-gif')}<div><b>${i+1}. ${esc(x.exercise)}</b><div class="tag-row"><span>${esc(exerciseCategory(x.exercise).replace('/Core',''))}</span></div></div></div><div class="editor-fields three"><label>Sets<input id="edit-sets-${i}" type="number" min="1" max="8" value="${x.sets}"></label><label>Reps<input id="edit-reps-${i}" value="${esc(x.reps)}"></label><label>Rest (sec)<input id="edit-rest-${i}" type="number" min="15" max="300" step="15" value="${x.rest??defaultRestSeconds(x.exercise)}"></label></div><label>Notes<input id="edit-note-${i}" value="${esc(x.note||'')}"></label><div class="editor-actions"><button class="ghost compact" ${i===0?'disabled':''} onclick="moveWorkoutExercise('${k}',${i},-1)">↑ Up</button><button class="ghost compact" ${i===items.length-1?'disabled':''} onclick="moveWorkoutExercise('${k}',${i},1)">↓ Down</button><button class="secondary compact" onclick="saveWorkoutExerciseEdit('${k}',${i})">Save</button><button class="ghost compact danger-text" onclick="deleteWorkoutExercise('${k}',${i})">Remove</button></div></div>`).join('')}</div><button class="primary full" onclick="$('#workoutEditorDialog').close();openExerciseLibrary('${k}')">＋ Add exercise</button>`;
}
function saveWorkoutExerciseEdit(k,i){const x=state.workouts[k]?.[i];if(!x)return;x.sets=Math.max(1,+$(`#edit-sets-${i}`).value||x.sets);x.reps=$(`#edit-reps-${i}`).value.trim()||x.reps;x.rest=Math.max(15,+$(`#edit-rest-${i}`).value||x.rest||defaultRestSeconds(x.exercise));x.note=$(`#edit-note-${i}`).value.trim();save();renderWorkoutEditor();renderWorkouts();toast('Workout updated')}
function moveWorkoutExercise(k,i,dir){const a=state.workouts[k]||[],j=i+dir;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];state.workoutExerciseIndex[k]=j;save();renderWorkoutEditor();renderWorkouts()}
function deleteWorkoutExercise(k,i){const x=state.workouts[k]?.[i];if(!x)return;if(confirm(`Remove ${x.exercise} from Workout ${k}? Past logged sessions will be kept.`)){state.workouts[k].splice(i,1);state.workoutExerciseIndex[k]=Math.max(0,Math.min(state.workouts[k].length-1,state.workoutExerciseIndex[k]||0));save();renderWorkoutEditor();renderWorkouts();toast('Exercise removed')}}
function openExerciseLibrary(k){state.libraryWorkout=k;state.libraryCategory='All';state.librarySearch='';renderExerciseLibraryDialog();$('#exerciseLibraryDialog').showModal()}
function renderExerciseLibraryDialog(){
 const k=state.libraryWorkout||state.uiWorkout||'A',cat=state.libraryCategory||'All',cats=['All','Chest','Back','Legs','Shoulders','Biceps','Triceps','Abs/Core'],q=(state.librarySearch||'').toLowerCase();
 const items=(state.exerciseLibrary||[]).filter(x=>(cat==='All'||x.category===cat)&&(!q||x.exercise.toLowerCase().includes(q)));
 $('#exerciseLibraryBody').innerHTML=`<div class="dialog-head"><button class="text-btn" onclick="$('#exerciseLibraryDialog').close()">Close</button><h3>Exercise Library</h3><span></span></div><div class="search-shell">⌕ <input id="exerciseSearch" type="search" placeholder="Search exercises..." value="${esc(state.librarySearch||'')}"></div><div class="library-categories concept-lib-tabs">${cats.map(c=>`<button class="${c===cat?'active':''}" onclick="state.libraryCategory='${c}';renderExerciseLibraryDialog()">${c==='Abs/Core'?'Core':c}</button>`).join('')}</div><div class="exercise-library-grid concept-library">${items.map(x=>`<article class="library-card">${exerciseVisual(x.exercise,'library-exercise-img')}<div class="library-card-body"><span class="gif-mini">GIF</span><h4>${esc(x.exercise)}</h4><small>${esc(x.category.replace('/Core',''))}</small><button class="primary compact full" onclick="addWorkoutExercise('${k}','${encodeURIComponent(x.exercise)}')">Add</button></div></article>`).join('')||'<div class="empty">No matching exercise.</div>'}</div>`;
 const inp=$('#exerciseSearch');if(inp)inp.oninput=e=>{state.librarySearch=e.target.value;renderExerciseLibraryDialog();requestAnimationFrame(()=>{$('#exerciseSearch')?.focus()})};
}
function addWorkoutExercise(k,encoded){
 const name=decodeURIComponent(encoded),src=(state.exerciseLibrary||[]).find(x=>x.exercise===name);if(!src)return;
 if((state.workouts[k]||[]).some(x=>x.exercise===name)){toast('Already in this workout');return}
 state.workouts[k].push({exercise:src.exercise,sets:src.sets,reps:src.reps,rest:src.rest??defaultRestSeconds(src.exercise),note:`${src.category} · ${src.equipment}`,userAdded:true});
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
function filterEntriesByDays(days){const all=Object.entries(state.logs).sort(([a],[b])=>a.localeCompare(b));if(!days||days>=365)return all;const end=dateObj(selectedDate),cut=new Date(end);cut.setDate(cut.getDate()-days+1);return all.filter(([d])=>dateObj(d)>=cut&&dateObj(d)<=end)}
function avgWaterForWeek(week){const vals=week.map(d=>+state.logs[d]?.waterMl||0).filter(v=>v>0);return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0}
function renderProgress(){
 const allEntries=Object.entries(state.logs).sort(([a],[b])=>a.localeCompare(b)),range=state.progressChartRange||30,entries=filterEntriesByDays(range),weigh=allEntries.filter(([,x])=>x.weight!=null),latest=latestValue('weight'),goal=state.settings.goalWeight,start=state.settings.startWeight,week=weekDates(selectedDate);
 let kcal=0,prot=0,n=0;week.forEach(d=>{const l=state.logs[d];if(l?.meals?.length){const t=totals(l);kcal+=t.kcal;prot+=t.protein;n++}});const avgSleep=(()=>{const sv=week.map(d=>state.logs[d]?.sleep).filter(v=>v!=null);return sv.length?sleepText(sv.reduce((a,b)=>a+b,0)/sv.length):'—'})(),water=avgWaterForWeek(week),w=weeklyWorkoutCount(week);
 state.progressRange=state.progressRange||28;const ws=workoutStats(state.progressRange);
 $('#view-progress').innerHTML=`<div class="page-head"><h2>Progress</h2><button class="bell-mini" onclick="openReminderDialog()">♧</button></div><div class="range-tabs concept-time-tabs">${[[7,'1W'],[30,'1M'],[90,'3M'],[180,'6M'],[365,'1Y']].map(([d,l])=>`<button class="${range===d?'active':''}" onclick="state.progressChartRange=${d};save();renderProgress()">${l}</button>`).join('')}</div>
 <div class="progress-main-card"><div class="weight-card-head"><div class="weight-icon">▣</div><div><span>Weight</span><b>${latest==null?'—':(+latest).toFixed(1)+' kg'}</b></div><div class="weight-change">${latest==null?'—':((latest-start)>=0?'+':'')+(latest-start).toFixed(1)+' kg'}<small>from start</small></div></div><div class="canvas-wrap concept-weight-chart"><canvas id="weightChart" width="760" height="300"></canvas></div></div>
 <div class="progress-main-card"><div class="card-title-row"><b>Body Measurements (cm)</b><span>${entries.length?'trend':'no data'}</span></div><div class="measurement-legend"><span class="waist">● Waist</span><span class="chest">● Chest</span><span class="arm">● Arm</span><span class="thigh">● Thigh</span></div><div class="canvas-wrap concept-body-chart"><canvas id="bodyChart" width="760" height="300"></canvas></div><div class="body-metrics compact">${['waist','chest','arm','thigh'].map(f=>metricCard(f)).join('')}</div></div>
 <div class="progress-main-card linked-summary"><div class="card-title-row"><div><b>Recovery & Nutrition</b><small>Linked context for weight and training</small></div></div><div class="linked-grid"><div><span>Avg sleep</span><b>${avgSleep}</b></div><div><span>Workouts</span><b>${w}/3</b></div><div><span>Avg kcal</span><b>${n?Math.round(kcal/n):'—'}</b></div><div><span>Avg protein</span><b>${n?Math.round(prot/n)+' g':'—'}</b></div><div><span>Avg water</span><b>${water?waterText(water):'—'}</b></div><div><span>Goal remaining</span><b>${latest==null?'—':Math.max(0,goal-latest).toFixed(1)+' kg'}</b></div></div></div>
 <div class="progress-main-card"><div class="card-title-row"><div><b>Training Balance</b><small>Completed sets by muscle group</small></div><div class="range-tabs compact-ranges">${[[7,'1 week'],[14,'2 weeks'],[28,'4 weeks']].map(([d,l])=>`<button class="${state.progressRange===d?'active':''}" onclick="state.progressRange=${d};save();renderProgress()">${l}</button>`).join('')}</div></div><div class="muscle-progress concept-muscles">${Object.entries(ws.groups).map(([g,x])=>{const pc=ws.totalSets?Math.round(x.sets/ws.totalSets*100):0;return`<div class="muscle-progress-row"><span>${g.replace('/Core','')}</span><b>${pc}%</b><div class="muscle-track"><i style="width:${Math.max(pc,x.sets?4:0)}%"></i></div></div>`}).join('')}</div><div class="volume-summary"><div><span>Completed sets</span><b>${ws.totalSets}</b></div><div><span>Training volume</span><b>${(ws.totalVolume/1000).toFixed(1)} t</b></div></div></div>
 <div class="progress-main-card"><div class="card-title-row"><div><b>Weekly calorie intake</b><small>Average calories on logged meal days</small></div><span>${n?Math.round(kcal/n)+' kcal':'No data'}</span></div><div class="canvas-wrap nutrition-chart-wrap"><canvas id="calorieChart" width="760" height="320"></canvas></div></div>
 <div class="progress-main-card"><div class="card-title-row"><b>Meal photos</b></div><div id="photoGallery" class="photo-gallery"><div class="empty">Loading photos…</div></div></div>`;
 requestAnimationFrame(()=>{drawWeightChart();drawCalorieChart();drawBodyChart();renderPhotoGallery()})
}
function metricCard(f){const label={waist:'Waist',chest:'Chest',arm:'Upper arm',thigh:'Thigh'}[f],v=latestValue(f);return`<div class="body-metric"><span class="muted">${label}</span><b>${v==null?'—':v.toFixed(1)}</b><span class="muted">cm</span></div>`}
function drawWeightChart(){
 const c=$('#weightChart');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height,pL=42,pR=22,pT=24,pB=42,weights=filterEntriesByDays(state.progressChartRange||30).filter(([,x])=>x.weight!=null);
 ctx.clearRect(0,0,W,H);const startWeight=state.settings.startWeight,goal=state.settings.goalWeight;if(!weights.length){ctx.fillStyle='#7b8790';ctx.font='16px -apple-system';ctx.fillText('No weight entries in this range.',30,80);return}
 const dates=weights.map(([d])=>dateObj(d)),startD=dates[0],endD=dates[dates.length-1],span=Math.max(86400000,endD-startD),vals=weights.map(([,l])=>+l.weight),min=Math.floor(Math.min(startWeight,...vals)-1),max=Math.ceil(Math.max(goal,...vals)+1),x=d=>pL+((dateObj(d)-startD)/span)*(W-pL-pR),y=v=>H-pB-((v-min)/(max-min))*(H-pT-pB);
 ctx.font='12px -apple-system';for(let v=min;v<=max;v++){ctx.strokeStyle='#e8edf3';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pL,y(v));ctx.lineTo(W-pR,y(v));ctx.stroke();ctx.fillStyle='#788797';ctx.fillText(v,8,y(v)+4)}
 ctx.strokeStyle='#9fb8d2';ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(pL,y(startWeight));ctx.lineTo(W-pR,y(goal));ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle='#0a73ff';ctx.lineWidth=4;ctx.beginPath();weights.forEach(([d,l],i)=>i?ctx.lineTo(x(d),y(l.weight)):ctx.moveTo(x(d),y(l.weight)));ctx.stroke();weights.forEach(([d,l])=>{ctx.fillStyle='#fff';ctx.strokeStyle='#0a73ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x(d),y(l.weight),6,0,Math.PI*2);ctx.fill();ctx.stroke()});
 const ticks=[weights[0],weights[Math.floor((weights.length-1)/2)],weights[weights.length-1]].filter(Boolean);ctx.fillStyle='#71808d';ctx.font='11px -apple-system';[...new Map(ticks.map(x=>[x[0],x])).values()].forEach(([d])=>ctx.fillText(fmtDate(d,{day:'numeric',month:'short'}),Math.max(4,x(d)-20),H-13));
}
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

function drawBodyChart(){
 const c=$('#bodyChart');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height,pL=44,pR=22,pT=26,pB=42,fields=['waist','chest','arm','thigh'],colors=['#1677ff','#20b978','#f29a2e','#8b62df'],entries=filterEntriesByDays(state.progressChartRange||30),vals=[];entries.forEach(([,l])=>fields.forEach(f=>{if(l[f]!=null)vals.push(+l[f])}));ctx.clearRect(0,0,W,H);if(!vals.length){ctx.fillStyle='#7b8790';ctx.font='16px -apple-system';ctx.fillText('Add body measurements to see trends.',30,80);return}
 const dated=entries.filter(([,l])=>fields.some(f=>l[f]!=null)),start=dateObj(dated[0][0]),end=dateObj(dated[dated.length-1][0]),span=Math.max(86400000,end-start),min=Math.floor(Math.min(...vals)-3),max=Math.ceil(Math.max(...vals)+3),x=d=>pL+((dateObj(d)-start)/span)*(W-pL-pR),y=v=>H-pB-((v-min)/(max-min))*(H-pT-pB);
 for(let v=Math.ceil(min/10)*10;v<=max;v+=10){ctx.strokeStyle='#edf1f5';ctx.beginPath();ctx.moveTo(pL,y(v));ctx.lineTo(W-pR,y(v));ctx.stroke();ctx.fillStyle='#8090a0';ctx.font='11px -apple-system';ctx.fillText(v,10,y(v)+4)}
 fields.forEach((f,fi)=>{const pts=entries.filter(([,l])=>l[f]!=null);if(!pts.length)return;ctx.strokeStyle=colors[fi];ctx.lineWidth=3;ctx.beginPath();pts.forEach(([d,l],i)=>i?ctx.lineTo(x(d),y(l[f])):ctx.moveTo(x(d),y(l[f])));ctx.stroke();pts.forEach(([d,l])=>{ctx.fillStyle='#fff';ctx.strokeStyle=colors[fi];ctx.lineWidth=2;ctx.beginPath();ctx.arc(x(d),y(l[f]),4,0,Math.PI*2);ctx.fill();ctx.stroke()})});
}
function renderSettings(){const s=state.settings;$('#view-settings').innerHTML=`<div class="page-head"><h2>More</h2><span class="version-chip">V2.1</span></div><div class="concept-card"><div class="card-title-row"><div><b>Targets</b><small>Your current programme settings</small></div></div><div class="two-col"><label>Starting weight<input id="setStart" type="number" step="0.1" value="${s.startWeight}"></label><label>Goal weight<input id="setGoal" type="number" step="0.1" value="${s.goalWeight}"></label><label>Protein target (g)<input id="setProtein" type="number" value="${s.proteinTarget}"></label><label>Water target (ml)<input id="setWaterTarget" type="number" step="250" value="${s.waterTarget||3000}"></label><label>Programme start<input id="setDate" type="date" value="${state.startDate}"></label></div><button class="primary full" onclick="saveSettings()">Save targets</button></div><div class="concept-card"><div class="card-title-row"><div><b>Reminders</b><small>Meals, training and weigh-ins</small></div><button class="link-btn" onclick="openReminderDialog()">Configure</button></div><button class="secondary full" onclick="requestNotifications()">Enable notifications</button></div><div class="concept-card"><div class="card-title-row"><div><b>Backup & restore</b><small>Includes logs, settings, custom foods and meal photos</small></div></div><div class="actions"><button class="primary" onclick="exportBackup()">Export backup</button><label class="secondary" style="text-align:center;cursor:pointer">Import backup<input type="file" accept="application/json" hidden onchange="importBackup(this.files[0])"></label></div></div><div class="concept-card"><b>About V2.1</b><p class="muted">Concept UI edition: the interface now matches the approved design direction while keeping the same local data store, meal-photo database, editable workouts, animated exercise demos, hour + minute sleep entry, water tracking and connected progress analytics.</p><p class="footer-note">Build ${BUILD}. Your existing data remains in the same <code>${STORE}</code> storage identity.</p></div><div class="concept-card"><button class="secondary danger full" onclick="resetApp()">Reset app data</button></div>`}
function saveSettings(){state.settings.startWeight=+$('#setStart').value;state.settings.goalWeight=+$('#setGoal').value;state.settings.proteinTarget=+$('#setProtein').value;state.settings.waterTarget=Math.max(500,+$('#setWaterTarget').value||3000);state.startDate=$('#setDate').value;save();renderAll();toast('Targets saved')}
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
async function exportBackup(){const photos=await allPhotoRecords(),encoded={};for(const[id,b]of Object.entries(photos))encoded[id]=await blobToDataURL(b);const pack={app:'Lean Mass Tracker',version:VERSION,exportedAt:new Date().toISOString(),state,photos:encoded},blob=new Blob([JSON.stringify(pack)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`lean-mass-v2-backup-${isoToday()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);toast('Backup exported')}
function importBackup(file){if(!file)return;const r=new FileReader();r.onload=async()=>{try{const pack=JSON.parse(r.result);state=pack.state||pack;migrate();if(pack.photos)for(const[id,data]of Object.entries(pack.photos))await putPhoto(id,dataURLToBlob(data));save();renderAll();toast('Backup restored')}catch(e){alert('That backup could not be restored.')}};r.readAsText(file)}
function resetApp(){if(confirm('Reset all app data back to the starter tracker?')){localStorage.removeItem(STORE);indexedDB.deleteDatabase(PHOTO_DB);location.reload()}}

window.openMeal=openMeal;window.deleteMeal=deleteMeal;window.saveCheckin=saveCheckin;window.quickMass=quickMass;window.addWater=addWater;window.setWater=setWater;window.openCheckin=openCheckin;window.shiftCheckinDate=shiftCheckinDate;window.showView=showView;window.shiftWeek=shiftWeek;window.renderMeals=renderMeals;window.mealsTab=mealsTab;window.mealLibraryMode=mealLibraryMode;window.toggleFavoriteName=toggleFavoriteName;window.addCustomMeal=addCustomMeal;window.renderWorkouts=renderWorkouts;window.setWorkoutExercise=setWorkoutExercise;window.shiftWorkoutExercise=shiftWorkoutExercise;window.toggleWorkoutSets=toggleWorkoutSets;window.renderProgress=renderProgress;window.openWorkoutEditor=openWorkoutEditor;window.renderWorkoutEditor=renderWorkoutEditor;window.saveWorkoutExerciseEdit=saveWorkoutExerciseEdit;window.moveWorkoutExercise=moveWorkoutExercise;window.deleteWorkoutExercise=deleteWorkoutExercise;window.openExerciseLibrary=openExerciseLibrary;window.renderExerciseLibraryDialog=renderExerciseLibraryDialog;window.addWorkoutExercise=addWorkoutExercise;window.removeWorkoutExercise=removeWorkoutExercise;window.openDemo=openDemo;window.saveExerciseSets=saveExerciseSets;window.copyPrevious=copyPrevious;window.completeWorkout=completeWorkout;window.saveSettings=saveSettings;window.openReminderDialog=openReminderDialog;window.updateReminder=updateReminder;window.requestNotifications=requestNotifications;window.testNotification=testNotification;window.openMealPhoto=openMealPhoto;window.exportBackup=exportBackup;window.importBackup=importBackup;window.resetApp=resetApp;
boot();
