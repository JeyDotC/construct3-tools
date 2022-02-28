import { h1, div, form, label, input, select, option, state, sideEffect } from '../../../public/justjs/index.js';

function ImagePointsGenerator() {
    const [, setProjectRoot, subscribeToProjectRoot] = state('');
    const [, setObjectType, subscribeToObjectType] = state('');
    const [, setObjectTypes, subscribeToObjectTypes] = state([]);

    const handleProjectSelected = (event) => {        
        const files = event.target.files;

        if(!files || files.length === 0){
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
                fileList.push({ path: normalizedPath, name});
            }
        }

        setObjectTypes(fileList);
    };

    return div({},
        h1({}, 'Image Points Generator'),
        form({},
            div({ class: 'mb-3' },
                label({ class: 'form-label', for: 'project-folder' }, 'Select Construct 3 Project Folder'),
                input({
                    class: 'form-control', id: 'project-folder', type: 'file', webkitdirectory: "true",
                    onchange: handleProjectSelected
                })
            ),
            div({ class: 'mb-3', },
                label({ class: 'form-label', for: 'project-object-type' }, 'Select Object Type'),
                sideEffect(
                    (files) => select({ class: 'form-control', id: 'project-object-type', disabled: files.length === 0 }, 
                        option({}, files.length === 0 ? 'Select a project Folder First' : '-- Select an object type --'),
                        ...files.map(({ path, name}) => option({ value: path }, name))
                    ),
                    subscribeToObjectTypes
                ),
            )
        )
    )
}

export { ImagePointsGenerator };