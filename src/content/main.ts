import '../types/chrome';

// LINEのウェブページに機能を追加するコンテンツスクリプト

interface Settings {
  showLoginIcon: boolean;
  showSenIcon: boolean;
}

class SenContentScript {
  private settings: Settings = {
    showLoginIcon: true,
    showSenIcon: true,
  };

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.loadSettings();
    this.injectStyles();
    this.setupMutationObserver();
  }

  private async loadSettings(): Promise<void> {
    const response = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
    if (response) {
      this.settings = response;
      this.updateIconVisibility();
    }
  }

  private injectStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .loginPage-module__title__zFCNd {
        position: relative;
        display: flex;
        align-items: center;
      }
      .sen-icon-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 180px;
        width: 180px;
        margin-right: 15px;
      }
      .sen-icon-container.show {
        display: inline-flex !important;
      }
      .sen-icon {
        width: 180px;
        height: 180px;
        display: block;
      }
      .loginPage-module__title__zFCNd .blind {
        margin-left: 10px;
      }
    `;
    document.head.appendChild(style);
  }

  private injectIcons(): void {
    const titleElement = document.querySelector('.loginPage-module__title__zFCNd');
    if (!titleElement) return;

    const logoElement = titleElement.querySelector('.icon.loginPage-module__icon_logo__8V9rM');
    if (!logoElement) return;

    const container = document.createElement('i');
    container.className = 'icon sen-icon-container show';
    container.innerHTML = `
      <img class="sen-icon" src="${chrome.runtime.getURL('icons/logo.svg')}" alt="Sen">
    `;

    logoElement.parentElement?.replaceChild(container, logoElement);
  }

  private updateIconVisibility(): void {
    const container = document.querySelector('.sen-icon-container');
    if (!container) return;

    const loginIcon = container.querySelector('.sen-icon-login') as HTMLElement;
    const qrIcon = container.querySelector('.sen-icon-qr') as HTMLElement;

    if (loginIcon) {
      loginIcon.style.display = this.settings.showLoginIcon ? 'block' : 'none';
    }
    if (qrIcon) {
      qrIcon.style.display = this.settings.showSenIcon ? 'block' : 'none';
    }

    container.classList.toggle('show', this.settings.showLoginIcon || this.settings.showSenIcon);
  }

  private setupMutationObserver(): void {
    const observer = new MutationObserver((mutations) => {
      const titleElement = document.querySelector('.loginPage-module__title__zFCNd');
      if (titleElement) {
        const logoElement = titleElement.querySelector('.icon.loginPage-module__icon_logo__8V9rM');
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

    // 初期ロード時にも確認
    this.injectIcons();
    this.updateIconVisibility();
  }
}

// コンテンツスクリプトの初期化
new SenContentScript();
