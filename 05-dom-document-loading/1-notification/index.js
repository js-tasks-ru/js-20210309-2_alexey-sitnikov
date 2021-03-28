export default class NotificationMessage {
  static currentNotification;

  constructor(message, {duration = 2000, type = "success"} = {}) {
    if (NotificationMessage.currentNotification) {
      NotificationMessage.currentNotification.remove();
    }

    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  buildElement(tag, className, text) {
    const element = document.createElement(tag);

    element.className = className;

    element.append(text);

    return element;
  }

  get timer() {
    return this.buildElement("div", ["timer"], "");
  }

  get header() {
    return this.buildElement("div", ["notification-header"], this.type);
  }

  get body() {
    return this.buildElement("div", ["notification-body"], this.message);
  }

  get notificationContent() {
    const element = document.createElement("div");

    element.className = "inner-wrapper";
    element.append(this.header, this.body);

    return element;
  }

  render() {
    const element = document.createElement("div");

    element.classList.add("notification", this.type);
    element.setAttribute("style", `--value: ${this.duration}ms`);

    element.append(this.timer, this.notificationContent);

    this.element = element;
    NotificationMessage.currentNotification = this.element;
  }

  show(parent) {
    const root = parent || document.body;

    root.append(this.element);

    setTimeout(() => this.remove(), this.duration);

    return this.element;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    NotificationMessage.currentNotification = null;
  }
}
