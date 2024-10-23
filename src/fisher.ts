import { Farmer, WeatherType, globalStore } from "./farmer";
import { WeatherManager } from "./weatherManager";

//原fisher.ts
export class Fisher extends Farmer {
    // private farmer: Farmer;
    private wormCatchCount: number; // 记录抓蚯蚓次数
    private explorationType: string | null; // 记录当前的远航类型
    private explorationStartTime: number | null; // 记录远航开始时间
  
    constructor(id: string, name: string) {
      super(id, name)
  
      this.wormCatchCount = 0;
      this.explorationType = null;
      this.explorationStartTime = null;
    }
    static getData(id: string): Fisher | null {
      try {
        let fisherData = JSON.parse(seal.ext.find('我的农田插件').storageGet(id) || "{}");
        if (Object.keys(fisherData).length === 0) {
          return null;
        }
        let fisher = new Fisher(id, fisherData.name);
        for (const key in fisherData) {
          fisher[key] = fisherData[key] || fisher[key]
        }
        // farmer.fields = farmerData.fields || 6;
        // farmer.money = farmerData.money || 200;
        // farmer.level = farmerData.level || 1;
        // farmer.experience = farmerData.experience || 0;
        // farmer.crops = farmerData.crops || {};
        // farmer.warehouse = farmerData.warehouse || { "防风草种子": 6 };
        // farmer.lastStealTime = farmerData.lastStealTime || 0; // 确保 lastStealTime 被正确初始化
        // farmer.lastSignInDate = farmerData.lastSignInDate || ""; // 初始化 lastSignInDate 属性
        // farmer.purchasedFields = farmerData.purchasedFields || {}; // 初始化 purchasedFields 属性
        // farmer.fishPond = farmerData.fishPond || 0; // 初始化 fishPond 属性
        // farmer.lastFishPondRefresh = farmerData.lastFishPondRefresh || ""; // 初始化 lastFishPondRefresh 属性
        return fisher;
      } catch (error) {
        return null;
      }
    }
    private refreshFishPond() {
      const now = new Date();
      const today = now.toDateString();
      if (this.lastFishPondRefresh !== today) {
        this.fishPond = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
        this.lastFishPondRefresh = today;
        this.saveData();
      }
    }
  
    public fish(): string {
      this.refreshFishPond();
  
      if (this.fishPond <= 0) {
        return "鱼塘中的鱼已经没有了，明天再来吧~";
      }
  
      if (!this.warehouse["鱼饵"]) {
        return "你还没有鱼饵呢，先去商店买点啦~";
      }
  
      this.warehouse["鱼饵"]--;
      if (this.warehouse["鱼饵"] === 0) {
        delete this.warehouse["鱼饵"];
      }
  
      const successRate = 0.55; // 55% 成功率
      const success = Math.random() < successRate;
  
      if (!success) {
        this.fishPond -= 0.5
        this.saveData();
        return "哎呀！鱼跑了...";
      }
  
      let fishType = "";
      switch (this.level) {
        case 4:
          fishType = this.getRandomFishType(["鲤鱼", "鲱鱼", "小嘴鲈鱼", "太阳鱼", "鳀鱼"]);
          break;
        case 5:
          fishType = this.getRandomFishType(["鲤鱼", "鲱鱼", "小嘴鲈鱼", "太阳鱼", "鳀鱼", "沙丁鱼", "河鲈", "鲢鱼", "鲷鱼", "红鲷鱼", "海参", "虹鳟鱼"]);
          break;
        case 6:
          fishType = this.getRandomFishType(["鲤鱼", "鲱鱼", "小嘴鲈鱼", "太阳鱼", "鳀鱼", "沙丁鱼", "河鲈", "鲢鱼", "鲷鱼", "红鲷鱼", "海参", "虹鳟鱼", "大眼鱼", "西鲱", "大头鱼", "大嘴鲈鱼", "鲑鱼", "鬼鱼"]);
          break;
        case 7:
          fishType = this.getRandomFishType(["鲤鱼", "鲱鱼", "小嘴鲈鱼", "太阳鱼", "鳀鱼", "沙丁鱼", "河鲈", "鲢鱼", "鲷鱼", "红鲷鱼", "海参", "虹鳟鱼", "大眼鱼", "西鲱", "大头鱼", "大嘴鲈鱼", "鲑鱼", "鬼鱼", "罗非鱼", "木跃鱼", "狮子鱼", "比目鱼", "大比目鱼", "午夜鲤鱼"]);
          break;
        // 其他等级可以继续添加
        default:
          fishType = this.getRandomFishType(["鲤鱼", "鲱鱼", "小嘴鲈鱼", "太阳鱼", "鳀鱼", "沙丁鱼", "河鲈", "鲢鱼", "鲷鱼", "红鲷鱼", "海参", "虹鳟鱼", "大眼鱼", "西鲱", "大头鱼", "大嘴鲈鱼", "鲑鱼", "鬼鱼", "罗非鱼", "木跃鱼", "狮子鱼", "比目鱼", "大比目鱼", "午夜鲤鱼", "史莱姆鱼", "虾虎鱼", "红鲻鱼", "青花鱼", "狗鱼", "虎纹鳟鱼", "蓝铁饼鱼", "沙鱼"])
      }
  
      // 生成鱼的长度
      const lengthProbability = Math.random();
      let fishLength: number;
      if (lengthProbability < 0.7) {
        fishLength = parseFloat((Math.random() * (3 - 2) + 2).toFixed(1)); // 2-3尺长
      } else if (lengthProbability < 0.8) {
        fishLength = parseFloat((Math.random() * (2 - 1) + 1).toFixed(1)); // 1-2尺长
      } else if (lengthProbability < 0.9) {
        fishLength = parseFloat((Math.random() * (4 - 3) + 3).toFixed(1)); // 3-4尺长
      } else if (lengthProbability < 0.95) {
        fishLength = parseFloat((Math.random() * (6 - 5) + 5).toFixed(1)); // 5-6尺长
      } else {
        fishLength = parseFloat((Math.random() * (1 - 0) + 0).toFixed(1)); // 0-1尺长
      }
  
  
      if (!this.warehouse[fishType]) {
        this.warehouse[fishType] = 0;
      }
      this.warehouse[fishType]++;
      this.fishPond--
      this.saveData();
      return `等待...等待...成功钓到一条长度为${fishLength}尺的${fishType}！`;
    }
  
    private getRandomFishType(fishTypes: string[]): string {
      return fishTypes[Math.floor(Math.random() * fishTypes.length)];
    }
  
    public catchWorms(): string {
      if (this.level < 4) {
        return "你的等级不够哦，再等等再来吧！";
      }
  
      const weatherManager = WeatherManager.getInstance();
      const currentWeather = weatherManager.getCurrentWeather();
  
      if (currentWeather !== WeatherType.Rainy) {
        return "今天可没有蚯蚓出来啊...";
      }
  
      if (this.wormCatchCount >= 12) {
        return "这里已经没有蚯蚓了...";
      }
  
      const successRate = 0.8; // 80% 成功率
      const success = Math.random() < successRate;
  
      if (success) {
        if (!this.warehouse["鱼饵"]) {
          this.warehouse["鱼饵"] = 0;
        }
        this.warehouse["鱼饵"]++;
        this.wormCatchCount++;
        this.saveData();
        return "恭喜你捕捉到了蚯蚓！";
      } else {
        this.wormCatchCount++;
        this.saveData();
        return "你挖了半天土，都没找到蚯蚓，有点可怜啊~";
      }
    }
  
    public getExplorationType(): string | null {
      const explorationType = this.explorationType;
      console.log(`读取 explorationType: ${explorationType}`);
      return explorationType;
    }
  
    public explore(type: string): string {
      // 检查是否处于远航状态
      if (this.explorationType) {
        const remainingTime = this.getExplorationRemainingTime();
        console.log(`当前远航状态: ${this.explorationType}, 剩余时间: ${remainingTime}`);
        return `你的船队正在探索中，让我看看...嗯，还有${remainingTime}才会回来哦~`;
      }
  
      const explorationTypes = {
        "近海远航": { duration: 5 * 60 * 60 * 1000, cost: 1000, reward: { minGold: 1200, maxGold: 1500, seeds: 7 } },
        "远海探索": { duration: 8 * 60 * 60 * 1000, cost: 3000, reward: { minGold: 3200, maxGold: 4000, seeds: 15, fish: 5 } },
        "随机探索": { duration: 12 * 60 * 60 * 1000, cost: 5000, reward: { minGold: 3000, maxGold: 8000, seeds: { min: 10, max: 20 }, fish: { min: 3, max: 10 } } }
      };
  
      const exploration = explorationTypes[type];
      if (!exploration) {
        return "选择远航类型：\n1.近海远航（5小时，1000金币）\n2.远海探索（8小时，3000金币）\n3.随机探索（12小时，5000金币）\n\n用“.远航<探索类型>开启远航吧！\n*远航结束后会来找你的！";
      }
  
      if (this.money < exploration.cost) {
        return `你的金币不够进行${type}哦~`;
      }
  
      console.log(`存储前 explorationType: ${this.explorationType}, explorationStartTime: ${this.explorationStartTime}`);
  
      this.money -= exploration.cost;
      this.explorationType = type;
      this.explorationStartTime = Date.now();
      this.saveData();
  
      console.log(`存储后 explorationType: ${this.explorationType}, explorationStartTime: ${this.explorationStartTime}`);
  
      return `你的船队出航啦~`;
    }
  
  
    public getExplorationRemainingTime(): string {
      if (!this.explorationType || !this.explorationStartTime) {
        return "0秒";
      }
  
      const explorationTypes = {
        "近海远航": 5 * 60 * 60 * 1000,
        "远海探索": 8 * 60 * 60 * 1000,
        "随机探索": 12 * 60 * 60 * 1000
      };
  
      const duration = explorationTypes[this.explorationType];
      const elapsedTime = Date.now() - this.explorationStartTime;
      const remainingTime = duration - elapsedTime;
  
      if (remainingTime <= 0) {
        // 当 remainingTime 为 0 时，调用 checkExplorationCompletion() 方法
        return this.checkExplorationCompletion();
      }
  
      const hours = Math.floor(remainingTime / (60 * 60 * 1000));
      const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
  
      return `${hours}小时${minutes}分钟${seconds}秒`;
    }
  
    public checkExplorationCompletion(): string {
      if (!this.explorationType || !this.explorationStartTime) {
        return "";
      }
  
      const explorationTypes = {
        "近海远航": { duration: 5 * 60 * 60 * 1000, reward: { minGold: 1200, maxGold: 1500, seeds: 7 } },
        "远海探索": { duration: 8 * 60 * 60 * 1000, reward: { minGold: 3200, maxGold: 4000, seeds: 15, fish: 5 } },
        "随机探索": { duration: 12 * 60 * 60 * 1000, reward: { minGold: 3000, maxGold: 8000, seeds: { min: 10, max: 20 }, fish: { min: 3, max: 10 } } }
      };
  
      const exploration = explorationTypes[this.explorationType];
      const elapsedTime = Date.now() - this.explorationStartTime;
  
      if (elapsedTime >= exploration.duration) {
        const reward = exploration.reward;
        const gold = Math.floor(Math.random() * (reward.maxGold - reward.minGold + 1)) + reward.minGold;
        this.money += gold;
  
        const seedTypes = Object.keys(globalStore).filter(item => item.endsWith("种子"));
        const seedType = seedTypes[Math.floor(Math.random() * seedTypes.length)];
        const seedQuantity = reward.seeds;
  
        if (!this.warehouse[seedType]) {
          this.warehouse[seedType] = 0;
        }
        this.warehouse[seedType] += seedQuantity;
  
        let fishReward = "";
        if (reward.fish) {
          const fishTypes = Object.keys(this.warehouse).filter(item => this.isFish(item));
          const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
          const fishQuantity = reward.fish;
  
          if (!this.warehouse[fishType]) {
            this.warehouse[fishType] = 0;
          }
          this.warehouse[fishType] += fishQuantity;
          fishReward = `和${fishType}×${fishQuantity}`;
        }
  
        this.explorationType = null;
        this.explorationStartTime = null;
        this.saveData();
        let idnumber = Number(this.id)
  
        return `[CQ:at,qq=${idnumber}]你的船队归来啦，带回了${gold}金币、${seedType}×${seedQuantity}mp${fishReward}`;
      }
  
      return "";
    }
  
    public isFish(item: string): boolean {
      const fishTypes = ["鲤鱼", "鲱鱼", "小嘴鲈鱼", "太阳鱼", "鳀鱼", "沙丁鱼", "河鲈", "鲢鱼", "鲷鱼", "红鲷鱼", "海参", "虹鳟鱼", "大眼鱼", "西鲱", "大头鱼", "大嘴鲈鱼", "鲑鱼", "鬼鱼", "罗非鱼", "木跃鱼", "狮子鱼", "比目鱼", "大比目鱼", "午夜鲤鱼", "史莱姆鱼", "虾虎鱼", "红鲻鱼", "青花鱼", "狗鱼", "虎纹鳟鱼", "蓝铁饼鱼", "沙鱼"]; // 可以根据需要扩展
      return fishTypes.includes(item);
    }
  }
  