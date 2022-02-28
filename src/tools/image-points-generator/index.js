const fs = require('fs');
const { processAnimations } = require('./processAnimations');

const markers = {
    // These are color markers.
    // Each row indicates a name and
    // a color.
    0: { name: 'a', marker: [255, 0, 0, 255] },
    1: { name: 'b', marker: [255, 106, 0, 255] },
    2: { name: 'c', marker: [255, 216, 0, 255] },
    3: { name: 'd', marker: [182, 255, 0, 255] },
};

const projectRoot = 'E:/Construct3/Anim-Experiments';
const objectType = 'leg';

const spriteRawData = fs.readFileSync(`${projectRoot}/objectTypes/${objectType}.json`);

const spriteMetadata = JSON.parse(spriteRawData);

const { animations } = spriteMetadata;

processAnimations({ animations, markers, projectRoot, objectType })
    .then((animations) => {
        spriteMetadata.animations = animations;
        console.log();
        console.log("Writing image points into project...");
        fs.writeFileSync(`${projectRoot}/objectTypes/${objectType}.json-x`, JSON.stringify(spriteMetadata));
        console.log("DONE.");
    });
