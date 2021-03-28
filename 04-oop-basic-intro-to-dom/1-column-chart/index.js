export default class ColumnChart {
  constructor({data = [], label = '', link = '', value = 0} = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;

    this.chartHeight = 50;

    this.render();
  }

  get title() {
    const element = document.createElement("div");

    element.className = "column-chart__title";

    element.append(`Total ${this.label}`);

    if (this.link) {
      const linkElement = document.createElement("a");

      linkElement.href = this.link;
      linkElement.className = "column-chart__link";

      linkElement.append("View all");

      element.append(linkElement);
    }

    return element;
  }

  get header() {
    const element = document.createElement("div");

    element.className = "column-chart__header";
    element.setAttribute("data-element", "header");

    element.append(String(this.value));

    return element;
  }

  get body() {
    const element = document.createElement("div");

    element.className = "column-chart__chart";
    element.setAttribute("data-element", "body");

    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    element.append(...this.data.map(
      item => {
        const value = Math.floor(item * scale);
        const percent = (item / maxValue * 100).toFixed(0);

        const element = document.createElement("div");

        element.setAttribute("style", `--value: ${value}`);
        element.setAttribute("data-tooltip", `${percent}%`);

        return element;
      }
    ));

    return element;
  }

  get container() {
    const element = document.createElement("div");

    element.className = "column-chart__container";

    element.append(this.header, this.body);

    return element;
  }

  render() {
    const element = document.createElement("div");

    element.className = "column-chart";

    if (!this.data.length) {
      element.classList.add("column-chart_loading");
    }

    element.append(this.title, this.container);

    this.element = element;
  }

  update(data) {
    this.data = data;

    this.render();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
