// upgradeList.js — JURN: On the Road
// Upgrade definitions — reskinned from Village of Chaos
"use strict";

class Upgrade {
  constructor(params = {}) {
    this.name        = params?.name;
    this.description = params?.description;
    this.type        = params?.type;
    this.cost        = params?.cost;
    this.duration    = params?.duration;
    this.once        = params?.once;
    this.scaling     = params.scaling;
    this.requirement = params?.requirement;
    this.effect      = params?.effect;
  }
}

Game.prototype.upgradeList = [
  // ── Core progression ──────────────────────────────────────────────────────
  new Upgrade({
    name: "Buy a used van",
    description: "It runs. Mostly. Fits two roadies and a dream.",
    type: "craft", cost: { wood: 10, food: 10 }, duration: 2, once: true,
    effect: function(game) {
      game.levels.tent += 1; game.lumberjack += 2;
      game.unlock("assign"); game.unlock("income");
      game.logMessage("event", "Two roadies have joined the tour. The van smells worse already.");
    },
  }),
  new Upgrade({
    name: "Squeeze in another bunk",
    description: "Duct-tape a hammock to the ceiling. One more roadie fits.",
    type: "craft", cost: { wood: 20, food: 40 }, duration: 2, once: false, scaling: 1.5,
    requirement: ["tent", 1],
    effect: function(game) {
      game.levels.tent += 1; game.lumberjack += 1;
      game.logMessage("event", "One more roadie joins. They call dibs on the hammock.");
    },
  }),
  new Upgrade({
    name: "Book bar circuit",
    description: "Lock down a string of dive bars. Small crowds, big character.",
    type: "craft", cost: { wood: 100 }, duration: 4, once: true, requirement: ["tent", 1],
    effect: function(game) {
      game.levels.pier += 1; game.unlock("fisherman");
      game.logMessage("event", "Bar circuit booked. Smells like stale beer and possibility.");
    },
  }),
  new Upgrade({
    name: "Extend the bar run",
    description: "More bars, more fans, more questionable decisions.",
    type: "craft", cost: { wood: 200 }, duration: 4, once: false, scaling: 4,
    requirement: ["pier", 1],
    effect: function(game) {
      game.production.fisherman *= 2; game.levels.pier += 1;
      game.logMessage("event", "The bar circuit just got longer. Your liver is not thrilled.");
    },
  }),
  new Upgrade({
    name: "Book club circuit",
    description: "Step up to proper clubs. Real stage, real lights, real egos.",
    type: "craft", cost: { wood: 200 }, duration: 5, once: true, requirement: ["pier", 1],
    effect: function(game) {
      game.unlock("stone"); game.unlock("miner"); game.levels.quarry += 1;
      game.logMessage("event", "Club circuit unlocked. Press kits suddenly seem necessary.");
    },
  }),
  new Upgrade({
    name: "Expand the club run",
    description: "More cities, bigger rooms, fancier riders.",
    type: "craft", cost: { wood: 250, stone: 100 }, duration: 5, once: false, scaling: 4,
    requirement: ["quarry", 1],
    effect: function(game) {
      game.levels.quarry += 1; game.production.miner *= 2;
      game.logMessage("event", "The club circuit grows. You\'re almost a real band.");
    },
  }),
  new Upgrade({
    name: "Set up merch table",
    description: "T-shirts, patches, and a vinyl run. Money on the table — literally.",
    type: "craft", cost: { wood: 200, stone: 200 }, duration: 6, once: true,
    requirement: ["quarry", 2],
    effect: function(game) {
      game.levels.smithy += 1; game.unlock("blacksmith"); game.unlock("craftSpeed");
      game.logMessage("event", "Merch table is live. Please don\'t fold the shirts wrong.");
    },
  }),
  new Upgrade({
    name: "Upgrade merch operation",
    description: "Better printer, faster turnaround, less iron-on disasters.",
    type: "craft", cost: { wood: 400, stone: 400 }, duration: 6, once: false, scaling: 2,
    requirement: ["smithy", 1],
    effect: function(game) {
      game.levels.smithy += 1; game.production.blacksmith *= 0.75;
      game.logMessage("event", "Merch operation upgraded. The hoodies are legitimately good now.");
    },
  }),
  new Upgrade({
    name: "Score a festival slot",
    description: "One slot on a mid-size festival lineup. This changes everything.",
    type: "craft", cost: { wood: 1000, stone: 1000 }, duration: 10, once: true,
    requirement: ["smithy", 3],
    effect: function(game) {
      game.levels.academy += 1; game.unlock("professor"); game.unlock("research"); game.unlock("researchSpeed");
      game.logMessage("event", "Festival slot confirmed. You are now, officially, A Band.");
    },
  }),
  new Upgrade({
    name: "Climb the festival bill",
    description: "Negotiate a better slot. Maybe even a second stage.",
    type: "craft", cost: { wood: 1500, stone: 2000 }, duration: 10, once: false, scaling: 2,
    requirement: ["academy", 1],
    effect: function(game) {
      game.levels.academy += 1; game.production.professor *= 0.75;
      game.logMessage("event", "You move up the festival bill. The headliner is nervous.");
    },
  }),
  new Upgrade({
    name: "Mentorship program",
    description: "Pair veteran roadies with new ones. Pass the knowledge.",
    type: "research", cost: { food: 1500 }, duration: 6, once: true,
    requirement: ["academy", 1],
    effect: function(game) {
      game.mentorUnlocked = true; game.unlock("mentor");
      game.logMessage("event", "Tour managers are now mentoring roadies. Efficiency rises.");
    },
  }),
  new Upgrade({
    name: "A&R rep program",
    description: "Industry contacts making sure chaos doesn\'t eat the whole budget.",
    type: "research", cost: { food: 6000 }, duration: 12, once: true,
    requirement: ["academy", 3],
    effect: function(game) {
      game.managerUnlocked = true; game.unlock("manager");
      game.logMessage("event", "A&R reps deployed. Chaos levels: slightly managed.");
    },
  }),

  // ── Gear upgrades ─────────────────────────────────────────────────────────
  new Upgrade({
    name: "Buy a used PA system",
    description: "It crackles. It hums. It plays music. Barely.",
    type: "craft", cost: { wood: 40 }, duration: 3, once: true, requirement: ["tent", 1],
    effect: function(game) {
      game.production.lumberjack *= 1.75;
      game.logMessage("event", "PA system acquired. The hum is a feature, not a bug.");
    },
  }),
  new Upgrade({
    name: "Better stage monitoring",
    description: "Actually hear yourself play for once.",
    type: "craft", cost: { wood: 100 }, duration: 3, once: true, requirement: ["pier", 1],
    effect: function(game) {
      game.production.fisherman *= 1.75;
      game.logMessage("event", "Monitors installed. Singer stops screaming at sound guy.");
    },
  }),
  new Upgrade({
    name: "Upgrade backline gear",
    description: "Bigger amps, real drum kit. No more borrowed gear shame.",
    type: "craft", cost: { wood: 120 }, duration: 3, once: true, requirement: ["quarry", 1],
    effect: function(game) {
      game.production.miner *= 1.75;
      game.logMessage("event", "New backline loaded into the van. Springs are groaning.");
    },
  }),
  new Upgrade({
    name: "Upgrade the van sound system",
    description: "If you\'re gonna drive 9 hours to the next show, at least it slaps.",
    type: "craft", cost: { wood: 20, stone: 50 }, duration: 4, once: true, requirement: ["quarry", 1],
    effect: function(game) {
      game.production.lumberjack *= 1.75;
      game.logMessage("event", "New van stereo hits different at 3am on the interstate.");
    },
  }),
  new Upgrade({
    name: "Pro-grade pedalboard",
    description: "Stop borrowing the opener\'s tuner pedal.",
    type: "craft", cost: { wood: 50, stone: 100 }, duration: 5, once: true, requirement: ["quarry", 2],
    effect: function(game) {
      game.production.miner *= 1.75;
      game.logMessage("event", "Pedalboard complete. 14 pedals for a 3-chord punk set. Perfect.");
    },
  }),
  new Upgrade({
    name: "Road case everything",
    description: "Protect the gear or replace the gear. Math checks out.",
    type: "craft", cost: { wood: 60, stone: 120 }, duration: 8, once: true, requirement: ["smithy", 1],
    effect: function(game) {
      game.production.miner *= 1.25;
      game.logMessage("event", "Road cases acquired. Gear now survives the van with dignity.");
    },
  }),
  new Upgrade({
    name: "Ergonomic merch display",
    description: "People buy more when they can see what they\'re buying.",
    type: "craft", cost: { wood: 160, stone: 40 }, duration: 8, once: true, requirement: ["smithy", 1],
    effect: function(game) {
      game.production.fisherman *= 1.25;
      game.logMessage("event", "Merch display upgraded. Sales are up. So is the attitude.");
    },
  }),
  new Upgrade({
    name: "Setlist laminator",
    description: "Pro move. Laminated setlists, no sweat damage.",
    type: "craft", cost: { wood: 200, stone: 120 }, duration: 10, once: true, requirement: ["smithy", 2],
    effect: function(game) {
      game.production.lumberjack *= 1.25;
      game.logMessage("event", "Laminated setlists deployed. The drummer still loses theirs.");
    },
  }),
  new Upgrade({
    name: "Bigger van (cargo trailer)",
    description: "Finally enough room for the full kit and everyone\'s sleeping bag.",
    type: "craft", cost: { wood: 400, stone: 100 }, duration: 10, once: true, requirement: ["smithy", 2],
    effect: function(game) {
      game.production.miner *= 1.5;
      game.logMessage("event", "Trailer hitched. Load-in now takes 20 minutes instead of an hour.");
    },
  }),
  new Upgrade({
    name: "Fish traps",
    description: "Passive fan pipeline — social media on autopilot.",
    type: "craft", cost: { wood: 500 }, duration: 12, once: true, requirement: ["smithy", 3],
    effect: function(game) {
      game.production.fisherman *= 1.5;
      game.logMessage("event", "Social posts scheduled. Fans are rolling in while you sleep.");
    },
  }),
  new Upgrade({
    name: "Lumbar support for long drives",
    description: "9-hour drives wreck the back. Invest in cushions.",
    type: "craft", cost: { wood: 300, stone: 300 }, duration: 12, once: true, requirement: ["smithy", 3],
    effect: function(game) {
      game.production.lumberjack * 1.75;
      game.logMessage("event", "Seat cushions: aboard. Chiropractor visits: down 60%.");
    },
  }),

  // ── Hustle research ────────────────────────────────────────────────────────
  new Upgrade({
    name: "Tour scheduling software",
    description: "Stop routing by vibes. Real mileage matters.",
    type: "research", cost: { food: 2000 }, duration: 15, once: true, requirement: ["academy", 1],
    effect: function(game) {
      game.production.blacksmith -= 0.05; game.production.professor -= 0.05;
      game.logMessage("event", "Tour routing optimized. Cutting 400 miles off the next run.");
    },
  }),
  new Upgrade({
    name: "Stage presence workshop",
    description: "Work on the live show. Bigger energy, more fans converted per gig.",
    type: "research", cost: { food: 600 }, duration: 15, once: true, requirement: ["academy", 1],
    effect: function(game) {
      game.production.lumberjack *= 2;
      game.logMessage("event", "Stage presence: unlocked. Front row is now a survival zone.");
    },
  }),
  new Upgrade({
    name: "Advanced mentorship",
    description: "Veteran roadies get even better at training the new ones.",
    type: "research", cost: { food: 3000 }, duration: 16, once: true, requirement: ["academy", 2],
    effect: function(game) {
      game.production.mentorBoost += 0.1;
      game.logMessage("event", "Tour managers are now seasoned pros. The chaos is... managed.");
    },
  }),

  // ── Story upgrades ─────────────────────────────────────────────────────────
  new Upgrade({
    name: "Track down the mystery promoter",
    description: "Someone keeps booking JURN in towns that don\'t exist on any map.",
    type: "craft", cost: { food: 50 }, duration: 60, once: true, requirement: ["quarry", 2],
    effect: function(game) {
      game.showStory(
        `You follow the booking email trail across three states and two timezone changes.\nThe address leads to a storage unit outside of Tulsa.\nInside: a lawn chair, a laptop, seventeen JURN posters, and a note.\n\n"Keep playing. They\'re listening."\n\nYou don\'t know who wrote it. You leave without answers.\nThe van needs gas.`,
        "Keep moving"
      );
    },
  }),
  new Upgrade({
    name: "Research the signal",
    description: "Something is broadcasting on the same frequency as your amps.",
    type: "research", cost: { food: 800 }, duration: 240, once: true, requirement: ["academy", 2],
    effect: function(game) {
      game.showStory(
        `Your sound engineer noticed it first: a subsonic tone under every recording.\nNot feedback. Not electrical noise. Something deliberate.\nIt matches no known transmitter. It\'s been there since the first demo.\nYou check the original tape.\nIt\'s there too.`,
        "Shelve it for now"
      );
    },
  }),
  new Upgrade({
    name: "Play the final show",
    description: "Everything has been building to this. Every city. Every flat tire.",
    type: "research", cost: { wood: 10000, food: 30000, stone: 50000 }, duration: 1200, once: true,
    requirement: ["academy", 4],
    effect: function(game) {
      game.showStory(
        `The venue is sold out. The signal is louder tonight.\nEvery face in the crowd — you\'ve seen them on the road.\nThe first note rings out and something shifts.`,
        "Play",
        () => {
          game.showStory(
            `The set is perfect. Or maybe the set doesn\'t matter anymore.\nThe signal is deafening now. Not in your ears — in your chest.\nThe crowd isn\'t leaving. They\'re waiting.\nFor what?`,
            "Keep playing",
            () => {
              game.showStory(
                `Static. White light. The van is gone.\nEveryone is still here.\nSomewhere ahead, the road continues.\nJURN plays on.\n\n== END OF TOUR`,
                "Ride into it",
                () => { game.gameOver(); }
              );
            }
          );
        }
      );
    },
  }),

  // ── Bonus / windfall upgrades ──────────────────────────────────────────────
  new Upgrade({
    name: "Raid the green room",
    description: "The headliner left a full rider. Waste not.",
    type: "craft", cost: { wood: 5, food: 5 }, duration: 2, once: true, requirement: ["tent", 1],
    effect: function(game) {
      game.fans += 40;
      game.logMessage("event", "You ate well. The cold cuts were incredible. Zero regrets.");
    },
  }),
  new Upgrade({
    name: "Pawn the spare guitar",
    description: "The backup axe hasn\'t been touched in three tours. Cash it in.",
    type: "craft", cost: { wood: 20 }, duration: 4, once: true, requirement: ["pier", 1],
    effect: function(game) {
      game.cash += 100;
      game.logMessage("event", "Spare guitar sold. Got $100 and freed up significant van space.");
    },
  }),
  new Upgrade({
    name: "Resell festival parking passes",
    description: "You have five. You need one.",
    type: "craft", cost: { stone: 20 }, duration: 5, once: true, requirement: ["quarry", 1],
    effect: function(game) {
      game.gear += 120;
      game.logMessage("event", "Parking passes flipped. Gear fund replenished. Legally gray, morally fine.");
    },
  }),
  new Upgrade({
    name: "Reunion show",
    description: "Book a hometown show. The old fans come out of the woodwork.",
    type: "craft", cost: { food: 40 }, duration: 5, once: true, requirement: ["quarry", 2],
    effect: function(game) {
      game.fans += 200;
      game.logMessage("event", "Hometown show: packed. Someone cried. It was the guitarist.");
    },
  }),
  new Upgrade({
    name: "Viral moment",
    description: "Someone posted a clip. It\'s making the rounds.",
    type: "research", cost: { wood: 50, stone: 50, food: 100 }, duration: 10, once: true,
    requirement: ["academy", 1],
    effect: function(game) {
      game.cash += 1000; game.gear += 1000;
      game.logMessage("event", "The clip hit 40k views. Merch sales spiked. The internet is wild.");
    },
  }),
  new Upgrade({
    name: "Licensing deal",
    description: "A TV show wants to use your track. Small check, big exposure.",
    type: "research", cost: { food: 400 }, duration: 15, once: true, requirement: ["academy", 2],
    effect: function(game) {
      game.cash += 1600; game.gear += 1600; game.fans += 800;
      game.logMessage("event", "Sync deal signed. It\'s a car commercial, but it\'s tasteful.");
    },
  }),
];
