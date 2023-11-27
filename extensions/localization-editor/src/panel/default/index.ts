
import 'reflect-metadata';
import '../../lib/core/container-registry';
import { createApp } from 'vue';
import MainApp from './component/default-app.vue';
import type { IPluralRulesJson } from '../../../@types/po';
import { container } from 'tsyringe';
import EventBusService from '../../lib/core/service/util/EventBusService';
import defaultAppStyle from './component/default-app.less';
export { PanelTranslateData } from '../share/scripts/PanelTranslateData';
export const pluralRules: IPluralRulesJson = container.resolve('PluralRules');
const eventBusService = container.resolve(EventBusService);

const weakMap = new WeakMap<any, InstanceType<typeof MainApp>>();
module.exports = Editor.Panel.define({
    listeners: {
        show() { },
        hide() { },
    },
    template: '<div id="app"></div>',
    style: defaultAppStyle,
    $: {
        app: '#app',
    },
    ready() {
        // 使用 data
        if (this.$.app) {
            // @ts-ignore
            const app = createApp(MainApp);
            app.mount(this.$.app);
            weakMap.set(this, app);
        }
    },
    methods: {
        executePanelMethod(method: string, ...args: any[]) {
            // @ts-ignore
            eventBusService.emit(method, ...args);
        },
    },
    beforeClose() { },
    close() {
        const app = weakMap.get(this);
        if (app) {
            app.unmount();
        }
    },
});
