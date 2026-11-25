"use strict";

const journeys = [
  {
    title: "Daily check-in",
    theme: "green",
    steps: [
      ["widget","Home Screen Widget","Tap a mood from the home screen","Tap a mood to save today’s check-in. The widget confirms it without showing the mood you picked. Select See your reset to open Today."],
      ["today","Today","Student home","Open Today to see your saved check-in, upcoming events, and a suggested reset."],
      ["checkin","Emoji Check-in","Save a mood in one tap","Tap Low or Very low. Today will suggest one of five short games. The private note is optional."],
      ["game","Random Mini-game","Play the suggested reset","Play the reset drawn from the low-mood pool. Finishing it adds one anonymous drop to the class garden."],
      ["garden","Class Garden","Grow a shared space","See the class garden. If you just completed a game, its anonymous drop is included in the total."],
      ["review","Mood Review","See a private trend","Change the Month selector to compare reviews. The monthly average uses saved check-ins, and the trend chart leaves gaps for missed days."]
    ]
  },
  {
    title: "Play or pause",
    theme: "gold",
    steps: [
      ["lanterns","Lantern Pairs","Match three pairs","Flip six lantern tiles to light three matched pairs. A mismatch waits for you to turn both over."],
      ["bloom","Grow a Bloom","Grow a flower","Choose a colour, water the seed three times, then add the bloom to the class garden."],
      ["meditation","Guided Meditation","Try a quiet minute","Start the guided practice and follow the prompts. You can pause or close it whenever you want."]
    ]
  },
  {
    title: "School calendar and results",
    theme: "blue",
    steps: [
      ["calendar","School Calendar","See or add deadlines","Open Add deadline to enter a quiz, a homework deadline, or a results date. Imported school events appear alongside private dates."],
      ["fog","Clear the Fog","Reset before each deadline","Try the Maths quiz breathing game. Press and release with the cues, or start hands-free breathing."],
      ["results","Results Day","Show the low-mood recommendation","This scenario loads a low check-in on Biology results day. Emotional Shredder appears first, with the random game still available."],
      ["shredder","Emotional Shredder","Let go of a private thought","Type an optional fictional thought and tap Shred the paper. The text is cleared and never stored."]
    ]
  },
  {
    title: "Privacy and student support",
    theme: "violet",
    steps: [
      ["sharing-preview","Preview Teacher View","Compare what each role sees","Switch between Teacher and Social worker. Your current streak is shown separately, and the staff views exclude the diary."],
      ["seven","7-Day Prompt","Offer support privately","Seven days of Low or Very low check-ins load a gentle prompt, with direct online counselling and school social worker options."],
      ["fourteen","14-Day Follow-up","Offer school follow-up","Fourteen low-mood days trigger automatic referral if consent is on. The teacher gets a class-level notice, and the social worker gets the named referral."],
      ["consent","Privacy & Consent","Choose what to share","To demonstrate a named referral, enable school social-worker follow-up and save. You can also choose to share a 14-day emoji chart. Then open Social Worker."],
      ["worker","Social Worker","View authorised follow-ups","The queue shows a fictional named referral after the student authorises it in Privacy & Consent. Open that step first to add one."]
    ]
  },
  {
    title: "Classroom response",
    theme: "gold",
    steps: [
      ["teacher","Teacher View","See class patterns","The teacher sees a class trend and a deadline clash on Workload Radar. Move the essay by two days, then open Updated Calendar to see the change."],
      ["updated-calendar","Updated Calendar","See the revised due date","After moving the essay in Teacher View, check the English essay card here for the new date and the teacher update."]
    ]
  }
];

const steps = journeys.flatMap(({title,steps}) => steps.map(([id,name,summary,cue]) => ({id,name,summary,cue,journey:title})));
const tabs = document.querySelector("#flow-tabs");
const map = document.querySelector("#flow-map");
const preview = document.querySelector("#flow-preview");
const phone = document.querySelector("#flow-phone");
const previous = document.querySelector("#previous-step");
const next = document.querySelector("#next-step");
const targetOrigin = location.origin === "null" ? "*" : location.origin;
const pageLink = (id, label) => `<a href="#${id}" data-step="${id}">${label}</a>`;
let selected;
let phoneReady = false;

tabs.innerHTML = pageLink("map","Flow Map") + steps.map(step => pageLink(step.id,step.name)).join("");
document.querySelector("#flow-rows").innerHTML = journeys.map(({title,theme,steps}) => `
  <section class="journey ${theme}">
    <h3>${title}</h3>
    <ol>${steps.map(([id,name,summary],index) => `<li>${index ? '<span class="connector" aria-hidden="true">→</span>' : ""}${pageLink(id,`<strong>${name}</strong><small>${summary}</small>`)}</li>`).join("")}</ol>
  </section>`).join("");

function sendStep() {
  if (phoneReady) phone.contentWindow.postMessage({type:"mood-campus-preview",step:selected},targetOrigin);
}

function renderFlow() {
  const index = steps.findIndex(step => step.id === location.hash.slice(1));
  const item = steps[index];
  selected = item?.id ?? "map";
  tabs.querySelectorAll("a").forEach(tab => {
    if (tab.dataset.step === selected) tab.setAttribute("aria-current","page");
    else tab.removeAttribute("aria-current");
  });
  map.hidden = Boolean(item);
  preview.hidden = !item;
  if (item) {
    document.querySelector("#preview-group").textContent = item.journey;
    document.querySelector("#preview-name").textContent = item.name;
    document.querySelector("#preview-cue").textContent = item.cue;
    previous.href = index > 0 ? "#" + steps[index-1].id : "#map";
    next.href = index < steps.length-1 ? "#" + steps[index+1].id : "#map";
    next.textContent = index < steps.length-1 ? "Next step" : "Flow Map";
    if (!phone.getAttribute("src")) phone.src = "./index.html?presentation=1";
  }
  sendStep();
  window.scrollTo(0,0);
}

phone.addEventListener("load",() => {
  if (!phone.getAttribute("src")) return;
  phoneReady = true;
  sendStep();
});
window.addEventListener("hashchange",() => {
  renderFlow();
  document.querySelector(selected === "map" ? "#map-heading" : "#preview-name").focus({preventScroll:true});
});
renderFlow();
