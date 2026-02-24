// road.js — JURN: On the Road
// Screen-swap + road events + manual resource buttons
"use strict";

(function () {
  const homeView  = document.getElementById("home-base-view");
  const roadView  = document.getElementById("road-view");
  const goRoadBtn = document.getElementById("go-road-btn");
  const goBaseBtn = document.getElementById("go-base-btn");
  const eventFeed = document.getElementById("road-event-feed");
  const bookBtn   = document.getElementById("book-show-btn");
  const buskBtn   = document.getElementById("busk-btn");

  // Manual resource buttons
  const earnCashBtn  = document.getElementById("earn-cash-btn");
  const earnFansBtn  = document.getElementById("earn-fans-btn");
  const earnGearBtn  = document.getElementById("earn-gear-btn");

  let onRoad = false;

  function setScreen(road) {
    onRoad = road;
    homeView.classList.toggle("active-view", !road);
    roadView.classList.toggle("active-view",  road);
    goRoadBtn.classList.toggle("active-toggle", !road);
    goBaseBtn.classList.toggle("active-toggle",  road);
  }

  goRoadBtn.addEventListener("click", () => setScreen(true));
  goBaseBtn.addEventListener("click", () => setScreen(false));

  // ── Click burst animation ──────────────────────────────────────────────────
  function spawnFloater(btn, text, color) {
    const floater = document.createElement("span");
    floater.className = "click-floater";
    floater.textContent = text;
    floater.style.color = color;
    // Position near the button
    const rect = btn.getBoundingClientRect();
    floater.style.left = (rect.left + rect.width / 2 - 20 + (Math.random() * 30 - 15)) + "px";
    floater.style.top  = (rect.top - 10) + "px";
    document.body.appendChild(floater);
    setTimeout(() => floater.remove(), 800);
  }

  // ── Manual resource buttons ────────────────────────────────────────────────
  earnCashBtn.addEventListener("click", () => {
    if (typeof game === "undefined") return;
    const gain = Math.max(1, Math.floor(game.levels.tent * 0.5 + 1));
    game.cash += gain;
    spawnFloater(earnCashBtn, `+${gain} Cash`, "#e8b923");
    earnCashBtn.classList.add("btn-pulse");
    setTimeout(() => earnCashBtn.classList.remove("btn-pulse"), 120);
  });

  earnFansBtn.addEventListener("click", () => {
    if (typeof game === "undefined") return;
    const gain = Math.max(1, Math.floor(game.levels.pier * 0.5 + 1));
    game.fans += gain;
    spawnFloater(earnFansBtn, `+${gain} Fans`, "#c0392b");
    earnFansBtn.classList.add("btn-pulse");
    setTimeout(() => earnFansBtn.classList.remove("btn-pulse"), 120);
  });

  earnGearBtn.addEventListener("click", () => {
    if (typeof game === "undefined") return;
    const gain = Math.max(1, Math.floor(game.levels.quarry * 0.5 + 1));
    game.gear += gain;
    spawnFloater(earnGearBtn, `+${gain} Gear`, "#7ec8e3");
    earnGearBtn.classList.add("btn-pulse");
    setTimeout(() => earnGearBtn.classList.remove("btn-pulse"), 120);
  });

  // ── Road events pool ───────────────────────────────────────────────────────
  const ROAD_EVENTS = [
    { text: "Flat tire outside Tulsa. Lost 30 min and some dignity.", cash: -20, fans: 0,   bad: true  },
    { text: "A local zine did a tiny feature. Word is spreading!",    cash: 0,   fans: 15,  bad: false },
    { text: "Promoter stiffed you $40. Classic.",                     cash: -40, fans: 0,   bad: true  },
    { text: "Sold out of T-shirts at the merch table!",               cash: 60,  fans: 10,  bad: false },
    { text: "Radio DJ played your track. Phones lit up.",             cash: 0,   fans: 30,  bad: false },
    { text: "Gas station run-in with an old fan. They cried a little.", cash: 0, fans: 5,   bad: false },
    { text: "PA blew mid-set. Crowd still went nuts somehow.",        cash: -25, fans: 20,  bad: false },
    { text: "Found $20 in the tour van couch cushions.",              cash: 20,  fans: 0,   bad: false },
    { text: "Venue double-booked you with a wedding DJ. Awkward.",    cash: -15, fans: -5,  bad: true  },
    { text: "Crowd surfing incident. Van windshield: $80.",           cash: -80, fans: 25,  bad: true  },
    { text: "College radio picked up the demo. Pure chaos energy.",   cash: 0,   fans: 40,  bad: false },
    { text: "Roadie accidentally booked two gigs same night. Bold.",  cash: 0,   fans: -10, bad: true  },
    { text: "Opening slot fell through — JURN headlines by default.", cash: 30,  fans: 20,  bad: false },
    { text: "Van broke down. Pushed it half a mile. Crowd loved it.", cash: -50, fans: 35,  bad: false },
    { text: "Surprise review in a regional paper. Four stars.",       cash: 0,   fans: 50,  bad: false },
  ];

  function addEvent(ev) {
    const hint = eventFeed.querySelector(".road-hint");
    if (hint) hint.remove();

    const p = document.createElement("p");
    p.classList.add("road-event");
    if (ev.bad) p.classList.add("bad");

    let suffix = "";
    if (ev.cash !== 0) suffix += ` [${ev.cash > 0 ? "+" : ""}${ev.cash} Cash]`;
    if (ev.fans !== 0) suffix += ` [${ev.fans > 0 ? "+" : ""}${ev.fans} Fans]`;
    p.textContent = ev.text + suffix;
    eventFeed.prepend(p);

    const events = eventFeed.querySelectorAll(".road-event");
    if (events.length > 8) events[events.length - 1].remove();

    if (typeof game !== "undefined") {
      game.cash = Math.max(0, game.cash + ev.cash);
      game.fans = Math.max(0, game.fans + ev.fans);
    }
  }

  bookBtn.addEventListener("click", () => {
    const ev = ROAD_EVENTS[Math.floor(Math.random() * ROAD_EVENTS.length)];
    addEvent(ev);
  });

  buskBtn.addEventListener("click", () => {
    if (typeof game !== "undefined") { game.cash += 5; game.fans += 2; }
    addEvent({ text: "Busked outside the venue. Hat overfloweth.", cash: 5, fans: 2, bad: false });
  });

  // Auto road event every 45s while on road screen
  setInterval(() => {
    if (!onRoad) return;
    const ev = ROAD_EVENTS[Math.floor(Math.random() * ROAD_EVENTS.length)];
    addEvent(ev);
  }, 45000);

  // ── HUD updater — crew total for status bar ───────────────────────────────
  function totalCrew() {
    if (typeof game === "undefined") return 0;
    const g = game;
    return g.lumberjack
      + g.fisherman.villager  + g.fisherman.mentor  + g.fisherman.manager
      + g.miner.villager      + g.miner.mentor      + g.miner.manager
      + g.blacksmith.villager + g.blacksmith.mentor + g.blacksmith.manager
      + g.professor.villager  + g.professor.mentor  + g.professor.manager;
  }

  function updateHUD() {
    if (typeof game === "undefined") return;
    document.getElementById("hud-cash").textContent  = Math.floor(game.cash);
    document.getElementById("hud-fans").textContent  = Math.floor(game.fans);
    document.getElementById("hud-gear").textContent  = Math.floor(game.gear);
    document.getElementById("hud-crew").textContent  = totalCrew();
    document.getElementById("hud-van").textContent   = game.levels.tent;
  }

  setInterval(updateHUD, 500);

})();
