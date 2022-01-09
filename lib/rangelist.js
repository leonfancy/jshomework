class RangeList {
  constructor() {
    this.root = null;
  }

  add(range) {
    let [begin, end] = range
    this.root = this._add(this.root, begin, end)

    // if (!this.root) {
    //   this.root = {begin, end, next: null}
    //   return
    // }
    //
    // let startNode = this.root;
    // while (startNode.next != null && begin > startNode.next.end) {
    //   startNode = startNode.next
    // }
    //
    //
    // let endNode = startNode.next
    // while (endNode != null && end > endNode.begin) {
    //   begin = Math.min(begin, endNode.begin)
    //   end = Math.max(end, endNode.end)
    //   endNode = endNode.next
    // }
    //
    // startNode.next = {begin, end, next: endNode}
  }

  _add(node, begin, end) {
    if (!node) return {begin, end, next: null}

    if (end < node.begin) {
      return {begin, end, next: node}
    }

    if (begin > node.end) {
      node.next = this._add(node.next, begin, end)
      return node;
    }

    begin = Math.min(node.begin, begin)
    end = Math.max(node.end, end)

    return this._add(node.next, begin, end)
  }

  toString() {
    let str = ""
    for (let node = this.root; node != null; node = node.next) {
      str += `[${node.begin}, ${node.end}) `
    }
    return str.trim();
  }

  print() {
    console.log(this.toString())
  }
}

module.exports = {
  RangeList,
}
