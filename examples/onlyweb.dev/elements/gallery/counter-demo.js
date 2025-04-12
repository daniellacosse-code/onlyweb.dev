$Frontend.Element.Register("counter-demo", {
  host: {
    handleMount() {
      this.state ??= {};

      this.addEventListener("click", ({ target }) => {
        const targetID = target.getAttribute("id");
        const currentState = this.state[targetID] || 0;

        this.state[targetID] = currentState + 1;

        for (const [key, value] of Object.entries(this.state)) {
          const target = this.querySelector(`#${key}`);

          if (target) target.textContent = value;
        }
      });
    }
  }
});
