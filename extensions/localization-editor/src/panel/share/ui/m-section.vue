<template>
    <div class="mSection">
        <div class="header" @click="clickIcon">
            <m-icon
                style="margin-right: 2px"
                class="icon"
                :background="false"
                :value="'arrow-triangle'"
                :upside-down="modelValue"></m-icon>
            <slot name="header"></slot>
        </div>
        <div v-show="modelValue" class="content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import MIcon from './m-icon.vue';

export default {
    components: {
        'm-icon': MIcon,
    },
    props: {
        /** 是否展开 */
        modelValue: Boolean,
    },
    setup(props, { emit }) {

        function clickIcon() {
            emit('update:modelValue', !props.modelValue);
        }
        return { clickIcon };
    },
};
</script>
