import { button, div, form, label, input, span, state, sideEffect } from '../../../public/justjs/index.js';

function MarkerEntry({ number, name, color, onRemoveMarker }){

  const handleRemoveHandler = (e) => {
    e.preventDefault();

    onRemoveMarker(number);
  }

  return div({ class: "input-group mb-3" },
      span({ class: "input-group-text", }, number),
      input({
        type: "text",
        class: "form-control",
        value: name,
        readonly: true,
      }),
      input({
        type: "color",
        class: "form-control form-control-color",
        value: color,
        readonly: true,
      }),
      button({
        class: "btn btn-outline-danger",
        onclick: handleRemoveHandler,
      }, 'Remove')
  );
}

export { MarkerEntry }