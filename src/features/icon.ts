import { Settings } from '../types/settings';
import { SettingsManager } from './settings';

export class IconManager {
  private static readonly TITLE_SELECTOR = '.loginPage-module__title__zFCNd';
  private static readonly LOGO_SELECTOR = '.icon.loginPage-module__icon_logo__8V9rM';
  private settingsManager: SettingsManager;

  constructor(settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
  }

  private createSettingsPanel(): HTMLElement {
    const settings = document.createElement('div');
    settings.className = 'sen-settings';
    const currentSettings = this.settingsManager.getSettings();

    settings.innerHTML = `
      <div class="sen-settings-item">
        <input type="checkbox" id="showLoginIcon" ${currentSettings.showLoginIcon ? 'checked' : ''}>
        <label for="showLoginIcon">ログインアイコンを表示</label>
      </div>
      <div class="sen-settings-item">
        <input type="checkbox" id="showSenIcon" ${currentSettings.showSenIcon ? 'checked' : ''}>
        <label for="showSenIcon">Senアイコンを表示</label>
      </div>
    `;

    settings.querySelector('#showLoginIcon')?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      await this.settingsManager.updateSetting('showLoginIcon', target.checked);
      this.updateIconVisibility();
    });

    settings.querySelector('#showSenIcon')?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      await this.settingsManager.updateSetting('showSenIcon', target.checked);
      this.updateIconVisibility();
    });

    return settings;
  }

  injectIcons(): void {
    const titleElement = document.querySelector(IconManager.TITLE_SELECTOR);
    if (!titleElement) return;

    const logoElement = titleElement.querySelector(IconManager.LOGO_SELECTOR);
    if (!logoElement) return;

    const container = document.createElement('i');
    container.className = 'icon sen-icon-container show';
    container.innerHTML = `
      <img class="sen-icon" src="${chrome.runtime.getURL('icons/logo.svg')}" alt="Sen">
    `;

    const settingsPanel = this.createSettingsPanel();
    container.appendChild(settingsPanel);

    container.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsPanel.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      settingsPanel.classList.remove('show');
    });

    logoElement.parentElement?.replaceChild(container, logoElement);
  }

  updateIconVisibility(): void {
    const container = document.querySelector('.sen-icon-container');
    if (!container) return;

    const settings = this.settingsManager.getSettings();
    container.classList.toggle('show', settings.showLoginIcon || settings.showSenIcon);
  }

  setupObserver(): void {
    const observer = new MutationObserver(() => {
      const titleElement = document.querySelector(IconManager.TITLE_SELECTOR);
      if (titleElement) {
        const logoElement = titleElement.querySelector(IconManager.LOGO_SELECTOR);
        const senContainer = titleElement.querySelector('.sen-icon-container');

        if (logoElement && !senContainer) {
          this.injectIcons();
          this.updateIconVisibility();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    this.injectIcons();
    this.updateIconVisibility();
  }
}
