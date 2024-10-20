// ==UserScript==
// @name         我的农田
// @author       bug人@,Pinenutn
// @version      1.0.0
// @description  实现部分农田小游戏插件，使用<.成为农夫>开启游戏，<.农场指令>查看帮助
// @timestamp    1729357648
// @license      Apache-2.0
// @homepageURL  https://github.com/bugtower100/myfarm
// @updateUrl    https://raw.githubusercontent.com/bugtower100/myfarm/refs/heads/master/%E5%8F%AA%E6%98%AF%E7%94%A8%E6%9D%A5%E6%9B%B4%E6%96%B0%E7%9A%84%E9%A1%B5%E9%9D%A2.js
// ==/UserScript==

(() => {
  // src/weatherManager.ts
  var WeatherManager = class _WeatherManager {
    constructor() {
      this.lastDate = /* @__PURE__ */ new Date();
      this.currentWeather = this.getRandomWeather();
    }
    static getInstance() {
      if (!_WeatherManager.instance) {
        _WeatherManager.instance = new _WeatherManager();
      }
      return _WeatherManager.instance;
    }
    getRandomWeather() {
      const random = Math.random();
      if (random < 0.5) {
        return "\u6674\u5929" /* Sunny */;
      } else if (random < 0.8) {
        return "\u96E8\u5929" /* Rainy */;
      } else if (random < 0.85) {
        return "\u5E72\u65F1" /* Drought */;
      } else if (random < 0.95) {
        return "\u66B4\u98CE\u96E8" /* Stormy */;
      } else {
        return "\u4E30\u6536\u65E5" /* Harvest */;
      }
    }
    updateWeather() {
      const now = /* @__PURE__ */ new Date();
      if (now.getDate() !== this.lastDate.getDate()) {
        this.currentWeather = this.getRandomWeather();
        this.lastDate = now;
        console.log(`\u5929\u6C14\u5DF2\u66F4\u65B0\u4E3A\uFF1A${this.currentWeather}`);
      } else {
        console.log(`\u5929\u6C14\u672A\u66F4\u65B0\uFF0C\u5F53\u524D\u5929\u6C14\u4E3A\uFF1A${this.currentWeather}`);
      }
    }
    getCurrentWeather() {
      return this.currentWeather;
    }
    getWeatherInfo() {
      return `\u5F53\u524D\u5929\u6C14: ${this.currentWeather}`;
    }
  };

  // src/farmer.ts
  var WeatherEffects = {
    ["\u6674\u5929" /* Sunny */]: 1,
    // 正常生长
    ["\u96E8\u5929" /* Rainy */]: 0.8,
    // 生长速度加快，时间缩短为原来的0.8
    ["\u5E72\u65F1" /* Drought */]: 1.5,
    // 生长速度减慢，时间为原来的1.5
    ["\u66B4\u98CE\u96E8" /* Stormy */]: 2.5,
    // 生长速度减慢，时间为原来的2.5
    ["\u4E30\u6536\u65E5" /* Harvest */]: 0.5
    // 生长速度加快，时间缩短为原来的0.5
  };
  var globalStore = {
    "\u9632\u98CE\u8349\u79CD\u5B50": { price: 50, level: 1 },
    "\u80E1\u841D\u535C\u79CD\u5B50": { price: 60, level: 1 },
    "\u767D\u841D\u535C\u79CD\u5B50": { price: 70, level: 2 },
    "\u82B1\u6930\u83DC\u79CD\u5B50": { price: 70, level: 2 },
    "\u5C0F\u767D\u83DC\u79CD\u5B50": { price: 70, level: 2 },
    "\u9752\u8C46\u79CD\u5B50": { price: 70, level: 2 },
    // 2级
    "\u80A5\u6599": { price: 100, level: 2 },
    // 新增肥料商品
    "\u571F\u8C46\u79CD\u5B50": { price: 75, level: 3 },
    "\u5927\u9EC4\u79CD\u5B50": { price: 80, level: 3 },
    "\u7518\u84DD\u83DC\u79CD\u5B50": { price: 80, level: 3 },
    "\u8461\u8404\u79CD\u5B50": { price: 80, level: 3 },
    "\u5411\u65E5\u8475\u79CD\u5B50": { price: 90, level: 3 },
    "\u73AB\u7470\u82B1\u79CD\u5B50": { price: 90, level: 3 },
    // 3级
    "\u8349\u8393\u79CD\u5B50": { price: 100, level: 4 },
    "\u8FA3\u6912\u79CD\u5B50": { price: 100, level: 4 },
    "\u751C\u74DC\u79CD\u5B50": { price: 105, level: 4 },
    "\u7EA2\u53F6\u5377\u5FC3\u83DC\u79CD\u5B50": { price: 105, level: 4 },
    "\u6768\u6843\u79CD\u5B50": { price: 110, level: 4 },
    "\u90C1\u91D1\u9999\u79CD\u5B50": { price: 105, level: 4 },
    "\u73AB\u7470\u4ED9\u5B50\u79CD\u5B50": { price: 110, level: 4 },
    // 4级
    "\u8304\u5B50\u79CD\u5B50": { price: 110, level: 5 },
    "\u82CB\u83DC\u79CD\u5B50": { price: 110, level: 5 },
    "\u5C71\u836F\u79CD\u5B50": { price: 110, level: 5 },
    "\u590F\u5B63\u4EAE\u7247\u79CD\u5B50": { price: 120, level: 5 },
    "\u865E\u7F8E\u4EBA\u79CD\u5B50": { price: 150, level: 5 },
    "\u6843\u6811\u79CD\u5B50": { price: 120, level: 5 },
    "\u82F9\u679C\u6811\u79CD\u5B50": { price: 120, level: 5 },
    "\u9999\u8549\u6811\u79CD\u5B50": { price: 150, level: 5 },
    "\u5B9D\u77F3\u751C\u8393\u79CD\u5B50": { price: 200, level: 5 },
    // 5级
    "\u6269\u5BB9\u7530\u5730": { price: 500, level: 3 },
    // 特殊商品
    "\u9C7C\u9975": { price: 20, level: 4 },
    // 新增鱼饵商品
    "\u6269\u5BB9\u7530\u5730ii": { price: 1e3, level: 5 }
    // 新增5级的扩容田地
  };
  var WeatherSystem = class {
    constructor() {
      this.weatherManager = WeatherManager.getInstance();
    }
    updateWeather() {
      this.weatherManager.updateWeather();
    }
    getCurrentWeather() {
      return this.weatherManager.getCurrentWeather();
    }
    getWeatherInfo() {
      return this.weatherManager.getWeatherInfo();
    }
  };
  var Farmer = class _Farmer {
    // 上次刷新鱼塘的日期
    constructor(id, name) {
      // 记录每个等级的扩容田地是否已经购买过
      this.stealCooldown = 60 * 1e3;
      this.id = id;
      this.name = name;
      this.fields = 6;
      this.money = 200;
      this.level = 1;
      this.experience = 0;
      this.crops = {};
      this.warehouse = { "\u9632\u98CE\u8349\u79CD\u5B50": 6 };
      this.lastStealTime = 0;
      this.weatherSystem = new WeatherSystem();
      this.lastSignInDate = "";
      this.purchasedFields = {};
      this.fishPond = 0;
      this.lastFishPondRefresh = "";
    }
    static getData(id) {
      try {
        let farmerData = JSON.parse(seal.ext.find("\u6211\u7684\u519C\u7530\u63D2\u4EF6").storageGet(id) || "{}");
        if (Object.keys(farmerData).length === 0) {
          return null;
        }
        let farmer = new _Farmer(id, farmerData.name);
        farmer.fields = farmerData.fields || 6;
        farmer.money = farmerData.money || 200;
        farmer.level = farmerData.level || 1;
        farmer.experience = farmerData.experience || 0;
        farmer.crops = farmerData.crops || {};
        farmer.warehouse = farmerData.warehouse || { "\u9632\u98CE\u8349\u79CD\u5B50": 6 };
        farmer.lastStealTime = farmerData.lastStealTime || 0;
        farmer.lastSignInDate = farmerData.lastSignInDate || "";
        farmer.purchasedFields = farmerData.purchasedFields || {};
        farmer.fishPond = farmerData.fishPond || 0;
        farmer.lastFishPondRefresh = farmerData.lastFishPondRefresh || "";
        return farmer;
      } catch (error) {
        return null;
      }
    }
    saveData() {
      seal.ext.find("\u6211\u7684\u519C\u7530\u63D2\u4EF6").storageSet(this.id.toString(), JSON.stringify(this));
    }
    checkLevelUp() {
      let levelUpThresholds = [100, 500, 1e3, 1500, 2e3, 2500, 3e3, 3600, 4e3, 5e3];
      let threshold = levelUpThresholds[this.level - 1];
      if (this.experience >= threshold) {
        this.level++;
        this.experience -= threshold;
        this.saveData();
        if (this.level === 4) {
          return `\u606D\u559C\uFF01\u60A8\u5347\u7EA7\u5230${this.level}\u7EA7\u4E86\uFF0C\u53EF\u4EE5\u89E3\u9501\u66F4\u591A\u5546\u54C1\u4E86\u3002
\u606D\u559C\u60A8\u89E3\u9501\u9C7C\u5858\uFF0C\u5F00\u542F\u9493\u9C7C\u529F\u80FD\uFF01`;
        } else if (this.level === 3) {
          return `\u606D\u559C\uFF01\u60A8\u5347\u7EA7\u5230${this.level}\u7EA7\u4E86\uFF0C\u53EF\u4EE5\u89E3\u9501\u66F4\u591A\u5546\u54C1\u4E86\u3002
\u5468\u56F4\u7684\u795E\u79D8\u5C0F\u7CBE\u7075\u5F00\u59CB\u6CE8\u610F\u4F60\u7684\u7530\u5730\u4E86\uFF01`;
        }
        return `\u606D\u559C\uFF01\u60A8\u5347\u7EA7\u5230${this.level}\u7EA7\u4E86\uFF0C\u53EF\u4EE5\u89E3\u9501\u66F4\u591A\u5546\u54C1\u4E86\u3002`;
      }
      return null;
    }
    fish() {
      const fisher = new Fisher(this.id, this.name);
      for (const key in fisher) {
        fisher[key] = this[key] || fisher[key];
      }
      return fisher.fish();
    }
    plantCrop(seed, quantity) {
      if (!seed.endsWith("\u79CD\u5B50")) {
        return `\u8BE5\u7269\u54C1\u4E0D\u53EF\u79CD\u690D\u3002`;
      }
      if (!this.warehouse[seed]) {
        return `\u4F60\u6CA1\u6709${seed}\uFF0C\u8BF7\u8D2D\u4E70\u540E\u79CD\u690D\u3002`;
      }
      let availableFields = this.fields - Object.keys(this.crops).length;
      if (quantity > availableFields) {
        return `\u4F60\u53EA\u6709${availableFields}\u5757\u7A7A\u95F2\u7530\u5730\u3002`;
      }
      if (this.warehouse[seed] < quantity) {
        return `\u4F60\u7684\u4ED3\u5E93\u4E2D\u6CA1\u6709\u8DB3\u591F\u7684${seed}\u3002`;
      }
      const weatherEffect = WeatherEffects[this.weatherSystem.getCurrentWeather()];
      let plantingTime = Math.random() * (4 - 0.5) + 0.5;
      let harvestTime = (/* @__PURE__ */ new Date()).getTime() + plantingTime * 60 * 60 * 1e3 * weatherEffect;
      const eventChance = 0.15;
      const eventHappened = Math.random() < eventChance;
      console.log(`\u4E8B\u4EF6\u89E6\u53D1\u6982\u7387: ${eventChance}, \u4E8B\u4EF6\u662F\u5426\u89E6\u53D1: ${eventHappened}`);
      if (eventHappened) {
        const eventType = Math.random() < 0.33 ? "\u5C0F\u7CBE\u7075\u50AC\u719F" : Math.random() < 0.5 ? "\u5973\u5DEB\u836F\u6C34\u81F4\u6B7B" : "\u72D7\u718A\u538B\u574F\u4F5C\u7269";
        console.log(`\u4E8B\u4EF6\u7C7B\u578B: ${eventType}`);
        if (eventType === "\u5C0F\u7CBE\u7075\u50AC\u719F" && this.level >= 3) {
          harvestTime *= 0.8;
          return `\u54E6\u5440\uFF0C\u4F60\u7684\u7530\u5730\u5438\u5F15\u5230\u8FD9\u7FA4\u53EF\u7231\u7684\u5C0F\u4E1C\u897F\u4E86\u554A~\u4ED6\u4EEC\u7ED9\u7530\u5730\u65BD\u52A0\u4E86\u9B54\u6CD5\u54E6\u3002
\u6210\u529F\u79CD\u690D${quantity}\u5757${seed}\uFF0C\u6210\u719F\u65F6\u95F4\u4E3A${this.formatTime(plantingTime * 0.8)}\u3002`;
        } else if (eventType === "\u5973\u5DEB\u836F\u6C34\u81F4\u6B7B") {
          this.crops = {};
          const compensation = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
          const fertilizer = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
          this.money += compensation;
          if (!this.warehouse["\u80A5\u6599"]) {
            this.warehouse["\u80A5\u6599"] = 0;
          }
          this.warehouse["\u80A5\u6599"] += fertilizer;
          this.saveData();
          return `\u545C\u54C7\uFF01\u8DEF\u8FC7\u7684\u5B9E\u4E60\u5973\u5DEB\u4E0D\u5C0F\u5FC3\u628A\u836F\u6C34\u5168\u6D12\u4E86\uFF0C\u4F60\u7684\u519C\u4F5C\u7269\u5168\u6CA1\u4E86\uFF01\u5BF9\u65B9\u5F88\u62B1\u6B49\uFF0C\u4E8E\u662F\u7ED9\u4E86\u4F60\u7684\u8865\u507F~\u83B7\u5F97${compensation}\u91D1\u5E01\u548C\u80A5\u6599\xD7${fertilizer}\u3002`;
        } else if (eventType === "\u72D7\u718A\u538B\u574F\u4F5C\u7269" && quantity > 2) {
          const fieldsToDestroy = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
          const fieldsDestroyed = Math.min(fieldsToDestroy, quantity);
          const destroyedFields = Object.keys(this.crops).slice(0, fieldsDestroyed);
          destroyedFields.forEach((field) => delete this.crops[field]);
          this.saveData();
          return `\u4E0D\u597D\u4E86\uFF0C\u4E00\u53EA\u8DEF\u8FC7\u7684\u72D7\u718A\u5728\u4F60\u7684\u7530\u5730\u91CC\u7761\u4E86\u4E00\u89C9\uFF0C\u538B\u574F\u4E86${fieldsDestroyed}\u5757\u4F5C\u7269...`;
        }
      }
      for (let i = 0; i < quantity; i++) {
        let field = this.getNextAvailableField();
        this.crops[field] = { seed, harvestTime, stolen: false };
      }
      this.warehouse[seed] -= quantity;
      if (this.warehouse[seed] === 0) {
        delete this.warehouse[seed];
      }
      this.saveData();
      return `\u6210\u529F\u79CD\u690D${quantity}\u5757${seed}\uFF0C\u6210\u719F\u65F6\u95F4\u4E3A${this.formatTime(plantingTime)}\u3002`;
    }
    getNextAvailableField() {
      let fieldNumber = 1;
      while (this.crops[`\u7530\u5730${fieldNumber}`]) {
        fieldNumber++;
      }
      return `\u7530\u5730${fieldNumber}`;
    }
    harvestAllCrops() {
      let now = (/* @__PURE__ */ new Date()).getTime();
      let harvestedCrops = {};
      let totalMoney = 0;
      let totalExperience = 0;
      for (let field in this.crops) {
        if (this.crops[field].harvestTime <= now && !this.crops[field].stolen) {
          let seed = this.crops[field].seed;
          let crop = seed.replace("\u79CD\u5B50", "");
          let seedPrice = globalStore[seed].price;
          let cropPrice = seedPrice * 0.5;
          let experience = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
          if (!harvestedCrops[crop]) {
            harvestedCrops[crop] = 0;
          }
          harvestedCrops[crop]++;
          totalMoney += cropPrice;
          totalExperience += experience;
          delete this.crops[field];
          if (!this.warehouse[crop]) {
            this.warehouse[crop] = 0;
          }
          this.warehouse[crop]++;
        }
      }
      if (Object.keys(harvestedCrops).length === 0) {
        return `\u5F53\u524D\u7530\u5730\u6682\u65F6\u6CA1\u6709\u6210\u719F\u4F5C\u7269\u54E6~`;
      }
      this.money += totalMoney;
      this.experience += totalExperience;
      this.saveData();
      let levelUpMessage = this.checkLevelUp();
      let result = `\u6210\u529F\u6536\u83B7`;
      for (let crop in harvestedCrops) {
        result += ` ${crop}\xD7${harvestedCrops[crop]}`;
      }
      result += `\uFF0C\u83B7\u5F97${totalMoney}\u91D1\u5E01\u548C${totalExperience}\u7ECF\u9A8C\u3002`;
      if (levelUpMessage) {
        result += `
${levelUpMessage}`;
      }
      return result;
    }
    harvestCrop(field) {
      if (field === "all") {
        return this.harvestAllCrops();
      }
      if (!this.crops[field] || this.crops[field].harvestTime > (/* @__PURE__ */ new Date()).getTime() || this.crops[field].stolen) {
        return `${field}\u8FD8\u6CA1\u6709\u6210\u719F\u4F5C\u7269\u54E6\uFF01`;
      }
      const adventurerEventChance = 0.05;
      const adventurerEventHappened = Math.random() < adventurerEventChance;
      console.log(`\u5192\u9669\u8005\u5077\u83DC\u4E8B\u4EF6\u89E6\u53D1\u6982\u7387: ${adventurerEventChance}, \u4E8B\u4EF6\u662F\u5426\u89E6\u53D1: ${adventurerEventHappened}`);
      if (adventurerEventHappened) {
        const matureFields = Object.keys(this.crops).filter((field2) => this.crops[field2].harvestTime <= (/* @__PURE__ */ new Date()).getTime() && !this.crops[field2].stolen);
        console.log(`\u6210\u719F\u7530\u5730\u6570\u91CF: ${matureFields.length}`);
        if (matureFields.length > 0) {
          const fieldsToSteal = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
          const stolenFields = matureFields.slice(0, fieldsToSteal);
          console.log(`\u88AB\u5077\u8D70\u7684\u7530\u5730\u6570\u91CF: ${stolenFields.length}`);
          stolenFields.forEach((field2) => delete this.crops[field2]);
          const compensation = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
          const seedTypes = Object.keys(globalStore).filter((item) => item.endsWith("\u79CD\u5B50"));
          const seedType = seedTypes[Math.floor(Math.random() * seedTypes.length)];
          const seedQuantity = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
          this.money += compensation;
          if (!this.warehouse[seedType]) {
            this.warehouse[seedType] = 0;
          }
          this.warehouse[seedType] += seedQuantity;
          this.saveData();
          return `\u8DEF\u8FC7\u7684\u5192\u9669\u8005\u91C7\u8D70\u4E86\u4F60\u7530\u5730\u91CC\u7684\u4F5C\u7269\uFF01\u4E0D\u8FC7\u6211\u4EEC\u53CA\u65F6\u8FFD\u4E0A\u4E86\u4ED6\u4EEC~
\u603B\u4E4B\u8981\u56DE\u4E86\u4E00\u4E9B\u62A5\u916C\u5462...\u4E5F\u4E0D\u7B97\u5DEE\uFF1F
\u83B7\u5F97${compensation}\u91D1\u5E01\u548C${seedType}\xD7${seedQuantity}\u3002`;
        }
      }
      let seed = this.crops[field].seed;
      let crop = seed.replace("\u79CD\u5B50", "");
      let seedPrice = globalStore[seed].price;
      let cropPrice = seedPrice * 0.5;
      let experience = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
      let doubleHarvestChance = this.level * 0.5;
      if (this.weatherSystem.getCurrentWeather() === "\u4E30\u6536\u65E5" /* Harvest */) {
        doubleHarvestChance += 5;
      }
      const doubleHarvestHappened = Math.random() < doubleHarvestChance / 100;
      if (doubleHarvestHappened) {
        cropPrice *= 2;
        experience *= 2;
        this.warehouse[crop] += 2;
        this.saveData();
        return `\u54E6\u5440\u54E6\u5440~\u7B80\u76F4\u662F\u5927\u4E30\u6536\uFF01
\u6210\u529F\u6536\u83B7${crop}\xD72\uFF0C\u83B7\u5F97${cropPrice}\u91D1\u5E01\u548C${experience}\u7ECF\u9A8C\u3002`;
      }
      this.money += cropPrice;
      this.experience += experience;
      delete this.crops[field];
      if (!this.warehouse[crop]) {
        this.warehouse[crop] = 0;
      }
      this.warehouse[crop]++;
      this.saveData();
      let levelUpMessage = this.checkLevelUp();
      let result = `\u6210\u529F\u6536\u83B7${crop}\uFF0C\u83B7\u5F97${cropPrice}\u91D1\u5E01\u548C${experience}\u7ECF\u9A8C\u3002`;
      if (levelUpMessage) {
        result += `
${levelUpMessage}`;
      }
      return result;
    }
    getFarmInfo() {
      let info = `\u7528\u6237\u540D: ${this.name}
\u91D1\u5E01: ${this.money}
\u7B49\u7EA7: ${this.level}
\u7ECF\u9A8C: ${this.experience}
`;
      let now = (/* @__PURE__ */ new Date()).getTime();
      for (let field in this.crops) {
        let remainingTime = (this.crops[field].harvestTime - now) / (60 * 60 * 1e3);
        if (remainingTime <= 0) {
          info += `${field}: ${this.crops[field].seed.replace("\u79CD\u5B50", "")}\uFF08\u5DF2\u6210\u719F\uFF09
`;
        } else {
          info += `${field}: ${this.crops[field].seed}\uFF0C\u5269\u4F59\u65F6\u95F4: ${this.formatTime(remainingTime)}
`;
        }
      }
      return info;
    }
    formatTime(timeInHours) {
      let hours = Math.floor(timeInHours);
      let minutes = Math.round((timeInHours - hours) * 60);
      return `${hours}\u5C0F\u65F6${minutes}\u5206\u949F`;
    }
    getStoreInfo() {
      let info = `\u5546\u5E97\u5546\u54C1:
`;
      for (let item in globalStore) {
        let level = globalStore[item].level;
        if (item === "\u6269\u5BB9\u7530\u5730" && this.purchasedFields[level]) {
          continue;
        }
        info += `${item}: ${globalStore[item].price}\u91D1\u5E01 (\u7B49\u7EA7${globalStore[item].level})
`;
      }
      return info;
    }
    buyItem(item, quantity = 1) {
      if (!globalStore[item]) {
        return `\u5546\u5E97\u4E2D\u6CA1\u6709${item}\u3002`;
      }
      if (this.level < globalStore[item].level) {
        return `\u4F60\u7684\u7B49\u7EA7\u4E0D\u591F\u8D2D\u4E70${item}\uFF0C\u518D\u52A0\u628A\u52B2\u5427~`;
      }
      if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
        return `\u8BF7\u8F93\u5165\u4E00\u4E2A\u6709\u6548\u7684\u8D2D\u4E70\u6570\u91CF\u54E6`;
      }
      let totalPrice = globalStore[item].price * quantity;
      if (this.money < totalPrice) {
        return `\u55EF...\u4F60\u7684\u91D1\u5E01\u4E0D\u591F\u8D2D\u4E70${quantity}\u4E2A${item}\u3002`;
      }
      if (item === "\u6269\u5BB9\u7530\u5730") {
        let level = globalStore[item].level;
        if (this.purchasedFields[level]) {
          return `\u4F60\u5DF2\u7ECF\u8D2D\u4E70\u8FC7\u8BE5\u7B49\u7EA7\u7684\u6269\u5BB9\u7530\u5730\u5566\uFF01`;
        }
        this.fields += quantity;
        this.purchasedFields[level] = true;
      } else if (item === "\u6269\u5BB9\u7530\u5730ii") {
        if (this.purchasedFields[5]) {
          return `\u4F60\u5DF2\u7ECF\u8D2D\u4E70\u8FC75\u7EA7\u6269\u5BB9\u7530\u5730\u5566\uFF01`;
        }
        this.fields += 1;
        this.purchasedFields[5] = true;
        delete globalStore["\u6269\u5BB9\u7530\u5730ii"];
      } else {
        if (!this.warehouse[item]) {
          this.warehouse[item] = 0;
        }
        this.warehouse[item] += quantity;
      }
      this.money -= totalPrice;
      this.saveData();
      return `\u94DB\u94DB\u2014\u2014\u6210\u529F\u8D2D\u4E70${item}${quantity}\u4E2A\u3002`;
    }
    sellItem(item, quantity = 1) {
      if (isNaN(quantity) || !Number.isInteger(quantity) || quantity <= 0) {
        return `\u8BF7\u8F93\u5165\u6709\u6548\u7684\u51FA\u552E\u6570\u91CF\u3002`;
      }
      if (!this.warehouse[item]) {
        return `\u4F60\u7684\u4ED3\u5E93\u4E2D\u6CA1\u6709${item}\u54E6`;
      }
      if (this.warehouse[item] < quantity) {
        return `\u4F60\u7684\u4ED3\u5E93\u4E2D\u6CA1\u6709\u8DB3\u591F\u7684${item}\u5566\uFF01`;
      }
      let sellPrice;
      if (item.endsWith("\u79CD\u5B50")) {
        sellPrice = globalStore[item].price * 0.8;
      } else if (item === "\u9C7C\u9975") {
        sellPrice = globalStore[item].price * 0.5;
      } else if (this.isFish(item)) {
        sellPrice = this.getFishPrice(item);
      } else {
        let seed = item + "\u79CD\u5B50";
        sellPrice = globalStore[seed].price * 1.25;
      }
      let totalSellPrice = sellPrice * quantity;
      this.money += totalSellPrice;
      this.warehouse[item] -= quantity;
      if (this.warehouse[item] === 0) {
        delete this.warehouse[item];
      }
      this.saveData();
      return `\u6210\u529F\u51FA\u552E${item}${quantity}\u4E2A\uFF0C\u83B7\u5F97${totalSellPrice}\u91D1\u5E01~`;
    }
    // 新增方法：判断是否为鱼类物品
    isFish(item) {
      const fishTypes = ["\u9CC0\u9C7C", "\u6C99\u4E01\u9C7C", "\u9CB7\u9C7C", "\u5927\u5634\u9C88\u9C7C", "\u9CA4\u9C7C"];
      return fishTypes.includes(item);
    }
    // 新增方法：获取鱼类物品的售价
    getFishPrice(item) {
      const fishPrices = {
        "\u9CA4\u9C7C": 20,
        "\u9CB1\u9C7C": 30,
        "\u5C0F\u5634\u9C88\u9C7C": 30,
        "\u592A\u9633\u9C7C": 45,
        "\u9CC0\u9C7C": 45,
        "\u6C99\u4E01\u9C7C": 45,
        "\u6CB3\u9C88": 50,
        "\u9CA2\u9C7C": 50,
        "\u9CB7\u9C7C": 50,
        "\u7EA2\u9CB7\u9C7C": 55,
        "\u6D77\u53C2": 55,
        "\u8679\u9CDF\u9C7C": 55,
        "\u5927\u773C\u9C7C": 60,
        "\u897F\u9CB1": 60,
        "\u5927\u5934\u9C7C": 60,
        "\u5927\u5634\u9C88\u9C7C": 60,
        "\u9C91\u9C7C": 60,
        "\u9B3C\u9C7C": 65,
        "\u7F57\u975E\u9C7C": 65,
        "\u6728\u8DC3\u9C7C": 65,
        "\u72EE\u5B50\u9C7C": 65,
        "\u6BD4\u76EE\u9C7C": 70,
        "\u5927\u6BD4\u76EE\u9C7C": 70,
        "\u5348\u591C\u9CA4\u9C7C": 70,
        "\u53F2\u83B1\u59C6\u9C7C": 70,
        "\u867E\u864E\u9C7C": 70,
        "\u7EA2\u9CBB\u9C7C": 75,
        "\u9752\u82B1\u9C7C": 75,
        "\u72D7\u9C7C": 75,
        "\u864E\u7EB9\u9CDF\u9C7C": 75,
        "\u84DD\u94C1\u997C\u9C7C": 75,
        "\u6C99\u9C7C": 75
      };
      return fishPrices[item] || 0;
    }
    getWarehouseInfo() {
      let info = `\u4ED3\u5E93\u7269\u54C1:
`;
      for (let item in this.warehouse) {
        info += `${item}: ${this.warehouse[item]}
`;
      }
      return info;
    }
    removeCrop(field) {
      if (!this.crops[field]) {
        return `${field}\u6CA1\u6709\u79CD\u690D\u4F5C\u7269\u3002`;
      }
      delete this.crops[field];
      this.saveData();
      return `\u6210\u529F\u94F2\u9664${field}\u7684\u4F5C\u7269\u3002`;
    }
    stealCrop(targetFarmer) {
      const now = Date.now();
      if (this.lastStealTime !== 0 && now - this.lastStealTime < this.stealCooldown) {
        const remainingTime = Math.ceil((this.stealCooldown - (now - this.lastStealTime)) / 1e3);
        return `\u9644\u8FD1\u8FD8\u6709\u4EBA\u770B\u7740\u5462\uFF0C\u518D\u7B49${remainingTime}\u79D2\u540E\u518D\u8BD5\u5427...`;
      }
      const matureFields = Object.keys(targetFarmer.crops).filter((field) => {
        return targetFarmer.crops[field].harvestTime <= now && !targetFarmer.crops[field].stolen;
      });
      if (matureFields.length === 0) {
        return `\u8FD9\u5BB6\u4EBA\u7684\u7530\u5730\u4E2D\u53EF\u6CA1\u6709\u6210\u719F\u7684\u4F5C\u7269\uFF0C\u6362\u4E2A\u76EE\u6807\u5427~`;
      }
      const randomField = matureFields[Math.floor(Math.random() * matureFields.length)];
      const seed = targetFarmer.crops[randomField].seed;
      const crop = seed.replace("\u79CD\u5B50", "");
      if (!this.warehouse[crop]) {
        this.warehouse[crop] = 0;
      }
      this.warehouse[crop]++;
      delete targetFarmer.crops[randomField];
      this.lastStealTime = now;
      this.saveData();
      targetFarmer.saveData();
      return `\u55EF\u54FC~\u6210\u529F\u5077\u53D6\u5230${crop}\u5566\uFF01`;
    }
    changeName(newName) {
      this.name = newName;
      this.saveData();
      return `\u8981\u6539\u540D\u6210${newName}\u5417\uFF1F\u597D\u7684\u597D\u7684\uFF0C\u4E0D\u4F1A\u662F\u505A\u4E86\u4EC0\u4E48\u4E8F\u5FC3\u4E8B\u5427~`;
    }
    useFertilizer(field) {
      if (!this.warehouse["\u80A5\u6599"]) {
        return `\u4F60\u7684\u4ED3\u5E93\u4E2D\u6CA1\u6709\u80A5\u6599\u54E6`;
      }
      if (!this.crops[field]) {
        return `${field}\u6CA1\u6709\u79CD\u690D\u4F5C\u7269\u3002`;
      }
      let now = (/* @__PURE__ */ new Date()).getTime();
      let remainingTime = (this.crops[field].harvestTime - now) / (60 * 60 * 1e3);
      if (remainingTime <= 0) {
        return `${field}\u7684\u4F5C\u7269\u5DF2\u7ECF\u6210\u719F\u5566\uFF01`;
      }
      this.crops[field].harvestTime -= remainingTime * 0.5 * 60 * 60 * 1e3;
      this.warehouse["\u80A5\u6599"]--;
      if (this.warehouse["\u80A5\u6599"] === 0) {
        delete this.warehouse["\u80A5\u6599"];
      }
      this.saveData();
      return `\u6210\u529F\u5BF9${field}\u4F7F\u7528\u9B54...\u80A5\u6599\uFF0C\u5269\u4F59\u65F6\u95F4\u51CF\u5C11\u4E00\u534A~`;
    }
    // 添加 lastStealTime 的 getter
    getLastStealTime() {
      return this.lastStealTime;
    }
    // 添加 discardItem 方法
    discardItem(item, quantity = 1) {
      if (!this.warehouse[item]) {
        return `\u4F60\u6CA1\u6709${item}\u7269\u54C1\u3002`;
      }
      if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
        return `\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u6570\u76EE\u3002`;
      }
      if (this.warehouse[item] < quantity) {
        return `\u8981\u4E22\u5F03\u7684\u6570\u76EE\u592A\u591A\u5566\uFF01`;
      }
      this.warehouse[item] -= quantity;
      if (this.warehouse[item] === 0) {
        delete this.warehouse[item];
      }
      this.saveData();
      return `\u6210\u529F\u4E22\u5F03${quantity}\u4E2A${item}\u3002`;
    }
  };
  var Fisher = class _Fisher extends Farmer {
    // 记录远航开始时间
    constructor(id, name) {
      super(id, name);
      this.fishCount = 0;
      this.lastFishTime = 0;
      this.fishCooldown = 0;
      this.wormCatchCount = 0;
      this.explorationType = null;
      this.explorationStartTime = null;
    }
    static getData(id) {
      try {
        let fisherData = JSON.parse(seal.ext.find("\u6211\u7684\u519C\u7530\u63D2\u4EF6").storageGet(id) || "{}");
        if (Object.keys(fisherData).length === 0) {
          return null;
        }
        let fisher = new _Fisher(id, fisherData.name);
        for (const key in fisherData) {
          fisher[key] = fisherData[key] || fisher[key];
        }
        return fisher;
      } catch (error) {
        return null;
      }
    }
    refreshFishPond() {
      const now = /* @__PURE__ */ new Date();
      const today = now.toDateString();
      if (this.lastFishPondRefresh !== today) {
        this.fishPond = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
        this.lastFishPondRefresh = today;
        this.saveData();
      }
    }
    fish() {
      this.refreshFishPond();
      const now = Date.now();
      if (this.fishCooldown > 0 && now - this.lastFishTime < this.fishCooldown) {
        const remainingTime = Math.ceil((this.fishCooldown - (now - this.lastFishTime)) / 6e4);
        return `\u9C7C\u5858\u4E2D\u7684\u9C7C\u513F\u90FD\u8EB2\u8D77\u6765\u4E86\uFF0C\u7B49\u4E00\u4F1A\u513F\u518D\u6765\u5427\uFF01\u5514...\u6211\u770B\u770B\uFF0C\u8FD8\u8981${remainingTime}\u5206\u949F\u540E\u4ED6\u4EEC\u624D\u4F1A\u51FA\u73B0\u54E6~`;
      }
      if (this.fishPond <= 0) {
        return "\u9C7C\u5858\u4E2D\u7684\u9C7C\u5DF2\u7ECF\u6CA1\u6709\u4E86\uFF0C\u660E\u5929\u518D\u6765\u5427~";
      }
      if (!this.warehouse["\u9C7C\u9975"]) {
        return "\u4F60\u8FD8\u6CA1\u6709\u9C7C\u9975\u5462\uFF0C\u5148\u53BB\u5546\u5E97\u4E70\u70B9\u5566~";
      }
      this.warehouse["\u9C7C\u9975"]--;
      if (this.warehouse["\u9C7C\u9975"] === 0) {
        delete this.warehouse["\u9C7C\u9975"];
      }
      const successRate = 0.4;
      const success = Math.random() < successRate;
      if (!success) {
        this.fishPond--;
        this.saveData();
        this.fishCount++;
        this.checkFishCooldown();
        return "\u54CE\u5440\uFF01\u9C7C\u8DD1\u4E86...";
      }
      let fishType = "";
      switch (this.level) {
        case 4:
          fishType = this.getRandomFishType(["\u9CA4\u9C7C", "\u9CB1\u9C7C", "\u5C0F\u5634\u9C88\u9C7C", "\u592A\u9633\u9C7C", "\u9CC0\u9C7C"]);
          break;
        case 5:
          fishType = this.getRandomFishType(["\u9CA4\u9C7C", "\u9CB1\u9C7C", "\u5C0F\u5634\u9C88\u9C7C", "\u592A\u9633\u9C7C", "\u9CC0\u9C7C", "\u6C99\u4E01\u9C7C", "\u6CB3\u9C88", "\u9CA2\u9C7C", "\u9CB7\u9C7C", "\u7EA2\u9CB7\u9C7C", "\u6D77\u53C2", "\u8679\u9CDF\u9C7C"]);
          break;
        case 6:
          fishType = this.getRandomFishType(["\u9CA4\u9C7C", "\u9CB1\u9C7C", "\u5C0F\u5634\u9C88\u9C7C", "\u592A\u9633\u9C7C", "\u9CC0\u9C7C", "\u6C99\u4E01\u9C7C", "\u6CB3\u9C88", "\u9CA2\u9C7C", "\u9CB7\u9C7C", "\u7EA2\u9CB7\u9C7C", "\u6D77\u53C2", "\u8679\u9CDF\u9C7C", "\u5927\u773C\u9C7C", "\u897F\u9CB1", "\u5927\u5934\u9C7C", "\u5927\u5634\u9C88\u9C7C", "\u9C91\u9C7C", "\u9B3C\u9C7C"]);
          break;
        case 7:
          fishType = this.getRandomFishType(["\u9CA4\u9C7C", "\u9CB1\u9C7C", "\u5C0F\u5634\u9C88\u9C7C", "\u592A\u9633\u9C7C", "\u9CC0\u9C7C", "\u6C99\u4E01\u9C7C", "\u6CB3\u9C88", "\u9CA2\u9C7C", "\u9CB7\u9C7C", "\u7EA2\u9CB7\u9C7C", "\u6D77\u53C2", "\u8679\u9CDF\u9C7C", "\u5927\u773C\u9C7C", "\u897F\u9CB1", "\u5927\u5934\u9C7C", "\u5927\u5634\u9C88\u9C7C", "\u9C91\u9C7C", "\u9B3C\u9C7C", "\u7F57\u975E\u9C7C", "\u6728\u8DC3\u9C7C", "\u72EE\u5B50\u9C7C", "\u6BD4\u76EE\u9C7C", "\u5927\u6BD4\u76EE\u9C7C", "\u5348\u591C\u9CA4\u9C7C"]);
          break;
        default:
          fishType = this.getRandomFishType(["\u9CA4\u9C7C", "\u9CB1\u9C7C", "\u5C0F\u5634\u9C88\u9C7C", "\u592A\u9633\u9C7C", "\u9CC0\u9C7C", "\u6C99\u4E01\u9C7C", "\u6CB3\u9C88", "\u9CA2\u9C7C", "\u9CB7\u9C7C", "\u7EA2\u9CB7\u9C7C", "\u6D77\u53C2", "\u8679\u9CDF\u9C7C", "\u5927\u773C\u9C7C", "\u897F\u9CB1", "\u5927\u5934\u9C7C", "\u5927\u5634\u9C88\u9C7C", "\u9C91\u9C7C", "\u9B3C\u9C7C", "\u7F57\u975E\u9C7C", "\u6728\u8DC3\u9C7C", "\u72EE\u5B50\u9C7C", "\u6BD4\u76EE\u9C7C", "\u5927\u6BD4\u76EE\u9C7C", "\u5348\u591C\u9CA4\u9C7C", "\u53F2\u83B1\u59C6\u9C7C", "\u867E\u864E\u9C7C", "\u7EA2\u9CBB\u9C7C", "\u9752\u82B1\u9C7C", "\u72D7\u9C7C", "\u864E\u7EB9\u9CDF\u9C7C", "\u84DD\u94C1\u997C\u9C7C", "\u6C99\u9C7C"]);
      }
      if (!this.warehouse[fishType]) {
        this.warehouse[fishType] = 0;
      }
      this.warehouse[fishType]++;
      this.fishPond--;
      this.saveData();
      this.fishCount++;
      this.checkFishCooldown();
      return `\u7B49\u5F85...\u7B49\u5F85...\u6210\u529F\u9493\u5230\u4E00\u6761${fishType}\uFF01`;
    }
    checkFishCooldown() {
      if (this.fishCount >= 4 && this.fishCount <= 6) {
        this.fishCooldown = Math.floor(Math.random() * (60 - 30 + 1) + 30) * 60 * 1e3;
        this.lastFishTime = Date.now();
      } else if (this.fishCount > 6) {
        this.fishCount = 0;
        this.fishCooldown = 0;
      }
    }
    getRandomFishType(fishTypes) {
      return fishTypes[Math.floor(Math.random() * fishTypes.length)];
    }
    catchWorms() {
      if (this.level < 4) {
        return "\u4F60\u7684\u7B49\u7EA7\u4E0D\u591F\u54E6\uFF0C\u518D\u7B49\u7B49\u518D\u6765\u5427\uFF01";
      }
      const weatherManager = WeatherManager.getInstance();
      const currentWeather = weatherManager.getCurrentWeather();
      if (currentWeather !== "\u96E8\u5929" /* Rainy */) {
        return "\u4ECA\u5929\u53EF\u6CA1\u6709\u86AF\u8693\u51FA\u6765\u554A...";
      }
      if (this.wormCatchCount >= 12) {
        return "\u8FD9\u91CC\u5DF2\u7ECF\u6CA1\u6709\u86AF\u8693\u4E86...";
      }
      const successRate = 0.8;
      const success = Math.random() < successRate;
      if (success) {
        if (!this.warehouse["\u9C7C\u9975"]) {
          this.warehouse["\u9C7C\u9975"] = 0;
        }
        this.warehouse["\u9C7C\u9975"]++;
        this.wormCatchCount++;
        this.saveData();
        return "\u606D\u559C\u4F60\u6355\u6349\u5230\u4E86\u86AF\u8693\uFF01";
      } else {
        this.wormCatchCount++;
        this.saveData();
        return "\u4F60\u6316\u4E86\u534A\u5929\u571F\uFF0C\u90FD\u6CA1\u627E\u5230\u86AF\u8693\uFF0C\u6709\u70B9\u53EF\u601C\u554A~";
      }
    }
    getExplorationType() {
      const explorationType = this.explorationType;
      console.log(`\u8BFB\u53D6 explorationType: ${explorationType}`);
      return explorationType;
    }
    explore(type) {
      if (this.explorationType) {
        const remainingTime = this.getExplorationRemainingTime();
        console.log(`\u5F53\u524D\u8FDC\u822A\u72B6\u6001: ${this.explorationType}, \u5269\u4F59\u65F6\u95F4: ${remainingTime}`);
        return `\u4F60\u7684\u8239\u961F\u6B63\u5728\u63A2\u7D22\u4E2D\uFF0C\u8BA9\u6211\u770B\u770B...\u55EF\uFF0C\u8FD8\u6709${remainingTime}\u624D\u4F1A\u56DE\u6765\u54E6~`;
      }
      const explorationTypes = {
        "\u8FD1\u6D77\u8FDC\u822A": { duration: 5 * 60 * 60 * 1e3, cost: 1e3, reward: { minGold: 1200, maxGold: 1500, seeds: 7 } },
        "\u8FDC\u6D77\u63A2\u7D22": { duration: 8 * 60 * 60 * 1e3, cost: 3e3, reward: { minGold: 3200, maxGold: 4e3, seeds: 15, fish: 5 } },
        "\u968F\u673A\u63A2\u7D22": { duration: 12 * 60 * 60 * 1e3, cost: 5e3, reward: { minGold: 3e3, maxGold: 8e3, seeds: { min: 10, max: 20 }, fish: { min: 3, max: 10 } } }
      };
      const exploration = explorationTypes[type];
      if (!exploration) {
        return "\u9009\u62E9\u8FDC\u822A\u7C7B\u578B\uFF1A\n1.\u8FD1\u6D77\u8FDC\u822A\uFF085\u5C0F\u65F6\uFF0C1000\u91D1\u5E01\uFF09\n2.\u8FDC\u6D77\u63A2\u7D22\uFF088\u5C0F\u65F6\uFF0C3000\u91D1\u5E01\uFF09\n3.\u968F\u673A\u63A2\u7D22\uFF0812\u5C0F\u65F6\uFF0C5000\u91D1\u5E01\uFF09\n\n\u7528\u201C.\u8FDC\u822A<\u63A2\u7D22\u7C7B\u578B>\u5F00\u542F\u8FDC\u822A\u5427\uFF01\n*\u8FDC\u822A\u7ED3\u675F\u540E\u4F1A\u6765\u627E\u4F60\u7684\uFF01";
      }
      if (this.money < exploration.cost) {
        return `\u4F60\u7684\u91D1\u5E01\u4E0D\u591F\u8FDB\u884C${type}\u54E6~`;
      }
      console.log(`\u5B58\u50A8\u524D explorationType: ${this.explorationType}, explorationStartTime: ${this.explorationStartTime}`);
      this.money -= exploration.cost;
      this.explorationType = type;
      this.explorationStartTime = Date.now();
      this.saveData();
      console.log(`\u5B58\u50A8\u540E explorationType: ${this.explorationType}, explorationStartTime: ${this.explorationStartTime}`);
      return `\u4F60\u7684\u8239\u961F\u51FA\u822A\u5566~`;
    }
    getExplorationRemainingTime() {
      if (!this.explorationType || !this.explorationStartTime) {
        return "0\u79D2";
      }
      const explorationTypes = {
        "\u8FD1\u6D77\u8FDC\u822A": 5 * 60 * 60 * 1e3,
        "\u8FDC\u6D77\u63A2\u7D22": 8 * 60 * 60 * 1e3,
        "\u968F\u673A\u63A2\u7D22": 12 * 60 * 60 * 1e3
      };
      const duration = explorationTypes[this.explorationType];
      const elapsedTime = Date.now() - this.explorationStartTime;
      const remainingTime = duration - elapsedTime;
      if (remainingTime <= 0) {
        return "0\u79D2";
      }
      const hours = Math.floor(remainingTime / (60 * 60 * 1e3));
      const minutes = Math.floor(remainingTime % (60 * 60 * 1e3) / (60 * 1e3));
      const seconds = Math.floor(remainingTime % (60 * 1e3) / 1e3);
      return `${hours}\u5C0F\u65F6${minutes}\u5206\u949F${seconds}\u79D2`;
    }
    checkExplorationCompletion() {
      if (!this.explorationType || !this.explorationStartTime) {
        return "";
      }
      const explorationTypes = {
        "\u8FD1\u6D77\u8FDC\u822A": { duration: 5 * 60 * 60 * 1e3, reward: { minGold: 1200, maxGold: 1500, seeds: 7 } },
        "\u8FDC\u6D77\u63A2\u7D22": { duration: 8 * 60 * 60 * 1e3, reward: { minGold: 3200, maxGold: 4e3, seeds: 15, fish: 5 } },
        "\u968F\u673A\u63A2\u7D22": { duration: 12 * 60 * 60 * 1e3, reward: { minGold: 3e3, maxGold: 8e3, seeds: { min: 10, max: 20 }, fish: { min: 3, max: 10 } } }
      };
      const exploration = explorationTypes[this.explorationType];
      const elapsedTime = Date.now() - this.explorationStartTime;
      if (elapsedTime >= exploration.duration) {
        const reward = exploration.reward;
        const gold = Math.floor(Math.random() * (reward.maxGold - reward.minGold + 1)) + reward.minGold;
        this.money += gold;
        const seedTypes = Object.keys(globalStore).filter((item) => item.endsWith("\u79CD\u5B50"));
        const seedType = seedTypes[Math.floor(Math.random() * seedTypes.length)];
        const seedQuantity = reward.seeds;
        if (!this.warehouse[seedType]) {
          this.warehouse[seedType] = 0;
        }
        this.warehouse[seedType] += seedQuantity;
        let fishReward = "";
        if (reward.fish) {
          const fishTypes = Object.keys(this.warehouse).filter((item) => this.isFish(item));
          const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
          const fishQuantity = reward.fish;
          if (!this.warehouse[fishType]) {
            this.warehouse[fishType] = 0;
          }
          this.warehouse[fishType] += fishQuantity;
          fishReward = `\u548C${fishType}\xD7${fishQuantity}`;
        }
        this.explorationType = null;
        this.explorationStartTime = null;
        this.saveData();
        return `\u4F60\u7684\u8239\u961F\u5F52\u6765\u5566\uFF0C\u5E26\u56DE\u4E86${gold}\u91D1\u5E01\u3001${seedType}\xD7${seedQuantity}${fishReward}`;
      }
      return "";
    }
    isFish(item) {
      const fishTypes = ["\u9CA4\u9C7C", "\u9CB1\u9C7C", "\u5C0F\u5634\u9C88\u9C7C", "\u592A\u9633\u9C7C", "\u9CC0\u9C7C", "\u6C99\u4E01\u9C7C", "\u6CB3\u9C88", "\u9CA2\u9C7C", "\u9CB7\u9C7C", "\u7EA2\u9CB7\u9C7C", "\u6D77\u53C2", "\u8679\u9CDF\u9C7C", "\u5927\u773C\u9C7C", "\u897F\u9CB1", "\u5927\u5934\u9C7C", "\u5927\u5634\u9C88\u9C7C", "\u9C91\u9C7C", "\u9B3C\u9C7C", "\u7F57\u975E\u9C7C", "\u6728\u8DC3\u9C7C", "\u72EE\u5B50\u9C7C", "\u6BD4\u76EE\u9C7C", "\u5927\u6BD4\u76EE\u9C7C", "\u5348\u591C\u9CA4\u9C7C", "\u53F2\u83B1\u59C6\u9C7C", "\u867E\u864E\u9C7C", "\u7EA2\u9CBB\u9C7C", "\u9752\u82B1\u9C7C", "\u72D7\u9C7C", "\u864E\u7EB9\u9CDF\u9C7C", "\u84DD\u94C1\u997C\u9C7C", "\u6C99\u9C7C"];
      return fishTypes.includes(item);
    }
  };

  // src/index.ts
  (() => {
    const weatherManager = WeatherManager.getInstance();
    function main() {
      if (!seal.ext.find("\u6211\u7684\u519C\u7530\u63D2\u4EF6")) {
        const ext = seal.ext.new("\u6211\u7684\u519C\u7530\u63D2\u4EF6", "bug\u4EBA@", "1.0.0");
        const cmdBecomeFarmer = {
          name: "\u6210\u4E3A\u519C\u592B",
          help: "\u6307\u4EE4\uFF1A.\u6210\u4E3A\u519C\u592B",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer, id, name) => {
              if (!farmer) {
                farmer = new Farmer(id, name);
                farmer.saveData();
                seal.replyToSender(ctx, msg, `\u606D\u559C\u4F60\u6210\u4E3A\u519C\u592B\uFF01
\u73B0\u5728\u4F60\u62E5\u67096\u5757\u7530\u5730\u3001200\u91D1\u5E01\u548C\u9632\u98CE\u8349\u79CD\u5B50\xD76~
x\u73B0\u5728\u4F60\u7684\u7B49\u7EA7\u4E3A1\uFF0C\u7ECF\u9A8C\u503C\u4E3A0\uFF0C\u52A0\u6CB9\u5427\uFF01

\u8BF7\u4F7F\u7528\u201C.\u519C\u573A\u6307\u4EE4\u201D\u67E5\u770B\u76F8\u5173\u6307\u4EE4`);
              } else {
                seal.replyToSender(ctx, msg, `\u54CE\u5440~\u4F60\u5DF2\u7ECF\u662F\u519C\u592B\u4E86\uFF0C\u96BE\u9053\u5FD8\u8BB0\u4E86\u5417\uFF1F`);
              }
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdFarmCommands = {
          name: "\u519C\u573A\u6307\u4EE4",
          help: "\u6307\u4EE4\uFF1A.\u519C\u573A\u6307\u4EE4",
          solve: (ctx, msg, cmdArgs) => {
            const helpMessage = `
    \u519C\u573A\u6307\u4EE4\u5E2E\u52A9\u4FE1\u606F\uFF1A
    .\u7B7E\u5230 - \u7B7E\u5230\u5E76\u83B7\u5F97\u6BCF\u65E5\u5956\u52B1

    .\u6211\u7684\u519C\u7530 - \u67E5\u770B\u6211\u7684\u519C\u7530\u4FE1\u606F
    .\u79CD\u690D<\u519C\u4F5C\u7269><\u6570\u91CF> - \u79CD\u690D\u519C\u4F5C\u7269\uFF08\u6570\u91CF\u548C\u7269\u54C1\u95F4\u8BF7\u52A0\u7A7A\u683C\uFF09
    .\u519C\u7530\u5546\u5E97 - \u67E5\u770B\u519C\u7530\u5546\u5E97
    .\u8D2D\u4E70 <\u5546\u54C1\u540D>\uFF08\u6570\u91CF\uFF09 - \u8D2D\u4E70\u5546\u54C1\uFF08\u6570\u91CF\u548C\u7269\u54C1\u95F4\u8BF7\u52A0\u7A7A\u683C\uFF09
    .\u51FA\u552E <\u5546\u54C1\u540D>\uFF08\u6570\u91CF\uFF09 - \u51FA\u552E\u5546\u54C1\uFF08\u6570\u91CF\u548C\u7269\u54C1\u95F4\u8BF7\u52A0\u7A7A\u683C\uFF09
    .\u597D\u53CB\u4FE1\u606F<@\u5176\u4ED6\u4EBA> - \u67E5\u770B\u597D\u53CB\u7684\u519C\u7530\u4FE1\u606F
    .\u6211\u7684\u4ED3\u5E93 - \u67E5\u770B\u6211\u7684\u4ED3\u5E93

    .\u94F2\u9664\u519C\u7530<\u7530\u5730\u540D> - \u94F2\u9664\u519C\u7530\u4E2D\u7684\u4F5C\u7269
    .\u5077\u7A83<@\u5176\u4ED6\u4EBA> - \u5077\u7A83\u5176\u4ED6\u4EBA\u7684\u4F5C\u7269
    .\u6536\u83B7 - \u6536\u83B7\u6240\u6709\u6210\u719F\u7684\u4F5C\u7269
    .\u4E22\u5F03 <\u7269\u54C1\u540D>\uFF08\u6570\u76EE\uFF09 - \u4E22\u5F03\u7269\u54C1\uFF08\u6570\u91CF\u548C\u7269\u54C1\u95F4\u8BF7\u52A0\u7A7A\u683C\uFF09
    .\u4FEE\u6539\u519C\u592B\u540D<\u65B0\u7528\u6237\u540D> - \u4FEE\u6539\u519C\u592B\u540D
    .\u4F7F\u7528\u80A5\u6599 <\u7530\u5730\u540D> - \u4F7F\u7528\u80A5\u6599\u7F29\u77ED\u65F6\u95F4

    .\u9493\u9C7C - \u5728\u9C7C\u5858\u9493\u9C7C
    .\u6293\u86AF\u8693 - \u6293\u86AF\u8693\u8F6C\u6362\u4E3A\u9C7C\u9975
    .\u8FDC\u822A - \u6D3E\u9063\u8239\u961F\u8FDC\u822A\u63A2\u7D22
    .\u519C\u573A\u6307\u4EE4 - \u67E5\u770B\u519C\u573A\u6307\u4EE4\u5E2E\u52A9\u4FE1\u606F
    `;
            seal.replyToSender(ctx, msg, helpMessage);
            return seal.ext.newCmdExecuteResult(true);
          }
        };
        const cmdFarmInfo = {
          name: "\u6211\u7684\u519C\u7530",
          help: "\u6307\u4EE4\uFF1A.\u6211\u7684\u519C\u7530",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              weatherManager.updateWeather();
              const now = /* @__PURE__ */ new Date();
              const dateInfo = `${now.getMonth() + 1}\u6708${now.getDate()}\u65E5`;
              const weatherInfo = weatherManager.getWeatherInfo();
              const farmInfo = farmer.getFarmInfo();
              const replyMessage = `\u7528\u6237\u540D: ${farmer.name}
\u65E5\u671F\uFF1A${dateInfo}
${weatherInfo}
${farmInfo}`;
              seal.replyToSender(ctx, msg, replyMessage);
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdPlantCrop = {
          name: "\u79CD\u690D",
          help: "\u6307\u4EE4\uFF1A.\u79CD\u690D<\u519C\u4F5C\u7269><\u6570\u91CF>",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              let crop = cmdArgs.getArgN(1);
              let quantity = parseInt(cmdArgs.getArgN(2));
              if (isNaN(quantity) || quantity <= 0) {
                seal.replyToSender(ctx, msg, `\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u6570\u91CF\u5566...`);
                return seal.ext.newCmdExecuteResult(true);
              }
              seal.replyToSender(ctx, msg, farmer.plantCrop(crop, quantity));
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdStoreInfo = {
          name: "\u519C\u7530\u5546\u5E97",
          help: "\u6307\u4EE4\uFF1A.\u519C\u7530\u5546\u5E97",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              seal.replyToSender(ctx, msg, farmer.getStoreInfo());
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdBuyItem = {
          name: "\u8D2D\u4E70",
          help: "\u6307\u4EE4\uFF1A.\u8D2D\u4E70 <\u5546\u54C1\u540D>\uFF08\u6570\u91CF\uFF09",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              let item = cmdArgs.getArgN(1);
              let quantity = parseInt(cmdArgs.getArgN(2)) || 1;
              seal.replyToSender(ctx, msg, farmer.buyItem(item, quantity));
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdSellItem = {
          name: "\u51FA\u552E",
          help: "\u6307\u4EE4\uFF1A.\u51FA\u552E <\u5546\u54C1\u540D>\uFF08\u6570\u91CF\uFF09",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              let item = cmdArgs.getArgN(1);
              let quantity = parseInt(cmdArgs.getArgN(2)) || 1;
              seal.replyToSender(ctx, msg, farmer.sellItem(item, quantity));
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdOtherFarmInfo = {
          name: "\u597D\u53CB\u4FE1\u606F",
          help: "\u6307\u4EE4\uFF1A.\u597D\u53CB\u4FE1\u606F<\u5176\u4ED6\u4EBA>",
          allowDelegate: true,
          solve: (ctx, msg, cmdArgs) => {
            let mctx = seal.getCtxProxyFirst(ctx, cmdArgs);
            return handleFarmerCommand(mctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              seal.replyToSender(ctx, msg, farmer.getFarmInfo());
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdWarehouseInfo = {
          name: "\u6211\u7684\u4ED3\u5E93",
          help: "\u6307\u4EE4\uFF1A.\u6211\u7684\u4ED3\u5E93",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              seal.replyToSender(ctx, msg, farmer.getWarehouseInfo());
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdRemoveCrop = {
          name: "\u94F2\u9664\u519C\u7530",
          help: "\u6307\u4EE4\uFF1A.\u94F2\u9664\u519C\u7530<\u5E8F\u53F7>",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              let field = cmdArgs.getArgN(1);
              seal.replyToSender(ctx, msg, farmer.removeCrop(field));
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdStealCrop = {
          name: "\u5077\u7A83",
          help: "\u6307\u4EE4\uFF1A.\u5077\u7A83<\u5176\u4ED6\u4EBA>",
          allowDelegate: true,
          solve: (ctx, msg, cmdArgs) => {
            let mctx = seal.getCtxProxyFirst(ctx, cmdArgs);
            return handleFarmerCommand(mctx, msg, cmdArgs, (farmer) => {
              let id = msg.sender.userId;
              farmer = Farmer.getData(id);
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              let mctx2 = seal.getCtxProxyFirst(ctx, cmdArgs);
              let targetFarmer = Farmer.getData(mctx2.player.userId);
              if (!targetFarmer) {
                seal.replyToSender(ctx, msg, `\u8FD9\u4E2A\u4EBA\u8FD8\u6CA1\u6709\u6210\u4E3A\u519C\u592B\u54E6\uFF0C\u8981\u4E0D\u8981\u8BD5\u7740\u8BA9\u4ED6\u4E5F\u52A0\u5165\u4F60\u5440~\u3002`);
                return seal.ext.newCmdExecuteResult(true);
              }
              let now = (/* @__PURE__ */ new Date()).getTime();
              if (farmer.getLastStealTime() != 0 && now - farmer.getLastStealTime() < 6e4) {
                let remainingTime = Math.ceil((6e4 - (now - farmer.getLastStealTime())) / 1e3);
                seal.replyToSender(ctx, msg, `\u9644\u8FD1\u8FD8\u6709\u4EBA\u770B\u7740\u5462\uFF0C\u518D\u7B49${remainingTime}\u79D2\u540E\u518D\u8BD5\u5427...`);
                return seal.ext.newCmdExecuteResult(true);
              }
              let result = farmer.stealCrop(targetFarmer);
              seal.replyToSender(ctx, msg, result);
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdHarvestCrop = {
          name: "\u6536\u83B7",
          help: "\u6307\u4EE4\uFF1A.\u6536\u83B7",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              console.log(`\u6536\u83B7\u6307\u4EE4: \u4E00\u952E\u6536\u83B7`);
              seal.replyToSender(ctx, msg, farmer.harvestCrop("all"));
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdDiscardItem = {
          name: "\u4E22\u5F03",
          help: "\u6307\u4EE4\uFF1A.\u4E22\u5F03 <\u7269\u54C1\u540D>\uFF08\u6570\u76EE\uFF09",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              let item = cmdArgs.getArgN(1);
              let quantity = parseInt(cmdArgs.getArgN(2)) || 1;
              console.log(`\u4E22\u5F03\u6307\u4EE4: \u7269\u54C1: ${item}, \u6570\u91CF: ${quantity}`);
              let result = farmer.discardItem(item, quantity);
              console.log(`\u4E22\u5F03\u7ED3\u679C: ${result}`);
              seal.replyToSender(ctx, msg, result);
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdChangeName = {
          name: "\u4FEE\u6539\u519C\u592B\u540D",
          help: "\u6307\u4EE4\uFF1A.\u4FEE\u6539\u519C\u592B\u540D<\u65B0\u7528\u6237\u540D>",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              let newName = cmdArgs.getArgN(1);
              let result = farmer.changeName(newName);
              seal.replyToSender(ctx, msg, result);
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdUseFertilizer = {
          name: "\u4F7F\u7528\u80A5\u6599",
          help: "\u6307\u4EE4\uFF1A.\u4F7F\u7528\u80A5\u6599 <\u7530\u5730\u5E8F\u53F7>",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              let field = cmdArgs.getArgN(1);
              let result = farmer.useFertilizer(field);
              seal.replyToSender(ctx, msg, result);
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdSignIn = {
          name: "\u7B7E\u5230",
          help: "\u6307\u4EE4\uFF1A.\u7B7E\u5230",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              const now = /* @__PURE__ */ new Date();
              const today = now.toDateString();
              if (farmer.lastSignInDate === today) {
                weatherManager.updateWeather();
                const dateInfo2 = `${now.getMonth() + 1}\u6708${now.getDate()}\u65E5`;
                const weatherInfo2 = weatherManager.getWeatherInfo();
                const signInMessage2 = `\u4ECA\u5929\u5DF2\u7ECF\u6253\u8FC7\u62DB\u547C\u4E86\u5427\uFF01\u8FD8\u662F\u8BF4\uFF0C\u4F60\u662F\u6765\u770B\u770B\u65E5\u5386\u770B\u770B\u5929\u6C14\u7684\uFF1F
\u65E5\u671F\uFF1A${dateInfo2}
${weatherInfo2}`;
                seal.replyToSender(ctx, msg, signInMessage2);
                return seal.ext.newCmdExecuteResult(true);
              }
              weatherManager.updateWeather();
              const dateInfo = `${now.getMonth() + 1}\u6708${now.getDate()}\u65E5`;
              const weatherInfo = weatherManager.getWeatherInfo();
              const reward = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
              farmer.money += reward;
              farmer.lastSignInDate = today;
              farmer.saveData();
              let signInMessage = `\u7B7E\u5230\u6210\u529F\uFF01
\u65E5\u671F\uFF1A${dateInfo}
${weatherInfo}
\u83B7\u5F97${reward}\u91D1\u5E01\u3002`;
              switch (weatherManager.getCurrentWeather()) {
                case "\u6674\u5929" /* Sunny */:
                  signInMessage += "\n\u54E6\u5440\u54E6\u5440\uFF0C\u662F\u4E2A\u5927\u6674\u5929\u5462~\uFF08\u65E0\u589E\u76CA\u5929\u6C14\uFF09";
                  break;
                case "\u96E8\u5929" /* Rainy */:
                  signInMessage += "\n\u4E0B\u96E8\u4E86\uFF0C\u662F\u690D\u7269\u4EEC\u559C\u6B22\u7684\u65E5\u5B50\u5462~\uFF08\u6536\u83B7\u65F6\u95F4\u7F29\u77ED\uFF0C\u53EF\u4EE5\u6293\u86AF\u8693\uFF09";
                  break;
                case "\u5E72\u65F1" /* Drought */:
                  signInMessage += "\n\u771F\u662F\u706B\u70ED\u7684\u5929\u6C14...\u522B\u5FD8\u4E86\u7ED9\u519C\u7530\u6D47\u6C34\uFF08\u6536\u83B7\u65F6\u95F4\u5EF6\u957F\uFF09";
                  break;
                case "\u66B4\u98CE\u96E8" /* Stormy */:
                  signInMessage += "\n\u54CE\u5440\uFF01\u4ECA\u5929\u66B4\u98CE\u96E8\u8981\u6765\u4E86\uFF0C\u6CE8\u610F\u4F5C\u7269\u522B\u88AB\u5439\u8DD1\u4E86\uFF01\uFF08\u6536\u83B7\u65F6\u95F4\u5927\u5E45\u5EF6\u957F\uFF09";
                  break;
                case "\u4E30\u6536\u65E5" /* Harvest */:
                  signInMessage += "\n\u771F\u662F\u4EE4\u4EBA\u795E\u6E05\u6C14\u723D\u7684\u597D\u65E5\u5B50\uFF0C\u4F60\u8BF4\u662F\u4E0D\u662F~\uFF08\u6536\u83B7\u65F6\u95F4\u5927\u5E45\u7F29\u77ED\uFF09";
                  break;
              }
              seal.replyToSender(ctx, msg, signInMessage);
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdFish = {
          name: "\u9493\u9C7C",
          help: "\u6307\u4EE4\uFF1A.\u9493\u9C7C",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              const result = farmer.fish();
              seal.replyToSender(ctx, msg, result);
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdCatchWorms = {
          name: "\u6293\u86AF\u8693",
          help: "\u6307\u4EE4\uFF1A.\u6293\u86AF\u8693",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              const fisher = Fisher.getData(farmer.id);
              const result = fisher.catchWorms();
              seal.replyToSender(ctx, msg, result);
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        const cmdExplore = {
          name: "\u8FDC\u822A",
          help: "\u6307\u4EE4\uFF1A.\u8FDC\u822A",
          solve: (ctx, msg, cmdArgs) => {
            return handleFarmerCommand(ctx, msg, cmdArgs, (farmer) => {
              if (!farmer) {
                seal.replyToSender(ctx, msg, `\u4F60\u8FD8\u4E0D\u662F\u519C\u592B\u54E6\uFF0C\u8BD5\u7740\u7528.\u6210\u4E3A\u519C\u592B\u6307\u4EE4\u52A0\u5165\u5927\u5BB6\u5427\uFF01`);
                return seal.ext.newCmdExecuteResult(true);
              }
              const fisher = Fisher.getData(farmer.id);
              const explorationType = fisher.getExplorationType();
              if (explorationType) {
                const remainingTime = fisher.getExplorationRemainingTime();
                console.log(`\u5F53\u524D\u8FDC\u822A\u72B6\u6001: ${explorationType}, \u5269\u4F59\u65F6\u95F4: ${remainingTime}`);
                seal.replyToSender(ctx, msg, `\u4F60\u7684\u8239\u961F\u6B63\u5728\u63A2\u7D22\u4E2D\uFF0C\u8BA9\u6211\u770B\u770B...\u55EF\uFF0C\u8FD8\u6709${remainingTime}\u624D\u4F1A\u56DE\u6765\u54E6~`);
                return seal.ext.newCmdExecuteResult(true);
              }
              const result = fisher.explore(cmdArgs.getArgN(1));
              seal.replyToSender(ctx, msg, result);
              return seal.ext.newCmdExecuteResult(true);
            });
          }
        };
        ext.cmdMap["\u6210\u4E3A\u519C\u592B"] = cmdBecomeFarmer;
        ext.cmdMap["\u519C\u573A\u6307\u4EE4"] = cmdFarmCommands;
        ext.cmdMap["\u6211\u7684\u519C\u7530"] = cmdFarmInfo;
        ext.cmdMap["\u79CD\u690D"] = cmdPlantCrop;
        ext.cmdMap["\u519C\u7530\u5546\u5E97"] = cmdStoreInfo;
        ext.cmdMap["\u8D2D\u4E70"] = cmdBuyItem;
        ext.cmdMap["\u51FA\u552E"] = cmdSellItem;
        ext.cmdMap["\u597D\u53CB\u4FE1\u606F"] = cmdOtherFarmInfo;
        ext.cmdMap["\u6211\u7684\u4ED3\u5E93"] = cmdWarehouseInfo;
        ext.cmdMap["\u94F2\u9664\u519C\u7530"] = cmdRemoveCrop;
        ext.cmdMap["\u5077\u7A83"] = cmdStealCrop;
        ext.cmdMap["\u6536\u83B7"] = cmdHarvestCrop;
        ext.cmdMap["\u4E22\u5F03"] = cmdDiscardItem;
        ext.cmdMap["\u4FEE\u6539\u519C\u592B\u540D"] = cmdChangeName;
        ext.cmdMap["\u4F7F\u7528\u80A5\u6599"] = cmdUseFertilizer;
        ext.cmdMap["\u7B7E\u5230"] = cmdSignIn;
        ext.cmdMap["\u9493\u9C7C"] = cmdFish;
        ext.cmdMap["\u6293\u86AF\u8693"] = cmdCatchWorms;
        ext.cmdMap["\u8FDC\u822A"] = cmdExplore;
        seal.ext.register(ext);
      }
    }
    function handleFarmerCommand(ctx, msg, cmdArgs, callback) {
      let id = ctx.player.userId;
      let name = ctx.player.name;
      let farmer = Farmer.getData(id);
      return callback(farmer, id, name);
    }
    main();
  })();
})();

