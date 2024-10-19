import { WeatherManager } from './weatherManager';
import { Fisher } from './fisher'; // 确保正确导入 Fisher 类

export enum WeatherType {
  Sunny = "晴天",
  Rainy = "雨天",
  Drought = "干旱",
  Stormy = "暴风雨",
  Harvest = "丰收日"
}

const WeatherEffects = {
  [WeatherType.Sunny]: 1.0, // 正常生长
  [WeatherType.Rainy]: 0.8, // 生长速度加快，时间缩短为原来的0.8
  [WeatherType.Drought]: 1.5, // 生长速度减慢，时间为原来的1.5
  [WeatherType.Stormy]: 2.5, // 生长速度减慢，时间为原来的2.5
  [WeatherType.Harvest]: 0.5 // 生长速度加快，时间缩短为原来的0.5
};

// 定义全局商店数据库
const globalStore = {
  "防风草种子": { price: 50, level: 1 },
  "胡萝卜种子": { price: 60, level: 1 },
  "白萝卜种子": { price: 70, level: 2 },
  "花椰菜种子": { price: 70, level: 2 },
  "小白菜种子": { price: 70, level: 2 },
  "青豆种子": { price: 70, level: 2 }, // 2级
  "肥料": { price: 100, level: 2 }, // 新增肥料商品
  "土豆种子": { price: 75, level: 3 },
  "大黄种子": { price: 80, level: 3 },
  "甘蓝菜种子": { price: 80, level: 3 },
  "葡萄种子": { price: 80, level: 3 },
  "向日葵种子": { price: 90, level: 3 },
  "玫瑰花种子": { price: 90, level: 3 }, // 3级
  "草莓种子": { price: 100, level: 4 },
  "辣椒种子": { price: 100, level: 4 },
  "甜瓜种子": { price: 105, level: 4 },
  "红叶卷心菜种子": { price: 105, level: 4 },
  "杨桃种子": { price: 110, level: 4 },
  "郁金香种子": { price: 105, level: 4 },
  "玫瑰仙子种子": { price: 110, level: 4 }, // 4级
  "茄子种子": { price: 110, level: 5 },
  "苋菜种子": { price: 110, level: 5 },
  "山药种子": { price: 110, level: 5 },
  "夏季亮片种子": { price: 120, level: 5 },
  "虞美人种子": { price: 150, level: 5 },
  "桃树种子": { price: 120, level: 5 },
  "苹果树种子": { price: 120, level: 5 },
  "香蕉树种子": { price: 150, level: 5 },
  "宝石甜莓种子": { price: 200, level: 5 }, // 5级
  "扩容田地": { price: 500, level: 3 }, // 特殊商品
  "鱼饵": { price: 20, level: 4 }, // 新增鱼饵商品
  "扩容田地ii": { price: 1000, level: 5 } // 新增5级的扩容田地
};

export class WeatherSystem {
  private weatherManager: WeatherManager;

  constructor() {
    this.weatherManager = WeatherManager.getInstance();
  }

  public updateWeather() {
    this.weatherManager.updateWeather();
  }

  public getCurrentWeather(): WeatherType {
    return this.weatherManager.getCurrentWeather();
  }

  public getWeatherInfo(): string {
    return this.weatherManager.getWeatherInfo();
  }
}

export class Farmer {
  id: string;
  name: string;
  fields: number;
  money: number;
  level: number;
  experience: number;
  crops: { [key: string]: { seed: string; harvestTime: number; stolen?: boolean } };
  warehouse: { [key: string]: number };
  private lastStealTime: number; // 确保 lastStealTime 只声明一次
  private weatherSystem: WeatherSystem; // 添加 weatherSystem 实例
  lastSignInDate: string; // 新增 lastSignInDate 属性
  private purchasedFields: { [level: number]: boolean }; // 记录每个等级的扩容田地是否已经购买过
  private stealCooldown: number = 60 * 1000; // 偷窃冷却时间，单位为毫秒，这里设置为1分钟
  fishPond: number; // 鱼塘中的鱼苗数量
  lastFishPondRefresh: string; // 上次刷新鱼塘的日期

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.fields = 6;
    this.money = 200;
    this.level = 1;
    this.experience = 0;
    this.crops = {};
    this.warehouse = { "防风草种子": 6 };
    this.lastStealTime = 0; // 初始化 lastStealTime
    this.weatherSystem = new WeatherSystem(); // 初始化 weatherSystem 实例
    this.lastSignInDate = ""; // 初始化 lastSignInDate 属性
    this.purchasedFields = {}; // 初始化 purchasedFields 属性
    this.fishPond = 0; // 初始化 fishPond 属性
    this.lastFishPondRefresh = ""; // 初始化 lastFishPondRefresh 属性
  }

  static getData(id: string): Farmer | null {
    try {
      let farmerData = JSON.parse(seal.ext.find('我的农田插件').storageGet(id) || "{}");
      console.log(`加载数据: ${JSON.stringify(farmerData)}`);
      if (Object.keys(farmerData).length === 0) {
        console.log(`加载数据为空: ${id}`);
        return null;
      }
      let farmer = new Farmer(id, farmerData.name);
      farmer.fields = farmerData.fields || 6;
      farmer.money = farmerData.money || 200;
      farmer.level = farmerData.level || 1;
      farmer.experience = farmerData.experience || 0;
      farmer.crops = farmerData.crops || {};
      farmer.warehouse = farmerData.warehouse || { "防风草种子": 6 };
      farmer.lastStealTime = farmerData.lastStealTime || 0; // 确保 lastStealTime 被正确初始化
      farmer.lastSignInDate = farmerData.lastSignInDate || ""; // 初始化 lastSignInDate 属性
      farmer.purchasedFields = farmerData.purchasedFields || {}; // 初始化 purchasedFields 属性
      farmer.fishPond = farmerData.fishPond || 0; // 初始化 fishPond 属性
      farmer.lastFishPondRefresh = farmerData.lastFishPondRefresh || ""; // 初始化 lastFishPondRefresh 属性
      console.log(`初始化后的农夫数据: ${JSON.stringify(farmer)}`);
      return farmer;
    } catch (error) {
      console.error(`Failed to initialize ${id}:`, error);
      return null;
    }
  }

  saveData() {
    console.log(`保存数据: ${JSON.stringify(this)}`);
    seal.ext.find('我的农田插件').storageSet(this.id.toString(), JSON.stringify(this));
  }

  checkLevelUp() {
    let levelUpThresholds = [100, 500, 1000, 1500, 2000, 2500, 3000, 3600, 4000, 5000];//升级阈值
    let threshold = levelUpThresholds[this.level - 1];
    if (this.experience >= threshold) {
      this.level++;
      this.experience -= threshold;
      this.saveData();
      if (this.level === 4) {
        return `恭喜！您升级到${this.level}级了，可以解锁更多商品了。\n恭喜您解锁鱼塘，开启钓鱼功能！`;
      }
      return `恭喜！您升级到${this.level}级了，可以解锁更多商品了。`;
    }
    return null;
  }

  public fish(): string {
    const fisher = new Fisher(this);
    return fisher.fish();
  }

  plantCrop(seed: string, quantity: number) {
    if (!seed.endsWith("种子")) {
      return `该物品不可种植。`;
    }
    if (!this.warehouse[seed]) {
      return `你没有${seed}，请购买后种植。`;
    }
    let availableFields = this.fields - Object.keys(this.crops).length;
    if (quantity > availableFields) {
      return `你只有${availableFields}块空闲田地。`;
    }
    if (this.warehouse[seed] < quantity) {
      return `你的仓库中没有足够的${seed}。`;
    }

    // 获取当前天气
    const weatherEffect = WeatherEffects[this.weatherSystem.getCurrentWeather()];

    let plantingTime = Math.random() * (4 - 0.5) + 0.5;
    let harvestTime = (/* @__PURE__ */ new Date()).getTime() + plantingTime * 60 * 60 * 1000 * weatherEffect;
    for (let i = 0; i < quantity; i++) {
      let field = this.getNextAvailableField();
      this.crops[field] = { seed, harvestTime, stolen: false };
    }
    this.warehouse[seed] -= quantity;
    if (this.warehouse[seed] === 0) {
      delete this.warehouse[seed];
    }
    this.saveData();
    return `成功种植${quantity}块${seed}，成熟时间为${this.formatTime(plantingTime)}。`;
  }

  getNextAvailableField() {
    let fieldNumber = 1;
    while (this.crops[`田地${fieldNumber}`]) {
      fieldNumber++;
    }
    return `田地${fieldNumber}`;
  }

  harvestAllCrops() {
    let now = (/* @__PURE__ */ new Date()).getTime();
    let harvestedCrops = {};
    let totalMoney = 0;
    let totalExperience = 0;
    console.log(`当前时间: ${now}`);
    console.log(`当前田地: ${JSON.stringify(this.crops)}`);
    for (let field in this.crops) {
      console.log(`检查 ${field}: ${JSON.stringify(this.crops[field])}`);
      if (this.crops[field].harvestTime <= now && !this.crops[field].stolen) {
        let seed = this.crops[field].seed;
        let crop = seed.replace("种子", "");
        let seedPrice = globalStore[seed].price;
        let cropPrice = seedPrice * 1.25;
        let experience = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
        console.log(` ${field} 的作物已成熟: ${crop}`);
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
      return `当前田地暂时没有成熟作物哦~`;
    }
    this.money += totalMoney;
    this.experience += totalExperience;
    this.saveData();

    // 调用 checkLevelUp 方法检查是否需要升级
    let levelUpMessage = this.checkLevelUp();
    let result = `成功收获`;
    for (let crop in harvestedCrops) {
      result += ` ${crop}×${harvestedCrops[crop]}`;
    }
    result += `，获得${totalMoney}金币和${totalExperience}经验。`;
    if (levelUpMessage) {
      result += `\n${levelUpMessage}`;
    }
    console.log(result);
    return result;
  }

  harvestCrop(field: string) {
    if (field === "all") {
      return this.harvestAllCrops();
    }
    console.log(`检查 ${field}: ${JSON.stringify(this.crops[field])}`);
    if (!this.crops[field] || this.crops[field].harvestTime > (/* @__PURE__ */ new Date()).getTime() || this.crops[field].stolen) {
      return `${field}还没有成熟作物哦！`;
    }
    let seed = this.crops[field].seed;
    let crop = seed.replace("种子", "");
    let seedPrice = globalStore[seed].price;
    let cropPrice = seedPrice * 1.25;
    let experience = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    this.money += cropPrice;
    this.experience += experience;
    delete this.crops[field];
    if (!this.warehouse[crop]) {
      this.warehouse[crop] = 0;
    }
    this.warehouse[crop]++;
    this.saveData();

    // 调用 checkLevelUp 方法检查是否需要升级
    let levelUpMessage = this.checkLevelUp();
    let result = `成功收获${crop}，获得${cropPrice}金币和${experience}经验。`;
    if (levelUpMessage) {
      result += `\n${levelUpMessage}`;
    }
    console.log(result);
    return result;
  }

  getFarmInfo() {
    let info = `用户名: ${this.name}
金币: ${this.money}
等级: ${this.level}
经验: ${this.experience}
`;
    let now = (/* @__PURE__ */ new Date()).getTime();
    for (let field in this.crops) {
      let remainingTime = (this.crops[field].harvestTime - now) / (60 * 60 * 1000);
      if (remainingTime <= 0) {
        info += `${field}: ${this.crops[field].seed.replace("种子", "")}（已成熟）
`;
      } else {
        info += `${field}: ${this.crops[field].seed}，剩余时间: ${this.formatTime(remainingTime)}
`;
      }
    }
    return info;
  }

  formatTime(timeInHours: number) {
    let hours = Math.floor(timeInHours);
    let minutes = Math.round((timeInHours - hours) * 60);
    return `${hours}小时${minutes}分钟`;
  }

  getStoreInfo() {
    let info = `商店商品:
`;
    for (let item in globalStore) {
      let level = globalStore[item].level;
      if (item === "扩容田地" && this.purchasedFields[level]) {
        continue; // 如果已经购买过该等级的扩容田地，则不显示该商品
      }
      info += `${item}: ${globalStore[item].price}金币 (等级${globalStore[item].level})
`;
    }
    return info;
  }

  buyItem(item: string, quantity: number = 1) {
    if (!globalStore[item]) {
      return `商店中没有${item}。`;
    }
    if (this.level < globalStore[item].level) {
      return `你的等级不够购买${item}，再加把劲吧~`;
    }

    // 确保购买数量是一个正整数
    if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      return `请输入一个有效的购买数量哦`;
    }

    let totalPrice = globalStore[item].price * quantity;
    if (this.money < totalPrice) {
      return `嗯...你的金币不够购买${quantity}个${item}。`;
    }

    if (item === "扩容田地") {
      let level = globalStore[item].level;
      if (this.purchasedFields[level]) {
        return `你已经购买过该等级的扩容田地啦！`;
      }
      this.fields += quantity;
      this.purchasedFields[level] = true;
    } else if (item === "扩容田地ii") {
      if (this.purchasedFields[5]) {
        return `你已经购买过5级扩容田地啦！`;
      }
      this.fields += 1; // 5级扩容田地一次只能购买一个
      this.purchasedFields[5] = true;
      delete globalStore["扩容田地ii"]; // 购买后从商店消失
    } else {
      if (!this.warehouse[item]) {
        this.warehouse[item] = 0;
      }
      this.warehouse[item] += quantity;
    }

    this.money -= totalPrice;
    this.saveData();
    return `铛铛——成功购买${item}${quantity}个。`;
  }

  sellItem(item: string, quantity: number = 1) {
  // 检查商品名后所跟数量是否为字符
  if (isNaN(quantity) || !Number.isInteger(quantity) || quantity <= 0) {
    return `请输入有效的出售数量。`;
  }

  if (!this.warehouse[item]) {
    return `你的仓库中没有${item}哦`;
  }
  if (this.warehouse[item] < quantity) {
    return `你的仓库中没有足够的${item}啦！`;
  }

  let sellPrice: number;
  if (item.endsWith("种子")) {
    sellPrice = globalStore[item].price * 0.8;
  } else if (item === "鱼饵") {
    sellPrice = globalStore[item].price * 0.5;
  } else if (this.isFish(item)) { // 调用 isFish 方法
    sellPrice = this.getFishPrice(item);
  } else {
    let seed = item + "种子";
    sellPrice = globalStore[seed].price * 1.25;
  }

  let totalSellPrice = sellPrice * quantity;
  this.money += totalSellPrice;
  this.warehouse[item] -= quantity;
  if (this.warehouse[item] === 0) {
    delete this.warehouse[item];
  }
  this.saveData();
  console.log(`出售物品: ${item}, 数量: ${quantity}, 单价: ${sellPrice}, 总价: ${totalSellPrice}`);
  return `成功出售${item}${quantity}个，获得${totalSellPrice}金币~`;
}
  // 新增方法：判断是否为鱼类物品
  private isFish(item: string): boolean {
    const fishTypes = ["鳀鱼", "沙丁鱼", "鲷鱼", "大嘴鲈鱼", "鲤鱼"]; // 可以根据需要扩展
    return fishTypes.includes(item);
  }

  // 新增方法：获取鱼类物品的售价
  private getFishPrice(item: string): number {
    const fishPrices = {
      "鳀鱼": 50,
      "沙丁鱼": 60,
      "鲷鱼": 100,
      "大嘴鲈鱼": 150,
      "鲤鱼": 30
    }; // 可以根据需要扩展
    return fishPrices[item] || 0;
  }

  getWarehouseInfo() {
    let info = `仓库物品:
`;
    for (let item in this.warehouse) {
      info += `${item}: ${this.warehouse[item]}
`;
    }
    return info;
  }

  removeCrop(field: string) {
    if (!this.crops[field]) {
      return `${field}没有种植作物。`;
    }
    delete this.crops[field];
    this.saveData();
    return `成功铲除${field}的作物。`;
  }

  public stealCrop(targetFarmer: Farmer): string {
  const now = Date.now();

  // 检查偷窃冷却时间
  if (this.lastStealTime !== 0 && now - this.lastStealTime < this.stealCooldown) {
    const remainingTime = Math.ceil((this.stealCooldown - (now - this.lastStealTime)) / 1000);
    return `附近还有人看着呢，再等${remainingTime}秒后再试吧...`;
  }


  // 检查目标农田中是否有成熟的作物
  const matureFields = Object.keys(targetFarmer.crops).filter(field => {
    return targetFarmer.crops[field].harvestTime <= now && !targetFarmer.crops[field].stolen;
  });

  // 打印成熟的作物信息
  console.log(`成熟的作物信息: ${JSON.stringify(matureFields)}`);

  if (matureFields.length === 0) {
    return `这家人的田地中可没有成熟的作物，换个目标吧~`;
  }

  // 随机选择一块成熟的作物
  const randomField = matureFields[Math.floor(Math.random() * matureFields.length)];
  const seed = targetFarmer.crops[randomField].seed;
  const crop = seed.replace("种子", "");

  // 将偷窃的作物添加到偷窃者的仓库中
  if (!this.warehouse[crop]) {
    this.warehouse[crop] = 0;
  }
  this.warehouse[crop]++;


  // 从被偷窃者的农田中删除被偷窃的作物
  delete targetFarmer.crops[randomField];


  // 更新偷窃者的上次偷窃时间
  this.lastStealTime = now;

  // 保存数据
  this.saveData();
  targetFarmer.saveData();

  return `嗯哼~成功偷取到${crop}啦！`;
}

  changeName(newName: string) {
    this.name = newName;
    this.saveData();
    return `要改名成${newName}吗？好的好的，不会是做了什么亏心事吧~`;
  }

  useFertilizer(field: string) {
    if (!this.warehouse["肥料"]) {
      return `你的仓库中没有肥料哦`;
    }

    if (!this.crops[field]) {
      return `${field}没有种植作物。`;
    }

    let now = (/* @__PURE__ */ new Date()).getTime();
    let remainingTime = (this.crops[field].harvestTime - now) / (60 * 60 * 1000);
    if (remainingTime <= 0) {
      return `${field}的作物已经成熟啦！`;
    }

    // 使用肥料，减少一半的生长时间
    this.crops[field].harvestTime -= remainingTime * 0.5 * 60 * 60 * 1000;
    this.warehouse["肥料"]--;
    if (this.warehouse["肥料"] === 0) {
      delete this.warehouse["肥料"];
    }
    this.saveData();
    return `成功对${field}使用魔...肥料，剩余时间减少一半~`;
  }
  // 添加 lastStealTime 的 getter
  public getLastStealTime(): number {
    return this.lastStealTime;
  }

  // 添加 discardItem 方法
  public discardItem(item: string, quantity: number = 1): string {
    if (!this.warehouse[item]) {
      return `你没有${item}物品。`;
    }

    // 确保丢弃数量是一个正整数
    if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      return `请输入正确的数目。`;
    }

    if (this.warehouse[item] < quantity) {
      return `要丢弃的数目太多啦！`;
    }

    this.warehouse[item] -= quantity;
    if (this.warehouse[item] === 0) {
      delete this.warehouse[item];
    }
    this.saveData();
    return `成功丢弃${quantity}个${item}。`;
  }
}
