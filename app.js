"use strict";

const icons = {
  sprout: '<path d="M12 22v-9M12 17C6 17 3 14 3 9c5 0 9 2 9 8Zm0-4c0-5 3-8 9-9 0 6-3 9-9 9Z"/>',
  home: '<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 21v-7h6v7"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m-13 5h2m4 0h2"/>',
  chart: '<path d="M3 3v18h18M8 16v-4m5 4V8m5 8V5"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M2 21v-2c0-3 3-5 7-5s7 2 7 5v2M17 5a3 3 0 0 1 0 6m1 3c3 1 4 3 4 5v2"/>',
  heart: '<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/>',
  shield: '<path d="M12 22s7-4 7-10V5l-7-3-7 3v7c0 6 7 10 7 10Z"/><path d="m9 12 2 2 4-4"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  play: '<path d="m8 5 12 7-12 7Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
  sparkle: '<path d="M12 2c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  wind: '<path d="M2 8h14a3 3 0 1 0-3-3M2 12h18a2 2 0 1 1-2 2M2 16h10a3 3 0 1 1-3 3"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  bubbles: '<circle cx="8" cy="14" r="5"/><circle cx="17" cy="7" r="4"/><circle cx="18" cy="18" r="2"/>',
  senses: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
  moon: '<path d="M20 15a8 8 0 0 1-11-11 8.5 8.5 0 1 0 11 11Z"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8 8 13 13M8 16 21 3"/>'
};
const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
document.querySelectorAll("[data-icon]").forEach(element => element.innerHTML = icon(element.dataset.icon));

const moods = [
  {emoji:"☹️", label:"Very low"}, {emoji:"😟", label:"Low"}, {emoji:"😐", label:"Okay"},
  {emoji:"🙂", label:"Good"}, {emoji:"😄", label:"Great"}
];
const games = {
  focus:{title:"Make Room to Focus",icon:"sparkle",theme:"amber",description:"Tap away three distractions and choose one small next step."},
  bubbles:{title:"Bubble Reset",icon:"bubbles",theme:"",description:"Tap six floating bubbles one at a time. Pause for a breath between taps."},
  senses:{title:"Notice Three Things",icon:"senses",theme:"amber",description:"Take a moment to notice one thing you can see, hear and feel."},
  lanterns:{title:"Lantern Pairs",icon:"moon",theme:"",description:"Flip six lantern tiles and find the three matching pairs. Take your time."},
  bloom:{title:"Grow a Bloom",icon:"sprout",theme:"pink",description:"Choose a flower colour and water a tiny seed until it blooms."},
  fog:{title:"Clear the Fog",icon:"wind",theme:"",description:"Press and release with a gentle breathing rhythm before a deadline."},
  shred:{title:"Emotional Shredder",icon:"scissors",theme:"pink",description:"Put a tough thought on a slip of paper and tap to shred it when you’re ready."}
};
const moodPool = ["focus","bubbles","senses","lanterns","bloom"];
const breathRounds = 6;
const bubbleCount = 6;
const gameDuration = 60;
const lanternSymbols = {sun:"☀️",leaf:"🍃",flower:"🌸"};
const bloomColors = {Lavender:"#a583d5",Peach:"#ee957d",Gold:"#e4b65e"};
const meditationPrompts = [
  "Let your feet rest on the floor or notice where your body is supported.",
  "Breathe at your natural pace. Notice one breath coming in and going out.",
  "If your attention wanders, gently bring it back to a sound or sensation.",
  "Notice how you feel now. When you’re ready, look around and carry on."
];
const sensePrompts = ["Find one thing you can see. Notice its colour or shape.","Tune in to one sound, near or far.","Notice something you can feel, like your feet on the floor."];
const main = document.querySelector("#main");
const screen = document.querySelector("#phone-screen");
const dialog = document.querySelector("#dialog");
const content = document.querySelector("#dialog-content");
const key = "mood-campus-gtsu2037-v1";
const presentation = location.search === "?presentation=1" && window.parent !== window;
const formatter = new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Hong_Kong",year:"numeric",month:"2-digit",day:"2-digit"});
let anchor = formatter.format(new Date());
const day = (offset = 0, from = anchor) => {
  const date = new Date(from + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0,10);
};
const showDate = (value, options = {month:"short", day:"numeric"}) => new Date(value + "T12:00:00Z").toLocaleDateString("en-GB",{timeZone:"UTC",...options});
const initial = () => ({entries:{},personal:[],imported:[],energy:14, consent:{aggregate:true,referral:false,shareTrend:false}, case:null, classMove:false, scenario:false});
let state = initial();
if (!presentation) {
  try { state = {...state,...JSON.parse(localStorage.getItem(key) || "{}")}; } catch {}
}
function persist() {
  if (presentation) return;
  try { localStorage.setItem(key,JSON.stringify(state)); } catch {}
}
const onlineCounselling = '<a class="btn quiet" href="https://www.openup.hk/" target="_blank" rel="noopener">Open online counselling</a>';
const supportDirectory = '<a class="text-link" href="https://www.shallwetalk.hk/en/get-help/online-support/" target="_blank" rel="noopener">Hong Kong online support contacts</a>';
const lowMood = record => record?.score === 1 || record?.score === 2;
let reviewMonth;
let page;
let toastTimer;
let game;
let clock;
let hold;
let expiry;
let practice;
let installPrompt;
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const btn = (label,action,style="",symbol="") => `<button type="button" class="btn ${style}" data-action="${action}">${symbol ? icon(symbol) : ""}${label}</button>`;
const link = (label,route,style="quiet") => `<a class="btn ${style}" href="#${route}">${label}</a>`;
const badge = (name, theme="") => `<span class="icon-badge ${theme}">${icon(name)}</span>`;
const intro = (tag,title,copy) => `<div class="page-intro"><div class="eyebrow">${tag}</div><h1>${title}</h1><p>${copy}</p></div>`;
const eventTypes = {exam:"Assessment",work:"Homework",grades:"Grades"};
function schoolExamples() {
  return [
    {id:"math",name:"Maths quiz",type:"exam",date:day(1),source:"School calendar"},
    {id:"english",name:"English essay",type:"work",date:day(state.classMove ? 3 : 1),source:"School calendar"},
    {id:"biology",name:"Biology results",type:"grades",date:day(state.scenario ? 0 : 3),source:"School calendar"}
  ];
}
function events() {
  return [...schoolExamples(),...state.imported,...state.personal].sort((a,b) => a.date.localeCompare(b.date));
}
function nextEvents() { return events().filter(event => event.date >= anchor); }
function gameAction(id, event) {
  return event ? "game:"+id+":"+encodeURIComponent(event.id) : "game:"+id;
}
function eventList(items, editable=false) {
  if (!items.length) return "<p>No upcoming events.</p>";
  return `<ul class="event-list">${items.map(event => {
    const remove = editable && event.source === "Just for you" ? btn("Remove","remove:"+event.id,"link") : "";
    const reset = event.type === "grades"
      ? (event.date <= anchor ? btn("Emotional Shredder",gameAction("shred",event),"soft","scissors") : "")
      : btn("Clear the Fog",gameAction("fog",event),"soft","wind");
    return `<li class="event calendar-event"><span class="date-tile">${Number(event.date.slice(8))}<small>${showDate(event.date,{month:"short"})}</small></span><div class="event-body"><b>${escapeHtml(event.name)}</b><small>${event.source}${event.id === "english" && state.classMove ? " · Updated by teacher" : ""}</small></div><span class="event-chip ${event.type}">${eventTypes[event.type]}</span>${reset || remove ? `<div class="event-actions">${reset}${remove}</div>` : ""}</li>`;
  }).join("")}</ul>`;
}
function assignMoodGame(entry) {
  if (entry.score <= 2 && !moodPool.includes(entry.reset)) {
    entry.reset = moodPool[Math.floor(Math.random() * moodPool.length)];
  }
}
function recommend(entry) {
  const low = entry?.score <= 2;
  if (low) {
    const randomReset = moodPool.includes(entry.reset) ? entry.reset : moodPool[0];
    const results = events().filter(event => event.type === "grades" && event.date >= day(-2) && event.date <= anchor).at(-1);
    if (results) return {id:"shred",event:results,alternative:randomReset};
    return {id:randomReset};
  }
  const deadline = nextEvents().find(event => event.type !== "grades" && event.date <= day(2));
  if (deadline) return {id:"fog",event:deadline};
  return {id:"focus"};
}
function lowStreak() {
  const offset = state.entries[anchor] ? 0 : 1;
  let days = 0;
  while (lowMood(state.entries[day(-offset-days)])) days++;
  return {days,start:days ? day(1-offset-days) : null};
}
function lowDays() { return lowStreak().days; }
function sharedCaseTrend() {
  if (!state.consent.shareTrend) return [];
  return Array.from({length:14},(_,index) => day(index-13))
    .filter(date => state.entries[date])
    .map(date => ({date,score:state.entries[date].score}));
}
function considerReferral() {
  const {days,start} = lowStreak();
  if (days < 14 || !state.consent.referral || state.case?.threshold?.start === start) return false;
  const existing = state.case;
  const legacy = existing && !existing.threshold && /^14 consecutive very-low check-ins$/.test(existing.reason) && start <= existing.date;
  const threshold = {date:legacy ? existing.date : anchor,days,start};
  state.case = {
    date:threshold.date,
    reason:"Automatic wellbeing follow-up",
    days,
    trend:legacy ? [] : sharedCaseTrend(),
    status:legacy ? existing.status : "New",
    threshold
  };
  return true;
}
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.textContent="",3400);
}
function gardenArt() {
  const plants = ["🌿","🌱","🌷","🌼","🌻","🪻","🌸"];
  return `<div class="garden-art" aria-hidden="true">${plants.slice(0,Math.min(7,3+Math.floor(state.energy/5))).map(plant => `<span>${plant}</span>`).join("")}</div>`;
}
function gardenSummary() {
  return `<small>${state.energy} shared drops</small><meter min="0" max="${(Math.floor(state.energy/20)+1)*20}" value="${state.energy}" aria-label="Class garden growth"></meter>`;
}
function carePrompt() {
  const {days,start} = lowStreak();
  if (days < 7) return "";
  const referred = state.case?.threshold?.start === start;
  const title = days >= 14 ? "School follow-up" : "A gentle check-in";
  const copy = referred
    ? "Your school social-worker follow-up is in the demo queue. Your teacher sees a class-level notice."
    : days >= 14
      ? "You can give your school social worker permission to check in with you."
      : "This week looks like it’s been tiring. Would you like to try online counselling or connect with your school social worker?";
  return `<aside class="banner care-banner" aria-labelledby="care-heading"><div class="card-head"><div><div class="eyebrow">${days} low-mood days in a row</div><h2 id="care-heading">${title}</h2></div>${badge("heart","pink")}</div><p>${copy}</p><div class="controls">${onlineCounselling}${btn("School social worker","contact","quiet")}${days >= 14 && !referred ? btn("Review consent","privacy","link") : ""}</div>${supportDirectory}</aside>`;
}
function moodButtons(entry, showSelection=true) {
  return `<div class="moods" role="group" aria-label="Today’s mood">${moods.map((mood,index) =>
    `<button type="button" class="mood" data-action="mood:${index+1}"${showSelection ? ` aria-pressed="${entry?.score===index+1}"` : ""}><span class="mood-face" style="--face-position:${index*25}%" aria-hidden="true"></span><span class="mood-label">${mood.label}</span></button>`
  ).join("")}</div>`;
}
function widget() {
  const entry = state.entries[anchor];
  return `<div class="home-layout">
    <time class="home-date" datetime="${anchor}">${showDate(anchor,{weekday:"long",month:"long",day:"numeric"})}</time>
    <section class="mood-widget" aria-labelledby="widget-heading">
      <div class="widget-brand"><img src="./icon-192.png" width="24" height="24" alt=""> Open Up</div>
      <h1 id="widget-heading">How are you feeling?</h1>
      <p class="widget-hint">Tap a mood to check in.</p>
      ${moodButtons(entry,false)}
      <div class="widget-bottom">${entry
        ? `<span class="widget-saved">✓ Saved today</span>${link("See your reset","today","soft")}`
        : `<span class="widget-private">${icon("shield")} Private check-in</span>`}</div>
    </section>
    <div class="home-launcher"><a href="#today" aria-label="Open Up app"><img src="./icon-192.png" width="56" height="56" alt=""><span>Open Up</span></a></div>
  </div>`;
}
function today() {
  const entry = state.entries[anchor];
  const suggestion = recommend(entry);
  const pastSameDay = [7,14,21,28].filter(offset => state.entries[day(-offset)]?.score <= 2).length;
  const pattern = entry?.score <= 2 && pastSameDay >= 2 ? `<small>Your check-in was also low on ${pastSameDay} recent ${showDate(anchor,{weekday:"long"})}s.</small>` : "";
  const exercise = games[suggestion.id];
  const context = suggestion.event ? `<div class="reset-context">${icon("calendar")} ${escapeHtml(suggestion.event.name)} · ${showDate(suggestion.event.date)}</div>` : "";
  const alternative = suggestion.alternative ? `<div class="controls">${btn("Try "+games[suggestion.alternative].title,gameAction(suggestion.alternative),"quiet")}</div>` : "";
  const status = entry ? '<span class="status-text">✓ Mood saved</span>' : btn("Skip","skip","link");
  return `<section class="hero" aria-labelledby="greeting"><div><div class="eyebrow">${icon("sun")} ${showDate(anchor,{weekday:"short",month:"long",day:"numeric"})}</div><h1 id="greeting">Hi, Alex.</h1><p>Take a minute for yourself.</p></div></section>
  <div class="dashboard"><div class="stack">
  <section class="card check-in"><div class="card-head"><div><h2>How are you feeling?</h2><p>Pick a mood to find a reset.</p></div>${status}</div>
  ${moodButtons(entry)}
  <div class="check-in-tools"><details class="journal"><summary>${entry?.note ? "Edit private note" : "Add a private note"}</summary><form id="note-form"><label class="field">Today’s note<textarea name="note" maxlength="600" placeholder="Anything you’d like to remember?">${escapeHtml(entry?.note)}</textarea></label><div class="controls"><button class="btn" type="submit">Save note</button></div></form></details>${btn("Preview teacher view","preview","link","eye")}</div>
  </section>
  ${carePrompt()}
  <section class="card recommend"><div class="card-head"><div class="reset-title">${badge(exercise.icon,exercise.theme)}<div><div class="eyebrow">${entry ? "Your next reset" : "Today’s reset"}</div><h2>${exercise.title}</h2></div></div><span class="pill">1 min</span></div>
  ${context}<div class="controls reset-controls">${btn("Start reset",gameAction(suggestion.id,suggestion.event),"","play")}${link("All resets","support","link")}</div><p>${exercise.description}</p>${pattern}${alternative}</section>
  ${lowMood(entry) ? `<section class="card low-support"><h2>Take a moment or talk to someone</h2><div class="controls">${btn("Guided meditation","meditation","soft","moon")}${onlineCounselling}</div></section>` : ""}
  </div><div class="stack">
  <section class="card"><div class="card-head"><div><h2>Coming up</h2><p>From school and your own plans.</p></div>${badge("calendar")}</div>${eventList(nextEvents().slice(0,3))}<div class="controls">${btn("Add deadline","add","quiet","plus")}${link("View calendar","calendar","link")}</div></section>
  <section class="card garden-card"><div class="card-head"><div><h2>Class garden</h2><p>Every completed reset adds one anonymous drop.</p></div>${badge("sprout","amber")}</div>${gardenArt()}${gardenSummary()}<div class="controls">${link("Visit the garden","garden","link")}</div></section>
  </div></div>`;
}
function calendarPage() {
  return `<div class="calendar-intro"><div class="page-intro"><h1>Calendar</h1><p>School events and your private dates.</p></div>${btn("Add deadline","add","","plus")}</div>`+
    `<div class="grid2"><section class="card"><div class="card-head"><div><h2>Upcoming events</h2><p>Pick Clear the Fog for any homework or quiz.</p></div>${badge("calendar")}</div>${eventList(events().filter(event => event.date >= anchor || (event.type === "grades" && event.date >= day(-2))),true)}</section>
    <section class="card">${badge("calendar","amber")}<h2>School calendar import</h2><p>Use the sample school file or upload an all-day CSV with date, title and type columns. The import stays in this browser.</p><div class="controls">${btn("Import sample","sample","quiet")}${btn("Upload CSV","upload","quiet")}</div><input id="csv" type="file" accept=".csv,text/csv" hidden></section></div>`;
}
function chart(items) {
  return `<div class="chart">${items.map(({label,score}) => `<div class="bar-row"><span>${label}</span><div class="bar" aria-hidden="true"><span style="width:${(score || 0)*20}%"></span></div><b>${score ? score.toFixed(1) : "—"}</b></div>`).join("")}</div>`;
}
function monthOptions() {
  const current = anchor.slice(0,7);
  return [...new Set([current,day(-1,current+"-01").slice(0,7),...Object.keys(state.entries).map(date=>date.slice(0,7))])].sort().reverse();
}
function trendChart(records, first, last, label) {
  if (!records.length) return "";
  const dateIndex = date => Math.round((Date.parse(date)-Date.parse(first))/86400000);
  const period = Math.max(1,dateIndex(last));
  const knots = records.map(({date,score}) => ({day:dateIndex(date),x:26+dateIndex(date)*261/period,y:110-(score-1)*21}));
  const lines = knots.slice(1).map((point,index) => {
    const prev=knots[index];
    return point.day === prev.day+1 ? `<line x1="${prev.x}" y1="${prev.y}" x2="${point.x}" y2="${point.y}"/>` : "";
  }).join("");
  return `<svg class="mood-trend" viewBox="0 0 305 138" role="img" aria-label="${label}">
    ${[1,2,3,4,5].map(score => `<text x="8" y="${114-(score-1)*21}">${score}</text><path class="gridline" d="M26 ${110-(score-1)*21}H287"/>`).join("")}
    <g class="trend-segments">${lines}</g>
    ${knots.map(point=>`<circle cx="${point.x}" cy="${point.y}" r="3"/>`).join("")}
    <text x="26" y="132">${showDate(first)}</text><text x="287" y="132" text-anchor="end">${showDate(last)}</text>
  </svg>`;
}
function review() {
  const available = monthOptions();
  const month = available.includes(reviewMonth) ? reviewMonth : available[0];
  const first=month+"-01";
  const current=month===anchor.slice(0,7);
  const nextMonth = new Date(first+"T12:00:00Z");
  nextMonth.setUTCMonth(nextMonth.getUTCMonth()+1);
  const last = current ? anchor : day(-1,nextMonth.toISOString().slice(0,10));
  const entries = Object.entries(state.entries).filter(([date]) => date.startsWith(month)).sort(([a],[b]) => a.localeCompare(b));
  const average = entries.length ? (entries.reduce((sum,[,record]) => sum+record.score,0)/entries.length).toFixed(1) : "—";
  const recent = entries.map(([date,{score}])=>({date,score}));
  return intro("Private to you","My mood review","See how your check-ins change month by month.")+
    `<div class="stack"><label class="field">Month<select id="review-month">${available.map(item=>`<option value="${item}" ${item===month?"selected":""}>${showDate(item+"-01",{month:"long",year:"numeric"})}</option>`).join("")}</select></label>
    <div class="grid2"><section class="card"><div class="card-head"><h2>Monthly average</h2><span class="pill">${current?"In progress":"Month ended"}</span></div><div class="kpi">${average} / 5</div><p>${entries.length} recorded check-in${entries.length===1?"":"s"}</p>${entries.length ? `<h3 class="trend-heading">Daily mood trend</h3>${trendChart(recent,first,last,"Recorded daily emotion scores from 1 to 5. Exact moods are listed in My diary.")}` : "<p>No check-ins for this month.</p>"}</section>
    <section class="card"><h2>My diary</h2><p>Only you can see these entries.</p><ul class="history-list">${entries.slice().reverse().map(([date,record]) => `<li><b>${moods[record.score-1].emoji} ${moods[record.score-1].label} · ${showDate(date)}</b>${record.note ? `<p>${escapeHtml(record.note)}</p>` : ""}</li>`).join("")}</ul>${entries.length ? "" : link("Go to check-in","today")}</section></div></div>`;
}
function garden() {
  return intro("Class 5B","Class garden","Every completed reset grows a shared space. Drops are added anonymously.")+
    `<section class="card garden-card">${gardenArt()}<div class="controls split"><h2>Our garden</h2>${link("Find a reset","support","soft")}</div>${gardenSummary()}</section>`;
}
function support() {
  return intro("Student space","Support & resets","Pick a short practice, a game or someone to talk to.")+
    `<div class="stack"><div class="grid2"><section class="card"><h2>Guided meditation</h2><p>Follow a quiet, one-minute practice at your own pace.</p><div class="controls">${btn("Start meditation","meditation","", "moon")}</div><a class="text-link" href="https://www.uclahealth.org/uclamindful/guided-meditations" target="_blank" rel="noopener">Audio in English and Cantonese · UCLA Mindful</a></section>
    <section class="card"><h2>Talk to someone</h2><div class="controls">${onlineCounselling}${btn("School social worker","contact","quiet")}</div>${supportDirectory}</section></div>
    <h2>Mini-games</h2><div class="grid3">${Object.entries(games).map(([id,item]) => `<section class="card">${badge(item.icon,item.theme)}<h2>${item.title}</h2><p>${item.description}</p><div class="controls">${btn("Start reset","game:"+id,"","play")}<span class="pill">About 1 min</span></div></section>`).join("")}</div></div>`;
}
function classTrend() {
  const samples = [[3.6,21],[3.3,23],[3.0,22],[2.7,23],[2.4,24]];
  return samples.map(([score,count],index) => {
    const date = day(index-4);
    const entry = state.consent.aggregate && state.entries[date];
    return {label:showDate(date),score:(score*count+(entry?.score || 0))/(count+(entry ? 1 : 0))};
  });
}
function teacherBody(preview=false) {
  const trend = classTrend();
  const low = trend.slice(-3).every(item => item.score <= 3);
  const overlaps = nextEvents().filter(event => event.source === "School calendar" && event.date === day(1));
  return `<div class="${preview ? "stack" : "grid2"}"><section class="card"><div class="card-head"><div><h2>Class 5B mood trend</h2><p>Sample daily averages out of 5 · minimum 10 check-ins</p></div>${badge("chart")}</div>${chart(trend)}</section>
  <section class="card"><div class="card-head"><div><h2>Workload radar</h2><p>Recent class mood alongside school deadlines.</p></div>${badge("calendar","amber")}</div>
  ${state.classMove ? `<p><b>English essay moved to ${showDate(day(3))}.</b> The student calendar shows the new date.</p>` : low && overlaps.length > 1 ? `<div class="banner"><b>Three days averaging 3 or below</b><p>${overlaps.map(item=>escapeHtml(item.name)).join(" and ")} fall on the same day.</p></div>${preview ? "" : `<div class="controls">${btn("Move essay two days","move")}</div>`}` : "<p>No workload signal today.</p>"}</section>${teacherNotice()}</div>`;
}
function teacherNotice() {
  return state.case?.threshold || state.case?.reason === "14 consecutive very-low check-ins" ? '<aside class="banner"><h3>Wellbeing team alert</h3><p>The social worker has a follow-up for this class. Teachers can review the class trend and coordinate with the wellbeing team.</p></aside>' : "";
}
function workerDetails(preview=false) {
  const item = state.case;
  if (!item) return "<p>No authorised referrals yet.</p>";
  const records = item.trend || [];
  const days = item.days ?? (item.reason === "14 consecutive very-low check-ins" ? 14 : null);
  return `<div class="event"><span class="avatar">AL</span><div class="event-body"><b>Alex Lee · Class 5B</b><small>${item.reason} · ${showDate(item.date)} · Consent recorded</small></div><span class="pill">${item.status}</span></div>
    ${days != null ? `<p><b>${days} consecutive low-mood days</b> when the follow-up was created.</p>` : ""}
    ${records.length ? `<h3 class="trend-heading">Shared emoji trend</h3>${trendChart(records,day(-13,item.date),item.date,"The daily emoji scores shared at referral, on a scale of 1 to 5.")}` : ""}
    ${!preview && item.status === "New" ? `<div class="controls">${btn("Mark reviewed","review-case","quiet")}</div>` : ""}`;
}
function worker() {
  return intro("Staff preview","Social-worker queue","Fictional follow-up requests authorised by the student.")+
    `<section class="card"><h2>Student follow-ups</h2>${workerDetails()}</section>`;
}
function sharingPreview(role="teacher") {
  const workerView = role === "worker";
  modal("Preview Teacher View",`<div class="stack">
    <p>Your private notes stay in your diary. This preview shows what each role can see in the demo.</p>
    <div class="preview-switch" role="group" aria-label="Preview role">
      <button class="btn quiet" data-action="preview:teacher" aria-pressed="${!workerView}">Teacher</button>
      <button class="btn quiet" data-action="preview:worker" aria-pressed="${workerView}">Social worker</button>
    </div>
    <div class="preview-personal"><b>Only you can see this:</b> ${lowDays()} consecutive low-mood days.</div>
    ${workerView ? `<section class="card"><h3>Student follow-ups</h3>${workerDetails(true)}</section>` : teacherBody(true)}
  </div>`);
  content.querySelector('[aria-pressed="true"]')?.focus();
}
const pages = {today,widget,calendar:calendarPage,review,garden,support,teacher:()=>intro("Staff preview","Teacher dashboard","See class-level trends and coordinate workload.")+teacherBody(),worker};
function render() {
  const phoneNav = document.querySelector("#phone-nav");
  const onHomeScreen = page === "widget";
  screen.setAttribute("data-view",onHomeScreen ? "widget" : "app");
  phoneNav.hidden = onHomeScreen;
  phoneNav.innerHTML = [
    ["today","Today","home"],["calendar","Calendar","calendar"],["garden","Garden","sprout"],["review","Review","chart"]
  ].map(([id,title,symbol]) => `<a href="#${id}" ${id===page ? 'aria-current="page"' : ""}>${icon(symbol)}<span>${title}</span></a>`).join("") +
  `<button type="button" data-action="more">${icon("more")}<span>More</span></button>`;
  main.innerHTML = pages[page]();
}
function route() {
  const requested = location.hash.slice(1);
  page = Object.hasOwn(pages,requested) ? requested : "today";
  if(dialog.open) dialog.close();
  render();
  screen.scrollTop = 0;
}
function refresh(selector) {
  render();
  if (selector) main.querySelector(selector)?.focus({preventScroll:true});
}
function modal(title,body) {
  content.innerHTML = `<div class="modal"><div class="card-head"><h2 id="modal-title">${title}</h2><button class="close" type="button" data-action="close" aria-label="Close">${icon("close")}</button></div>${body}</div>`;
  dialog.setAttribute("aria-labelledby","modal-title");
  if (!dialog.open) dialog.showModal();
}
function more() {
  modal("More",`<div class="more-list">${presentation ? "" : '<a class="btn quiet" href="./flow.html">User flow demonstration</a>'}${link("Home screen widget","widget")}${link("Support and all resets","support")}${btn("Privacy & consent","privacy","quiet","shield")}${btn("Install app","install","quiet","phone")}${btn("Demo controls","demo","quiet","play")}${link("Teacher view","teacher")}${link("Social worker","worker")}</div>`);
}
async function installApp() {
  if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone) {
    modal("Open Up is installed","<p>You’re using the home-screen app.</p>");
    return;
  }
  if (installPrompt) {
    const prompt = installPrompt;
    installPrompt = null;
    await prompt.prompt();
    return;
  }
  modal("Install Open Up",'<div class="stack"><p><b>iPhone</b> · Open this page in Safari, tap Share, then choose Add to Home Screen.</p><p><b>Android</b> · Open this page in Chrome and choose Install app or Add to Home screen from the browser menu.</p></div>');
}
function privacy() {
  modal("Privacy & consent",`<div class="stack"><p>Your diary and personal deadlines are visible in your student space. Teachers see class averages and school deadlines. A consented automatic follow-up adds an anonymous class notice for the teacher and a named referral for the social worker.</p>
  <form id="privacy-form"><label class="setting"><input type="checkbox" name="aggregate" ${state.consent.aggregate?"checked":""}><span><b>Include my emoji in class averages</b><small>Teachers see grouped results when there are at least 10 responses.</small></span></label>
  <label class="setting"><input type="checkbox" name="referral" ${state.consent.referral?"checked":""}><span><b>Allow automatic social-worker follow-up</b><small>After 14 consecutive Low or Very low days. At seven days the app gives you a private prompt.</small></span></label>
  <label class="setting"><input type="checkbox" name="shareTrend" ${state.consent.shareTrend?"checked":""}><span><b>Include a 14-day emoji chart with future referrals</b><small>Only the social worker sees this chart. The referral includes your name, class and streak length.</small></span></label>
  <div class="controls"><button class="btn" type="submit">Save consent</button></div></form></div>`);
}
function addDeadline() {
  modal("Add a private deadline",`<form id="deadline-form" class="stack"><p>Every quiz or homework deadline includes Clear the Fog. Results dates can trigger Emotional Shredder after a low check-in.</p>
  <label class="field">Title<input name="name" required maxlength="85" placeholder="e.g. Chemistry worksheet"></label>
  <label class="field">Type<select name="type"><option value="work">Homework</option><option value="exam">Quiz or exam</option><option value="grades">Results day</option></select></label>
  <label class="field">Event date<input name="date" type="date" min="${anchor}" value="${day(1)}" required></label>
  <div><button class="btn" type="submit">Save deadline</button></div></form>`);
}
function demo() {
  modal("Demo controls",`<div class="stack"><p>Load fictional check-ins to show what happens over time.</p><a href="./mood-campus-figma-flow.svg" download>Download the Figma storyboard (SVG)</a>
  <div class="controls">${btn("7 low days","seed:7","quiet")}${btn("14 low days","seed:14","quiet")}${btn("Results day","seed:grades","quiet")}</div>
  <div class="controls">${btn("Reset demo","reset-confirm","link")}</div></div>`);
}
function clearTimers() {
  clearInterval(clock);
  clearTimeout(hold);
  clearTimeout(expiry);
}
function dealLanterns() {
  const deck = Object.keys(lanternSymbols).flatMap(symbol => [symbol,symbol]);
  for (let index=deck.length-1; index>0; index--) {
    const other = Math.floor(Math.random()*(index+1));
    [deck[index],deck[other]] = [deck[other],deck[index]];
  }
  return deck;
}
function lanternBoard() {
  const cards = game.deck.map((symbol,index) => {
    const matched = game.matched.includes(index);
    const visible = matched || game.revealed.includes(index);
    return `<button type="button" class="lantern-tile" data-action="flip:${index}" aria-label="Lantern ${index+1}${visible?", "+symbol:""}${matched?", matched":""}" data-lit="${visible}" ${matched?"disabled":""}>${visible ? lanternSymbols[symbol] : "✦"}</button>`;
  });
  const progress = game.matched.length/2;
  const waiting = game.revealed.length === 2;
  return `<p role="status">${waiting ? "Two different symbols. Turn them over and try another pair." : `${progress} of 3 pairs lit`}</p><div class="lantern-board">${cards.join("")}</div>${waiting ? btn("Turn over both","turn","quiet") : ""}`;
}
function redrawLanterns(focusAction) {
  const zone = document.querySelector("#lantern-game");
  zone.innerHTML = lanternBoard();
  (zone.querySelector(`[data-action="${focusAction}"]:enabled`) || zone.querySelector("button:enabled"))?.focus();
}
function flipLantern(index) {
  if (!Number.isInteger(index) || index < 0 || index >= game.deck.length ||
    game.matched.includes(index) || game.revealed.includes(index) || game.revealed.length === 2) return;
  game.revealed.push(index);
  if (game.revealed.length === 2 && game.deck[game.revealed[0]] === game.deck[index]) {
    game.matched.push(...game.revealed);
    game.revealed = [];
    if (game.matched.length === game.deck.length) {finishGame(); return;}
  }
  redrawLanterns(game.revealed.length === 2 ? "turn" : "flip:"+index);
}
function bloomBoard() {
  const stage = ["Seed","Sprout","Bud","Bloom"][game.moved];
  const options = Object.entries(bloomColors).map(([name,color]) =>
    `<button type="button" class="btn quiet bloom-colour" data-action="bloom-colour:${name}" aria-pressed="${game.colour===name}"><span aria-hidden="true" style="--petal:${color}"></span>${name}</button>`).join("");
  return `<div class="bloom-plot" data-stage="${game.moved}" style="--petal:${bloomColors[game.colour]}" aria-hidden="true"><span class="bloom-plant"></span><span class="bloom-pot"></span></div>
    <p role="status">${stage} · ${game.moved} of 3 water drops</p>
    <div class="bloom-colours" role="group" aria-label="Flower colour">${options}</div>
    ${game.moved===3 ? btn("Add bloom to the garden","plant") : btn("Water the seed","water","","sparkle")}`;
}
function redrawBloom(action) {
  const zone = document.querySelector("#bloom-game");
  zone.innerHTML = bloomBoard();
  zone.querySelector(`[data-action="${action}"]`)?.focus();
}
function meditation() {
  clearTimers();
  game = null;
  practice = {remaining:60,running:false};
  modal("One-minute guided meditation",`<p>Read one prompt at a time, with your eyes open or closed as feels comfortable.</p><div class="exercise meditation"><p id="meditation-prompt" aria-live="polite">${meditationPrompts[0]}</p><div class="meditation-orb" aria-hidden="true"></div><progress id="meditation-progress" max="60" value="0" aria-label="Meditation progress"></progress><p id="meditation-time" role="timer">1:00</p></div>${btn("Start practice","meditate","")}`);
}
function toggleMeditation(button) {
  if (practice.running) {
    clearInterval(clock);
    practice.running = false;
    button.textContent = "Resume practice";
    return;
  }
  practice.running = true;
  button.textContent = "Pause";
  clock = setInterval(() => {
    const remaining = --practice.remaining;
    document.querySelector("#meditation-time").textContent = `0:${String(remaining).padStart(2,"0")}`;
    document.querySelector("#meditation-progress").value = 60-remaining;
    if (!remaining) {
      clearInterval(clock);
      practice.running = false;
      document.querySelector("#meditation-prompt").textContent = "Take your time getting back to your day.";
      button.textContent = "Done";
      button.dataset.action = "close";
    } else if (remaining % 15 === 0) {
      document.querySelector("#meditation-prompt").textContent = meditationPrompts[(60-remaining)/15];
    }
  },1000);
}
function startGame(id, eventId) {
  clearTimers();
  const item = games[id];
  if (!item) return;
  game = {id, rounds:0, phase:"ready", moved:0, done:false, paced:false};
  const event = eventId ? events().find(item => item.id === decodeURIComponent(eventId)) : null;
  const context = event ? `<div class="reset-context">${icon("calendar")} ${escapeHtml(event.name)} · ${showDate(event.date)}</div>` : "";
  let exercise;
  if (id === "fog") {
    exercise = `<div class="exercise fog-game"><p id="rhythm" aria-live="polite">Press for four seconds as you breathe in gently.</p><button class="breathe" id="breathe" type="button">Press and hold</button><p id="rounds">0 of ${breathRounds} breaths</p></div><div class="controls">${btn("Start hands-free breathing","paced","quiet")}</div>`;
  } else if (id === "focus") {
    exercise = `<div class="exercise"><p>Tap each distraction to set it aside.</p><div class="thoughts">${["Messages","Other homework","What ifs"].map(text=>btn(text,"aside","quiet")).join("")}</div></div><form id="focus-form" class="stack"><label class="field">One small next step <small>Choose one you can do now.</small><select name="step" required><option value="">Choose a step</option><option>Open my notes</option><option>Read the first question</option><option>Set a five-minute timer</option></select></label><p class="form-feedback" id="focus-feedback" role="status"></p><div><button class="btn" type="submit">Finish reset</button></div></form>`;
  } else if (id === "bubbles") {
    exercise = `<div class="exercise"><p id="game-progress" aria-live="polite">0 of ${bubbleCount} bubbles</p><div class="bubble-stage"><button class="bubble" id="bubble" type="button" data-action="pop">Pop</button></div></div>`;
  } else if (id === "lanterns") {
    Object.assign(game,{deck:dealLanterns(),matched:[],revealed:[]});
    exercise = `<div class="exercise lantern-game" id="lantern-game">${lanternBoard()}</div>`;
  } else if (id === "bloom") {
    game.colour = "Lavender";
    exercise = `<div class="exercise bloom-game" id="bloom-game">${bloomBoard()}</div>`;
  } else if (id === "senses") {
    exercise = `<div class="exercise sense-game"><p id="game-progress" aria-live="polite">${sensePrompts[0]}</p><div class="controls">${btn("I noticed it","notice","","senses")}</div></div>`;
  } else {
    exercise = '<form id="shred-form"><div class="exercise" id="paper"><label class="field">A thought you want to let go<textarea name="thought" maxlength="180" autocomplete="off" placeholder="Write it here if you want…"></textarea></label><p><small>This exercise does not save your words.</small></p></div><button class="btn" type="submit">Shred the paper</button></form>';
  }
  const timer = id === "fog" ? "" : '<p class="game-time" id="game-time" role="timer" aria-label="Time remaining">1:00</p>';
  modal(item.title,`${context}<p>${item.description}</p>${timer}${exercise}`);
  if (timer) {
    const end = Date.now() + gameDuration * 1000;
    clock = setInterval(() => {
      const remaining = Math.max(0,Math.ceil((end-Date.now())/1000));
      document.querySelector("#game-time").textContent = remaining ? `${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,"0")}` : "Take your time. You can still finish.";
      if (!remaining) clearInterval(clock);
    },250);
  }
  if (id === "fog") bindFog();
}
function finishGame() {
  if (!game || game.done) return;
  game.done = true;
  clearTimers();
  state.energy++;
  persist();
  refresh();
  modal("One drop added",`<div class="stack">${gardenArt()}<p>Your class garden grew by one anonymous drop.</p><div class="controls">${link("See class garden","garden","soft")}${btn("Done","close")}</div></div>`);
  content.querySelector(".close")?.focus();
}
function inhale(paced=false) {
  if (!game || game.phase !== "ready") return;
  game.phase = "in";
  const control = document.querySelector("#breathe");
  control.classList.add("holding");
  document.querySelector("#rhythm").textContent = "Breathe in gently…";
  hold = setTimeout(() => {
    if (paced) exhale();
    else {
      game.phase = "release";
      document.querySelector("#rhythm").textContent = "Release and breathe out slowly.";
    }
  },4000);
}
function exhale() {
  if (!game) return;
  clearTimeout(hold);
  const control = document.querySelector("#breathe");
  control.classList.remove("holding");
  game.phase = "out";
  document.querySelector("#rhythm").textContent = "Breathe out slowly…";
  expiry = setTimeout(() => {
    game.rounds++;
    document.querySelector("#rounds").textContent = `${game.rounds} of ${breathRounds} breaths`;
    if (game.rounds === breathRounds) {finishGame(); return;}
    game.phase = "ready";
    if (game.paced) inhale(true);
    else document.querySelector("#rhythm").textContent = "Press and hold when you’re ready for the next breath.";
  },6000);
}
function bindFog() {
  const control = document.querySelector("#breathe");
  control.addEventListener("pointerdown",event => {
    if (!event.isPrimary || event.button !== 0 || game.paced) return;
    control.setPointerCapture(event.pointerId);
    inhale();
  });
  control.addEventListener("click",event => {if (event.detail===0) startPaced();});
  function release(event) {
    if (!event.isPrimary) return;
    if (game?.phase === "release") {exhale(); return;}
    if (game?.phase !== "in" || game.paced) return;
    clearTimeout(hold);
    game.phase = "ready";
    control.classList.remove("holding");
    document.querySelector("#rhythm").textContent = "Try holding until the release cue, or use paced breathing.";
  }
  control.addEventListener("pointerup",release);
  control.addEventListener("pointercancel",release);
}
function startPaced() {
  if (!game || game.phase !== "ready") return;
  game.paced = true;
  document.querySelector('[data-action="paced"]').textContent = "Hands-free breathing";
  document.querySelector('[data-action="paced"]').disabled = true;
  inhale(true);
}
dialog.addEventListener("close",() => {
  if (dialog.open) return;
  clearTimers();
  game = null;
  practice = null;
  content.innerHTML = "";
  if (page && !document.activeElement.closest("button, a, input, textarea, select")) main.focus({preventScroll:true});
});
function loadScenario(value) {
  updateDate();
  state.case = null;
  state.scenario = value === "grades";
  state.entries = {};
  if (state.scenario) state.entries[anchor] = {score:1,note:""};
  else for (let index=0;index<Number(value);index++) state.entries[day(-index)] = {score:1,note:""};
  assignMoodGame(state.entries[anchor]);
  considerReferral();
}
function seed(value) {
  loadScenario(value);
  persist();
  dialog.close();
  if (page==="today") refresh(); else location.hash="today";
  showToast("Fictional scenario loaded.");
}
function applyCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const normalized = input.replace(/^\uFEFF/,"").replace(/\r\n?/g,"\n");
  for (let index=0;index<=normalized.length;index++) {
    const char = normalized[index];
    if (char === '"') {
      if (quoted && normalized[index+1] === '"') {field += '"'; index++;}
      else quoted = !quoted;
    } else if ((char === "," || char === "\n" || char === undefined) && !quoted) {
      row.push(field.trim());
      field = "";
      if (char !== ",") {
        if (row.some(Boolean)) rows.push(row);
        row = [];
      }
    } else field += char ?? "";
  }
  if (quoted || rows.shift()?.join(",").toLowerCase() !== "date,title,type" || !rows.length || rows.length > 100) return false;
  const imported = [];
  for (const item of rows) {
    const [date,name,type] = item;
    if (item.length!==3 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date+"T12:00:00Z")) || day(0,date)!==date || !name || name.length>85 || !Object.hasOwn(eventTypes,type)) return false;
    const id = "school:"+JSON.stringify(item);
    if (!imported.some(event => event.id===id)) imported.push({id,date,name,type,source:"School calendar"});
  }
  state.imported = imported;
  persist();
  refresh();
  showToast(`${imported.length} school events imported.`);
  return true;
}

document.addEventListener("click",event => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    const anchorLink = event.target.closest("a[href^='#']");
    if (anchorLink) {
      if (dialog.open) dialog.close();
      if (anchorLink.hash === location.hash) screen.scrollTop = 0;
    }
    return;
  }
  const [action,value,contextId] = button.dataset.action.split(":");
  switch (action) {
    case "more": more(); break;
    case "install": installApp().catch(() => showToast("Use your browser menu to add Open Up to your home screen.")); break;
    case "privacy": privacy(); break;
    case "preview": sharingPreview(value); break;
    case "add": addDeadline(); break;
    case "demo": demo(); break;
    case "close": dialog.close(); break;
    case "skip": showToast("Skipped today. Resets and support are still available."); break;
    case "mood": {
      const journal = main.querySelector(".journal[open]");
      const draft = journal?.querySelector("textarea")?.value;
      updateDate();
      state.entries[anchor] = {...state.entries[anchor],score:Number(value)};
      assignMoodGame(state.entries[anchor]);
      considerReferral();
      persist();
      refresh(`[data-action="mood:${value}"]`);
      if (journal) {
        const updatedJournal = main.querySelector(".journal");
        updatedJournal.open = true;
        updatedJournal.querySelector("textarea").value = draft;
      }
      showToast(page === "widget" ? "Mood saved for today." : `Mood saved. ${games[recommend(state.entries[anchor]).id].title} is ready.`);
      break;
    }
    case "game": startGame(value, contextId); break;
    case "meditation": meditation(); break;
    case "meditate": toggleMeditation(button); break;
    case "flip": flipLantern(Number(value)); break;
    case "turn": {
      const first = game.revealed[0];
      game.revealed = [];
      redrawLanterns("flip:"+first);
      break;
    }
    case "bloom-colour":
      game.colour = value;
      redrawBloom("bloom-colour:"+value);
      break;
    case "water":
      game.moved++;
      redrawBloom(game.moved === 3 ? "plant" : "water");
      break;
    case "plant": finishGame(); break;
    case "paced": startPaced(); break;
    case "pop":
      game.moved++;
      if (game.moved === bubbleCount) {finishGame(); break;}
      document.querySelector("#game-progress").textContent = `${game.moved} of ${bubbleCount} bubbles`;
      button.dataset.position = String(game.moved);
      break;
    case "notice":
      game.moved++;
      if (game.moved === sensePrompts.length) {finishGame(); break;}
      document.querySelector("#game-progress").textContent = sensePrompts[game.moved];
      break;
    case "aside":
      button.remove();
      game.moved++;
      if (game.moved===3) {
        document.querySelector(".thoughts").textContent = "A little room to focus.";
        document.querySelector("#focus-feedback").textContent = "";
      }
      (document.querySelector(".thoughts button") || document.querySelector("#focus-form select")).focus();
      break;
    case "contact":
      modal("School social worker",`<div class="stack"><p>For your school’s real contact details, check the school directory or ask a trusted member of staff. You can create a fictional request in this demo.</p>${supportDirectory}<div class="controls">${btn("Send demo request","request")}</div></div>`);
      break;
    case "request":
      if (!state.case) state.case = {date:anchor,reason:"Student requested contact",days:lowDays(),trend:sharedCaseTrend(),status:"New"};
      persist();
      dialog.close();
      refresh();
      showToast("Demo request saved to the social-worker queue.");
      break;
    case "review-case":
      state.case.status = "Reviewed";
      persist();
      refresh();
      showToast("Follow-up marked reviewed.");
      break;
    case "seed": seed(value); break;
    case "reset-confirm":
      modal("Reset this demo?",`<p>This clears check-ins, deadlines, consent choices and garden contributions in this browser.</p><div class="controls">${btn("Reset demo","reset")}${btn("Cancel","close","quiet")}</div>`);
      break;
    case "reset":
      state=initial();
      persist();
      dialog.close();
      if(page==="today") refresh(); else location.hash="today";
      showToast("Demo reset.");
      break;
    case "remove":
      state.personal=state.personal.filter(event=>event.id!==value);
      persist();
      refresh();
      showToast("Deadline removed.");
      break;
    case "move":
      state.classMove=true;
      persist();
      refresh();
      showToast("Class calendar updated.");
      break;
    case "sample":
      applyCsv(`date,title,type\n${day(2)},History quiz,exam\n${day(4)},Geography worksheet,work`);
      break;
    case "upload": document.querySelector("#csv").click(); break;
  }
});
document.addEventListener("change",async event => {
  if (event.target.id === "review-month") {
    reviewMonth = event.target.value;
    refresh("#review-month");
    return;
  }
  if (event.target.matches("#deadline-form select")) {
    const date = event.target.form.elements.date;
    date.min = event.target.value === "grades" ? day(-2) : anchor;
    return;
  }
  if (event.target.id !== "csv" || !event.target.files.length) return;
  const file = event.target.files[0];
  event.target.value="";
  try { if (file.size <= 100000 && applyCsv(await file.text())) return; } catch {}
  showToast("Use a CSV with date (YYYY-MM-DD), title and type (exam, work or grades).");
});
document.addEventListener("submit",event => {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  switch (form.id) {
    case "note-form":
      if (!state.entries[anchor]) {showToast("Choose an emoji before saving your note."); return;}
      state.entries[anchor].note = String(data.get("note")).trim();
      persist();
      showToast("Private note saved.");
      break;
    case "deadline-form": {
      const name=String(data.get("name")).trim();
      if (!name) {showToast("Enter a deadline title."); return;}
      state.personal.push({id:"personal-"+Math.random().toString(36).slice(2),name,type:data.get("type"),date:data.get("date"),source:"Just for you"});
      persist();
      dialog.close();
      refresh();
      showToast("Calendar event saved.");
      break;
    }
    case "privacy-form":
      state.consent={aggregate:data.has("aggregate"),referral:data.has("referral"),shareTrend:data.has("shareTrend")};
      considerReferral();
      persist();
      dialog.close();
      refresh();
      showToast("Consent settings saved.");
      break;
    case "focus-form":
      if (game.moved < 3) {document.querySelector("#focus-feedback").textContent = "Set aside each distraction before finishing."; return;}
      finishGame();
      break;
    case "shred-form":
      form.querySelector("textarea").value="";
      form.querySelector("button").disabled=true;
      document.querySelector("#paper").classList.add("tear");
      expiry=setTimeout(finishGame,550);
      break;
  }
});
const demoRoutes = {
  widget:"widget", today:"today", checkin:"today", game:"today", garden:"garden", review:"review",
  lanterns:"support", bloom:"support", meditation:"support", "sharing-preview":"today",
  calendar:"calendar", fog:"calendar", results:"today", shredder:"today",
  seven:"today", fourteen:"today", consent:"today", worker:"worker", teacher:"teacher", "updated-calendar":"calendar"
};
function showDemoStep(step) {
  if (step !== "map" && !Object.hasOwn(demoRoutes,step)) return;
  clearTimers();
  game = null;
  if (dialog.open) dialog.close();
  if (step === "map") return;
  updateDate();
  if (step === "results" || step === "shredder") {
    if (!state.scenario || state.entries[anchor]?.score > 2 || !state.entries[anchor]) loadScenario("grades");
  } else if (step === "seven") loadScenario(7);
  else if ((step === "fourteen" || step === "consent") && lowDays() < 14) loadScenario(14);
  else if (step === "checkin" || step === "game") state.scenario = false;

  if (step === "review" && !Object.keys(state.entries).length) {
    const sample = day(-1,anchor.slice(0,7)+"-01");
    [4,3,2,3,4].forEach((score,index) => state.entries[day(index-4,sample)] = {score,note:""});
    reviewMonth = sample.slice(0,7);
  }
  if (step === "game") {
    if (!lowMood(state.entries[anchor])) state.entries[anchor] = {...state.entries[anchor],score:2};
    assignMoodGame(state.entries[anchor]);
  }
  history.replaceState(null,"","#"+demoRoutes[step]);
  route();
  if (step === "game") startGame(state.entries[anchor].reset);
  if (step === "lanterns" || step === "bloom") startGame(step);
  if (step === "meditation") meditation();
  if (step === "sharing-preview") sharingPreview();
  if (step === "fog") startGame("fog","math");
  if (step === "shredder") startGame("shred","biology");
  if (step === "consent") privacy();
  if (step === "seven" || step === "fourteen") main.querySelector(".banner")?.scrollIntoView({block:"center"});
}

if (presentation) {
  window.addEventListener("message",event => {
    if (event.source !== window.parent || event.origin !== location.origin || event.data?.type !== "mood-campus-preview") return;
    showDemoStep(event.data.step);
  });
}

function updateDate() {
  const current = formatter.format(new Date());
  if (anchor === current) return false;
  anchor = current;
  return true;
}
window.addEventListener("hashchange",() => {updateDate(); route();});
document.addEventListener("visibilitychange",() => {
  if (!document.hidden && !dialog.open && updateDate()) {
    if (considerReferral()) persist();
    refresh();
  }
});
window.addEventListener("beforeinstallprompt",event => {
  event.preventDefault();
  installPrompt = event;
});
if (window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone) {
  document.body.classList.add("installed-app");
}
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
if (state.entries[anchor]?.score <= 2 && !moodPool.includes(state.entries[anchor].reset)) {
  assignMoodGame(state.entries[anchor]);
  persist();
}
if (considerReferral()) persist();
route();
