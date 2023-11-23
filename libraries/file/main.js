export default class FileWrapper extends File {
  constructor(fileLocation, options = {}) {
    super(
      [Deno.readFileSync(fileLocation)],
      fileLocation instanceof URL ? fileLocation.pathname : fileLocation,
      options
    );
  }

  toString() {
    return URL.createObjectURL(this);
  }
}
