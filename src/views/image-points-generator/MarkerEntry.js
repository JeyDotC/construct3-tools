import { button, div,  input, span, } from '../../../public/justjs/index.js';

function MarkerEntry({ number, name, color, onRemoveMarker, onMarkerChanged }){

  const handleRemoveHandler = (e) => {
    e.preventDefault();

    onRemoveMarker(number);
  }

  const handleColorChange = (e) => {
    const newColor = e.target.value;

    onMarkerChanged({ number, name, color: newColor });
  }

  const handleTextChange = (e) => {
    const newName = e.target.value;

    onMarkerChanged({ number, name: newName, color });
  };

  return div({ class: "input-group mb-3" },
      span({ class: "input-group-text", }, number),
      input({
        type: "text",
        class: "form-control",
        value: name,
        onchange: handleTextChange,
      }),
      input({
        type: "color",
        class: "form-control form-control-color",
        value: color,
        onchange: handleColorChange,
      }),
      button({
        class: "btn btn-outline-danger",
        onclick: handleRemoveHandler,
      }, 'Remove')
  );
}

export { MarkerEntry }