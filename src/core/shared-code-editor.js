const DEFAULT_OPTIONS = {

};

export default class SharedCodeEditor {
  constructor(editor, options) {
    this.eventTarget = new EventTarget();
    this.editor = editor;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
    this.bindEditorListeners();
  }
  
  bindEditorListeners() {
    this.editor.onDidChangeCursorPosition(this.handleCursorChange)
    this.editor.onDidChangeModelContent(this.handleChange)
  }

  handleCursorChange = e => {
    console.log(
      'Cursor Change',
      `position: ${e.position.lineNumber}, ${e.position.column}`,
      `morePositions: ${e.secondaryPositions}`,
    );
    this.dispatch('cursorChange', {
      position: [e.position.lineNumber, e.position.column],
      positions: [
        [e.position.lineNumber, e.position.column],
        ...e.secondaryPositions.map(pos => [pos.lineNumber, pos.column]),
      ],
    });
  };

  handleChange = e => {
    console.log(
      'Change',
      e.changes
    );

    const changes = e.changes.slice(0);
    changes.sort((a, b) => a.rangeOffset > b.rangeOffset ? 1 : -1);

    const op = [];
    let pos = 0;
    for (const change of changes) {
      const offset = change.rangeOffset - pos;
      if (0 < offset) {
        op.push(offset);
      }
      
    }
    // e.changes

    // change.range
    // change.range.startColumn startLineNumber endColumn endLineNumber
    // change.rangeLength
    // change.rangeOffset
    // text

    // { type: "WRITE_NOTI", client: [14928, "qub3qM4h"], version: 14, op: [8, "f", 8, "f"] }
    // { type: "WRITE_NOTI", client: [14928, "qub3qM4h"], version: 15, op: [3, { d: "oe" }, 5, { d: "t neas" }] }

  };

  on = (type, listener) => {
    this.eventTarget.addEventListener(type, listener);
  };

  dispatch = (typeArg, detail, cancelable) => {
    const event = new Event(typeArg, cancelable ? { cancelable: true } : {});
    Object.assign(event, { detail });
    return this.eventTarget.dispatchEvent(event);
  };

  setValue(newValue) {
    this.editor.setValue(newValue);
  }
}