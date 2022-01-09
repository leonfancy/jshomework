const {RangeList} = require("../lib/rangelist");
const expect = require('chai').expect
describe("RangeList", function () {
  describe("#add()", function () {
    it("should add to an empty list", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 5])

      expect(rangeList.toString()).to.equal("[1, 5)")
    })

    it("should add range before the 1st range", function () {
      let rangeList = new RangeList();

      rangeList.add([10, 20])
      rangeList.add([1, 5])

      expect(rangeList.toString()).to.equal("[1, 5) [10, 20)")
    })

    it("should add range after the 1st range", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 5])
      rangeList.add([10, 20])

      expect(rangeList.toString()).to.equal("[1, 5) [10, 20)")
    })

    it("should add range between two ranges", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 5])
      rangeList.add([10, 20])

      rangeList.add([6, 9])

      expect(rangeList.toString()).to.equal("[1, 5) [6, 9) [10, 20)")
    })

    it("should add range given a range that intersects with left part of another", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 3])
      rangeList.add([7, 15])

      rangeList.add([6, 10])

      expect(rangeList.toString()).to.equal("[1, 3) [6, 15)")
    })

    it("should add range given a range that intersects with right part of another", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 3])
      rangeList.add([7, 15])

      rangeList.add([10, 16])

      expect(rangeList.toString()).to.equal("[1, 3) [7, 16)")
    })

    it("should add range given a range that fall into another", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 3])
      rangeList.add([7, 15])

      rangeList.add([8, 10])

      expect(rangeList.toString()).to.equal("[1, 3) [7, 15)")
    })

    it("should add range given a range that cover another", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 3])
      rangeList.add([7, 15])

      rangeList.add([6, 16])

      expect(rangeList.toString()).to.equal("[1, 3) [6, 16)")
    })

    it("should add range given a range that intersect multiple", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 3])
      rangeList.add([7, 15])
      rangeList.add([20, 25])
      rangeList.add([30, 35])

      rangeList.add([8, 32])

      expect(rangeList.toString()).to.equal("[1, 3) [7, 35)")
    })

    it("should merge range given a range with begin value equals to end value of an existing range", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 5])
      rangeList.add([5, 10])

      expect(rangeList.toString()).to.equal("[1, 10)")
    })

    it("should merge range given a range with end value equals to begin value of an existing range", function () {
      let rangeList = new RangeList();

      rangeList.add([5, 10])
      rangeList.add([1, 5])

      expect(rangeList.toString()).to.equal("[1, 10)")
    })

    it("should not change range list given invalid range", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 5])
      rangeList.add([5, 5])
      rangeList.add([6, 3])

      expect(rangeList.toString()).to.equal("[1, 5)")
    })
  })

  describe("#remove()", function () {
    it("should remove nothing from empty range list", function () {
      let rangeList = new RangeList();

      rangeList.remove([1, 5])

      expect(rangeList.toString()).to.equal("")
    })

    it("should remove nothing given range has no intersect with current range", function () {
      let rangeList = new RangeList();

      rangeList.add([10, 20])
      rangeList.remove([1, 5])
      rangeList.remove([25, 30])

      expect(rangeList.toString()).to.equal("[10, 20)")
    })

    it("should remove right part if only the begin of remove range fall into an existing range", function () {
      let rangeList = new RangeList();

      rangeList.add([10, 20])
      rangeList.remove([15, 25])

      expect(rangeList.toString()).to.equal("[10, 15)")
    })

    it("should remove middle part if both the end and begin of remove range fall into an existing range", function () {
      let rangeList = new RangeList();

      rangeList.add([10, 20])
      rangeList.remove([15, 17])

      expect(rangeList.toString()).to.equal("[10, 15) [17, 20)")
    })

    it("should remove left part if only the end of remove range fall into an existing range", function () {
      let rangeList = new RangeList();

      rangeList.add([10, 20])
      rangeList.remove([15, 17])

      expect(rangeList.toString()).to.equal("[10, 15) [17, 20)")
    })

    it("should remove whole part if a part falls into the given remove range", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 5])
      rangeList.add([10, 20])
      rangeList.remove([8, 25])

      expect(rangeList.toString()).to.equal("[1, 5)")
    })

    it("should remove multiple ranges if the given remove range spans multiple ranges", function () {
      let rangeList = new RangeList();

      rangeList.add([1, 5])
      rangeList.add([10, 20])
      rangeList.add([25, 30])
      rangeList.add([35, 40])
      rangeList.remove([15, 38])

      expect(rangeList.toString()).to.equal("[1, 5) [10, 15) [38, 40)")
    })

    it("should remove all ranges", function () {
      let rangeList = new RangeList();

      rangeList.add([10, 20])
      rangeList.add([25, 30])
      rangeList.remove([10, 30])

      expect(rangeList.toString()).to.equal("")
    })
  })
})
