import {  div, label, select, option,  } from '../../../public/justjs/index.js';

function ObjectTypesSelect({ objectTypes, onObjectTypeSelected }) {

  const disabled = objectTypes.length === 0;

  return (
    div({ class: 'mb-3', disabled },
      label({ class: 'form-label', for: 'project-object-type' }, 'Select Object Type'),

      select({ 
          class: 'form-control', 
          id: 'project-object-type', 
          disabled,
          onchange: (e) => onObjectTypeSelected(e.target.value)
        },
        option({}, disabled ? 'Select a project Folder First' : '-- Select an object type --'),
        ...objectTypes.map(({ name }) => option({ value: name }, name))
      )
    )
  )
}

export { ObjectTypesSelect }