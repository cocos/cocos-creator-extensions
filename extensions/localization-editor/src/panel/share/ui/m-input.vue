<template>
    <div
        class="mInput"
        :readonly="isReadOnly"
        tabindex="0"
        :isSelected="isSelected"
        :error="error"
        :isEditing="isEditing"
        :disabled="disabled"
        @blur="onBlur"
        @focus="onFocus"
        @click="onClick">
        <input
            v-show="!isTextarea"
            ref="inputElement"
            :placeholder="translatedPlaceHolder"
            :value="modelValue"
            :readonly="isReadOnly"
            :type="type"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur" />
        <textarea
            v-show="isTextarea"
            ref="textareaElement"
            :placeholder="translatedPlaceHolder"
            :value="modelValue"
            rows="1"
            :readonly="isReadOnly"
            :type="type"
            @focus="onFocus"
            @input="onInput"
            @blur="onBlur">
        </textarea>
        <div class="icon">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
export default {
    props: {
        modelValue: String,
        readonly: Boolean,
        type: String,
        isTextarea: Boolean,
        placeholder: String,
        error: Boolean,
        placeHolder: String,
        disabled: Boolean,
    },
    emits: ['blur', 'update:modelValue'],
    setup: (props, { emit }) => {

        const isReadOnly = computed(() => {
            if (props.isTextarea) {
                return props.readonly || !isEditing.value;
            } else {
                return props.readonly;
            }
        });
        const isSelected = ref(false);
        const isEditing = ref(false);
        const inputElement = ref(null as HTMLInputElement | null);
        const textareaElement = ref(null as HTMLTextAreaElement | null);
        const labelElement = ref(null as HTMLElement | null);
        const translatedPlaceHolder = ref(props.placeHolder);
        function onClick(event: MouseEvent) {
            if (!isSelected.value) {
                isSelected.value = true;
            } else {
                isEditing.value = true;
                focus();
            }
        }
        function onInput(event: Event ) {
            if (props.isTextarea && textareaElement.value) {
                textareaElement.value.style.height = '16px';
                textareaElement.value.style.height = textareaElement.value.scrollHeight + 'px';
            }
            emit('update:modelValue', (<HTMLInputElement>event.target)!.value);
        }
        let blurTimeout: NodeJS.Timeout | null = null; // eslint-disable-line no-undef
        const onBlur = (event: Event) => {
            emit('blur');
            blurTimeout = setTimeout(() => {
                isSelected.value = false;
                isEditing.value = false;
            }, 100);
        };
        function onFocus() {
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
        }
        function focus() {
            if (props.isTextarea) {
                textareaElement.value?.focus();
            } else {
                inputElement.value?.focus();
            }
        }
        function updatePlaceHolder(){
            if (props.placeHolder?.startsWith('i18n:')){
                translatedPlaceHolder.value = Editor.I18n.t(props.placeHolder.slice('i18n:'.length));
            }
        }

        onMounted(() => {
            updatePlaceHolder();
            const addBroadcastListener = Editor.Message.__protected__ ? Editor.Message.__protected__.addBroadcastListener : Editor.Message.addBroadcastListener;
            addBroadcastListener('i18n:change', updatePlaceHolder);
        });
        onUnmounted(() => {
            const addBroadcastListener = Editor.Message.__protected__ ? Editor.Message.__protected__.removeBroadcastListener : Editor.Message.removeBroadcastListener;
            Editor.Message.__protected__.removeBroadcastListener('i18n:change', updatePlaceHolder);
        });
        return {
            translatedPlaceHolder,
            focus, onFocus,
            onBlur, onInput, inputElement
            , textareaElement, labelElement,
            isSelected, onClick, isEditing, isReadOnly,
        };
    },
};
</script>

