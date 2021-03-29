export function sortByKeyFunction(arr, param = "asc", {checkLocales = false, keyFunction = item => item}) {
  const newArr = arr.slice();
  const sortOrder = (param === "desc" ? -1 : 1);

  if (checkLocales) {
    newArr.sort(
      (a, b) => sortOrder * keyFunction(a).localeCompare(
        keyFunction(b),
        ["ru", "en"],
        {
          caseFirst: "upper"
        }
      )
    );
  } else {
    newArr.sort(
      (a, b) => sortOrder * (keyFunction(a) - keyFunction(b))
    );
  }

  return newArr;
}

export default class SortableTable {
  subElements = {};

  constructor(header, {data = []}) {
    this.header = header;
    this.data = data;

    this.render();
  }

  get subElements() {
    return this.tableBody;
  }

  get tableHeader() {
    const element = document.createElement("div");

    element.classList.add("sortable-table__header", "sortable-table__row");
    element.setAttribute("data-element", "header");

    element.append(...this.header.map(item => {
      const element = document.createElement("div");
      const innerElement = document.createElement("span");
      innerElement.innerText = item.title;

      element.className = "sortable-table__cell";
      element.setAttribute("data-id", item.id);
      element.setAttribute("data-sortable", item.sortable);

      element.append(innerElement);

      return element;
    }));

    return element;
  }

  get tableBody() {
    const element = document.createElement("div");

    element.className = "sortable-table__body";
    element.setAttribute("data-element", "body");

    element.append(...this.data.map(dataItem => {
      const element = document.createElement("a");

      element.className = "sortable-table__row";

      element.href = `/products/${dataItem.id}`;

      element.append(...this.header.map(column => {
        const cellElement = document.createElement("div");

        if ("template" in column) {
          cellElement.innerHTML = column.template(dataItem.images);

          return cellElement.firstElementChild;

        } else {
          cellElement.className = "sortable-table__cell";
          cellElement.textContent = dataItem[column.id];

          return cellElement;
        }
      }));

      return element;
    }));

    return element;
  }

  render() {
    const element = document.createElement("div");

    element.className = "sortable-table";
    element.append(this.tableHeader, this.tableBody);

    this.element = element;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;

      return acc;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  sort(field, order) {
    let data;
    const column = this.header.find(obj => obj.id === field);
    const {sortType} = column;

    switch (sortType) {
    case "string":
      data = sortByKeyFunction(this.data, order, {checkLocales: true, keyFunction: item => item[field]});
      break;
    case "number":
      data = sortByKeyFunction(this.data, order, {checkLocales: false, keyFunction: item => item[field]});
      break;
    default:
      data = sortByKeyFunction(this.data, order);
    }

    this.data = data;

    this.render();
  }
}
