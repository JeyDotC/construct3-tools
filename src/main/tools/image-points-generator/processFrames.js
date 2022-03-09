const { processImage } = require('./processImage');

const path = require('path');

function processFrames({ markers, animation, projectRoot, objectType, onFrameProcessed }) {

    const { frames, name } = animation;

    const frameData = frames
        .map((frame, index) => ({
            frame,
            file: path.join(projectRoot, 'images', `${objectType.toLowerCase()}-${name.toLowerCase()}-${String(index).padStart(3, '0')}.${frame.exportFormat}`),
        }));

    const processFrame = ({ frame, file }, index) => processImage({ file, markers })
        .then(imagePoints => {
            onFrameProcessed();
            
            return { frame, file, imagePoints };
        });

    return Promise
        .all(frameData.map(processFrame))
        .then((framesWithImagePoints) => framesWithImagePoints.map(({ frame, imagePoints }) => {
            const [firstImagePoint, ...otherImagePoints] = imagePoints;
            const { x, y } = firstImagePoint || { x: frame.originX, y: frame.originY };

            return ({
                ...frame,
                originX: x,
                originY: y,
                imagePoints: otherImagePoints.map(({ name, x, y }) => ({ name, x, y }))
            });
        }))
        .then((framesWithImagePoints) => {
            return framesWithImagePoints;
        });
}

module.exports = { processFrames };