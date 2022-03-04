export type ImagePoint = {
    name: string,
    x: number,
    y: number,
}

export type CollisionPoly = {
    points: number[],
};

export type Frame = {
    width: number,
    height: number,
    originX: number,
    originY: number,
    originalSource: string,
    exportFormat: string,
    exportQuality: number,
    imageSpriteId: number,
    collisionPoly: CollisionPoly,
    useCollisionPoly: boolean,
    duration: number,
    imagePoints: ImagePoint[]
};

export type AnimationItem = {
    name: string,
    isLooping: boolean,
    isPingPong: boolean,
    repeatCount: number,
    repeatTo: number,
    speed: number,
    frames: Frame[]
};

export type AnimationFolder = {
    name?: string,
    items: AnimationItem[],
    subfolders: AnimationFolder[],
};

export type ObjectType = {
    animations: AnimationFolder
};