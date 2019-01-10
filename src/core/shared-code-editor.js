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
    this.lastValue = this.editor.getValue();
    this.editor.onDidChangeModelContent(this.handleChange);
    this.editor.onDidChangeCursorPosition(this.handleCursorChange);
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
    const changes = e.changes.slice(0);
    changes.sort((a, b) => a.rangeOffset > b.rangeOffset ? 1 : -1);

    const op = [];
    let pos = 0;
    for (const change of changes) {
      const offset = change.rangeOffset - pos;
      if (0 < offset) {
        op.push(offset);
      }

      if (change.rangeLength > 0) {
        op.push({ d: this.lastValue.substr(change.rangeOffset, change.rangeLength) });
      }
      if (change.text.length > 0) {
        op.push(change.text);
      }
      pos = change.rangeOffset + change.rangeLength;
    }

    this.lastValue = this.editor.getValue();
    this.dispatch('change', { op });
    // console.log('op', op);
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