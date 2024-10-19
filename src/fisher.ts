import { Farmer } from './farmer';
import { WeatherType } from './farmer'; // 确保正确导入 WeatherType
import { WeatherManager } from './weatherManager'; // 确保正确导入 WeatherManager

export class Fisher {
  private farmer: Farmer;
  private fishCount: number; // 记录钓鱼次数
  private lastFishTime: number; // 记录上次钓鱼时间
  private fishCooldown: number; // 钓鱼冷却时间
  private wormCatchCount: number; // 记录抓蚯蚓次数

  constructor(farmer: Farmer) {
    this.farmer = farmer;
    this.fishCount = 0;
    this.lastFishTime = 0;
    this.fishCooldown = 0;
    this.wormCatchCount = 0;
  }

  private refreshFishPond() {
    const now = new Date();
    const today = now.toDateString();
    if (this.farmer.lastFishPondRefresh !== today) {
      this.farmer.fishPond = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
      this.farmer.lastFishPondRefresh = today;
      this.farmer.saveData();
    }
  }

  public fish(): string {
    this.refreshFishPond();

    const now = Date.now();

    // 检查是否在冷却时间内
    if (this.fishCooldown > 0 && now - this.lastFishTime < this.fishCooldown) {
      const remainingTime = Math.ceil((this.fishCooldown - (now - this.lastFishTime)) / 60000);
      return `鱼塘中的鱼儿都躲起来了，等一会儿再来吧！唔...我看看，还要${remainingTime}分钟后他们才会出现哦~`;
    }

    if (this.farmer.fishPond <= 0) {
      return "鱼塘中的鱼已经没有了，明天再来吧~";
    }

    if (!this.farmer.warehouse["鱼饵"]) {
      return "你还没有鱼饵呢，先去商店买点啦~";
    }

    this.farmer.warehouse["鱼饵"]--;
    if (this.farmer.warehouse["鱼饵"] === 0) {
      delete this.farmer.warehouse["鱼饵"];
    }

    const successRate = 0.4; // 40% 成功率
    const success = Math.random() < successRate;

    if (!success) {
      this.farmer.fishPond--;
      this.farmer.saveData();
      this.fishCount++;
      this.checkFishCooldown();
      return "哎呀！鱼跑了...";
    }

    let fishType = "";
    switch (this.farmer.level) {
      case 4:
        fishType = this.getRandomFishType(["鲤鱼","鲱鱼", "小嘴鲈鱼", "太阳鱼","鳀鱼"]);
        break;
      case 5:
        fishType = this.getRandomFishType(["鲤鱼","鲱鱼", "小嘴鲈鱼", "太阳鱼","鳀鱼","沙丁鱼", "河鲈", "鲢鱼", "鲷鱼","红鲷鱼","海参","虹鳟鱼"]);
        break;
      case 6:
        fishType = this.getRandomFishType(["鲤鱼","鲱鱼", "小嘴鲈鱼", "太阳鱼","鳀鱼","沙丁鱼", "河鲈", "鲢鱼", "鲷鱼","红鲷鱼","海参","虹鳟鱼","大眼鱼","西鲱","大头鱼","大嘴鲈鱼","鲑鱼","鬼鱼"]);
        break;
      case 7:
        fishType = this.getRandomFishType(["鲤鱼","鲱鱼", "小嘴鲈鱼", "太阳鱼","鳀鱼","沙丁鱼", "河鲈", "鲢鱼", "鲷鱼","红鲷鱼","海参","虹鳟鱼","大眼鱼","西鲱","大头鱼","大嘴鲈鱼","鲑鱼","鬼鱼","罗非鱼","木跃鱼","狮子鱼","比目鱼","大比目鱼","午夜鲤鱼"]);
        break;
      // 其他等级可以继续添加
      default:
        fishType = this.getRandomFishType(["鲤鱼","鲱鱼", "小嘴鲈鱼", "太阳鱼","鳀鱼","沙丁鱼", "河鲈", "鲢鱼", "鲷鱼","红鲷鱼","海参","虹鳟鱼","大眼鱼","西鲱","大头鱼","大嘴鲈鱼","鲑鱼","鬼鱼","罗非鱼","木跃鱼","狮子鱼","比目鱼","大比目鱼","午夜鲤鱼","史莱姆鱼","虾虎鱼","红鲻鱼","青花鱼","狗鱼","虎纹鳟鱼","蓝铁饼鱼","沙鱼"])
    }

    if (!this.farmer.warehouse[fishType]) {
      this.farmer.warehouse[fishType] = 0;
    }
    this.farmer.warehouse[fishType]++;
    this.farmer.fishPond--;
    this.farmer.saveData();
    this.fishCount++;
    this.checkFishCooldown();

    return `等待...等待...成功钓到一条${fishType}！`;
  }

  private checkFishCooldown() {
    if (this.fishCount >= 4 && this.fishCount <= 6) {
      this.fishCooldown = Math.floor(Math.random() * (60 - 30 + 1) + 30) * 60 * 1000; // 30分钟到1小时不等的冷却时间
      this.lastFishTime = Date.now();
    } else if (this.fishCount > 6) {
      this.fishCount = 0;
      this.fishCooldown = 0;
    }
  }

  private getRandomFishType(fishTypes: string[]): string {
    return fishTypes[Math.floor(Math.random() * fishTypes.length)];
  }

  public catchWorms(): string {
    if (this.farmer.level < 4) {
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
      if (!this.farmer.warehouse["鱼饵"]) {
        this.farmer.warehouse["鱼饵"] = 0;
      }
      this.farmer.warehouse["鱼饵"]++;
      this.wormCatchCount++;
      this.farmer.saveData();
      return "恭喜你捕捉到了蚯蚓！";
    } else {
      this.wormCatchCount++;
      this.farmer.saveData();
      return "你挖了半天土，都没找到蚯蚓，有点可怜啊~";
    }
  }
}
