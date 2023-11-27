<template>
    <div
        class="mIcon"
        :border="hasBorder"
        :background="background">
        <slot>
            <ui-icon :value="value"></ui-icon>
        </slot>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: false,
        },
        hasBorder: {
            type: Boolean,
            required: false,
            default: false,
        },
        background: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
};
</script>
