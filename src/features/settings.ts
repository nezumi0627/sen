import { Settings } from '../types/settings';

export class SettingsManager {
  private settings: Settings = {
    showLoginIcon: true,
    showSenIcon: true,
  };

  async loadSettings(): Promise<Settings> {
    const response = await chrome.storage.sync.get(['showLoginIcon', 'showSenIcon']);
    this.settings = {
      showLoginIcon: response.showLoginIcon ?? true,
      showSenIcon: response.showSenIcon ?? true,
    };
    return this.settings;
  }

  async updateSetting(key: keyof Settings, value: boolean): Promise<void> {
    this.settings[key] = value;
    await chrome.storage.sync.set({ [key]: value });
  }

  getSettings(): Settings {
    return this.settings;
  }
}
