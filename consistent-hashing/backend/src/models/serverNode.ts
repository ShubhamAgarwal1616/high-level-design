import { VNode } from './vnode';

export class ServerNode {
  public vnodes: VNode[] = [];
  constructor(public id: string) {}
}
