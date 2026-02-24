// road.js — JURN: On the Road
// Handles the two-screen toggle and road event system
"use strict";

(function () {
  const homeView  = document.getElementById("home-base-view");
  const roadView  = document.getElementById("road-view");
  const goRoadBtn = document.getElementById("go-road-btn");
  const goBaseBtn = document.getElementById("go-base-btn");
  const eventFeed = document.getElementById("road-event-feed");
  const bookBtn   = document.getElementById("book-show-btn");
  const buskBtn   = document.getElementById("busk-btn");

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

  // Road events pool
  const ROAD_EVENTS = [
    { text: "Flat tire outside Tulsa. Lost 30 min and some dignity.", cash: -20, fans: 0,   bad: true  },
    { text: "A local zine did a tiny feature. Word is spreading!",   cash: 0,   fans: 15,  bad: false },
    { text: "Promoter stiffed you $40. Classic.",                    cash: -40, fans: 0,   bad: true  },
    { text: "Sold out of T-shirts at the merch table!",              cash: 60,  fans: 10,  bad: false },
    { text: "Radio DJ played your track. Phones lit up.",            cash: 0,   fans: 30,  bad: false },
    { text: "Gas station run-in with an old fan. They cried a little.", cash: 0, fans: 5,  bad: false },
    { text: "PA blew mid-set. Crowd still went nuts somehow.",       cash: -25, fans: 20,  bad: false },
    { text: "Found $20 in the tour van couch cushions.",             cash: 20,  fans: 0,   bad: false },
    { text: "Venue double-booked you with a wedding DJ. Awkward.",   cash: -15, fans: -5,  bad: true  },
    { text: "Crowd surfing incident. Van windshield: $80.",          cash: -80, fans: 25,  bad: true  },
    { text: "College radio picked up the demo. Pure chaos energy.",  cash: 0,   fans: 40,  bad: false },
    { text: "Roadie accidentally booked two gigs on the same night. Bold.",   cash: 0, fans: -10, bad: true },
  ];

  function addEvent(ev) {
    // Remove hint text on first event
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

    // Trim to last 8 events
    const events = eventFeed.querySelectorAll(".road-event");
    if (events.length > 8) events[events.length - 1].remove();

    // Apply effect to game state (global `game` object)
    if (typeof game !== "undefined") {
      game.cash = Math.max(0, game.cash + ev.cash);
      game.fans = Math.max(0, game.fans + ev.fans);
    }
  }

  // Book a Show button — triggers a random road event
  bookBtn.addEventListener("click", () => {
    const ev = ROAD_EVENTS[Math.floor(Math.random() * ROAD_EVENTS.length)];
    addEvent(ev);
  });

  // Busk button — small manual fan + cash gain
  buskBtn.addEventListener("click", () => {
    if (typeof game !== "undefined") {
      game.cash += 5;
      game.fans += 2;
    }
    addEvent({ text: "Busked outside the venue. Hat overfloweth.", cash: 5, fans: 2, bad: false });
  });

  // Auto road event every 45s while on road screen
  setInterval(() => {
    if (!onRoad) return;
    const ev = ROAD_EVENTS[Math.floor(Math.random() * ROAD_EVENTS.length)];
    addEvent(ev);
  }, 45000);

})();
