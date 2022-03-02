const fs = require('fs');
const { processAnimations } = require('./processAnimations');

export type MakerData = {
    name: string,
    marker: [number, number, number],
};

export type GenerateImagePointsParameters = {
    projectRoot: string,
    objectType: string,
    markers: Record<number, MakerData>,
};

function generateImagePoints({projectRoot, objectType, markers}: GenerateImagePointsParameters) {
    const spriteRawData = fs.readFileSync(`${projectRoot}/objectTypes/${objectType}.json`);

    const spriteMetadata = JSON.parse(spriteRawData);
    
    const { animations } = spriteMetadata;
    
    return processAnimations({ animations, markers, projectRoot, objectType })
        .then((animations) => {
            spriteMetadata.animations = animations;
            console.log();
            console.log("Writing image points into project...");
            fs.writeFileSync(`${projectRoot}/objectTypes/${objectType}.json-x`, JSON.stringify(spriteMetadata));
            console.log("DONE.");
        });
}

export { generateImagePoints };
