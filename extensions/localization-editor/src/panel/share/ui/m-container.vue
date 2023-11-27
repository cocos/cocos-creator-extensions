<template>
    <div
        ref="container"
        class="scroll-container"
        tabindex="0"
        :style="{'overflow-y': 'auto', position: 'relative', 'height': containerHeight ? containerHeight + 'px' : undefined}"
        :scrollTop="scrollTop"
        @scroll="handleScroll">
        <div
            class="virtual-list"
            tabindex="0"
            :style="{height: totalHeight + 'px',paddingTop: top + 'px'}">
            <slot
                v-for="(item, index) in visibleItems"
                :key="item.key"
                :item="item"
                :index="index">
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, PropType, ref } from 'vue';

export default {
    props: {
        current: {
            type: String,
            required: true,
        },
        items: {
            type: Array as PropType<Object & {key: string}[]>,
            required: true,
        },
        itemHeight: {
            type: Number,
            required: true,
        },
        containerHeight: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        const visibleItems = computed(() => {
            const containerHeight = props.containerHeight;
            const endIndex = Math.min(
                startIndex.value + Math.ceil(containerHeight / props.itemHeight),
                props.items.length
            );
            const items = [];
            for (let i = startIndex.value; i < endIndex; i++) {
                items.push({
                    ...props.items[i],
                });
            }
            return items;
        });
        const startIndex = computed(() => Math.floor( scrollTop.value / props.itemHeight));
        const top = computed(() => startIndex.value * props.itemHeight);

        let scrolling = false;
        const scrollTop = ref(0);
        const totalHeight = computed(() => {
            updateScrollValue();
            return props.items.length * props.itemHeight - top.value;
        });
        const container = ref(null as HTMLElement | null);

        function updateScrollValue() {
            // 如果在 scroll 时就不需要计算 scroll top
            if (scrolling) {
                scrolling = false;
                return;
            }
            // 矫正滚动到选择对象的所在位置
            let currentIdx = props.items.findIndex((item:{ key: string}) => item.key === props.current);
            currentIdx = currentIdx === props.items.length - 1 ? (currentIdx -= 2.5) : (currentIdx -= 1.5);
            currentIdx = currentIdx < 0 ? 0 : currentIdx;
            scrollTop.value = Math.floor(currentIdx * props.itemHeight);
        }

        function handleScroll(event: any) {
            scrolling = true;
            scrollTop.value = event.target.scrollTop;
        }

        return {
            container,
            top,
            visibleItems,
            handleScroll,
            scrollTop,
            totalHeight,
        };
    },

};
</script>
