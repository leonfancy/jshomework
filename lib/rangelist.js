class RangeList {
  constructor() {
    this.root = null;
  }

  add(range) {
    let [begin, end] = range

    if (end <= begin) return;

    let prev = null, curr = this.root

    while (true) {
      if (!curr || end < curr.begin) {
        let newNode = {begin, end, next: curr};
        if (prev) prev.next = newNode
        else this.root = newNode
        return
      } else if (begin > curr.end) {
        prev = curr;
      } else {
        begin = Math.min(curr.begin, begin)
        end = Math.max(curr.end, end)
      }
      curr = curr.next
    }
  }

  remove(range) {
    let [begin, end] = range

    if (end <= begin) return;

    let prev = null, curr = this.root
    while (curr && end > curr.begin) {
      if (begin >= curr.end) {
        prev = curr
        curr = curr.next
        continue
      }

      if (begin <= curr.begin && end >= curr.end) {
        if (prev) prev.next = curr.next
        else this.root = curr.next

        curr = curr.next
      } else if (begin <= curr.begin && end < curr.end) {
        curr.begin = end
        return
      } else if (begin > curr.begin && end < curr.end) {
        curr.next = {begin: end, end: curr.end, next: curr.next}
        curr.end = begin
        return
      } else if (begin > curr.begin && end >= curr.end) {
        curr.end = begin
        prev = curr
        curr = curr.next
      }
    }
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
