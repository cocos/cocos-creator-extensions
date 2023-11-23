import { onMounted, onUnmounted, ref } from 'vue/dist/vue.js';
import { SetupContext } from 'vue/types/v3-setup-context';

import { GraphAssetMgr, MessageType, MaskMgr, MessageMgr, MaskType } from '../../shader-graph';

/**
 * 用于提示引导用户处理相关操作例如（打开，导入，覆盖）
 * @param props
 * @param ctx
 */
export const maskLogic = (props: { }, ctx: SetupContext | SetupContext<any>) => {
    const maskRef = ref();
    const displayMaskType = ref<MaskType>(MaskMgr.Instance.displayMaskType);

    const createNewList = ref([
        {
            type: 'Surface',
            label: Editor.I18n.t('shader-graph.buttons.new') + 'Surface',
        },
        {
            type: 'Unlit',
            label: Editor.I18n.t('shader-graph.buttons.new') + 'Unlit',
        },
    ]);

    function onUpdateMask(nextMaskType: MaskType) {
        displayMaskType.value = nextMaskType;
        changeMaskDisplay();
    }

    function changeMaskDisplay() {
        if (!maskRef.value) return;

        if (displayMaskType.value === MaskType.None) {
            maskRef.value.removeAttribute('show');
        } else {
            maskRef.value.setAttribute('show', '');
        }
    }

    // Test Code
    // document.addEventListener('keydown', (event) => {
    //     let nextMaskType = MaskType.None;
    //     switch (event.code) {
    //         case 'Digit1':
    //             nextMaskType = MaskType.WaitSceneReady;
    //             break;
    //         case 'Digit2':
    //             nextMaskType = MaskType.AssetMissing;
    //             break;
    //         case 'Digit3':
    //             nextMaskType = MaskType.AssetChange;
    //             break;
    //         case 'Digit4':
    //             nextMaskType = MaskType.NeedCreateNewAsset;
    //             break;
    //         case 'Digit5':
    //             nextMaskType = MaskType.NeedSaveBeReloadByRename;
    //             break;
    //     }
    //     onUpdateMask(nextMaskType);
    // });

    onMounted(() => {
        changeMaskDisplay();
        MessageMgr.Instance.register(MessageType.UpdateMask, onUpdateMask);
    });

    onUnmounted(() => {
        MessageMgr.Instance.unregister(MessageType.UpdateMask, onUpdateMask);
    });

    async function onSaveAs() {
        GraphAssetMgr.Instance.saveAs().then((done: boolean) => {
            done && MaskMgr.Instance.updateMask();
        });
    }

    async function onCreateNew(type: string) {
        GraphAssetMgr.Instance.createNew(type).then((done: boolean) => {
            done && MaskMgr.Instance.updateMask();
        });
    }

    async function onOpen() {
        GraphAssetMgr.Instance.open().then((done: boolean) => {
            done && MaskMgr.Instance.updateMask();
        });
    }

    async function onReload() {
        GraphAssetMgr.Instance.load().then((done: boolean) => {
            done && MaskMgr.Instance.updateMask();
        });
    }

    async function onOverride() {
        GraphAssetMgr.Instance.save().then((done: boolean) => {
            done && MaskMgr.Instance.updateMask();
        });
    }

    async function onSaveAndReloadByRename() {
        GraphAssetMgr.Instance.save().then(() => {
            GraphAssetMgr.Instance.load().then((done) => {
                done && MaskMgr.Instance.updateMask();
            });
        });
    }

    async function onCancel() {
        MaskMgr.Instance.updateMask();
    }

    return {
        onOpen,
        onSaveAs,
        onCreateNew,
        onReload,
        onOverride,
        onCancel,
        onSaveAndReloadByRename,

        maskRef,
        createNewList,

        // mask
        MaskType,
        displayMaskType,
    };
};
