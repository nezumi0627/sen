import '../types/chrome';

class BackgroundScript {
  private settings = {
    showLoginIcon: true,
    showSenIcon: true,
  };

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.loadSettings();
    this.setupMessageListener();
  }

  private async loadSettings(): Promise<void> {
    // @ts-ignore: chrome.storage.sync.getの型定義が不完全なため
    const result = await chrome.storage.sync.get(['showLoginIcon', 'showSenIcon']);
    this.settings = {
      showLoginIcon: result.showLoginIcon ?? true,
      showSenIcon: result.showSenIcon ?? true,
    };
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((_message, _sender, sendResponse) => {
      sendResponse(this.settings);
      return true;
    });
  }

  private async updateSettings(settings: { [key: string]: boolean }): Promise<void> {
    // @ts-ignore: chrome.storage.sync.setの型定義が不完全なため
    await chrome.storage.sync.set(settings);
    this.settings = { ...this.settings, ...settings };
  }

  private async handleSettingsUpdate(key: string, value: boolean): Promise<void> {
    // @ts-ignore: chrome.storage.sync.setの型定義が不完全なため
    await this.updateSettings({ [key]: value });
  }
}

new BackgroundScript();
