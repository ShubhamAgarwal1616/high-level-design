import {VNode} from "./models/vnode";

export class AVLNode<T> {
  public height = 1;
  constructor(public key: number, public value: T, public left: AVLNode<T> | null = null, public right: AVLNode<T> | null = null) {}
}

export class AVLTree<T> {
  private root: AVLNode<T> | null = null;

  insert(key: number, value: T) {
    this.root = this._insert(this.root, key, value);
  }

  delete(key: number) {
    this.root = this._delete(this.root, key);
  }

  findSuccessor(key: number): T | null {
    let curr = this.root, succ: AVLNode<T> | null = null;
    while (curr) {
      if (key < curr.key) { succ = curr; curr = curr.left; }
      else { curr = curr.right; }
    }
    return succ ? succ.value : this._min(this.root)?.value ?? null;
  }

  toSerializable() {
    function dfs(node: AVLNode<T> | null): any {
      if (!node) return null;
      return {
        key: node.key,
        value: (node.value as VNode).server.id,
        height: node.height,
        left: dfs(node.left),
        right: dfs(node.right)
      };
    }
    return dfs(this.root);
  }

  private height(node: AVLNode<T> | null): number { return node?.height ?? 0; }
  private balanceFactor(node: AVLNode<T>): number { return this.height(node.left) - this.height(node.right); }
  private updateHeight(node: AVLNode<T>): void { node.height = 1 + Math.max(this.height(node.left), this.height(node.right)); }

  private rotateRight(y: AVLNode<T>): AVLNode<T> {
    const x = y.left!;
    y.left = x.right;
    x.right = y;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  private rotateLeft(x: AVLNode<T>): AVLNode<T> {
    const y = x.right!;
    x.right = y.left;
    y.left = x;
    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  private _rebalance(node: AVLNode<T>): AVLNode<T> {
    this.updateHeight(node);
    const balance = this.balanceFactor(node);
    if (balance > 1) {
      if (this.balanceFactor(node.left!) < 0) node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }
    if (balance < -1) {
      if (this.balanceFactor(node.right!) > 0) node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }
    return node;
  }

  private _insert(node: AVLNode<T> | null, key: number, value: T): AVLNode<T> {
    if (!node) return new AVLNode(key, value);
    if (key < node.key) node.left = this._insert(node.left, key, value);
    else if (key > node.key) node.right = this._insert(node.right, key, value);
    else { node.value = value; return node; }
    return this._rebalance(node);
  }

  private _delete(node: AVLNode<T> | null, key: number): AVLNode<T> | null {
    if (!node) return null;
    if (key < node.key) node.left = this._delete(node.left, key);
    else if (key > node.key) node.right = this._delete(node.right, key);
    else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      const min = this._min(node.right)!;
      node.key = min.key;
      node.value = min.value;
      node.right = this._delete(node.right, min.key);
    }
    return this._rebalance(node);
  }

  private _min(node: AVLNode<T> | null): AVLNode<T> | null {
    console.log('finding min node ');
    while (node && node.left) node = node.left;
    return node;
  }
}
