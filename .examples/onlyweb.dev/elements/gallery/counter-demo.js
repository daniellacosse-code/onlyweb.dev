export class CounterDemo extends $Frontend.Element {
  attributes = {
    state: Object,
  };

  click({ attributes: { state }, event: { target } }) {
    const key = target.getAttribute("id");

    state[key] ??= 0;
    state[key]++;

    target.textContent = state[key];

    return { attributes: { ...state } };
  }
}
