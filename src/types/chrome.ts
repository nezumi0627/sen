declare global {
  const chrome: {
    runtime: {
      getURL: (path: string) => string;
      sendMessage: (message: any) => Promise<any>;
      onMessage: {
        addListener: (
          callback: (
            message: any,
            sender: any,
            sendResponse: (response?: any) => void,
          ) => void | boolean,
        ) => void;
      };
    };
    storage: {
      sync: {
        get: (keys: string | string[] | object) => Promise<{ [key: string]: any }>;
        set: (items: object) => Promise<void>;
      };
    };
  };
}

export {};
