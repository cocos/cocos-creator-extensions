let minWidth = 0;
let minHeight = 0;

export function setMinSize(width: number, height: number) {
    minWidth = width;
    minHeight = height;
}

export function getMinSize() {
    return {
        width: minWidth,
        height: minHeight,
    };
}
