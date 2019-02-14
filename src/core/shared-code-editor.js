import classnames from 'classnames';
import './shared-code-editor.css';

const DEFAULT_OPTIONS = {

};

export default class SharedCodeEditor {
  constructor(editor, options) {
    this.eventTarget = new EventTarget();
    this.editor = editor;
    this.model = editor.getModel();
    this.cursors = {};
    this.cursorTags = {};
    this.cursorTagElements = {};
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
    const selections = this.editor.getSelections().map(selection => {
      const offsets = [
        this.model.getOffsetAt(selection.getStartPosition()),
        this.model.getOffsetAt(selection.getEndPosition()),
      ];
      offsets.sort();
      return offsets;
    });
    this.dispatch('cursorChange', { selections });
    console.log('cursorChange', selections);
  };

  handleChange = e => {
    const changes = (e.changes || []).slice(0);
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
    console.log('change', op);
  };

  dispatch = (typeArg, detail, cancelable) => {
    const event = new Event(typeArg, cancelable ? { cancelable: true } : {});
    Object.assign(event, { detail });
    return this.eventTarget.dispatchEvent(event);
  };

  // Public methods below.

  on(type, listener) {
    this.eventTarget.addEventListener(type, listener);
  }

  setValue(newValue) {
    this.editor.setValue(newValue);
  }

  apply(op) {
    let pos = 0;
    for (const ot of op) {
      switch (typeof ot) {
        case 'object':
          const startPosition = this.model.getPositionAt(pos);
          const endPosition = this.model.getPositionAt(pos + ot.d.length);
          this.model.applyEdits([
            {
              range: {
                startColumn: startPosition.column,
                startLineNumber: startPosition.lineNumber,
                endColumn: endPosition.column,
                endLineNumber: endPosition.lineNumber,
              },
              text: null,
            }
          ]);
          break;
        case 'string':
          const position = this.model.getPositionAt(pos);
          this.model.applyEdits([
            {
              range: {
                startColumn: position.column,
                startLineNumber: position.lineNumber,
                endColumn: position.column,
                endLineNumber: position.lineNumber,
              },
              text: ot,
            },
          ]);
          break;
        case 'number':
          pos += ot;
          break;
        default:
          break;
      }
    }
  }

  setCursor(id, startOffset, endOffset, options = {}) {
    const oldDecorations = [];
    if (this.cursors[id]) {
      oldDecorations.push(id);
      delete this.cursors[id];
    }
    const className = 'SharedCodeEditor-cursor';
    const startPosition = this.model.getPositionAt(startOffset);
    const endPosition = this.model.getPositionAt(endOffset);
    const decorations = [
      {
        options: {
          className: `${className} ${className}--${id}`,
          hoverMessage: options.title || undefined,
        },
        range: {
          startColumn: startPosition.column,
          startLineNumber: startPosition.lineNumber,
          endColumn: endPosition.column,
          endLineNumber: endPosition.lineNumber,
        },
      },
    ];
    this.editor.deltaDecorations(oldDecorations, decorations);

    const tagWidget = {
      domNode: null,
      getId: () => id,
      getDomNode: () => {
        const el = document.createElement('div');
        el.innerHTML = options.title || 'User';
        el.className = 'SharedCodeEditor-cursor-tag';
        this.cursorTagElements[id] = el;
      },
      getPosition: () => ({
        position: {
          column: endPosition.column,
          lineNumber: endPosition.lineNumber,
        },
        preference: [
          monaco.editor.ContentWidgetPositionPreference.ABOVE, 
          monaco.editor.ContentWidgetPositionPreference.BELOW,
        ],
      }),
    };
    if (this.cursorTags[id]) {
      this.editor.layoutContentWidget(tagWidget);
    } else {
      this.editor.addContentWidget(tagWidget);
    }
    
  }
}