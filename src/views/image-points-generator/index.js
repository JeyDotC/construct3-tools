import { h1, div, form, label, input, span, state, sideEffect } from '../../../public/justjs/index.js';
import { ObjectTypesSelect } from './ObjecTypesSelect.js';

function ImagePointsGenerator() {
    const [, setProjectRoot, subscribeToProjectRoot] = state('');
    const [, setObjectType, subscribeToObjectType] = state('');
    const [, setObjectTypes, subscribeToObjectTypes] = state([]);

    const handleProjectSelected = (event) => {
        const files = event.target.files;

        if (!files || files.length === 0) {
            setProjectRoot('');
            setObjectTypes([]);
            return;
        }

        const [firstFile] = files;
        const normalized = firstFile.path.replaceAll('\\', '/');

        const rootFolder = normalized.substring(0, normalized.lastIndexOf("/") + 1);
        setProjectRoot(rootFolder);

        const objectTypesFolder = `${rootFolder}objectTypes`;

        let fileList = [];
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const normalizedPath = file.path.replaceAll('\\', '/');

            if (normalizedPath.startsWith(objectTypesFolder) && normalizedPath.endsWith('.json')) {
                const name = file.name;
                fileList.push({ path: normalizedPath, name });
            }
        }

        setObjectTypes(fileList);
    };

    return div({},
        h1({}, 'Image Points Generator'),
        form({},
            div({ class: 'mb-3' },
                label({ class: 'form-label', for: 'project-folder' }, 'Select a Construct 3 Project Folder'),
                input({
                    class: 'form-control', id: 'project-folder', type: 'file', webkitdirectory: "true",
                    onchange: handleProjectSelected
                })
            ),
            div({},
                sideEffect(
                    (projectRoot, objectTypes) => (
                        projectRoot && projectRoot.length > 0 && objectTypes.length === 0 ? span({ class: 'text-danger' }, 'Select a valid C3 project folder') : ''
                    ),
                    subscribeToProjectRoot,
                    subscribeToObjectTypes
                )
            ),
            sideEffect(
                objectTypes => ObjectTypesSelect({ objectTypes }),
                subscribeToObjectTypes
            ),
        )
    )
}

export { ImagePointsGenerator };