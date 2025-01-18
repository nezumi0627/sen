import { Settings } from '../types/settings';

export class SettingsManager {
  private settings: Settings = {
    showLoginIcon: true,
    showSenIcon: true,
    darkMode: false,
  };

  async loadSettings(): Promise<Settings> {
    const response = await chrome.storage.sync.get(['showLoginIcon', 'showSenIcon', 'darkMode']);
    this.settings = {
      showLoginIcon: response.showLoginIcon ?? true,
      showSenIcon: response.showSenIcon ?? true,
      darkMode: response.darkMode ?? false,
    };
    return this.settings;
  }

  async updateSetting(key: keyof Settings, value: boolean): Promise<void> {
    this.settings[key] = value;
    await chrome.storage.sync.set({ [key]: value });

    // ダークモードの設定が変更された場合、テーマを更新
    if (key === 'darkMode') {
      this.updateTheme();
    }
  }

  getSettings(): Settings {
    return this.settings;
  }

  private updateTheme(): void {
    document.documentElement.setAttribute('data-theme', this.settings.darkMode ? 'dark' : 'light');
  }
}
