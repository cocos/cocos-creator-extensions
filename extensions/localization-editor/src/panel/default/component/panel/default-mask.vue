<template>
    <div class="mask">
        <div>
            <ui-label :value="`${PKGName}.home.turn_on_tip`"></ui-label>
            <ui-button @confirm="onButtonClick()">
                <ui-label
                    color
                    :value="`${PKGName}.home.turn_on`">
                </ui-label>
            </ui-button>
        </div>
    </div>
</template>            
<script lang="ts">
import { MainName } from '../../../../lib/core/service/util/global';

export default {
    emits: ['confirm'],
    setup(props, { emit }){
        return {
            onButtonClick(){
                emit('confirm');
            },
            PKGName: `i18n:${MainName}`,
        };
    },
};
</script>
<style></style>