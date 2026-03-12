'use strict';

function renderHabits(){
  const week=weekDays(),c=eid('habitList');c.innerHTML='';
  S.habits.forEach(h=>{
    const str=calcStreak(h.days);
    const row=document.createElement('div');row.className='habit-row';
    row.innerHTML=`
      <input class="editable habit-name-inp" value="${h.name}" onchange="updateHabitName(${h.id},this.value)" title="Click to rename">
      <div class="habit-days">
        ${week.map((d,i)=>{
          const on=h.days[d],isTod=d===today();
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
  if(h){
    h.name=val;
    scheduleSave();
  }
}

function toggleH(id,date){
  const h=S.habits.find(h=>h.id===id);
  if(!h)return;
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

function updateStreaks(){
  const pids=[1,2,3,4,5],pDays={};
  weekDays().forEach(d=>{
    if(pids.every(pid=>{
      const h=S.habits.find(h=>h.id===pid);
      return h&&h.days[d];
    })) pDays[d]=true;
  });

  eid('s-prayer').textContent=calcStreak(pDays)+'d';

  [[7,'s-gym'],[6,'s-cardio'],[8,'s-read']].forEach(([hid,elId])=>{
    const h=S.habits.find(h=>h.id===hid);
    eid(elId).textContent=(h?calcStreak(h.days):0)+'d';
  });
}
