export class WeatherEffectGateway {
  private weatherOptions = ['sunny', 'rainy', 'cloudy', 'stormy'];
  private currentWeather: string | null = null;

  async getWeatherEffect(): Promise<string> {
    if (!this.currentWeather) {
      this.currentWeather = this.weatherOptions[Math.floor(Math.random() * this.weatherOptions.length)];
    }
    return this.currentWeather;
  }
}