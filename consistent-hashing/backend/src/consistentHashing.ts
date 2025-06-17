import crypto from 'crypto';
import { AVLTree } from './avl';
import { ServerNode } from './models/serverNode';
import { VNode } from './models/vnode';

export class ConsistentHashing {
  private ring = new AVLTree<VNode>();
  private servers = new Map<string, ServerNode>();

  constructor(private vnodeCount = 3) {}

  addServer(serverId: string) {
    if (this.servers.has(serverId)) return;
    const server = new ServerNode(serverId);
    this.servers.set(serverId, server);

    for (let i = 0; i < this.vnodeCount; i++) {
      const h = this.hash(`${serverId}#${i}`);
      const vnode = new VNode(h, server);
      server.vnodes.push(vnode);
      this.ring.insert(h, vnode);
    }
  }

  removeServer(serverId: string) {
    const server = this.servers.get(serverId);
    if (!server) return;
    server.vnodes.forEach(vn => this.ring.delete(vn.hash));
    this.servers.delete(serverId);
  }

  mapKey(key: string): string | null {
    const h = this.hash(key);
    const vnode = this.ring.findSuccessor(h);
    return vnode ? vnode.server.id : null;
  }

  getState(keys: string[]): any {
    const mapping = keys.map(k => ({ key: k, serverId: this.mapKey(k), hash: this.hash(k) }));
    return {
      tree: this.ring.toSerializable(),
      servers: Array.from(this.servers.keys()),
      mapping
    };
  }

  private hash(data: string): number {
    return parseInt(crypto.createHash('sha256').update(data).digest('hex').slice(0, 8), 16);
  }
}
