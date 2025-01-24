import '../types/chrome';

interface CommandSuggestion {
  command: string;
  description: string;
}

interface UserProfile {
  displayName: string;
  statusMessage: string;
  pictureStatus: string;
}

export class ChatCommandManager {
  private static readonly CHAT_INPUT_SELECTOR = 'textarea-ex';
  private commands: CommandSuggestion[] = [
    { command: '/test', description: 'プロフィール情報を送信' },
    { command: '/help', description: 'コマンド一覧を表示' },
    { command: '/clear', description: '入力欄をクリア' },
    { command: '/time', description: '現在時刻を送信' },
    { command: '/me', description: '自分のアクションを表示' },
    { command: '/shrug', description: '¯\\_(ツ)_/¯ を送信' },
    { command: '/tableflip', description: '(╯°□°）╯︵ ┻━┻ を送信' },
    { command: '/unflip', description: '┬─┬ ノ( ゜-゜ノ) を送信' },
  ];

  constructor() {
    this.setupInputObserver();
  }

  private async getProfile(): Promise<UserProfile | null> {
    try {
      const response = await fetch(
        'https://line-web.ame-x.net/_proxy/CHROME_GW/api/talk/thrift/Talk/TalkService/getProfile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-Token': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
          },
          credentials: 'include',
          body: '[1]',
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data) {
        throw new Error('Profile data not found');
      }

      return {
        displayName: data.data.displayName,
        statusMessage: data.data.statusMessage,
        pictureStatus: data.data.pictureStatus,
      };
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  }

  private createCommandButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'actionGroup-module__button_action__VwNgx';
    button.setAttribute('aria-label', 'Chat commands');
    button.setAttribute('data-type', 'commands');
    button.setAttribute('data-tooltip', 'チャットコマンド');
    button.setAttribute('data-tooltip-placement', 'top-start');

    const icon = document.createElement('i');
    icon.className = 'icon';
    icon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3h18v18H3V3zm16.5 1.5h-15v15h15v-15z" fill="#303030"/>
        <path d="M7 8.25h2.25v1.5H7v-1.5zm0 3h2.25v1.5H7v-1.5zm0 3h2.25v1.5H7v-1.5zm3.75-6h6v1.5h-6v-1.5zm0 3h6v1.5h-6v-1.5zm0 3h6v1.5h-6v-1.5z" fill="#303030"/>
      </svg>
    `;

    button.appendChild(icon);
    return button;
  }

  private createCommandList(input: HTMLElement & { textContent: string }): HTMLElement {
    const list = document.createElement('div');
    list.className = 'popover-module__popover__3jS3t popover-module__popover_menu__2Uy3N';
    list.style.cssText = `
      min-width: 240px;
      max-width: 320px;
      position: absolute;
      bottom: calc(100% + 8px);
      left: 8px;
      z-index: 1000;
    `;

    const menu = document.createElement('div');
    menu.className = 'menu-module__menu__2Zg5q';
    menu.style.maxHeight = '400px';
    menu.style.overflowY = 'auto';

    this.commands.forEach((cmd) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'menu-module__menu_item__3yQYK';
      item.onclick = () => {
        input.textContent = cmd.command;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
        list.style.display = 'none';
      };

      const content = document.createElement('div');
      content.className = 'menu-module__menu_item_content__1k6Fa';
      content.style.display = 'flex';
      content.style.justifyContent = 'space-between';
      content.style.width = '100%';

      const command = document.createElement('span');
      command.textContent = cmd.command;
      command.style.fontWeight = 'bold';

      const description = document.createElement('span');
      description.textContent = cmd.description;
      description.style.color = 'var(--sen-text-secondary, #666)';

      content.appendChild(command);
      content.appendChild(description);
      item.appendChild(content);
      menu.appendChild(item);
    });

    list.appendChild(menu);
    return list;
  }

  private async handleCommand(input: HTMLElement & { textContent: string }): Promise<void> {
    const command = input.textContent.trim();
    const commandParts = command.split(' ');
    const baseCommand = commandParts[0].toLowerCase();
    const args = commandParts.slice(1).join(' ');

    switch (baseCommand) {
      case '/test': {
        const profile = await this.getProfile();
        if (profile) {
          const message = `プロフィール情報:
名前: ${profile.displayName}
ステータスメッセージ: ${profile.statusMessage}
画像URL: https://profile.line-scdn.net/${profile.pictureStatus}/preview`;
          input.textContent = message;
        }
        break;
      }

      case '/help': {
        const message = `利用可能なコマンド:
${this.commands.map((cmd) => `${cmd.command} - ${cmd.description}`).join('\n')}

コマンドの使い方:
1. / を入力するとコマンド一覧が表示されます
2. タブキーで補完できます
3. コマンドをクリックして選択できます`;
        input.textContent = message;
        break;
      }

      case '/clear': {
        input.textContent = '';
        return; // メッセージを送信しない
      }

      case '/time': {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          weekday: 'long',
        });
        input.textContent = `現在時刻: ${formatter.format(now)}`;
        break;
      }

      case '/me': {
        if (!args) {
          input.textContent = '使用方法: /me [アクション] (例: /me がコーヒーを飲む)';
          break;
        }
        input.textContent = `*${args}*`;
        break;
      }

      case '/shrug': {
        input.textContent = '¯\\_(ツ)_/¯';
        break;
      }

      case '/tableflip': {
        input.textContent = '(╯°□°）╯︵ ┻━┻';
        break;
      }

      case '/unflip': {
        input.textContent = '┬─┬ ノ( ゜-゜ノ)';
        break;
      }

      default:
        if (command.startsWith('/')) {
          input.textContent = `未知のコマンドです: ${command}
/help でコマンド一覧を表示できます。`;
          break;
        } else {
          return; // コマンドでない場合は何もしない
        }
    }

    // コマンドが実行された場合（/clear, /sticker, /file, /capture以外）、メッセージを送信
    if (!['/clear', '/sticker', '/file', '/capture'].includes(baseCommand)) {
      // 入力イベントを発火させて、送信ボタンを有効化
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Enterキーイベントを発火させてメッセージを送信
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(enterEvent);
    }
  }

  private setupInputObserver(): void {
    const observer = new MutationObserver(() => {
      const editorArea = document.querySelector('.chatroomEditor-module__editor_area__1UsgR') as HTMLElement;
      if (!editorArea) return;

      const input = editorArea.querySelector(ChatCommandManager.CHAT_INPUT_SELECTOR) as HTMLElement & {
        dataset: DOMStringMap;
        textContent: string;
      };
      if (!input) return;

      // 既に初期化済みの場合は何もしない
      if (input.dataset.senCommandsInitialized) return;

      // 初期化フラグを設定
      input.dataset.senCommandsInitialized = 'true';

      // コマンドリストを作成
      const commandList = this.createCommandList(input);
      commandList.style.display = 'none';
      editorArea.style.position = 'relative';
      editorArea.appendChild(commandList);

      // キーダウンイベントをhook
      const handleKeyDown = async (e: KeyboardEvent) => {
        const text = input.textContent || '';

        // /キーでコマンドリストを表示
        if (e.key === '/' && text === '') {
          e.preventDefault();
          input.textContent = '/';

          // カーソルを末尾に移動
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(input);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);

          // 入力イベントを発火
          const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: '/',
          });
          input.dispatchEvent(inputEvent);
          return;
        }

        // Tabキーでコマンド補完
        if (e.key === 'Tab' && text.startsWith('/')) {
          e.preventDefault();
          const inputParts = text.split(' ');
          const inputCommand = inputParts[0].toLowerCase();
          const matchedCommand = this.commands.find((cmd) => cmd.command.toLowerCase().startsWith(inputCommand));
          if (matchedCommand) {
            // 引数がある場合は保持
            if (inputParts.length > 1) {
              input.textContent = `${matchedCommand.command} ${inputParts.slice(1).join(' ')}`;
            } else {
              input.textContent = matchedCommand.command;
            }

            // カーソルを末尾に移動
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(input);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);

            // 入力イベントを発火
            const inputEvent = new InputEvent('input', {
              bubbles: true,
              cancelable: true,
              inputType: 'insertText',
              data: input.textContent,
            });
            input.dispatchEvent(inputEvent);
          }
          return;
        }

        // Enterキーでコマンド実行
        if (e.key === 'Enter' && !e.shiftKey && text.startsWith('/')) {
          e.preventDefault();
          commandList.style.display = 'none';
          await this.handleCommand(input);
        }
      };

      // 入力イベントをhook
      const handleInput = () => {
        const text = input.textContent || '';
        if (text.startsWith('/')) {
          // 入力されたコマンドに一致するものをフィルタリング
          const inputParts = text.split(' ');
          const inputCommand = inputParts[0].toLowerCase();
          const filteredCommands = this.commands.filter((cmd) => cmd.command.toLowerCase().startsWith(inputCommand));

          // フィルタリングされたコマンドを表示
          if (filteredCommands.length > 0) {
            const menu = commandList.querySelector('.menu-module__menu__2Zg5q');
            if (menu) {
              menu.innerHTML = '';
              filteredCommands.forEach((cmd) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'menu-module__menu_item__3yQYK';
                item.onclick = () => {
                  // 引数がある場合は保持
                  if (inputParts.length > 1) {
                    input.textContent = `${cmd.command} ${inputParts.slice(1).join(' ')}`;
                  } else {
                    input.textContent = cmd.command;
                  }

                  // カーソルを末尾に移動
                  const range = document.createRange();
                  const sel = window.getSelection();
                  range.selectNodeContents(input);
                  range.collapse(false);
                  sel?.removeAllRanges();
                  sel?.addRange(range);

                  // 入力イベントを発火
                  const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: input.textContent,
                  });
                  input.dispatchEvent(inputEvent);
                  input.focus();
                  commandList.style.display = 'none';
                };

                const content = document.createElement('div');
                content.className = 'menu-module__menu_item_content__1k6Fa';
                content.style.display = 'flex';
                content.style.justifyContent = 'space-between';
                content.style.width = '100%';

                const command = document.createElement('span');
                command.textContent = cmd.command;
                command.style.fontWeight = 'bold';

                const description = document.createElement('span');
                description.textContent = cmd.description;
                description.style.color = 'var(--sen-text-secondary, #666)';

                content.appendChild(command);
                content.appendChild(description);
                item.appendChild(content);
                menu.appendChild(item);
              });
            }
            commandList.style.display = 'block';
          } else {
            commandList.style.display = 'none';
          }
        } else {
          commandList.style.display = 'none';
        }
      };

      input.addEventListener('keydown', handleKeyDown);
      input.addEventListener('input', handleInput);

      // クリックイベントでポップオーバーを閉じる
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (
          !target.closest('.popover-module__popover__3jS3t') &&
          !target.closest(ChatCommandManager.CHAT_INPUT_SELECTOR)
        ) {
          commandList.style.display = 'none';
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}
