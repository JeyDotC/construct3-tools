import { h1, div, form, label, input, span, button, fieldset, legend, hr, state, sideEffect, h2 } from '../../public/justjs/index.js';
import { MarkerEntry } from './MarkerEntry.js';
import { MarkerForm } from './MarkerForm.js';
import { ObjectTypesSelect } from './ObjecTypesSelect.js';

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function rgbToHex([r, g, b]){
    const R = r.toString(16).padStart(2, '0');
    const G = g.toString(16).padStart(2, '0');
    const B = b.toString(16).padStart(2, '0');

    return `#${R}${G}${B}`;
}

function ImagePointsGenerator() {
    const [getProjectRoot, setProjectRoot, subscribeToProjectRoot] = state('');
    const [getObjectType, setObjectType, subscribeToObjectType] = state('');
    const [, setObjectTypes, subscribeToObjectTypes] = state([]);
    const [getMarkers, setMarkers, subscribeToMarkers] = state([]);
    const [, setMarkersAreSaving, subscribeToMarkersAreSaving] = state(false);

    const [getAvailableMarkers, setAvailableMarkers, subscribeToAvailableMarkers] = state(undefined);

    const markersAreConfigured = (markers, objectType, projectRoot) => markers.length === 0 || objectType.length === 0 || projectRoot.length === 0;
    const markersAreSaving = (markers, objectType, projectRoot, markersAreSaving) => markersAreConfigured(markers, objectType, projectRoot) || markersAreSaving;

    const prepareMarkers = () => getMarkers().reduce((accumulate, { number, color, name }) => ({
        ...accumulate,
        [number]: { name, marker: [...Object.values(hexToRgb(color)), 255] }
    }), {});

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

    const handleObjectTypeSelected = (objectType) => {
        setObjectType(objectType);

        if (objectType.length > 0) {
            window.electronAPI.loadImagePointsSpec(getProjectRoot(), objectType)
        }
    };

    const handleMarkerAdd = (marker) => {
        const currentMarkers = getMarkers();
        // Avoid repeated numbers and replace them with the newer version.
        const markers = currentMarkers.filter(({ number }) => marker.number !== number);

        setMarkers([...markers, marker].sort((a, b) => a.number - b.number))
    };

    const handleRemoveMarker = (number) => setMarkers(getMarkers().filter((marker) => marker.number !== number));

    const handleMarkerChanged = ({ number, color, name }) => setMarkers(getMarkers().map((marker) => {
        if (marker.number === number) {
            return { number, name, color, };
        }
        return marker;
    }));

    const handleSaveMarkers = (e) => {
        e.preventDefault();

        setMarkersAreSaving(true);

        window.electronAPI.saveImagePointsSpec({
            projectRoot: getProjectRoot(),
            markers: prepareMarkers(),
            objectType: getObjectType(),
        });
    }

    window.electronAPI.onSaveImagePointsSpec(() => setMarkersAreSaving(false));
    window.electronAPI.onLoadImagePointsSpec((event, data) => {
        setAvailableMarkers(data);
    });

    const handleGenerateImagePoints = (e) => {
        e.preventDefault();

        window.electronAPI.generateImagePoints({
            projectRoot: getProjectRoot(),
            markers: prepareMarkers(),
            objectType: getObjectType(),
        });
    };

    const handleRejectAvailableMarkers = (e) => {
        e.preventDefault();

        setAvailableMarkers(undefined);
    };

    const handleLoadAvailableMarkers = (e) => {
        e.preventDefault();

        const markers = Object.entries(getAvailableMarkers())
            .map(([number, { name, marker }]) => ({ number, name, color: rgbToHex(marker) }));

        setMarkers(markers);
        setAvailableMarkers(undefined);
    };

    return div({},
        h1({}, 'Image Points Generator'),
        form({},
            label({}, 'Project: '),
            span({}, subscribeToProjectRoot),
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
                objectTypes => ObjectTypesSelect({ objectTypes, onObjectTypeSelected: handleObjectTypeSelected }),
                subscribeToObjectTypes
            ),
            fieldset({},
                legend({}, "Image Point Markers"),
                sideEffect(
                    (availableMarkers) => {
                        if (availableMarkers === undefined) {
                            return "";
                        }
                        return div({ class: "small" },
                            "There are markers available, load them?: ",
                            button({ class: "btn btn-primary btn-sm", onclick: handleLoadAvailableMarkers }, "Yes"),
                            ' ',
                            button({ class: "btn btn-danger btn-sm", onclick: handleRejectAvailableMarkers }, "No")
                        );
                    },
                    subscribeToAvailableMarkers
                ),
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
            div({ class: "text-end" },
                button({
                    class: "btn btn-secondary",
                    onclick: handleSaveMarkers,
                    disabled: sideEffect(
                        markersAreSaving,
                        subscribeToMarkers,
                        subscribeToObjectType,
                        subscribeToProjectRoot,
                        subscribeToMarkersAreSaving
                    ),
                }, "Save Markers"),
                " ",
                button({
                    class: "btn btn-primary",
                    onclick: handleGenerateImagePoints,
                    disabled: sideEffect(
                        markersAreConfigured,
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