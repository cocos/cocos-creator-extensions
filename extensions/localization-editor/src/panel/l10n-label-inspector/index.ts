import 'reflect-metadata';
import '../../lib/core/container-registry';
import { App, createApp } from 'vue';
import MainApp from './component/inspector-app.vue';
import { container } from 'tsyringe';
import EventBusService from '../../lib/core/service/util/EventBusService';
import inspectorAppStyle from './component/inspector-app.less';

const weakMap = new WeakMap<any, App<Element>>();
const eventBusService = container.resolve(EventBusService);

module.exports = Editor.Panel.define({
    template: `
      <div id="app"></div>
    `,
    $: {
        app: '#app',
    },
    ready() {
        const app = createApp(MainApp, {});
        const element = this.$.app;
        app.mount(element!);
        weakMap.set(this, app);
    },
    style: inspectorAppStyle,

    update(dump) {
        eventBusService.emit('onDumpUpdated', dump);
    },
    close() {
        const app = weakMap.get(this);
        if (app) {
            app.unmount();
        }
    },
});
