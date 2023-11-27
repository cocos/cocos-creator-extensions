<template>
    <ui-button
        class="button"
        :transparent="transparent"
        :border="hasBorder"
        :color="color"
        :disabled="disabled">
        <slot></slot>
    </ui-button>
</template>

<script lang="ts">
export default {
    props: {
        transparent: {
            type: Boolean,
            required: false,
            default: true,
        },
        hasBorder: {
            type: Boolean,
            required: false,
            default: false,
        },
        color: {
            type: String,
            required: false,
            default: 'white',
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
};
</script>
