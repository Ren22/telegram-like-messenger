import { v4 as makeUUID } from 'uuid';
import EventBus from './EventBus';

type allowedTags = 'div' | 'button';
export class Block {
  private _element: HTMLElement;
  private _meta: { props: any, tagName: allowedTags };
  props: any;
  eventBus: () => EventBus;
  static eventBus: () => EventBus;
  private _id: string;
  isFullPageHeight: boolean;
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_RENDER: 'flow:render',
    FLOW_CDU: 'flow:component-did-update',
  }

  constructor(tagName: allowedTags = 'div', props = {}, isFullPageHeight = false) {
    const eventBus = new EventBus();
    this._meta = {
      tagName,
      props,
    };
    this._id = makeUUID();
    this.props = this._makePropsProxy(props);
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    this.isFullPageHeight = isFullPageHeight;
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);
    element.setAttribute('data-id', this._id);
    // todo: refactor and remove this part, it's not correct to assign styles here
    if (this.isFullPageHeight) {
      element.style.height = '100%';
    }
    return element;
  }

  setProps = (nextProps: any) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  private _componentDidMount() {
    this.componentDidMount();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  componentDidMount() {}

  private _componentDidUpdate() {
    this.componentDidUpdate();
    this._render();
  }

  getElement() {
    return this._element;
  }

  componentDidUpdate() {}

  getId() {
    return this._id;
  }

  private _addEvents() {
    const { events = {} } = this.props;
    Object.keys(events).forEach((eventName) => {
      this._element.addEventListener(
        eventName,
        events[eventName],
      );
    });
  }

  private _render() {
    const block = this.render();
    this._element.innerHTML = '';
    //  todo this.removeListneres()
    this._element.appendChild(block);
    this._addEvents();
  }

  renderAsHTMLString() {
    // this method is needed when we work with html templates in handlebars partials
    return this._element.outerHTML;
  }

  render(): Node {
    return document.createElement('div');
  }

  private _makePropsProxy(props: any) {
    function errorWhenPrivateProp(prop: string | number | symbol) {
      if (typeof prop === 'string' && prop.indexOf('_') === 0) {
        throw new Error('Нет прав');
      }
    }

    return new Proxy(props, {
      get: (target, prop) => {
        errorWhenPrivateProp(prop);
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set: (target, prop, value) => {
        errorWhenPrivateProp(prop);
        target[prop] = value;
        this.eventBus().emit(Block.EVENTS.FLOW_CDU);
        return true;
      },
      deleteProperty: () => {
        throw new Error('Нет прав');
      },
    });
  }
}