_vague hand-waving_ something like this:

```js
class ProcessData extends $Shared.Data {
  key = "process";
  id = Deno.processId() ?? null;
  reload() {
    Deno.killProcess(this.id);
    this.id = Deno.startProcess();
  }
}

class ProcessReloadButton extends $Frontend.Element {
  tag = "process-reload-button"
  attributes = {
    role: "button"
  }
  data = { ProcessData }
  async click({ data: { process }}) {
    await process.reload();
  }
  render({ _: { msg }, data: { process }}) {
    return this.html`<span>${msg('Reload')}</span> ${process.id}`;
  }
}

class ProcessPage extends $Backend.Page {
  path = "/process"
  data = { ProcessData }
  elements = { ProcessReloadButton }
  constructor() {
    this.data.process.id = Deno.processId();
  }
  render() {
    return this.html`
      <process-reload-button></process-reload-button>
    `;
  }
}
```
