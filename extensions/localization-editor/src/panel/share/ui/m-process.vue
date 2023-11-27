<template>
    <div class="mProcess">
        <div
            class="content"
            :style="{ width: value*100 + '%' }"
            :color="color"></div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        value: Number,
        color: {
            type: String,
            default: 'blue',
        },
    },
};
</script>

<style scoped lang="less">
@import url('../less/color');

</style>
