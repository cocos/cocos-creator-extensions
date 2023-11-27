import type { BlockData, LineData, PinData } from '../../block-forge/interface';
import type { IGraphDescription } from '../../block-forge/interface';

import {
    BlockEvent, BlockMouseEvent, GraphMouseEvent, LineEvent, LineMouseEvent,
} from '../../block-forge/event';

import { Menu } from '../menu';
import { GraphEditorMgr, ForgeMgr } from '../base';

export function createDefaultGraph(): IGraphDescription {
    return {
        type: 'Graph',
        style: {
            showOriginPoint: true,
            originPointColor: 'rgba(68,68,68,0.3)',
            gridColor: 'rgba(68,68,68,0.3)',
            backgroundColor: '#050505',
        },
        validator: {
            dataLink(nodes: { [key: string]: BlockData }, lines: { [key: string]: LineData }, line: LineData, input: any, output: any): boolean {
                const inputBlock = ForgeMgr.Instance.getBlockByUuid(line.input.node);
                let inputConnectType = '', outputConnectType = '';
                const inputTag = input.name || input.tag;
                if (input.direction === 'input') {
                    const inputPinData = inputBlock.getInputPin(inputTag);
                    inputConnectType = inputPinData?.desc.details.connectType;
                } else if (input.direction === 'output') {
                    const inputPinData = inputBlock.getOutputPin(inputTag);
                    if (inputBlock.block.type === 'PropertyNode') {
                        inputConnectType = inputPinData?.value.details.connectType;
                    } else {
                        inputConnectType = inputPinData?.desc.details.connectType;
                    }
                }
                const outputBlock = ForgeMgr.Instance.getBlockByUuid(line.output.node);
                const outputTag = output.name || output.tag;
                if (output.direction === 'input') {
                    const outputPinData = outputBlock.getInputPin(outputTag);
                    outputConnectType = outputPinData?.desc.details.connectType;
                } else if (output.direction === 'output') {
                    const outputPinData = outputBlock.getOutputPin(outputTag);
                    outputConnectType = outputPinData?.desc.details.connectType;
                }

                // 删除同一个 output 的线条
                GraphEditorMgr.Instance.deleteLinesByDuplicateOutput(lines, line);

                return (inputConnectType === outputConnectType) || (input.type === output.type);
            },
            execLink(nodes: any, lines: any, line: any, input: any, output: any): boolean {
                return true;
            },
            deleteLine(...args: any[]): boolean {
                return true;
            },
            // 节点
            createNode(...args: any[]): boolean {
                return true;
            },
            deleteNode(...args: any[]): boolean {
                return true;
            },
        },
        event: {
            // Block 选中事件
            onBlockSelected(event: BlockEvent) {
                return true;
            },
            onBlockUnselected(event: BlockEvent) {
                return true;
            },

            // Line 选中事件
            onLineSelected(event: LineEvent) {
                return true;
            },
            onLineUnselected(event: LineEvent) {
                return true;
            },

            // Block 点击事件
            onBlockClick(event: BlockMouseEvent) {
                return true;
            },
            onBlockRightClick(event: BlockMouseEvent) {
                return Menu.Instance.popupMenu(event);
            },
            onBlockDblClick(event: BlockMouseEvent) {
                return true;
            },

            // Line 点击事件
            onLineClick(event: LineMouseEvent) {
                return true;
            },
            onLineRightClick(event: LineMouseEvent) {
                return Menu.Instance.popupMenu(event);
            },
            onLineDblClick(event: LineMouseEvent) {
                return true;
            },

            // Graph 点击事件
            onGraphRightClick(event: GraphMouseEvent) {
                return Menu.Instance.popupMenu(event);
            },

            // 连线
            onLineCreated(event: LineEvent) {
                return true;
            },
            onLineDeleted(event: LineEvent) {
                return true;
            },

            // 节点
            onBlockCreated(event: BlockEvent) {
                return true;
            },
            onBlockDeleted(event: BlockEvent) {
                return true;
            },
        },
    };
}

