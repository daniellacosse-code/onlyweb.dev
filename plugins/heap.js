export default class Heap {
  constructor(items = [], comparator = (a, b) => a > b) {
    this.comparator = comparator;
    this.items = [];
    for (const item of items) {
      this.push(item);
    }
  }

  push(value) {
    this.items.push(value);

    if (this.items.length < 2) {
      return;
    }

    let currentIndex = this.items.length - 1;
    let parentIndex = this.__parentIndex(currentIndex);
    while (this.comparator(this.items[parentIndex], value)) {
      this.__swap(parentIndex, currentIndex);

      currentIndex = parentIndex;
      parentIndex = this.__parentIndex(currentIndex);
    }
  }

  peek() {
    return this.items[0];
  }

  remove(value) {
    let valueIndex = this.items.indexOf(value);

    if (valueIndex === this.items.length - 1) {
      this.items.pop();
      return;
    }

    this.items[valueIndex] = this.items.pop();
    let bestChildIndex = this.__bestChildIndex(valueIndex);
    while (
      this.comparator(this.items[valueIndex], this.items[bestChildIndex])
    ) {
      this.__swap(valueIndex, bestChildIndex);

      valueIndex = bestChildIndex;
      bestChildIndex = this.__bestChildIndex(valueIndex);
    }
  }

  __parentIndex(index) {
    return index - ((index >> 1) << 1) ? (index - 1) >> 1 : (index - 2) >> 1;
  }

  __bestChildIndex(index) {
    return this.comparator(
      this.items[(index << 1) + 2],
      this.items[(index << 1) + 1]
    )
      ? (index << 1) + 1
      : (index << 1) + 2;
  }

  __swap(index1, index2, arr = this.items) {
    const tmp = arr[index2];

    arr[index2] = arr[index1];
    arr[index1] = tmp;

    return arr;
  }
}

export class MinHeap extends Heap {
  constructor(items = []) {
    super(items);
  }
}

export class MaxHeap extends Heap {
  constructor(items = []) {
    super(items, (a, b) => a < b);
  }
}
