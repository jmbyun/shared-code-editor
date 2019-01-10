import SharedCodeEditor from './core/shared-code-editor';

var globalRef = (typeof this !== "undefined") ? this : window;

if (module.hot) {
  module.hot.accept('./core/shared-code-editor', () => {
    console.log('Accepting the updated SharedCodeEditor module!');
  });
}

globalRef.SharedCodeEditor = SharedCodeEditor;
