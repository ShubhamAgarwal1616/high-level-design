import { ServerNode } from './serverNode';

export class VNode {
  constructor(public hash: number, public server: ServerNode) {}
}
