import { WeatherEffectGateway } from './WeatherEffectGateway';

describe('WeatherEffectGateway', () => {
  let gateway: WeatherEffectGateway;

  beforeEach(() => {
    gateway = new WeatherEffectGateway();
  });

  it('should get current weather effect', async () => {
    const weather = await gateway.getWeatherEffect();
    expect(weather).toBeDefined();
    expect(typeof weather).toBe('string');
    expect(['sunny', 'rainy', 'cloudy', 'stormy']).toContain(weather);
  });

  it('should return consistent weather for same call', async () => {
    const weather1 = await gateway.getWeatherEffect();
    const weather2 = await gateway.getWeatherEffect();
    expect(weather1).toBe(weather2);
  });
});