import { getMinSize } from './const';
import { FloatWindowConfig } from '../internal';

const RESIZER_TAG = [
    'top',
    'left',
    'right',
    'bottom',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
];

export interface IResizerOptions {
    // 当前窗口
    $window: HTMLDivElement;
    // 配置
    config: FloatWindowConfig;
    // 数据变化是触发的事件
    onChange?: (style: CSSStyleDeclaration) => void;
}

const hasResizerEvent = false;

/**
 * 添加缩放器
 * @param options
 */
export function useResizer(options: IResizerOptions) {
    const { $window, config } = options;
    if (!config.events.resizer) {
        RESIZER_TAG.forEach((tag: string) => {
            const element = $window.querySelector(tag);
            if (element) {
                element.remove();
            }
        });
        return;
    }

    // 检查是否注册过，如果注册过就跳过
    for (const tag of RESIZER_TAG) {
        if ($window.querySelector(tag)) {
            return;
        }
    }

    const minSize = getMinSize();
    RESIZER_TAG.forEach((tag: string) => {
        const element = document.createElement('div');
        element.setAttribute('id', tag);
        element.setAttribute('class', tag);
        element.addEventListener('mousedown', onDragStartFrameEvent, false);
        $window.appendChild(element);
    });

    const parentElement = $window.parentElement!;

    let aspectRatio = 1;
    function onDragStartFrameEvent(event: MouseEvent) {

        const windowRect = {
            left: $window.offsetLeft,
            top: $window.offsetTop,
            width: $window.offsetWidth,
            height: $window.offsetHeight,
        };

        // 鼠标点击时候的坐标
        const mouseDown = {
            x: event.clientX,
            y: event.clientY,
        };

        const dragTarget = event.target as HTMLElement;

        aspectRatio = windowRect.width / windowRect.height;

        let lastLeft = -1;
        let lastTop = -1;
        let lastWidth = -1;
        let lastHeight = -1;
        let newLeft = -1;
        let newWidth = -1;
        let newTop = -1;
        let newHeight = -1;

        const minX = 0;
        const minY = 0;
        const maxX = parentElement.offsetWidth + parentElement.offsetLeft - windowRect.width;
        const maxY = parentElement.offsetHeight - parentElement.offsetTop - windowRect.height;

        function moveTop(deltaY: number) {
            newTop = windowRect.top - deltaY;
            newHeight = windowRect.height + deltaY;

            newHeight = Math.max(newHeight, minSize.height);
            newHeight = Math.min(newHeight, windowRect.top + windowRect.height);

            newTop = Math.min(newTop, windowRect.top + windowRect.height - minSize.height);
            newTop = Math.max(newTop, minX);

            if (newHeight <= minSize.width) {
                newTop = lastTop;
                newHeight = lastHeight;
            }
            lastTop = newTop;
            lastHeight = newHeight;
        }

        const parentElementOffsetHeight = parentElement.offsetHeight;

        function moveBottom(deltaY: number) {
            newHeight = windowRect.height - deltaY;
            newHeight = Math.max(minSize.height, newHeight);
            const offsetTop = parentElement.offsetTop;
            newHeight = Math.min(newHeight, Math.abs(parentElementOffsetHeight - offsetTop - windowRect.top));
        }

        function moveLeft(deltaX: number) {
            newLeft = windowRect.left - deltaX;
            newWidth = windowRect.width + deltaX;

            newWidth = Math.max(newWidth, minSize.width);
            newWidth = Math.min(newWidth, windowRect.left + windowRect.width);

            newLeft = Math.min(newLeft, windowRect.left + windowRect.width - minSize.width);
            newLeft = Math.max(newLeft, 0);
            if (newWidth <= minSize.width) {
                newLeft = lastLeft;
                newWidth = lastWidth;
            }
            lastLeft = newLeft;
            lastWidth = newWidth;
        }

        function moveRight(deltaX: number) {
            newWidth = windowRect.width - deltaX;
            newWidth = Math.max(minSize.width, newWidth);
            newWidth = Math.min(newWidth, Math.abs(windowRect.left - (parentElement.offsetLeft + parentElement.offsetWidth)));
        }

        function drag(event: MouseEvent) {
            const deltaX = (mouseDown.x - event.clientX);
            const deltaY = (mouseDown.y - event.clientY);

            switch (dragTarget.id) {
                case 'top-left':
                    moveTop(deltaY);
                    moveLeft(deltaX);
                    break;
                case 'top-right':
                    moveTop(deltaY);
                    moveRight(deltaX);
                    break;
                case 'bottom-left':
                    moveBottom(deltaY);
                    moveLeft(deltaX);
                    break;
                case 'bottom-right':
                    moveBottom(deltaY);
                    moveRight(deltaX);
                    break;
                case 'top':
                    moveTop(deltaY);
                    break;
                case 'bottom':
                    moveBottom(deltaY);
                    break;
                case 'left':
                    moveLeft(deltaX);
                    break;
                case 'right':
                    moveRight(deltaX);
                    break;
            }

            if (config.events.enableAspectRatio) {

                if (newHeight !== -1) {
                    newWidth = newHeight * aspectRatio;
                }
                if (newWidth !== -1) {
                    newHeight = newWidth; //newWidth / aspectRatio;
                }
            }

            if (newWidth !== -1) {
                const minWidth = parseFloat(config.base.minWidth);
                newWidth = newWidth <= minWidth ? minWidth : newWidth;
            }
            if (newHeight !== -1) {
                const minHeight = parseFloat(config.base.minHeight);
                newHeight = newHeight <= minHeight ? minHeight : newHeight;
            }

            if (newTop !== -1) $window.style.top = `${newTop}px`;
            if (newHeight !== -1) $window.style.height = `${newHeight}px`;
            if (newLeft !== -1) $window.style.left = `${newLeft}px`;
            if (newWidth !== -1) $window.style.width = `${newWidth}px`;

            if (newTop !== -1 || newHeight !== -1 || newLeft !== -1 || newWidth !== -1) {
                options.onChange && options.onChange($window.style);
            }
        }

        function dragEnd() {
            document.removeEventListener('mousemove', drag, true);
            document.removeEventListener('mouseup', dragEnd, true);
        }

        document.addEventListener('mousemove', drag, true);
        document.addEventListener('mouseup', dragEnd, true);
    }
}

/**
 * 窗口 resize 时，重新矫正坐标，保证在画板内
 */
export function adjustWindowPosition($window: HTMLElement, limitedAreaElement: HTMLElement) {
    const limitedAreaSection = limitedAreaElement.shadowRoot!.querySelector('section')!;
    const limitedAreaSectionRect = {
        left: limitedAreaSection.clientLeft,
        right: limitedAreaSection.clientLeft + limitedAreaSection.clientWidth,
        top: limitedAreaSection.clientTop,
        bottom: limitedAreaSection.clientTop + limitedAreaSection.clientHeight,
    };

    const left = parseFloat($window.style.left) || undefined;
    if (left !== undefined && (
        left < limitedAreaSectionRect.left ||
        left > (limitedAreaSectionRect.right - $window.offsetWidth))) {
        const newLeft = Math.min(Math.max(left, limitedAreaSectionRect.left), limitedAreaSectionRect.right - $window.offsetWidth);
        $window.style.left = newLeft + 'px';
    }

    const top = parseFloat($window.style.top) || undefined;
    if (top !== undefined && (
        top < limitedAreaSectionRect.top ||
        top > limitedAreaSectionRect.bottom - $window.offsetHeight
    )) {
        // 校正位置，确保窗口在父节点区域内
        let newTop = Math.min( Math.max(top, limitedAreaSectionRect.top), limitedAreaSectionRect.bottom - $window.offsetHeight);
        const minTop = limitedAreaElement.shadowRoot!.querySelector('header')!.offsetHeight;
        newTop = Math.max(minTop, newTop);
        $window.style.top = newTop + 'px';
    }
}
