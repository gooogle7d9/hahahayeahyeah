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
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8 8 13 13M8 16 21 3"/>'
};
const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
document.querySelectorAll("[data-icon]").forEach(element => element.innerHTML = icon(element.dataset.icon));

const moods = [
  {emoji:"☹️", label:"Very low"}, {emoji:"😟", label:"Low"}, {emoji:"😐", label:"Okay"},
  {emoji:"🙂", label:"Good"}, {emoji:"😄", label:"Great"}
];
const games = {
  fog:{title:"Clear the fog", time:"60 sec", icon:"wind", theme:"", description:"Press and release with a gentle breathing rhythm before a quiz or exam."},
  focus:{title:"Make room to focus", time:"90 sec", icon:"sparkle", theme:"amber", description:"Set aside three distractions and pick one small task to start."},
  shred:{title:"Let it go", time:"60 sec", icon:"scissors", theme:"pink", description:"Put a tough thought on a slip of paper and shred it when you’re ready."}
};
const navItems = [
  ["today","Today","home"], ["calendar","School calendar","calendar"], ["review","My mood review","chart"],
  ["garden","Class garden","sprout"], ["support","Support","heart"], ["teacher","Teacher view","users"],
  ["worker","Social worker","shield"]
];
const main = document.querySelector("#main");
const dialog = document.querySelector("#dialog");
const content = document.querySelector("#dialog-content");
const key = "mood-campus-gtsu2037-v1";
const formatter = new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Hong_Kong",year:"numeric",month:"2-digit",day:"2-digit"});
const anchor = formatter.format(new Date());
const day = (offset = 0, from = anchor) => {
  const date = new Date(from + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0,10);
};
const showDate = (value, options = {month:"short", day:"numeric"}) => new Date(value + "T12:00:00Z").toLocaleDateString("en-GB",{timeZone:"UTC",...options});
const initial = () => ({entries:{},personal:[],imported:[],energy:14, consent:{aggregate:true,referral:false}, case:null, classMove:false, scenario:false});
let state = initial();
try { state = {...state,...JSON.parse(localStorage.getItem(key) || "{}")}; } catch {}
function persist() {
  try { localStorage.setItem(key,JSON.stringify(state)); } catch {}
}
let page;
let toastTimer;
let game;
let clock;
let hold;
let expiry;
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
    {id:"biology",name:"Biology results",type:"grades",date:day(3),source:"School calendar"}
  ];
}
function events() {
  return [...schoolExamples(),...state.imported,...state.personal].sort((a,b) => a.date.localeCompare(b.date));
}
function nextEvents() { return events().filter(event => event.date >= anchor); }
function eventList(items, editable=false) {
  if (!items.length) return "<p>No upcoming events.</p>";
  return `<ul class="event-list">${items.map(event => `<li class="event"><span class="date-tile">${Number(event.date.slice(8))}<small>${showDate(event.date,{month:"short"})}</small></span><div class="event-body"><b>${escapeHtml(event.name)}</b><small>${event.source}${event.id === "english" && state.classMove ? " · Updated by teacher" : ""}</small></div><span class="event-chip ${event.type}">${eventTypes[event.type]}</span>${editable && event.source==="Just for you" ? btn("Remove","remove:"+event.id,"link") : ""}</li>`).join("")}</ul>`;
}
function recommend(score) {
  if (state.scenario && score <= 2) return {id:"shred", reason:"Biology results came back today."};
  const soon = nextEvents().filter(event => event.date <= day(2));
  const privateEvent = soon.find(event => event.source === "Just for you");
  const grades = events().find(event => event.type === "grades" && event.date >= day(-2) && event.date <= anchor);
  const assessment = soon.find(event => event.type === "exam");
  const event = privateEvent || (score <= 2 && grades) || assessment || (score <= 3 && soon[0]);
  if (!event) return {id:score <= 2 ? "shred" : "focus",reason:"Picked for how you feel today."};
  const when = event.date === anchor ? "today" : event.date === day(1) ? "tomorrow" : "on " + showDate(event.date);
  const campusReason = `${escapeHtml(event.name)} · ${when}.`;
  const id = event.type === "exam" ? "fog" : event.type === "grades" && score <= 2 ? "shred" : "focus";
  return {id,reason:campusReason};
}
function lowDays() {
  let count = 0;
  while (state.entries[day(-count)]?.score === 1) count++;
  return count;
}
function considerReferral() {
  if (lowDays() >= 14 && state.consent.referral && !state.case) {
    state.case = {date:anchor,reason:"14 consecutive very-low check-ins",status:"New"};
  }
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
  const count = lowDays();
  if (count < 7) return "";
  const copy = state.case
    ? "A follow-up for Alex Lee is in the simulated social-worker queue."
    : count >= 14
      ? "You can give the school social worker permission to check in with you."
      : "It sounds like this week has been a lot. Would you like to talk to someone?";
  return `<aside class="banner"><b>${count >= 14 ? "School support" : "A gentle check-in"}</b><p>${copy}</p><div class="controls">${link("See support options","support")}${btn("Review consent","privacy","link")}</div></aside>`;
}
function today() {
  const entry = state.entries[anchor];
  const suggestion = recommend(entry?.score);
  const pastSameDay = [7,14,21,28].filter(offset => state.entries[day(-offset)]?.score <= 2).length;
  const pattern = entry?.score <= 2 && pastSameDay >= 2 ? `<small>Your check-in was also low on ${pastSameDay} recent ${showDate(anchor,{weekday:"long"})}s.</small>` : "";
  const exercise = games[suggestion.id];
  return `<section class="hero"><div><div class="eyebrow">${icon("sun")} ${showDate(anchor,{weekday:"long",month:"long",day:"numeric"})}</div><h1>Hi, Alex.</h1><p>Take a moment to check in with yourself, then find a small reset for whatever school brings today.</p></div></section>
  <div class="dashboard"><div class="stack">
  <section class="card"><div class="card-head"><div><h2>How are you feeling?</h2><p>Tap one emoji to save today’s check-in.</p></div>${badge("heart")}</div>
  <div class="moods" role="group" aria-label="Today’s mood">${moods.map((mood,index) => `<button class="mood" data-action="mood:${index+1}" aria-pressed="${entry?.score===index+1}"><span aria-hidden="true">${mood.emoji}</span>${mood.label}</button>`).join("")}</div>
  <details class="journal"><summary>Add a private note</summary><form id="note-form"><label class="field">Today’s note<textarea name="note" maxlength="600" placeholder="Anything you’d like to remember?">${escapeHtml(entry?.note)}</textarea></label><div class="controls"><button class="btn" type="submit">Save note</button></div></form></details>
  <div class="controls split">${btn("Preview teacher view","preview","quiet","eye")} ${entry ? '<span class="status-text">✓ Saved today</span>' : btn("Skip for today","skip","link")}</div>${carePrompt()}</section>
  <section class="card recommend"><div class="card-head"><div><div class="eyebrow">${entry ? "Picked for this check-in" : "Today’s reset"}</div><h2>${exercise.title}</h2></div>${badge(exercise.icon,exercise.theme)}</div>
  <p>${suggestion.reason} ${exercise.description}</p>${pattern}<div class="controls">${btn("Start reset","game:"+suggestion.id,"","play")}<span class="pill">${exercise.time}</span>${link("All resets","support","link")}</div></section>
  </div><div class="stack">
  <section class="card"><div class="card-head"><div><h2>Coming up</h2><p>From school and your own plans.</p></div>${badge("calendar")}</div>${eventList(nextEvents().slice(0,3))}<div class="controls">${btn("Add deadline","add","quiet","plus")}${link("View calendar","calendar","link")}</div></section>
  <section class="card garden-card"><div class="card-head"><div><h2>Class garden</h2><p>Every completed reset adds one anonymous drop.</p></div>${badge("sprout","amber")}</div>${gardenArt()}${gardenSummary()}<div class="controls">${link("Visit the garden","garden","link")}</div></section>
  </div></div>`;
}
function calendarPage() {
  return intro("Student space","School calendar","Save a quiz or deadline to get a reset matched to what’s coming up.")+
    `<div class="grid2"><section class="card"><div class="card-head"><div><h2>Upcoming events</h2><p>School events and private deadlines in one place.</p></div>${badge("calendar")}</div>${eventList(nextEvents(),true)}<div class="controls">${btn("Add deadline","add","","plus")}</div></section>
    <section class="card">${badge("calendar","amber")}<h2>School calendar import</h2><p>Use the sample school file or upload an all-day CSV with date, title and type columns. The import stays in this browser.</p><div class="controls">${btn("Import sample","sample","quiet")}${btn("Upload CSV","upload","quiet")}</div><input id="csv" type="file" accept=".csv,text/csv" hidden></section></div>`;
}
function chart(items) {
  return `<div class="chart">${items.map(({label,score}) => `<div class="bar-row"><span>${label}</span><div class="bar" aria-hidden="true"><span style="width:${(score || 0)*20}%"></span></div><b>${score ? score.toFixed(1) : "—"}</b></div>`).join("")}</div>`;
}
function review() {
  const month = anchor.slice(0,7);
  const entries = Object.entries(state.entries).filter(([date]) => date.startsWith(month)).sort(([a],[b]) => a.localeCompare(b));
  const average = entries.length ? (entries.reduce((sum,[,record]) => sum+record.score,0)/entries.length).toFixed(1) : "—";
  const weeks = Array.from({length:Math.ceil(Number(anchor.slice(8))/7)}, (_,index) => {
    const batch=entries.filter(([date]) => Math.floor((Number(date.slice(8))-1)/7)===index);
    return {label:`Days ${index*7+1}–${Math.min(index*7+7,Number(anchor.slice(8)))}`,score:batch.length ? batch.reduce((sum,[,record])=>sum+record.score,0)/batch.length : 0};
  });
  return intro("Private to you","My mood review",showDate(anchor,{month:"long",year:"numeric"}))+
    `<div class="grid2"><section class="card"><h2>Monthly average</h2><div class="kpi">${average} / 5</div><p>${entries.length} check-in${entries.length===1?"":"s"} this month</p>${chart(weeks)}${entries.length ? "" : '<p>Your first check-in will appear here.</p>'}</section><section class="card"><h2>My diary</h2><p>Only you can see these entries.</p><ul class="history-list">${entries.slice().reverse().map(([date,record]) => `<li><b>${moods[record.score-1].emoji} ${moods[record.score-1].label} · ${showDate(date)}</b>${record.note ? `<p>${escapeHtml(record.note)}</p>` : ""}</li>`).join("")}</ul>${entries.length ? "" : link("Go to check-in","today")}</section></div>`;
}
function garden() {
  return intro("Class 5B","Class garden","Every completed reset grows a shared space. Drops are added anonymously.")+
    `<section class="card garden-card">${gardenArt()}<div class="controls split"><h2>Our garden</h2>${link("Find a reset","support","soft")}</div>${gardenSummary()}</section>`;
}
function support() {
  return intro("Student space","Find a reset","Choose something that fits how you feel right now.")+
    `<div class="grid3">${Object.entries(games).map(([id,item]) => `<section class="card">${badge(item.icon,item.theme)}<h2>${item.title}</h2><p>${item.description}</p><div class="controls">${btn("Start reset","game:"+id,"","play")}<span class="pill">${item.time}</span></div></section>`).join("")}</div>
    <section class="card" style="margin-top:17px"><h2>Talk to someone</h2><p>Reach out whenever you’d like support.</p><div class="controls"><a class="btn quiet" href="https://www.openup.hk/" target="_blank" rel="noopener">Open Up online support</a>${btn("School social worker","contact","quiet")}</div>${carePrompt()}</section>`;
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
  ${state.classMove ? `<p><b>English essay moved to ${showDate(day(3))}.</b> The student calendar shows the new date.</p>` : low && overlaps.length > 1 ? `<div class="banner"><b>Three days averaging 3 or below</b><p>${overlaps.map(item=>escapeHtml(item.name)).join(" and ")} fall on the same day.</p></div>${preview ? "" : `<div class="controls">${btn("Move essay two days","move")}</div>`}` : "<p>No workload signal today.</p>"}</section></div>`;
}
function worker() {
  const item = state.case;
  return intro("Staff preview","Social-worker queue","Fictional follow-up requests authorised by the student.")+
    `<section class="card"><h2>Student follow-ups</h2>${item ? `<div class="event"><span class="avatar">AL</span><div class="event-body"><b>Alex Lee · Class 5B</b><small>${item.reason} · ${showDate(item.date)} · Consent recorded</small></div><span class="pill">${item.status}</span></div>${item.status==="New" ? `<div class="controls">${btn("Mark reviewed","review-case","quiet")}</div>` : ""}` : "<p>No authorised referrals yet. Use Demo controls to try the consent flow.</p>"}</section>`;
}
const pages = {today,calendar:calendarPage,review,garden,support,teacher:()=>intro("Staff preview","Teacher dashboard","See class-level trends and coordinate workload.")+teacherBody(),worker};
function render() {
  document.querySelector("#nav").innerHTML = navItems.map(([id,title,symbol],index) =>
    (index===0 ? '<div class="nav-label">Student space</div>' : index===5 ? '<div class="nav-label">Staff preview</div>' : "")+
    `<a class="nav-item" href="#${id}" ${id===page ? 'aria-current="page"' : ""}>${icon(symbol)}${title}</a>`
  ).join("");
  document.querySelector("#breadcrumb").innerHTML = `${["teacher","worker"].includes(page) ? "Staff preview" : "Student space"} <span>/</span> ${navItems.find(item=>item[0]===page)[1]}`;
  main.innerHTML = pages[page]();
}
function route() {
  const requested = location.hash.slice(1);
  page = Object.hasOwn(pages,requested) ? requested : "today";
  if(dialog.open) dialog.close();
  render();
  window.scrollTo(0,0);
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
function privacy() {
  modal("Privacy & consent",`<div class="stack"><p>Your diary and personal deadlines are visible in your student space. Teachers see class averages and school deadlines. Social workers receive your name, class and referral reason after consent.</p>
  <form id="privacy-form"><label class="setting"><input type="checkbox" name="aggregate" ${state.consent.aggregate?"checked":""}><span><b>Include my emoji in class averages</b><small>Teachers see grouped results when there are at least 10 responses.</small></span></label>
  <label class="setting"><input type="checkbox" name="referral" ${state.consent.referral?"checked":""}><span><b>Allow automatic social-worker follow-up</b><small>After 14 consecutive very-low check-ins. At 7 days you get a private prompt. You can change consent for future referrals.</small></span></label>
  <div class="controls"><button class="btn" type="submit">Save consent</button></div></form></div>`);
}
function addDeadline() {
  modal("Add a private deadline",`<form id="deadline-form" class="stack"><p>A deadline within two days can change the reset suggested on Today.</p>
  <label class="field">Title<input name="name" required maxlength="85" placeholder="e.g. Chemistry worksheet"></label>
  <label class="field">Type<select name="type"><option value="work">Homework</option><option value="exam">Quiz or exam</option><option value="grades">Results day</option></select></label>
  <label class="field">Due date<input name="date" type="date" min="${anchor}" value="${day(1)}" required></label>
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
function startGame(id) {
  clearTimers();
  game = {id, rounds:0, phase:"ready", moved:0, done:false, expires:0};
  const item = games[id];
  let exercise;
  if (id === "fog") {
    exercise = '<div class="exercise"><p id="rhythm" aria-live="polite">Hold for 4 seconds as you breathe in gently.</p><button class="breathe" id="breathe" type="button">Press and hold</button><p id="rounds">0 of 3 rounds</p></div><p><small>Using a keyboard or prefer tapping? Use the paced option.</small></p>' + btn("Use paced breathing","paced","link");
  } else if (id === "focus") {
    exercise = `<div class="exercise"><p>Tap each distraction to set it aside.</p><div class="thoughts">${["Messages","Other homework","What ifs"].map(text=>btn(text,"aside","quiet")).join("")}</div><p id="focus-time" role="timer">1:30</p></div><form id="focus-form" class="stack"><label class="field">One small next step <small>Choose one you can do now.</small><select name="step" required><option value="">Choose a step</option><option>Open my notes</option><option>Read the first question</option><option>Set a five-minute timer</option></select></label><div><button class="btn" type="submit">Finish reset</button></div></form>`;
  } else {
    exercise = '<form id="shred-form"><div class="exercise" id="paper"><label class="field">A thought you want to let go<textarea name="thought" maxlength="180" autocomplete="off" placeholder="Write it here if you want…"></textarea></label><p><small>This exercise does not save your words.</small></p></div><button class="btn" type="submit">Shred the paper</button></form>';
  }
  modal(item.title,`<p>${item.description}</p>${exercise}`);
  if (id === "focus") {
    const end = Date.now() + 90000;
    clock = setInterval(() => {
      const remaining = Math.max(0,Math.ceil((end-Date.now())/1000));
      document.querySelector("#focus-time").textContent = remaining ? `${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,"0")}` : "Take your time. You can still finish.";
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
    document.querySelector("#rounds").textContent = game.rounds + " of 3 rounds";
    if (game.rounds === 3) {finishGame(); return;}
    game.phase = "ready";
    document.querySelector("#rhythm").textContent = "Ready for the next breath? Press and hold, or use paced breathing.";
  },6000);
}
function bindFog() {
  const control = document.querySelector("#breathe");
  control.addEventListener("pointerdown",event => {
    if (event.button !== 0) return;
    control.setPointerCapture(event.pointerId);
    inhale();
  });
  control.addEventListener("click",event => {if (event.detail===0) inhale(true);});
  function release() {
    if (game?.phase === "release") {exhale(); return;}
    if (game?.phase !== "in") return;
    clearTimeout(hold);
    game.phase = "ready";
    control.classList.remove("holding");
    document.querySelector("#rhythm").textContent = "Try holding until the release cue, or use paced breathing.";
  }
  control.addEventListener("pointerup",release);
  control.addEventListener("pointercancel",release);
}
dialog.addEventListener("close",() => {
  clearTimers();
  game = null;
  if (page && !document.activeElement.closest("button, a, input, textarea, select")) main.focus({preventScroll:true});
});
function seed(value) {
  state.case = null;
  state.scenario = value === "grades";
  state.entries = {};
  if (state.scenario) state.entries[anchor] = {score:1,note:""};
  else for (let index=0;index<Number(value);index++) state.entries[day(-index)] = {score:1,note:""};
  considerReferral();
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
    if (anchorLink && dialog.open) dialog.close();
    return;
  }
  const [action,value] = button.dataset.action.split(":");
  switch (action) {
    case "privacy": privacy(); break;
    case "preview": modal("Preview teacher view",`<div class="stack"><p>This is the class information a teacher can see. Your journal, name and private deadlines stay in your student space.</p>${teacherBody(true)}</div>`); break;
    case "add": addDeadline(); break;
    case "demo": demo(); break;
    case "close": dialog.close(); break;
    case "skip": showToast("Skipped today. Resets and support are still available."); break;
    case "mood":
      state.entries[anchor] = {...state.entries[anchor],score:Number(value)};
      considerReferral();
      persist();
      refresh(`[data-action="mood:${value}"]`);
      showToast("Today’s mood saved.");
      break;
    case "game": startGame(value); break;
    case "paced": inhale(true); break;
    case "aside":
      button.remove();
      game.moved++;
      if (game.moved===3) document.querySelector(".thoughts").textContent = "A little room to focus.";
      (document.querySelector(".thoughts button") || document.querySelector("#focus-form select")).focus();
      break;
    case "contact":
      modal("School social worker",`<div class="stack"><p>In a real school setup, this would show your school’s contact details. You can try creating a fictional request now.</p><div class="controls">${btn("Send demo request","request")}</div></div>`);
      break;
    case "request":
      if (!state.case) state.case = {date:anchor,reason:"Student requested contact",status:"New"};
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
      showToast("Deadline saved. Check Today for your updated reset.");
      break;
    }
    case "privacy-form":
      state.consent={aggregate:data.has("aggregate"),referral:data.has("referral")};
      considerReferral();
      persist();
      dialog.close();
      refresh();
      showToast("Consent settings saved.");
      break;
    case "focus-form":
      if (game.moved < 3) {showToast("Set aside the three distractions first."); return;}
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
window.addEventListener("hashchange",route);
route();
