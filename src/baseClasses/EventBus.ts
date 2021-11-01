// eslint-disable-next-line no-unused-vars
type CallBackFunction = (...args: any[]) => {};

export default class EventBus {
  listeners: Record<string, CallBackFunction[]>
  static instance: any;

  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: CallBackFunction) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: CallBackFunction) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event]
        .filter((listener: CallBackFunction) => callback !== listener);
    }
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) {
      throw new Error(`No such event exists ${event}`);
    }
    this.listeners[event].forEach((listener) => {
      listener(args);
    });
  }
}