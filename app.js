const STORE='leanMassTrackerV1';
let seed, state, selectedDate=isoToday(), mealFilter='';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function isoToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function fmtDate(s){return new Date(s+'T12:00:00').toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'})}
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
function targetForDate(date){const start=new Date(state.startDate+'T12:00:00'), d=new Date(date+'T12:00:00'); const week=Math.max(1,Math.min(12,Math.floor((d-start)/604800000)+1)); let kcal=week<=2?2500:week<=4?2600:week<=8?2650:2700; return {week,kcal,protein:state.settings.proteinTarget||105}}
function logFor(date){if(!state.logs[date]) state.logs[date]={meals:[],weight:null,waist:null,sleep:null,energy:'',training:'No',workout:'Rest',workoutLog:{}}; return state.logs[date]}
function totals(log){return log.meals.reduce((a,m)=>({kcal:a.kcal+(+m.kcal||0),protein:a.protein+(+m.protein||0)}),{kcal:0,protein:0})}
function pct(v,t){return Math.max(0,Math.min(100,Math.round((v/t)*100)||0))}

async function boot(){
 seed=await fetch('seed-data.json').then(r=>r.json());
 const stored=localStorage.getItem(STORE);
 if(stored){state=JSON.parse(stored)}else{
   state={version:1,startDate:'2026-08-14',settings:{...seed.setup,proteinTarget:seed.setup.proteinTarget},meals:seed.meals,workouts:seed.workouts,logs:{},customMeals:[]};
   for(const [date,x] of Object.entries(seed.historical)) state.logs[date]={meals:x.meals||[],weight:x.weight,waist:x.waist,sleep:x.sleep,energy:x.energy,training:x.training,workout:x.workout,workoutLog:{}};
   save();
 }
 setupNav(); setupDialog(); renderAll();
 if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
}

function setupNav(){
 $$('.bottom-nav button').forEach(b=>b.onclick=()=>showView(b.dataset.view));
 $('#todayBtn').onclick=()=>{selectedDate=isoToday();showView('today')};
}
function showView(name){$$('.view').forEach(v=>v.classList.remove('active')); $(`#view-${name}`).classList.add('active'); $$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===name)); renderAll()}

function renderAll(){renderToday();renderMeals();renderWorkouts();renderProgress();renderSettings()}

function renderToday(){
 const log=logFor(selectedDate), t=targetForDate(selectedDate), sum=totals(log);
 const weight=latestValue('weight'), gain=weight==null?0:weight-state.settings.startWeight;
 let mealHtml=log.meals.length?log.meals.map((m,i)=>`<div class="meal-row row between"><div><span class="pill">${esc(m.slot)}</span><strong>${esc(m.name)}</strong><span class="muted">${Math.round(m.kcal)} kcal · ${(+m.protein).toFixed((+m.protein)%1?1:0)} g protein</span></div><button class="ghost tiny" onclick="deleteMeal('${selectedDate}',${i})">Delete</button></div>`).join(''):`<div class="empty">No meals logged yet.</div>`;
 const status=sum.kcal>=t.kcal*.9&&sum.protein>=t.protein?'On track':sum.kcal>t.kcal*1.15?'Above calorie target':'Building';
 $('#view-today').innerHTML=`
 <div class="card hero"><div class="row between"><div><div class="eyebrow">WEEK ${t.week} · ${fmtDate(selectedDate)}</div><h2>${status}</h2><div class="muted">Goal: ${state.settings.startWeight} → ${state.settings.goalWeight} kg</div></div><div class="right"><div style="font-size:28px;font-weight:800">${weight==null?'—':(+weight).toFixed(1)} kg</div><div class="muted">${gain>0?'+':''}${gain.toFixed(1)} kg</div></div></div></div>
 <div class="kpis"><div class="kpi"><span class="muted">Calories</span><div class="big">${Math.round(sum.kcal)}</div><div class="muted">of ${t.kcal} kcal</div><div class="progress"><i style="width:${pct(sum.kcal,t.kcal)}%"></i></div></div><div class="kpi"><span class="muted">Protein</span><div class="big">${Math.round(sum.protein)}g</div><div class="muted">of ${t.protein} g</div><div class="progress"><i style="width:${pct(sum.protein,t.protein)}%"></i></div></div></div>
 <div class="card"><div class="section-title"><div><span class="muted">Selected day</span><h2>${fmtDate(selectedDate)}</h2></div><input id="datePick" type="date" value="${selectedDate}" style="width:auto;margin:0"></div><div class="quick-grid"><button class="quick" onclick="openMeal('Breakfast')"><strong>+ Breakfast</strong><span class="muted">Log meal</span></button><button class="quick" onclick="openMeal('Snack 1')"><strong>+ Snack</strong><span class="muted">Log snack</span></button><button class="quick" onclick="openMeal('Lunch')"><strong>+ Lunch</strong><span class="muted">Log meal</span></button><button class="quick" onclick="openMeal('Dinner')"><strong>+ Dinner</strong><span class="muted">Log meal</span></button></div></div>
 <div class="card"><div class="row between"><h3>Meals</h3><button class="ghost" onclick="openMeal('Other')">+ Add</button></div>${mealHtml}<div class="metricline"><span>Total</span><b>${Math.round(sum.kcal)} kcal · ${Math.round(sum.protein)} g</b></div></div>
 <div class="card"><h3>Daily check-in</h3><div class="two-col"><label>Weight (kg)<input id="todayWeight" type="number" step="0.1" value="${log.weight??''}"></label><label>Waist (cm)<input id="todayWaist" type="number" step="0.1" value="${log.waist??''}"></label><label>Sleep (hours)<input id="todaySleep" type="number" step="0.1" value="${log.sleep??''}"></label><label>Energy<select id="todayEnergy"><option></option>${['Low','Moderate','Good','High'].map(x=>`<option ${log.energy===x?'selected':''}>${x}</option>`).join('')}</select></label></div><button class="primary" onclick="saveCheckin()">Save check-in</button></div>
 <div class="card workout-card"><span class="muted">Workout</span><h3>${workoutSuggestion(selectedDate)}</h3><div class="muted">Target is 3 resistance sessions/week. Friday evening and Sunday are make-up days, not extra compulsory sessions.</div><div class="actions"><button class="primary" onclick="showView('workouts')">Open workouts</button></div></div>`;
 $('#datePick').onchange=e=>{selectedDate=e.target.value;renderAll()};
}

function workoutSuggestion(date){
 const d=new Date(date+'T12:00:00').getDay();
 return ({1:'Workout A · preferred',3:'Workout B · preferred',6:'Workout C · preferred',5:'Make-up option · A or C',0:'Make-up option · B or C'}[d]||'Recovery / rest day');
}
function saveCheckin(){const l=logFor(selectedDate); l.weight=numOrNull($('#todayWeight').value);l.waist=numOrNull($('#todayWaist').value);l.sleep=numOrNull($('#todaySleep').value);l.energy=$('#todayEnergy').value;save();renderAll()}
function numOrNull(x){return x===''?null:+x}

function setupDialog(){
 $('#mealSearch').oninput=()=>populateMealSelect($('#mealSearch').value);
 $('#mealSelect').onchange=syncMealFields;
 $('#saveMeal').onclick=()=>{const sel=$('#mealSelect').value; const name=sel==='__manual__'?($('#mealNotes').value||'Custom / manual meal'):sel; const item=allMeals().find(m=>m.name===sel); const kcal=+$(`#mealKcal`).value||0, protein=+$(`#mealProtein`).value||0; logFor(selectedDate).meals.push({slot:$('#mealSlot').value,name,kcal,protein,notes:$('#mealNotes').value});save();$('#mealDialog').close();renderAll()}
}
function allMeals(){return [...state.meals,...(state.customMeals||[])]}
function openMeal(slot='Other'){ $('#mealSlot').value=slot;$('#mealSearch').value='';populateMealSelect('');$('#mealNotes').value=''; $('#mealDialog').showModal(); syncMealFields()}
function populateMealSelect(q=''){const list=allMeals().filter(m=>m.name.toLowerCase().includes(q.toLowerCase())).slice(0,120);$('#mealSelect').innerHTML=list.map(m=>`<option value="${esc(m.name)}">${esc(m.name)} · ${Math.round(m.kcal)} kcal / ${m.protein}g</option>`).join('')+`<option value="__manual__">Other / manual entry</option>`;syncMealFields()}
function syncMealFields(){const v=$('#mealSelect').value,m=allMeals().find(x=>x.name===v);$('#mealKcal').value=m?m.kcal:'';$('#mealProtein').value=m?m.protein:'';if(m&&m.notes)$('#mealNotes').placeholder=m.notes;else $('#mealNotes').placeholder='optional'}
function deleteMeal(date,i){logFor(date).meals.splice(i,1);save();renderAll()}

function renderMeals(){
 $('#view-meals').innerHTML=`<div class="section-title"><div><span class="muted">From your Excel tracker</span><h2>Meal database</h2></div><span class="pill">${allMeals().length} items</span></div><div class="card"><label>Search foods<input id="dbSearch" type="search" placeholder="rice, yam, yoghurt, Serious Mass…"></label><div id="dbList"></div></div><div class="card"><h3>Add your own food</h3><div class="two-col"><label>Name<input id="customName"></label><label>Calories<input id="customKcal" type="number"></label><label>Protein (g)<input id="customProtein" type="number" step="0.5"></label><label>Notes<input id="customNotes"></label></div><button class="primary" onclick="addCustomMeal()">Save food</button></div>`;
 const renderList=()=>{const q=$('#dbSearch').value.toLowerCase();const items=allMeals().filter(m=>m.name.toLowerCase().includes(q)).slice(0,50);$('#dbList').innerHTML=items.map(m=>`<div class="meal-row"><strong>${esc(m.name)}</strong><span class="muted">${Math.round(m.kcal)} kcal · ${m.protein} g protein</span>${m.notes?`<div class="tiny muted">${esc(m.notes)}</div>`:''}</div>`).join('')||'<div class="empty">No match</div>'};
 $('#dbSearch').oninput=renderList;renderList();
}
function addCustomMeal(){const name=$('#customName').value.trim();if(!name)return;state.customMeals.push({name,kcal:+$('#customKcal').value||0,protein:+$('#customProtein').value||0,notes:$('#customNotes').value||'Custom'});save();renderMeals()}

function renderWorkouts(){
 const buttons=['A','B','C'].map(k=>`<button class="chip ${state.uiWorkout===k||(!state.uiWorkout&&k==='A')?'active':''}" onclick="state.uiWorkout='${k}';renderWorkouts()">Workout ${k}</button>`).join(''); const k=state.uiWorkout||'A'; const flex=seed.flex[k]; const ex=state.workouts[k]; const log=logFor(selectedDate);
 $('#view-workouts').innerHTML=`<div class="section-title"><div><span class="muted">Home programme</span><h2>Workouts</h2></div><span class="pill">3 sessions/week</span></div><div class="notice success"><b>Flexible schedule:</b> Workout ${k} prefers ${flex.preferred}; alternative: ${flex.alternative}. Friday/Sunday are make-up slots when work fatigue causes a miss.</div><div class="tabbar">${buttons}</div><div class="card"><div class="row between"><div><span class="muted">${fmtDate(selectedDate)}</span><h3>Workout ${k}</h3></div><button class="ghost" onclick="selectedDate=isoToday();renderAll()">Use today</button></div>${ex.map((x,i)=>exerciseHtml(k,x,i,log)).join('')}<div class="actions"><button class="primary" onclick="completeWorkout('${k}')">Mark Workout ${k} complete</button></div></div><div class="notice">Use controlled technique and stop most sets with about 1–3 good repetitions still possible. For barbell bench press, use a spotter/safety arrangement when available and avoid grinding failed reps alone.</div>`;
}
function exerciseHtml(k,x,i,log){const key=`${k}-${i}`,v=log.workoutLog?.[key]||{};return `<div class="exercise-row"><div class="row between"><div><strong>${esc(x.exercise)}</strong><div class="muted">${x.sets} sets · ${esc(x.reps)}</div></div><span class="pill">${x.sets}×</span></div>${x.note?`<div class="tiny muted">${esc(x.note)}</div>`:''}<div class="set-grid"><label>Load (kg)<input type="number" step="0.5" id="load-${key}" value="${v.load??''}"></label><label>Last reps<input type="number" id="reps-${key}" value="${v.reps??''}"></label><button class="ghost" onclick="saveExercise('${key}')">Save</button></div></div>`}
function saveExercise(key){const l=logFor(selectedDate);l.workoutLog=l.workoutLog||{};l.workoutLog[key]={load:numOrNull($(`#load-${key}`).value),reps:numOrNull($(`#reps-${key}`).value)};save()}
function completeWorkout(k){const l=logFor(selectedDate);l.training='Yes';l.workout=k;save();renderAll()}

function renderProgress(){
 const entries=Object.entries(state.logs).sort(([a],[b])=>a.localeCompare(b)); const weigh=entries.filter(([,x])=>x.weight!=null); const latest=latestValue('weight'); const goal=state.settings.goalWeight; const start=state.settings.startWeight;
 $('#view-progress').innerHTML=`<div class="section-title"><div><span class="muted">12-week trajectory</span><h2>Progress</h2></div></div><div class="kpis"><div class="kpi"><span class="muted">Starting</span><div class="big">${start}</div><div class="muted">kg</div></div><div class="kpi"><span class="muted">Latest</span><div class="big">${latest??'—'}</div><div class="muted">kg</div></div><div class="kpi"><span class="muted">Goal</span><div class="big">${goal}</div><div class="muted">kg</div></div><div class="kpi"><span class="muted">Logged weights</span><div class="big">${weigh.length}</div><div class="muted">entries</div></div></div><div class="card"><h3>Weight chart</h3><div class="canvas-wrap"><canvas id="weightChart" width="720" height="300"></canvas></div><div class="muted">Target path shown from ${start} kg to ${goal} kg over 12 weeks.</div></div><div class="card"><h3>Recent check-ins</h3>${entries.slice(-10).reverse().map(([d,x])=>`<div class="history-row row between"><div><strong>${fmtDate(d)}</strong><div class="muted">${x.energy||'No energy rating'} · ${x.sleep??'—'} h sleep</div></div><div class="right"><b>${x.weight??'—'} kg</b><div class="muted">${totals(x).kcal} kcal</div></div></div>`).join('')||'<div class="empty">No logs yet</div>'}</div>`;
 requestAnimationFrame(drawChart);
}
function latestValue(field){const es=Object.entries(state.logs).filter(([,x])=>x[field]!=null).sort(([a],[b])=>b.localeCompare(a));return es.length?+es[0][1][field]:null}
function drawChart(){const c=$('#weightChart');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height,p=42;ctx.clearRect(0,0,W,H);const start=new Date(state.startDate+'T12:00:00'),end=new Date(start.getTime()+83*86400000);const weights=Object.entries(state.logs).filter(([,x])=>x.weight!=null).sort(([a],[b])=>a.localeCompare(b));const min=Math.min(61,state.settings.startWeight-2,...weights.map(x=>x[1].weight));const max=Math.max(70,state.settings.goalWeight+2,...weights.map(x=>x[1].weight));const x=d=>p+((new Date(d+'T12:00:00')-start)/(end-start))*(W-2*p);const y=v=>H-p-((v-min)/(max-min))*(H-2*p);ctx.strokeStyle='#dde4e9';ctx.lineWidth=1;for(let v=Math.ceil(min);v<=max;v++){ctx.beginPath();ctx.moveTo(p,y(v));ctx.lineTo(W-p,y(v));ctx.stroke();ctx.fillStyle='#7b8790';ctx.font='12px sans-serif';ctx.fillText(v+'',8,y(v)+4)}ctx.strokeStyle='#b9c4cc';ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(p,y(state.settings.startWeight));ctx.lineTo(W-p,y(state.settings.goalWeight));ctx.stroke();ctx.setLineDash([]);if(weights.length){ctx.strokeStyle='#20639b';ctx.lineWidth=4;ctx.beginPath();weights.forEach(([d,l],i)=>i?ctx.lineTo(x(d),y(l.weight)):ctx.moveTo(x(d),y(l.weight)));ctx.stroke();weights.forEach(([d,l])=>{ctx.fillStyle='#173f5f';ctx.beginPath();ctx.arc(x(d),y(l.weight),5,0,Math.PI*2);ctx.fill()})}}

function renderSettings(){
 const s=state.settings;
 $('#view-settings').innerHTML=`<div class="section-title"><div><span class="muted">Personal programme</span><h2>Settings & backup</h2></div></div><div class="card"><h3>Targets</h3><div class="two-col"><label>Starting weight<input id="setStart" type="number" step="0.1" value="${s.startWeight}"></label><label>Goal weight<input id="setGoal" type="number" step="0.1" value="${s.goalWeight}"></label><label>Protein target (g)<input id="setProtein" type="number" value="${s.proteinTarget}"></label><label>Programme start<input id="setDate" type="date" value="${state.startDate}"></label></div><button class="primary" onclick="saveSettings()">Save settings</button></div><div class="card"><h3>Serious Mass</h3><div class="metricline"><span>1 heaped scoop</span><b>631 kcal · 25 g protein</b></div><div class="muted">Tracker source: 168 g powder; approximately 124 g carbohydrate and 1.5 g creatine.</div></div><div class="card"><h3>Backup your data</h3><p class="muted">V1 stores data on this device. Export a JSON backup periodically, especially before clearing Safari data or changing phones.</p><div class="actions"><button class="primary" onclick="exportBackup()">Export backup</button><label class="secondary" style="text-align:center;cursor:pointer">Import backup<input type="file" id="importFile" accept="application/json" hidden onchange="importBackup(this.files[0])"></label></div></div><div class="card"><h3>Install on iPhone</h3><p class="muted">After these files are hosted on HTTPS, open the site in Safari → Share → Add to Home Screen. The app then opens in standalone mode and works offline after its first successful load.</p></div><div class="card"><button class="secondary danger" onclick="resetApp()">Reset app to tracker data</button></div>`;
}
function saveSettings(){state.settings.startWeight=+$('#setStart').value;state.settings.goalWeight=+$('#setGoal').value;state.settings.proteinTarget=+$('#setProtein').value;state.startDate=$('#setDate').value;save();renderAll()}
function exportBackup(){const b=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=`lean-mass-backup-${isoToday()}.json`;a.click();URL.revokeObjectURL(u)}
function importBackup(file){if(!file)return;const r=new FileReader();r.onload=()=>{try{state=JSON.parse(r.result);save();renderAll();alert('Backup restored.')}catch(e){alert('That backup could not be read.')}};r.readAsText(file)}
function resetApp(){if(confirm('Reset all app data back to the supplied Excel tracker starter data?')){localStorage.removeItem(STORE);location.reload()}}

window.openMeal=openMeal;window.deleteMeal=deleteMeal;window.saveCheckin=saveCheckin;window.showView=showView;window.renderMeals=renderMeals;window.addCustomMeal=addCustomMeal;window.renderWorkouts=renderWorkouts;window.saveExercise=saveExercise;window.completeWorkout=completeWorkout;window.saveSettings=saveSettings;window.exportBackup=exportBackup;window.importBackup=importBackup;window.resetApp=resetApp;
boot();
