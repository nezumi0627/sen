export class PincodeManager {
  private static readonly PINCODE_SELECTOR = '.pinCodeModal-module__pincode__bFKMn';

  addCopyButton(): void {
    const pincodeElement = document.querySelector(PincodeManager.PINCODE_SELECTOR);
    if (!pincodeElement || pincodeElement.querySelector('.sen-copy-button')) return;

    const pincode = pincodeElement.textContent?.trim() || '';
    const copyButton = document.createElement('button');
    copyButton.className = 'sen-copy-button';
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pincode);
        copyButton.classList.add('copied');
        setTimeout(() => copyButton.classList.remove('copied'), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });

    pincodeElement.appendChild(copyButton);
  }

  setupObserver(): void {
    const observer = new MutationObserver(() => {
      const pincodeElement = document.querySelector(PincodeManager.PINCODE_SELECTOR);
      if (pincodeElement) {
        this.addCopyButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
}
