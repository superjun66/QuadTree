import { _decorator, BoxCollider, Collider, Collider2D, Component, Contact2DType, instantiate, Node, NodePool, Prefab } from 'cc';
import { NodePoolMgr } from '../pool/NodePoolMgr';
import { POOL_ENMU } from '../pool/PoolStruct';
import { resolve } from 'path';
import { Item } from '../../../TestScene/src/Item';
import { ItemDataMgr } from './ItemDataMgr';

export enum ItemType {
    Normal = 0,
    Stone,
}


const { ccclass, property } = _decorator;

@ccclass('ItemPrefab')
export class ItemPrefab extends Component {

    itemType: number = ItemType.Normal;//南瓜 石头
    eliminateNum: number = 1;

    increasingId: number;//id标识
    onLoad() {

    }
    async createItem(id): Promise<number[]> {
        this.increasingId = id;
        let random = Math.floor(Math.random() * 16);
        let indexRandom = random + Math.floor(Math.random() * 22);
        let type = random % 3;
        let index = indexRandom % 4;
        let i = 0;
        let vales = [];
        this.itemType = (type == 2) ? ItemType.Stone : ItemType.Normal;
        this.eliminateNum = (type == 2) ? 2 : 1;
        while (i < 4) {
            if (i == index) {
                let emptyNode = await NodePoolMgr.instance.getPoolNode(POOL_ENMU.Monster_Empty);
                this.node.addChild(emptyNode);
                vales.push(0);
            } else {
                let node = await NodePoolMgr.instance.getPoolNode((type == 2) ? POOL_ENMU.Monster_Stone : POOL_ENMU.Monster_Normal);
                vales.push((type == 2) ? 2 : 1);
                this.node.addChild(node);
            }
            i++;
        }
        return vales;

    }

    //创建自定义item
    async createCustomItem(index, id): Promise<number[]> {
        this.increasingId = id;
        this.itemType = ItemType.Normal;
        return new Promise(async resolve => {
            let i = 0;
            let vales = [];
            while (i < 4) {
                if (i != index) {
                    let emptyNode = await NodePoolMgr.instance.getPoolNode(POOL_ENMU.Monster_Empty);
                    vales.push(0);
                    this.node.addChild(emptyNode);
                } else {
                    let node = await NodePoolMgr.instance.getPoolNode(POOL_ENMU.Monster_Normal);
                    vales.push(1);
                    this.node.addChild(node);
                }
                i++;
            }
            resolve(vales);
        })

    }
    //替换类型
    replaceItemType() {

    }

    //替换格子 空格子替换为normal
    replaceGrid(index) {

    }


    recycleItem() {
        ItemDataMgr.instance.deleteData(this.increasingId);
        let child = this.node.children;
        for (let len = child.length, i = len - 1; i >= 0; i--) {
            const childNode = child[i];
            NodePoolMgr.instance.putNodeToPool(childNode);
        }
    }
}


