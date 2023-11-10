<template>
    <div class="mFile">
        <ui-prop
            v-show="showIcon"
            style="width:0px"
            :tooltip="tooltip">
            <slot name="icon">
                !
            </slot>
        </ui-prop>
        <div class="label">
            <slot name="label"></slot>
        </div>
        <m-input
            no-vertical-padding
            class="mInput"
            :placeholder="placeholder"
            :model-value="modelValue"
            @blur="onBlur"
            @update:modelValue="onModelUpdate">
            <slot name="inputIcon"></slot>
        </m-input>
    </div>
</template>

<script lang="ts">
import { join } from 'path';
import { ref } from 'vue';
import mInput from './m-input.vue';
import { existsSync } from 'fs-extra';
import { MainName, ProjectAssetPath } from '../../../lib/core/service/util/global';

export default {
    components: {
        'm-input': mInput,
    },
    props: {
        modelValue: String,
        checkFileExist: Boolean,
        checkEmpty: Boolean,
        placeholder: String,
    },
    emits: ['blur', 'update:modelValue'],
    setup: (props, { emit }) => {

        const isFileExist = ref(!props.checkFileExist || existsSync(join(ProjectAssetPath, props.modelValue ?? '')));
        function onModelUpdate(value: string) {
            emit('update:modelValue', value);
        }
        function onBlur(event: Event) {
            if (props.checkFileExist) {
                isFileExist.value = existsSync(join(ProjectAssetPath, props.modelValue ?? ''));
            }
        }

        return { isFileExist, onModelUpdate, onBlur };
    },
    computed: {
        showIcon(): boolean {
            return (this.checkEmpty && this.modelValue === '') || (this.checkFileExist && !this.isFileExist);
        },
        tooltip(): string {
            if (this.modelValue === '' && this.checkEmpty) {
                return 'i18n:' + MainName + '.cannot_empty';
            } else {
                return 'i18n:' + MainName + '.file_no_exist';
            }
        },
    },
};
</script>
