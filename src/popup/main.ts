// ポップアップのメインスクリプト

interface Settings {
  showLoginIcon: boolean;
  showSenIcon: boolean;
}

class SenPopup {
  private settings: Settings = {
    showLoginIcon: true,
    showSenIcon: true,
  };

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.loadSettings();
    this.setupEventListeners();
  }

  private async loadSettings(): Promise<void> {
    // 保存された設定を読み込む
    const response = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
    if (response) {
      this.settings = response;
      this.updateUI();
    }
  }

  private updateUI(): void {
    // チェックボックスの状態を更新
    const loginIconCheckbox = document.getElementById('showLoginIcon') as HTMLInputElement;
    const senIconCheckbox = document.getElementById('showSenIcon') as HTMLInputElement;

    if (loginIconCheckbox && senIconCheckbox) {
      loginIconCheckbox.checked = this.settings.showLoginIcon;
      senIconCheckbox.checked = this.settings.showSenIcon;
    }
  }

  private setupEventListeners(): void {
    // 保存ボタンのイベントリスナー
    const saveButton = document.getElementById('saveSettings');
    if (saveButton) {
      saveButton.addEventListener('click', () => this.saveSettings());
    }

    // チェックボックスの変更イベントリスナー
    const loginIconCheckbox = document.getElementById('showLoginIcon') as HTMLInputElement;
    const senIconCheckbox = document.getElementById('showSenIcon') as HTMLInputElement;

    if (loginIconCheckbox && senIconCheckbox) {
      loginIconCheckbox.addEventListener('change', (e) => {
        this.settings.showLoginIcon = (e.target as HTMLInputElement).checked;
      });

      senIconCheckbox.addEventListener('change', (e) => {
        this.settings.showSenIcon = (e.target as HTMLInputElement).checked;
      });
    }
  }

  private async saveSettings(): Promise<void> {
    // 設定を保存
    await chrome.runtime.sendMessage({
      type: 'SAVE_SETTINGS',
      data: this.settings,
    });
  }
}

// ポップアップの初期化
new SenPopup();
