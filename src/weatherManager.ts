import { WeatherType } from './farmer'; // 确保 WeatherType 被正确导入

export class WeatherManager {
  private static instance: WeatherManager;
  private lastDate: Date;
  private currentWeather: WeatherType;

  private constructor() {
    this.lastDate = new Date();
    this.currentWeather = this.getRandomWeather();
  }

  public static getInstance(): WeatherManager {
    if (!WeatherManager.instance) {
      WeatherManager.instance = new WeatherManager();
    }
    return WeatherManager.instance;
  }

  private getRandomWeather(): WeatherType {
    const random = Math.random();
    if (random < 0.5) {
      return WeatherType.Sunny;
    } else if (random < 0.8) {
      return WeatherType.Rainy;
    } else if (random < 0.85) {
      return WeatherType.Drought;
    } else if (random < 0.95) {
      return WeatherType.Stormy;
    } else {
      return WeatherType.Harvest;
    }
  }

  public updateWeather() {
    const now = new Date();
    if (now.getDate() !== this.lastDate.getDate()) {
      this.currentWeather = this.getRandomWeather();
      this.lastDate = now;
      console.log(`天气已更新为：${this.currentWeather}`); // 打印日志
    } else {
      console.log(`天气未更新，当前天气为：${this.currentWeather}`); // 打印日志
    }
  }

  public getCurrentWeather(): WeatherType {
    return this.currentWeather;
  }

  public getWeatherInfo(): string {
    return `当前天气: ${this.currentWeather}`;
  }
}
