import Heap from "./heap";

test.concurrent("heap smoke test", () => {
  const heap = new Heap();

  heap.push(3);
  heap.push(1);
  heap.push(2);

  expect(heap.peek()).toBe(1);
});
