const pixels = require('image-pixels');

function closeTo(value, target, tolerance = 2){
    return value >= target - tolerance && value <= target + tolerance;
}

async function processImage({ file, markers, }) {
    const { data, width, height } = await pixels(file);

    let imagePointStack = { ...markers };
    let imagePoints = {};

    for (let byte = 0; byte < data.length; byte += 4) {
        const [R, G, B, A] = [data[byte], data[byte + 1], data[byte + 2], data[byte + 3]];

        const [matchIndex, markerSpec] = Object.entries(imagePointStack).find(
            ([, { marker }]) => {
                const [stackR, stackG, stackB, stackA] = marker;
                return (
                    closeTo(stackR, R) &&
                    closeTo(stackG, G) &&
                    closeTo(stackB, B) &&
                    stackA === A
                );
            }) || [];

        if (matchIndex !== undefined) {
            delete imagePointStack[matchIndex];

            const { name } = markerSpec;
            const pixelIndex = byte / 4;
            const pixelY = (pixelIndex / width) | 0;
            const pixelX = (pixelIndex - pixelY * width) | 0;
            const x = pixelX / width;
            const y = pixelY / height;

            imagePoints[matchIndex] = {
                name,
                x,
                y,
                byte,
                pixelX,
                pixelY
            };
        }
        if (imagePointStack.length === 0) {
            break;
        }
    }

    return Object.values(imagePoints);
}

module.exports = { processImage };