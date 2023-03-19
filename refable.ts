export type Class<T> = new (...args: any[]) => T;

export class Application {
  #ctors = new Map<string, Class<Controller>>();
  #controllers = new WeakMap<Element, Controller>();
  #targets = new Map<Element, Controller>();
  #actions = new Map<Element, Action[]>();
  #observer: MutationObserver;

  constructor() {
    this.#observer = new MutationObserver((mutations) =>
      this.#mutated(mutations)
    );
  }

  #mutated(mutations: MutationRecord[]) {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => this.#removeNode(node));
      mutation.addedNodes.forEach((node) => this.#addNode(node));
    });
  }

  #addNode(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      if (el.hasAttribute("data-controller")) {
        this.#addController(el);
      }

      el.querySelectorAll("[data-controller]").forEach((el) =>
        this.#addController(el)
      );

      if (el.hasAttribute("data-target")) {
        this.#addTarget(el);
      }

      el.querySelectorAll("[data-target]").forEach((el) => this.#addTarget(el));

      if (el.hasAttribute("data-action")) {
        this.#addAction(el);
      }

      el.querySelectorAll("[data-action]").forEach((el) => this.#addAction(el));
    }
  }

  #removeNode(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      el.querySelectorAll("[data-action]").forEach((el) =>
        this.#removeAction(el)
      );

      if (el.hasAttribute("data-action")) {
        this.#removeAction(el);
      }

      el.querySelectorAll("[data-target]").forEach((el) =>
        this.#removeTarget(el)
      );

      if (el.hasAttribute("data-target")) {
        this.#removeTarget(el);
      }

      el.querySelectorAll("[data-controller]").forEach((el) =>
        this.#removeController(el)
      );

      if (el.hasAttribute("data-controller")) {
        this.#removeController(el);
      }
    }
  }

  #addController(el: Element) {
    const closest = el.parentElement.closest("[data-controller]");

    let parent: Controller = null;

    if (closest) {
      parent = this.#controllers.get(closest);
    }

    const id = el.getAttribute("data-controller");

    let controller = this.#controllers.get(el);

    if (!controller) {
      const ctor = this.#ctors.get(id);
      controller = new ctor(el, this);
      controller.parent = parent;

      this.#controllers.set(el, controller);

      queueMicrotask(() => controller.created());
    } else {
      controller.parent = parent;
    }

    if ("dataset" in el) {
      for (const key in el.dataset as DOMStringMap) {
        if (key.endsWith("Value")) {
          const changed = `${key}Changed`;

          Object.defineProperty(controller, key, {
            get: () => el.dataset[key],
            set: (value) => {
              el.dataset[key] = value;

              queueMicrotask(() => {
                if (controller[changed]) {
                  controller[changed](value);
                }
              });
            },
          });

          queueMicrotask(() => {
            if (controller[changed]) {
              controller[changed](el.dataset[key]);
            }
          });
        }
      }
    }

    if (parent) {
      const targets = `${id}Controllers`;

      if (parent[targets]) {
        (parent[targets] as Controller[]).push(controller);
      } else {
        parent[targets] = [controller];

        Object.defineProperty(parent, `${id}Controller`, {
          get: () => parent[targets][0],
        });
      }

      const connected = `${id}ControllerConnected`;

      queueMicrotask(() => {
        if (parent[connected]) {
          parent[connected](controller);
        }
      });
    }

    queueMicrotask(() => controller.connected());
  }

  #removeController(el: Element) {
    const controller = this.#controllers.get(el);
    const id = el.getAttribute("data-controller");
    const parent = controller.parent;

    if (parent) {
      const arr = parent[`${id}Controllers`] as Controller[];

      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === controller) {
          arr.splice(i, 1);
          break;
        }
      }

      const disconnected = `${id}ControllerDisconnected`;

      queueMicrotask(() => {
        if (parent[disconnected]) {
          parent[disconnected](controller);
        }
      });
    }

    queueMicrotask(() => controller.disconnected());
  }

  #addTarget(el: Element) {
    const id = el.getAttribute("data-target");
    const closest = el.closest("[data-controller]");
    const controller = this.#controllers.get(closest);

    this.#targets.set(el, controller);

    const targets = `${id}Targets`;

    if (controller[targets]) {
      (controller[targets] as Element[]).push(el);
    } else {
      controller[targets] = [el];

      Object.defineProperty(controller, `${id}Target`, {
        get: () => controller[targets][0],
      });
    }

    const connected = `${id}TargetConnected`;

    queueMicrotask(() => {
      if (controller[connected]) {
        controller[connected](el);
      }
    });
  }

  #removeTarget(el: Element) {
    const id = el.getAttribute("data-target");
    const controller = this.#targets.get(el);
    const targets = `${id}Targets`;

    const arr = controller[targets] as Element[];

    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === el) {
        arr.splice(i, 1);
        break;
      }
    }

    this.#targets.delete(el);

    const disconnected = `${id}TargetDisconnected`;

    queueMicrotask(() => {
      if (controller[disconnected]) {
        controller[disconnected](el);
      }
    });
  }

  #addAction(el: Element) {
    const id = el.getAttribute("data-action");
    const closest = el.closest("[data-controller]");
    const parent = this.#controllers.get(closest);

    const targets = id.split(" ");

    targets.forEach((target) => {
      const [event, listener] = target.split("->");

      const params = listener.split(":");
      const options = {};

      if (params.length > 1) {
        for (let i = 1; i < params.length; i++) {
          options[params[i]] = true;
        }
      }

      const action: Action = {
        event,
        options,
        listener: (event) => {
          if ("stop" in options) {
            event.stopPropagation();
          }

          if ("prevent" in options) {
            event.preventDefault();
          }

          parent[params[0]](event);
        },
      };

      el.addEventListener(action.event, action.listener, action.options);

      const actions = this.#actions.get(el);

      if (actions) {
        actions.push(action);
      } else {
        this.#actions.set(el, [action]);
      }
    });
  }

  #removeAction(el: Element) {
    const actions = this.#actions.get(el);

    actions.forEach((action) =>
      el.removeEventListener(action.event, action.listener, action.options)
    );

    this.#actions.delete(el);
  }

  register(id: string, ctor: Class<Controller>) {
    this.#ctors.set(id, ctor);
  }

  ready(resolve: Function) {
    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", () => resolve());
    } else {
      resolve();
    }
  }

  run() {
    this.ready(() => {
      document
        .querySelectorAll("[data-controller]")
        .forEach((el) => this.#addController(el));

      document
        .querySelectorAll("[data-target]")
        .forEach((el) => this.#addTarget(el));

      document
        .querySelectorAll("[data-action]")
        .forEach((el) => this.#addAction(el));

      this.#observer.observe(document, {
        childList: true,
        subtree: true,
      });
    });
  }
}

export class Controller<T extends Element = Element> {
  #element: T;
  #parent: Controller;
  #application: Application;

  constructor(element: T, application: Application) {
    this.#element = element;
    this.#application = application;
  }

  get element() {
    return this.#element;
  }

  get application() {
    return this.#application;
  }

  get parent() {
    return this.#parent;
  }

  set parent(parent: Controller) {
    this.#parent = parent;
  }

  nextTick(callback: () => void): void {
    queueMicrotask(callback);
  }

  dispatch(type: string, detail = {}) {
    const event = new CustomEvent(type, {
      detail,
      bubbles: true,
      cancelable: true,
    });

    this.#element.dispatchEvent(event);

    return event;
  }

  created() {}
  connected() {}
  disconnected() {}
}

interface Action {
  event: string;
  listener: EventListener;
  options: AddEventListenerOptions;
}
