const { processImage } = require('./processImage');

function processFrames({ markers, animation, projectRoot, objectType }) {

    const { frames, name } = animation;

    console.log(`  Processing animation ${name}`);

    const frameData = frames
        .map((frame, index) => ({
            frame,
            file: `${projectRoot}/images/${objectType.toLowerCase()}-${name.toLowerCase()}-${String(index).padStart(3, '0')}.${frame.exportFormat}`
        }));

    const processFrame = ({ frame, file }, index) => processImage({ file, markers })
        .then(imagePoints => {
            const percentage = ((index + 1) / frames.length) * 100;
            const progressCharacters = percentage.toFixed(0) / 10;
            const visualProgress = "=".repeat(progressCharacters);
            const visualRemaining = " ".repeat(10 - progressCharacters);

            process.stdout.write(`\r  [${visualProgress}${visualRemaining}] ${percentage.toFixed(2)}%`);
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
            console.log();
            console.log(`  Done animation ${name}`);
            return framesWithImagePoints;
        });
}

module.exports = { processFrames };