import '../types/chrome';
import { SettingsManager } from '../features/settings';
import { PincodeManager } from '../features/pincode';
import { IconManager } from '../features/icon';
import { SettingsUI } from '../features/settings-ui';

class SenContentScript {
  private settingsManager: SettingsManager;
  private pincodeManager: PincodeManager;
  private iconManager: IconManager;
  private settingsUI: SettingsUI;

  constructor() {
    this.settingsManager = new SettingsManager();
    this.pincodeManager = new PincodeManager();
    this.iconManager = new IconManager(this.settingsManager);
    this.settingsUI = new SettingsUI(this.settingsManager);
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.settingsManager.loadSettings();
    this.pincodeManager.setupObserver();
    this.iconManager.setupObserver();
    this.settingsUI.setupObserver();
  }
}

// コンテンツスクリプトの初期化
new SenContentScript();
