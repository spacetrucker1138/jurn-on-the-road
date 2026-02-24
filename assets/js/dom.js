// dom.js — JURN: On the Road
"use strict";

class DOM {
  constructor() {
    this.assignButton   = document.getElementById("assign-button");
    this.craftButton    = document.getElementById("craft-button");
    this.researchButton = document.getElementById("research-button");

    this.assign   = document.getElementById("assign");
    this.craft    = document.getElementById("craft");
    this.research = document.getElementById("research");

    // Resource displays (IDs kept generic but now show cash/fans/gear)
    this.wood          = document.getElementById("cash-amount");
    this.woodIncome    = document.getElementById("cash-income");
    this.food          = document.getElementById("fans-amount");
    this.foodIncome    = document.getElementById("fans-income");
    this.stone         = document.getElementById("gear-amount");
    this.stoneIncome   = document.getElementById("gear-income");
    this.craftSpeed    = document.getElementById("craft-speed");
    this.researchSpeed = document.getElementById("research-speed");

    // Hidden gather buttons (still referenced by game.js)
    this.gatherWood = document.getElementById("gather-wood");
    this.gatherFood = document.getElementById("gather-food");

    // Crew counts
    this.lumberjack         = document.getElementById("lumberjack");
    this.fishermanVillager  = document.getElementById("fisherman-villager");
    this.minerVillager      = document.getElementById("miner-villager");
    this.blacksmithVillager = document.getElementById("blacksmith-villager");
    this.professorVillager  = document.getElementById("professor-villager");
    this.fishermanMentor    = document.getElementById("fisherman-mentor");
    this.minerMentor        = document.getElementById("miner-mentor");
    this.blacksmithMentor   = document.getElementById("blacksmith-mentor");
    this.professorMentor    = document.getElementById("professor-mentor");
    this.fishermanManager   = document.getElementById("fisherman-manager");
    this.minerManager       = document.getElementById("miner-manager");
    this.blacksmithManager  = document.getElementById("blacksmith-manager");
    this.professorManager   = document.getElementById("professor-manager");

    // Building levels
    this.tentLevel    = document.getElementById("tent-level");
    this.pierLevel    = document.getElementById("pier-level");
    this.quarryLevel  = document.getElementById("quarry-level");
    this.smithyLevel  = document.getElementById("smithy-level");
    this.academyLevel = document.getElementById("academy-level");

    // Chaos indicators
    this.pierChaos    = document.getElementById("pier-chaos");
    this.quarryChaos  = document.getElementById("quarry-chaos");
    this.smithyChaos  = document.getElementById("smithy-chaos");
    this.academyChaos = document.getElementById("academy-chaos");

    // Assignment buttons
    this.fishermanVillagerUp    = document.getElementById("fisherman-villager-up");
    this.fishermanVillagerDown  = document.getElementById("fisherman-villager-down");
    this.minerVillagerUp        = document.getElementById("miner-villager-up");
    this.minerVillagerDown      = document.getElementById("miner-villager-down");
    this.blacksmithVillagerUp   = document.getElementById("blacksmith-villager-up");
    this.blacksmithVillagerDown = document.getElementById("blacksmith-villager-down");
    this.professorVillagerUp    = document.getElementById("professor-villager-up");
    this.professorVillagerDown  = document.getElementById("professor-villager-down");
    this.fishermanMentorUp      = document.getElementById("fisherman-mentor-up");
    this.fishermanMentorDown    = document.getElementById("fisherman-mentor-down");
    this.minerMentorUp          = document.getElementById("miner-mentor-up");
    this.minerMentorDown        = document.getElementById("miner-mentor-down");
    this.blacksmithMentorUp     = document.getElementById("blacksmith-mentor-up");
    this.blacksmithMentorDown   = document.getElementById("blacksmith-mentor-down");
    this.professorMentorUp      = document.getElementById("professor-mentor-up");
    this.professorMentorDown    = document.getElementById("professor-mentor-down");
    this.fishermanManagerUp     = document.getElementById("fisherman-manager-up");
    this.fishermanManagerDown   = document.getElementById("fisherman-manager-down");
    this.minerManagerUp         = document.getElementById("miner-manager-up");
    this.minerManagerDown       = document.getElementById("miner-manager-down");
    this.blacksmithManagerUp    = document.getElementById("blacksmith-manager-up");
    this.blacksmithManagerDown  = document.getElementById("blacksmith-manager-down");
    this.professorManagerUp     = document.getElementById("professor-manager-up");
    this.professorManagerDown   = document.getElementById("professor-manager-down");

    // Save / Load / Reset
    this.save      = document.getElementById("save");
    this.load      = document.getElementById("load");
    this.reset     = document.getElementById("reset");
    this.logExpand = document.getElementById("log-expand");

    // Popups
    this.popupShroud = document.getElementById("popup-shroud");
    this.popup       = document.getElementById("popup");
    this.popupText   = document.getElementById("popup-text");
    this.popupDismiss = document.getElementById("popup-dismiss");

    this.storyShroud = document.getElementById("story-shroud");
    this.storyText   = document.getElementById("story-text");
    this.storyDismiss = document.getElementById("story-dismiss");

    // World / log
    this.world       = document.getElementById("world");
    this.log         = document.getElementById("log");
    this.messageArea = document.getElementById("message-area");

    // Dynamic upgrade list
    this.upgrades = [];

    // HUD bar elements (always-visible inventory strip)
    this.hudCash = document.getElementById("hud-cash");
    this.hudFans = document.getElementById("hud-fans");
    this.hudGear = document.getElementById("hud-gear");
    this.hudCrew = document.getElementById("hud-crew");
    this.hudVan  = document.getElementById("hud-van");
  }
}
