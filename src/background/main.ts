import '../types/chrome';

// 拡張機能のバックグラウンドスクリプト

class SenBackgroundScript {
  constructor() {
    this.initialize();
  }

  private initialize(): void {
    console.log('Sen background script initialized');
    this.setupMessageListeners();
  }

  private setupMessageListeners(): void {
    // コンテンツスクリプトからのメッセージを処理
    // @ts-ignore
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Received message:', message);

      // メッセージの種類に応じて処理を実行
      switch (message.type) {
        case 'SAVE_SETTINGS':
          this.saveSettings(message.data);
          break;
        case 'GET_SETTINGS':
          this.getSettings().then(sendResponse);
          return true; // 非同期レスポンスのために必要
      }
    });
  }

  private async saveSettings(settings: any): Promise<void> {
    // @ts-ignore
    await chrome.storage.sync.set({ settings });
  }

  private async getSettings(): Promise<any> {
    // @ts-ignore
    const data = await chrome.storage.sync.get('settings');
    return data.settings;
  }
}

// バックグラウンドスクリプトの初期化
new SenBackgroundScript();
