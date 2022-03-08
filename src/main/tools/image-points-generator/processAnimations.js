const { processFrames } = require("./processFrames");

async function processAnimations({ animations, markers, projectRoot, objectType, onFrameProcessed}) {

    const { items, subfolders } = animations;

    const newAnimationItemJobs = items.map(
        (animation) => processFrames({ markers, animation, projectRoot, objectType, onFrameProcessed }).then((frames) => ({...animation, frames}))
    );
    
    const newItems = await Promise.all(newAnimationItemJobs);

    const newSubFoldersJobs = subfolders.map(subAnimations => processAnimations({ animations: subAnimations, markers, projectRoot, objectType }));

    const newSubFolders = await Promise.all(newSubFoldersJobs);

    return { items: newItems, subfolders: newSubFolders };
}

module.exports = { processAnimations };