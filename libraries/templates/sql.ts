
// TODO: implement this 

// await fetch(sql`
//   SELECT *
//   FROM images
//   WHERE id = ${id}
// `);

class SQLRequest extends Request {
  constructor(sqlBody: string, sqlInsertions?: (string | number)[], init?: RequestInit) {
    super(sqlBody, init);
  }
}

export default (template: TemplateStringsArray, ...insertions: (SQLRequest | string | number)[]) => { };
