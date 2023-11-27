import { FloatWindowConfig } from '../internal';

/**
 * @param header
 * @param limitedAreaElement
 * @param $window - 当前窗口对象
 */
export interface IHeaderDragOptions {
    // 需要拖动的对象
    target: HTMLDivElement;
    // 当前窗口对象
    $window: HTMLDivElement;
    // 配置
    config: FloatWindowConfig;
    onChange?: (style: CSSStyleDeclaration) => void;

}

let onDragStartHeaderEvent: (event: MouseEvent) => void;

/**
 * 添加 header 拖动时间
 * @param options
 */
export function useDragEvent(options: IHeaderDragOptions) {
    const { target, $window, config } = options;

    if (!config.events.drag) {
        target.removeEventListener('mousedown', onDragStartHeaderEvent, false);
        target.removeAttribute('style');
        return;
    }

    if (target.getAttribute('has-drag-event') !== null) return;

    const parentElement = $window.parentElement!;

    onDragStartHeaderEvent = function(event: MouseEvent) {
        event.stopPropagation();

        const parentElementRect = parentElement.getBoundingClientRect();
        const windowRect = $window.getBoundingClientRect();
        const pointX = event.clientX;
        const pointY = event.clientY;

        const uiGraphForge = parentElement.parentElement?.querySelector('ui-graph-forge')?.shadowRoot;
        const uiGraphForgeHeaderHeight = uiGraphForge?.querySelector('header')?.clientHeight || 28;

        // 当前窗口的位置
        const start = {
            left: $window.offsetLeft,
            top: $window.offsetTop,
        };

        const minX = 0;
        const minY = uiGraphForgeHeaderHeight;
        const maxX = parentElement.offsetWidth + parentElement.offsetLeft - windowRect.width;
        const maxY = parentElement.offsetHeight - parentElement.offsetTop - windowRect.height;

        const tabs = $window.parentNode?.parentNode?.querySelector('.right-tabs');
        const tabsRect = tabs?.getBoundingClientRect();

        function drag(event: MouseEvent) {
            const x = start.left + (event.clientX - pointX);
            const y = start.top + (event.clientY - pointY);

            let newX = 0, newY = 0;
            if (config.events.limitless) {
                newX = x;
                newY = y;
            } else {
                newY = Math.min(Math.max(minY, y), maxY);
                newX = Math.min(Math.max(minX, x), maxX - (tabsRect?.width || 0));
            }

            $window.style.left = `${newX}px`;
            $window.style.top = `${newY}px`;

            options.onChange && options.onChange($window.style);
        }

        function dragEnd() {
            document.removeEventListener('mousemove', drag, true);
            document.removeEventListener('mouseup', dragEnd, true);
        }

        document.addEventListener('mousemove', drag, true);
        document.addEventListener('mouseup', dragEnd, true);
    };

    target.addEventListener('mousedown', onDragStartHeaderEvent, false);
    target.setAttribute('style', 'cursor: move;');
    target.setAttribute('has-drag-event', '');
}
