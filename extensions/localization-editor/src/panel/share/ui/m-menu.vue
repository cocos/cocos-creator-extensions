<template>
    <div
        ref="root"
        class="mMenu"
        :style="{
            left:x+'px',
            top:y+'px',
        }">
        <div
            v-for="menu in menus"
            :key="menu.label"
            @click="onClick(menu)">
            <ui-label :value="menu.label"></ui-label>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue';
export type CustomMenu ={
    label: string,
    click: () => any,
}
export default {
    props: {
        x: {
            required: true, 
            type: Number, 
        },
        y: {
            required: true, 
            type: Number, 
        },
        menus: {
            required: true, 
            type: Array as PropType<CustomMenu[]>, 
        },
    },
    setup(){
        const root = ref(null as HTMLElement |null);

        const onClick = function (menu: CustomMenu) {
            menu.click();
            root!.value!.style.display = 'none';
        }

        return {
            root,
            onClick,
        };
    },
};
</script>
