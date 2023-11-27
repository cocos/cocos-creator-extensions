
import 'reflect-metadata';
import '../../lib/core/container-registry';
import { createApp } from 'vue';
import MainApp from './component/build-app.vue';
import type { ITaskOptions } from '../../lib/builder/ITaskOptions';
import type { IEventBusEventMap } from '../../lib/core/service/util/IEventMap';
import { container } from 'tsyringe';
import EventBusService from '../../lib/core/service/util/EventBusService';
import buildAppStyle from './component/build-app.less';

const weakMap = new WeakMap<any, { app: InstanceType<typeof MainApp>, onChangeBuilderOptions: IEventBusEventMap['changeBuilderOptions'] }>();

const eventBusService = container.resolve(EventBusService);

module.exports = Editor.Panel.define({
    $: { app: '#app' },
    template: '<div id="app"></div>',
    // @ts-ignore
    ready(options: ITaskOptions, type: string, pkgName: string, errorMap: any) {
        const onChangeBuilderOptions: IEventBusEventMap['changeBuilderOptions'] = (key, value, isError) => {
            this.dispatch('update', key, value, isError);
        };
        if (this.$.app) {
            const app = createApp(MainApp);
            app.mount(this.$.app);
            weakMap.set(this, {
                app,
                onChangeBuilderOptions,
            });
            eventBusService.emit('onBuilderUpdated', options);
        }
        eventBusService.on('changeBuilderOptions', onChangeBuilderOptions);
    },
    style: buildAppStyle,
    update(options: ITaskOptions, key: string) {
        eventBusService.emit('onBuilderUpdated', options, key);
    },
    close() {
        const data = weakMap.get(this);
        if (data) {
            data.app?.unmount();
            eventBusService.off('changeBuilderOptions', data.onChangeBuilderOptions);
        }
    },
});
