import { SettingsManager } from './settings';

export class IconManager {
  private static readonly TITLE_SELECTOR = '.loginForm-module__title__3Kcwm';
  private static readonly LOGO_SELECTOR = '.loginForm-module__logo__2QqoA';
  private settingsManager: SettingsManager;

  constructor(settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
  }

  private createSettingsPanel(): HTMLDivElement {
    const panel = document.createElement('div');
    panel.className = 'sen-settings';
    panel.innerHTML = <>
      <div class="sen-settings-item">
        <input type="checkbox" id="showLoginIcon" checked>
        <label for="showLoginIcon">ログインアイコンを表示</label>
      </div>
      <div class="sen-settings-item">
        <input type="checkbox" id="showSenIcon" checked>
        <label for="showSenIcon">Senアイコンを表示</label>
      </div>
    </>;

    // イベントリスナーの設定
    panel.querySelector('#showLoginIcon')?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      await this.settingsManager.updateSetting('showLoginIcon', target.checked);
    });

    panel.querySelector('#showSenIcon')?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      await this.settingsManager.updateSetting('showSenIcon', target.checked);
    });

    return panel;
  }

  injectIcons(): void {
    const titleElement = document.querySelector(IconManager.TITLE_SELECTOR);
    const logoElement = document.querySelector(IconManager.LOGO_SELECTOR);

    if (titleElement && !titleElement.querySelector('.sen-icon-container')) {
      const iconContainer = document.createElement('div');
      iconContainer.className = 'sen-icon-container';
      iconContainer.innerHTML = <img src={chrome.runtime.getURL('icons/logo.svg')} alt="Sen" class="sen-icon" />;

      const wrapper = document.createElement('div');
      wrapper.className = 'sen-icon-wrapper';
      wrapper.appendChild(iconContainer);

      // 設定パネルの追加
      const settingsPanel = this.createSettingsPanel();
      wrapper.appendChild(settingsPanel);

      // アイコンクリック時の設定パネル表示切り替え
      iconContainer.addEventListener('click', () => {
        settingsPanel.classList.toggle('show');
      });

      titleElement.appendChild(wrapper);
    }

    if (logoElement && !logoElement.querySelector('.sen-icon-container')) {
      const iconContainer = document.createElement('div');
      iconContainer.className = 'sen-icon-container';
      iconContainer.innerHTML = <img src={chrome.runtime.getURL('icons/logo.svg')} alt="Sen" class="sen-icon" />;

      const wrapper = document.createElement('div');
      wrapper.className = 'sen-icon-wrapper';
      wrapper.appendChild(iconContainer);

      logoElement.appendChild(wrapper);
    }
  }

  updateIconVisibility(): void {
    const settings = this.settingsManager.getSettings();
    const iconContainers = document.querySelectorAll('.sen-icon-container');

    iconContainers.forEach((container, index) => {
      if (index === 0 && !settings.showLoginIcon) {
        container.classList.remove('show');
      } else if (index === 1 && !settings.showSenIcon) {
        container.classList.remove('show');
      } else {
        container.classList.add('show');
      }
    });
  }

  setupObserver(): void {
    const observer = new MutationObserver(() => {
      const titleElement = document.querySelector(IconManager.TITLE_SELECTOR);
      const logoElement = document.querySelector(IconManager.LOGO_SELECTOR);

      if (
        (titleElement && !titleElement.querySelector('.sen-icon-container')) ||
        (logoElement && !logoElement.querySelector('.sen-icon-container'))
      ) {
        this.injectIcons();
        this.updateIconVisibility();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}
