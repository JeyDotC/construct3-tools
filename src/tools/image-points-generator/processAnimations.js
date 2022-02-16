const { processFrames } = require("./processFrames");

async function processAnimations({ animations, markers, projectRoot, objectType}) {

    const { items, subfolders, name } = animations;

    const folderName = name || '<Root>';
    console.log(`Processing Folder ${folderName} with ${items.length} animations.`);

    const newAnimationItemJobs = items.map(
        (animation) => processFrames({ markers, animation, projectRoot, objectType }).then((frames) => ({...animation, frames}))
    );
    
    const newItems = await Promise.all(newAnimationItemJobs);

    const newSubFoldersJobs = subfolders.map(subAnimations => processAnimations({ animations: subAnimations, markers, projectRoot, objectType }));

    const newSubFolders = await Promise.all(newSubFoldersJobs);

    console.log(`Done Processing Folder ${folderName}`);

    return { items: newItems, subfolders: newSubFolders };
}

module.exports = { processAnimations };