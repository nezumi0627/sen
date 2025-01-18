import { SettingsManager } from './settings';

export class SettingsUI {
  private static readonly MENU_LIST_SELECTOR = '.settingPopup-module__menu_list__nRUGt';
  private settingsManager: SettingsManager;

  constructor(settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
  }

  private createSenMenuItem(): HTMLLIElement {
    const menuItem = document.createElement('li');
    menuItem.className = 'settingPopup-module__menu_list_item__i-60E';
    menuItem.innerHTML = `
      <button type="button" class="settingPopup-module__button_menu__8XxD0" data-key="sen" aria-current="false">
        Sen設定
      </button>
    `;
    return menuItem;
  }

  private createSenSettingsContent(): HTMLDivElement {
    const content = document.createElement('div');
    const settings = this.settingsManager.getSettings();

    content.innerHTML = `
      <div class="settingGroup-module__setting_group__zDeQH">
        <div class="settingGroup-module__title_box__fyl29">
          <strong class="settingGroup-module__title__Zf02i">アイコン設定</strong>
        </div>
        <div class="settingGroup-module__contents__DreL9">
          <div class="settingItem-module__setting_item__1-HtF" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
            <span class="settingItem-module__text__2t_GI">ログインアイコンを表示</span>
            <label class="sen-toggle">
              <input type="checkbox" id="showLoginIcon" ${settings.showLoginIcon ? 'checked' : ''}>
              <span class="sen-toggle-slider"></span>
            </label>
          </div>
          <div class="settingItem-module__setting_item__1-HtF" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
            <span class="settingItem-module__text__2t_GI">Senアイコンを表示</span>
            <label class="sen-toggle">
              <input type="checkbox" id="showSenIcon" ${settings.showSenIcon ? 'checked' : ''}>
              <span class="sen-toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    `;

    // イベントリスナーの設定
    content.querySelector('#showLoginIcon')?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      await this.settingsManager.updateSetting('showLoginIcon', target.checked);
    });

    content.querySelector('#showSenIcon')?.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      await this.settingsManager.updateSetting('showSenIcon', target.checked);
    });

    return content;
  }

  private setupTabSwitching(menuItem: HTMLLIElement, content: HTMLDivElement): void {
    const allMenuButtons = document.querySelectorAll('.settingPopup-module__button_menu__8XxD0');
    const contentsArea = document.querySelector('.settingPopup-module__contents__rgdP5');

    menuItem.querySelector('button')?.addEventListener('click', () => {
      // 他のタブのaria-currentをfalseに
      allMenuButtons.forEach((button) => button.setAttribute('aria-current', 'false'));
      menuItem.querySelector('button')?.setAttribute('aria-current', 'true');

      // コンテンツを切り替え
      if (contentsArea) {
        contentsArea.innerHTML = '';
        contentsArea.appendChild(content);
      }
    });
  }

  injectSettingsUI(): void {
    const menuList = document.querySelector(SettingsUI.MENU_LIST_SELECTOR);
    if (!menuList) return;

    const menuItem = this.createSenMenuItem();
    const content = this.createSenSettingsContent();

    menuList.appendChild(menuItem);
    this.setupTabSwitching(menuItem, content);
  }

  setupObserver(): void {
    const observer = new MutationObserver(() => {
      const menuList = document.querySelector(SettingsUI.MENU_LIST_SELECTOR);
      const senMenuItem = menuList?.querySelector('[data-key="sen"]');

      if (menuList && !senMenuItem) {
        this.injectSettingsUI();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}
