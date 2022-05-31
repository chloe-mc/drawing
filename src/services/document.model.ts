import * as Automerge from 'automerge';

export class DocumentModel {
  private doc: Automerge.Doc<any>;

  constructor(doc?: Automerge.Doc<any>) {
    this.doc = doc || Automerge.init();
  }

  from(state: any) {
    this.doc = Automerge.from(state);
  }

  load(binary: Automerge.BinaryDocument) {
    this.doc = Automerge.load(binary);
  }

  getBinary() {
    return Automerge.save(this.doc);
  }
}
