import { h1, div, form, label, input, span, button, fieldset, legend, hr, state, sideEffect } from '../../../public/justjs/index.js';
import { MarkerEntry } from './MarkerEntry.js';
import { MarkerForm } from './MarkerForm.js';
import { ObjectTypesSelect } from './ObjecTypesSelect.js';

function ImagePointsGenerator() {
    const [getProjectRoot, setProjectRoot, subscribeToProjectRoot] = state('');
    const [getObjectType, setObjectType, subscribeToObjectType] = state('');
    const [, setObjectTypes, subscribeToObjectTypes] = state([]);
    const [getMarkers, setMarkers, subscribeToMarkers] = state([]);

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
                const name = file.name.substring(0, file.name.lastIndexOf("."));
                fileList.push({ path: normalizedPath, name });
            }
        }

        setObjectTypes(fileList);
    };

    const handleMarkerAdd = (marker) => {
        const currentMarkers = getMarkers();
        // Avoid repeated numbers and replace them with the newer version.
        const markers = currentMarkers.filter(({ number }) => marker.number !== number);

        setMarkers([...markers, marker].sort((a, b) => a.number - b.number))
    };

    const handleRemoveMarker = (number) => setMarkers(getMarkers().filter((marker) => marker.number !== number));

    const handleMarkerChanged = ({ number, color, name }) => setMarkers(getMarkers().map((marker) => {
        if(marker.number === number){
            return { number, name, color, };
        }
        return marker;
    }))

    const handleGenerateImagePoints = (e) => {
        e.preventDefault();

        window.electronAPI.generateImagePoints({
            projectRoot: getProjectRoot(),
            markers: getMarkers(),
            objectType: getObjectType(),
        });
    }

    window.electronAPI.onImagePointsProgress((e, params) => console.log(params));

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
                objectTypes => ObjectTypesSelect({ objectTypes, onObjectTypeSelected: setObjectType }),
                subscribeToObjectTypes
            ),
            fieldset({},
                legend({}, "Image Point Markers"),
                sideEffect(
                    markers => div({},
                        ...markers.map(({ number, name, color }) => MarkerEntry({ 
                            number, 
                            name, 
                            color, 
                            onRemoveMarker: handleRemoveMarker,
                            onMarkerChanged: handleMarkerChanged,
                        }))
                    ),
                    subscribeToMarkers
                ),
                MarkerForm({ onAddMarker: handleMarkerAdd }),
            ),
            hr(),
            div({ class: "text-end"}, 
                button({ 
                    class: "btn btn-primary", 
                    onclick: handleGenerateImagePoints,
                    disabled: sideEffect(
                        (markers, objectType, projectRoot) => markers.length === 0 || objectType.length === 0 || projectRoot.length === 0,
                        subscribeToMarkers,
                        subscribeToObjectType,
                        subscribeToProjectRoot
                    ),
                }, "Generate Image Points")
            )
        )
    )
}

export { ImagePointsGenerator };