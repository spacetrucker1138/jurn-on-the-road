// game.js
// JURN: On the Road — reskinned from Village of Chaos by Tearnote
// Resources: cash (was wood), fans (was food), gear (was stone)
// Buildings: van/bar/club/merch/festival
"use strict";

class Game {
  constructor(dom) {
    this.dom = dom;

    // Resources
    this.cash = 0;   // was wood
    this.fans = 0;   // was food
    this.gear = 0;   // was stone

    // "wood/food/stone" aliases so upgradeList.js effects still work
    Object.defineProperty(this, 'wood',  { get: () => this.cash,  set: v => { this.cash = v; } });
    Object.defineProperty(this, 'food',  { get: () => this.fans,  set: v => { this.fans = v; } });
    Object.defineProperty(this, 'stone', { get: () => this.gear,  set: v => { this.gear = v; } });

    // Buildings (same internal key names — upgradeList uses them)
    this.levels = {
      tent: 0,      // = Van
      pier: 0,      // = Bar Circuit
      quarry: 0,    // = Club Circuit
      smithy: 0,    // = Merch Table
      academy: 0,   // = Festival Stage
    };
    this.chaos = { pier: 0, quarry: 0, smithy: 0, academy: 0 };

    // Crew assignments (same internal keys)
    this.lumberjack = 0; // = roadies riding along (unassigned pool)
    this.fisherman  = { villager: 0, mentor: 0, manager: 0 }; // bar
    this.miner      = { villager: 0, mentor: 0, manager: 0 }; // club
    this.blacksmith = { villager: 0, mentor: 0, manager: 0 }; // merch
    this.professor  = { villager: 0, mentor: 0, manager: 0 }; // festival

    // Balance
    this.production = {
      lumberjack:       0.001,
      fisherman:        0.001,
      miner:            0.001,
      blacksmith:       0.75,
      professor:        0.75,
      mentorBoost:      1.5,
      managerReduction: 0.2,
    };

    // Upgrades
    this.upgrades = [];
    for (let upgrade of this.upgradeList) {
      this.upgrades.push({ visible: false, available: false, started: false, progress: 0, completed: 0 });
    }
    this.renderUpgrades();

    this.unlocks = {
      income: false, stone: false, craftSpeed: false, researchSpeed: false,
      assign: false, research: false, chaos: false, mentor: false,
      manager: false, fisherman: false, blacksmith: false, miner: false, professor: false,
    };

    this.serializable = [
      "cash", "fans", "gear", "levels", "unlocks",
      "lumberjack", "fisherman", "miner", "blacksmith", "professor",
      "production", "upgrades", "tutorial",
    ];

    // Tab buttons
    this.dom.assignButton.addEventListener("click", () => this.changeTab("assign"));
    this.dom.craftButton.addEventListener("click",  () => this.changeTab("craft"));
    this.dom.researchButton.addEventListener("click", () => this.changeTab("research"));

    // Gather buttons (hidden in JURN but kept for compatibility)
    this.dom.gatherWood.addEventListener("click", this.gatherWood);
    this.dom.gatherFood.addEventListener("click", this.gatherFood);

    // Crew assignment buttons
    const jobs  = ["fisherman", "miner", "blacksmith", "professor"];
    const roles = ["villager", "mentor", "manager"];
    for (let job of jobs) {
      for (let role of roles) {
        const roleCap = role[0].toUpperCase() + role.slice(1);
        this.dom[job + roleCap + "Up"].addEventListener("click",   () => this.assign(job, role));
        this.dom[job + roleCap + "Down"].addEventListener("click", () => this.unassign(job, role));
      }
    }

    this.dom.popupDismiss.addEventListener("click", () => { this.dom.popupShroud.style.display = "none"; });
    this.dom.storyDismiss.addEventListener("click", () => { this.dom.storyShroud.style.display = "none"; });
    this.dom.save.addEventListener("click",  () => this.save());
    this.dom.load.addEventListener("click",  () => this.load());
    this.dom.reset.addEventListener("click", () => {
      if (window.confirm("Reset all tour progress? This is irreversible.")) this.reset();
    });
    this.dom.logExpand.addEventListener("click", () => this.dom.log.classList.toggle("visible"));

    this.dom.craftButton.click();

    if (!this.load()) {
      this.showStory(
        `The van smells like old fast food and amplifier grease.\nYou\'ve got a tank of gas, a secondhand PA system, and a dream.\nThe road stretches out ahead. Time to see if JURN can make it.`,
        "Let\'s Roll"
      );
      this.logMessage("info", "Welcome to JURN: On the Road!");
      this.showPopup(
        `You\'re managing JURN on their first tour. Earn Cash and Fans by booking shows, upgrading your van and gear. Start by collecting enough Cash and Fans to buy your first roadie.`,
        "#van-block"
      );
    }
    setInterval(() => this.save(), 1000 * 60 * 5);
  }

  update(deltaTime) {
    this.updateUpgrades(deltaTime);
    this.chaos.pier   = this.getChaosLevel(this.fisherman);
    this.chaos.quarry = this.getChaosLevel(this.miner);
    this.chaos.smithy = this.getChaosLevel(this.blacksmith);
    this.chaos.academy = this.getChaosLevel(this.professor);
    this.cash += deltaTime * this.getWoodProduction();
    this.fans += deltaTime * this.getFoodProduction();
    this.gear += deltaTime * this.getStoneProduction();
    this.updatePopups();
  }

  updateUpgrades(deltaTime) {
    for (let i in this.upgradeList) {
      if (!this.dom.upgrades[i]) continue;
      this.upgrades[i].available = this.canAffordUpgrade(i) && !this.upgrades[i].started;
      if (this.canAffordUpgrade(i) || this.upgrades[i].started)
        this.dom.upgrades[i].classList.remove("inactive");
      else
        this.dom.upgrades[i].classList.add("inactive");
      if (this.upgrades[i].started) {
        const speedup = this.upgradeList[i].type == "craft"
          ? this.getCraftSpeedup() : this.getResearchSpeedup();
        this.upgrades[i].progress += deltaTime / (this.upgradeList[i].duration * 1000 * speedup);
        if (this.upgrades[i].progress >= 1) {
          this.completeUpgrade(i);
        } else {
          this.dom.upgrades[i].style.setProperty("--progress", this.upgrades[i].progress * 100 + "%");
        }
      }
    }
  }

  getUpgradeCost(upgradeIdx) {
    const cost = { ...this.upgradeList[upgradeIdx].cost };
    const scaling = this.upgradeList[upgradeIdx].scaling ?? 1;
    const factor  = scaling ** this.upgrades[upgradeIdx].completed;
    for (let i in cost) cost[i] = Math.ceil(cost[i] * factor);
    return cost;
  }

  canAffordUpgrade(upgradeIdx) {
    const cost = this.getUpgradeCost(upgradeIdx);
    return (cost.wood ?? 0) <= this.cash &&
           (cost.food ?? 0) <= this.fans &&
           (cost.stone ?? 0) <= this.gear;
  }

  upgradeRequirementMet(upgradeIdx) {
    if (!this.upgradeList[upgradeIdx].requirement) return true;
    return this.levels[this.upgradeList[upgradeIdx].requirement[0]] >= this.upgradeList[upgradeIdx].requirement[1];
  }

  upgradeClicked(upgradeIdx) {
    if (!this.upgrades[upgradeIdx].available) return;
    const cost = this.getUpgradeCost(upgradeIdx);
    this.cash -= cost.wood  ?? 0;
    this.fans -= cost.food  ?? 0;
    this.gear -= cost.stone ?? 0;
    this.upgrades[upgradeIdx].started = true;
  }

  completeUpgrade(upgradeIdx) {
    this.upgradeList[upgradeIdx].effect(this);
    this.upgrades[upgradeIdx].completed += 1;
    this.upgrades[upgradeIdx].started   = false;
    this.upgrades[upgradeIdx].progress  = 0;
    this.renderUpgrades();
  }

  render() {
    this.dom.wood.textContent         = Math.floor(this.cash);
    this.dom.woodIncome.textContent   = (this.getWoodProduction() * 1000).toFixed(1);
    this.dom.food.textContent         = Math.floor(this.fans);
    this.dom.foodIncome.textContent   = (this.getFoodProduction() * 1000).toFixed(1);
    this.dom.stone.textContent        = Math.floor(this.gear);
    this.dom.stoneIncome.textContent  = (this.getStoneProduction() * 1000).toFixed(1);
    this.dom.craftSpeed.textContent   = (1 / this.getCraftSpeedup()).toFixed(1);
    this.dom.researchSpeed.textContent = (1 / this.getResearchSpeedup()).toFixed(1);

    this.dom.lumberjack.textContent          = this.lumberjack;
    this.dom.fishermanVillager.textContent   = this.fisherman.villager;
    this.dom.minerVillager.textContent       = this.miner.villager;
    this.dom.blacksmithVillager.textContent  = this.blacksmith.villager;
    this.dom.professorVillager.textContent   = this.professor.villager;
    this.dom.fishermanMentor.textContent     = this.fisherman.mentor;
    this.dom.minerMentor.textContent         = this.miner.mentor;
    this.dom.blacksmithMentor.textContent    = this.blacksmith.mentor;
    this.dom.professorMentor.textContent     = this.professor.mentor;
    this.dom.fishermanManager.textContent    = this.fisherman.manager;
    this.dom.minerManager.textContent        = this.miner.manager;
    this.dom.blacksmithManager.textContent   = this.blacksmith.manager;
    this.dom.professorManager.textContent    = this.professor.manager;

    this.dom.tentLevel.textContent    = this.levels.tent;
    this.dom.pierLevel.textContent    = this.levels.pier;
    this.dom.quarryLevel.textContent  = this.levels.quarry;
    this.dom.smithyLevel.textContent  = this.levels.smithy;
    this.dom.academyLevel.textContent = this.levels.academy;

    this.dom.pierChaos.textContent    = Math.ceil(this.chaos.pier    * 100);
    this.dom.quarryChaos.textContent  = Math.ceil(this.chaos.quarry  * 100);
    this.dom.smithyChaos.textContent  = Math.ceil(this.chaos.smithy  * 100);
    this.dom.academyChaos.textContent = Math.ceil(this.chaos.academy * 100);
  }

  renderUpgrades() {
    this.dom.craft.replaceChildren();
    this.dom.research.replaceChildren();
    this.dom.upgrades.length = 0;
    for (let i in this.upgradeList)
      this.upgrades[i].visible = this.upgradeRequirementMet(i);
    for (let i in this.upgradeList) {
      const upgrade = this.upgrades[i];
      if (!upgrade.visible || (this.upgradeList[i].once && this.upgrades[i].completed >= 1)) {
        this.dom.upgrades.push(null); continue;
      }
      let el = this.createUpgradeElement(i);
      el.addEventListener("click", () => this.upgradeClicked(i));
      this.dom.upgrades.push(el);
      if (this.upgradeList[i].type == "craft") this.dom.craft.appendChild(el);
      else this.dom.research.appendChild(el);
    }
  }

  createUpgradeElement(upgradeIdx) {
    let el = document.createElement("div");
    el.classList.add("upgrade");
    const cost = this.getUpgradeCost(upgradeIdx);
    let costStr = [];
    if (cost.wood)  costStr.push(`${cost.wood} Cash`);
    if (cost.food)  costStr.push(`${cost.food} Fans`);
    if (cost.stone) costStr.push(`${cost.stone} Gear`);
    el.innerHTML = `
      <h2>${this.upgradeList[upgradeIdx].name}</h2>
      <p>${this.upgradeList[upgradeIdx].description}</p>
      <p class="cost">Cost: ${costStr.join(", ")}</p>`;
    return el;
  }

  getWoodProduction()  { return this.production.lumberjack * this.lumberjack; }
  getFoodProduction() {
    const contrib = this.fisherman.villager + this.fisherman.mentor * this.production.mentorBoost;
    return contrib * this.production.fisherman * (1 - this.chaos.pier);
  }
  getStoneProduction() {
    const contrib = this.miner.villager + this.miner.mentor * this.production.mentorBoost;
    return this.production.miner * contrib * (1 - this.chaos.quarry);
  }
  getCraftSpeedup() {
    const contrib = this.blacksmith.villager + this.blacksmith.mentor * this.production.mentorBoost;
    return 1 - (1 - this.production.blacksmith ** contrib) * (1 - this.chaos.smithy);
  }
  getResearchSpeedup() {
    const contrib = this.professor.villager + this.professor.mentor * this.production.mentorBoost;
    return 1 - (1 - this.production.professor ** contrib) * (1 - this.chaos.academy);
  }
  getChaosLevel(job) {
    const unpaired = Math.max(job.villager - job.mentor, 0);
    let penalty = job.mentor + unpaired - 1;
    penalty *= this.production.managerReduction ** job.manager;
    return Math.max(1 - 0.8 ** penalty, 0);
  }

  gatherFood = () => { this.fans += 1; };
  gatherWood  = () => { this.cash += 1; };

  assign(job, role) {
    if (this.lumberjack == 0) return;
    this.lumberjack -= 1;
    this[job][role] += 1;
    if (this[job][role] >= 2) game.unlock("chaos");
  }
  unassign(job, role) {
    if (this[job][role] == 0) return;
    this[job][role] -= 1;
    this.lumberjack += 1;
  }

  unlock(name) {
    let display = "block";
    if (["fisherman","miner","blacksmith","professor"].includes(name)) display = "flex";
    if (["income","chaos"].includes(name)) display = "inline";
    if (name === "stone") { display = "flex"; } // gear row is flex
    const nameDashed = Util.kebabCase(name);
    document.body.style.setProperty(`--${nameDashed}-display`, display);
    this.unlocks[name] = true;
  }
  lockEverything() {
    for (let name in this.unlocks) {
      const nameDashed = Util.kebabCase(name);
      document.body.style.setProperty(`--${nameDashed}-display`, "none");
    }
  }

  changeTab(tabName) {
    const TABS = ["assign","craft","research"];
    for (let tab of TABS) {
      this.dom[tab].style.display = "none";
      this.dom[tab + "Button"].classList.remove("active");
    }
    this.dom[tabName].style.display = "block";
    this.dom[tabName + "Button"].classList.add("active");
  }

  logMessage(type, msg) {
    let el = document.createElement("p");
    el.textContent = msg;
    el.classList.add(type);
    this.dom.messageArea.prepend(el);
  }

  showStory(message, buttonText, callback) {
    this.dom.storyShroud.style.display = "flex";
    this.dom.storyText.textContent = message;
    this.dom.storyDismiss.textContent = buttonText;
    if (callback) this.dom.storyDismiss.addEventListener("click", callback);
  }

  save() {
    let state = {};
    for (let field of this.serializable) state[field] = this[field];
    localStorage.setItem("jurn-savegame", JSON.stringify(state));
    this.logMessage("info", "Tour saved.");
  }

  load() {
    const state = JSON.parse(localStorage.getItem("jurn-savegame"));
    if (!state) return false;
    for (let field of this.serializable) {
      if (state[field] !== undefined) this[field] = state[field];
    }
    this.renderUpgrades();
    this.lockEverything();
    for (let unlock in this.unlocks) if (this.unlocks[unlock]) this.unlock(unlock);
    this.dom.popupDismiss.click();
    this.dom.messageArea.replaceChildren();
    this.logMessage("info", "Tour loaded.");
    return true;
  }

  reset() { localStorage.removeItem("jurn-savegame"); window.location.reload(); }
  gameOver() { document.write("== END OF TOUR"); }
  cheat() { this.cash = 100000; this.fans = 100000; this.gear = 100000; }
}
