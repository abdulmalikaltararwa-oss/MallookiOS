'use strict';

function renderHabits(){
  const week=weekDays(),c=eid('habitList');c.innerHTML='';
  S.habits.forEach(h=>{
    const str=calcStreak(h.days||{});
    const row=document.createElement('div');row.className='habit-row';
    row.innerHTML=`
      <input class="editable habit-name-inp" value="${h.name}" onchange="updateHabitName(${h.id},this.value)" title="Click to rename">
      <div class="habit-days">
        ${week.map((d,i)=>{
          const on=!!(h.days&&h.days[d]),isTod=d===today();
          return `<div class="day-dot ${on?(isTod?'today-on':'on'):''}" title="${d}" onclick="toggleH(${h.id},'${d}')">${DAY_SHORT[i].slice(0,2)}</div>`;
        }).join('')}
      </div>
      <div class="habit-streak-n">${str>0?str+'d':''}</div>
      <button class="habit-del" onclick="delHabit(${h.id})">✕</button>`;
    c.appendChild(row);
  });
  updateStreaks();
}

function updateHabitName(id,val){
  const h=S.habits.find(h=>h.id===id);
  if(h){h.name=val;scheduleSave();updateStreaks();}
}

function toggleH(id,date){
  const h=S.habits.find(h=>h.id===id);
  if(!h)return;
  if(!h.days)h.days={};
  h.days[date]=!h.days[date];
  scheduleSave();
  renderHabits();
}

function delHabit(id){
  if(!confirm('Remove habit?'))return;
  S.habits=S.habits.filter(h=>h.id!==id);
  scheduleSave();
  renderHabits();
}

function addHabit(){
  const name=eid('newHabitName').value.trim();
  if(!name)return;
  S.habits.push({id:Date.now(),name,days:{}});
  eid('newHabitName').value='';
  scheduleSave();
  renderHabits();
  toast(`"${name}" added`);
}

function hnorm(v){return String(v||'').toLowerCase().trim();}
function hmatch(h,...keys){
  const n=hnorm(h&&h.name);
  return keys.some(k=>n.includes(k));
}
function hfind(...keys){return S.habits.find(h=>hmatch(h,...keys));}
function streakOf(h){return h?calcStreak(h.days||{}):0;}

function prayerStreak(){
  const prayers=['fajr','dhuhr','asr','maghrib','isha'].map(k=>hfind(k)).filter(Boolean);
  if(prayers.length===5){
    const days={},all=[...new Set(prayers.flatMap(h=>Object.keys(h.days||{})))];
    all.forEach(d=>{if(prayers.every(h=>h.days&&h.days[d]))days[d]=true;});
    return calcStreak(days);
  }
  const generic=hfind('prayer','salah','salat','صلاة','صلاه');
  return streakOf(generic);
}

function setStreak(elId,show,val){
  const el=eid(elId); if(!el)return;
  const row=el.closest('.streak-row');
  if(row)row.style.display=show?'flex':'none';
  el.textContent=show?`${val}d`:'';
}

function updateStreaks(){
  const p=S.streakPrefs||{};
  setStreak('s-prayer',!!p.prayer,prayerStreak());
  setStreak('s-cardio',p.cardio!==false,streakOf(hfind('cardio','walk','run','jog','cycle')));
  setStreak('s-gym',p.gym!==false,streakOf(hfind('gym','lift','workout','training','weights')));
  setStreak('s-read',p.read!==false,streakOf(hfind('read','reading','book')));
}
