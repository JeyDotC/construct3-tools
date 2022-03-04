import { button, div, input, state, sideEffect } from '../../public/justjs/index.js';

function MarkerForm({ onAddMarker }) {
  const [getNumber, setNumber, subscribeToNumber] = state(0);
  const [getName, setName, subscribeToName] = state('Origin');
  const [getColor, setColor, subscribeToColor] = state('#000000');

  const handleNumberChanged = (e) => setNumber(parseInt(e.target.value));
  const handleNameChanged = (e) => setName(e.target.value);
  const handleColorChanged = (e) => setColor(e.target.value);
  const handleAddMarker = (e) => {
    e.preventDefault();

    onAddMarker({ number: getNumber(), name: getName(), color: getColor() });

    const nextNumber = getNumber() + 1;
    setName(`Image Point ${nextNumber}`);
    setNumber(nextNumber);
  }

  return div({},
    div({ class: "input-group mb-3" },
      input({
        type: "number",
        class: "form-control mw-4",
        value: subscribeToNumber,
        min: 0,
        step: 1,
        onchange: handleNumberChanged
      }),
      input({
        type: "text",
        id: "image-point-name",
        class: "form-control",
        value: subscribeToName,
        placeholder: 'Image point name',
        onkeydown: handleNameChanged,
        onchange: handleNameChanged
      }),
      input({
        type: "color",
        class: "form-control form-control-color",
        value: subscribeToColor,
        onchange: handleColorChanged
      }),
      button({
        class: "btn btn-outline-primary",
        onclick: handleAddMarker,
        disabled: sideEffect(
          (name, color) => name.length === 0 || color.length === 0,
          subscribeToName,
          subscribeToColor
        )
      }, 'Add')
    )
  );
}

export { MarkerForm }