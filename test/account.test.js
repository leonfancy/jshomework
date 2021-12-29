const {BankAccount} = require("../lib/account")
const sinon = require("sinon");
const expect = require('chai').expect

describe("BankAccount", function () {
  const INITIAL_BALANCE = 20

  let account

  let fakeNow = 1640765314284
  let dateNowStub;

  beforeEach(function () {
    account = new BankAccount("Bob", INITIAL_BALANCE)

    dateNowStub = sinon.stub(Date, 'now')
    dateNowStub.returns(fakeNow)
  })

  afterEach(function () {
    dateNowStub.restore()
  })

  describe("#constructor()", function () {
    it("should create a banking account with initial balance and name", function () {
      expect(account.name).to.equal("Bob")
      expect(account.balance).to.equal(INITIAL_BALANCE)
      expect(account.transactions).to.be.an('array').that.is.empty
    })
  })

  describe("#deposit()", function () {
    it("should increment balance by given amount and save transaction history", function () {

      account.deposit(10)

      expect(account.balance).to.equal(30)
      expect(dateNowStub.callCount).to.equal(1)
      expect(account.transactions).to.deep.equal([{timestamp: fakeNow, amount: 10, message: "deposit"}])
    })

    it("should save the given message to transaction history", function () {

      account.deposit(10, "salary")

      expect(account.balance).to.equal(30)
      expect(dateNowStub.callCount).to.equal(1)
      expect(account.transactions).to.deep.equal([{timestamp: fakeNow, amount: 10, message: "salary"}])
    })

    it("should throw error given a negative amount", function () {
      expect(() => account.deposit(-10))
        .throw(RangeError, "Deposit amount can't be negative")
    })
  })

  describe("#withdraw()", function () {
    it("should decrement balance by given amount and save transaction history", function () {

      account.withdraw(5)

      expect(account.balance).to.equal(15)
      expect(dateNowStub.callCount).to.equal(1)
      expect(account.transactions).to.deep.equal([{timestamp: fakeNow, amount: -5, message: "withdraw"}])
    })

    it("should save the given message to transaction history", function () {
      account.withdraw(5, "buy car")

      expect(account.balance).to.equal(15)
      expect(dateNowStub.callCount).to.equal(1)
      expect(account.transactions).to.deep.equal([{timestamp: fakeNow, amount: -5, message: "buy car"}])
    })

    it("should throw error given a negative amount", function () {
      expect(() => account.withdraw(-10))
        .throw(RangeError, "Withdraw amount can't be negative")
    })

    it("should throw error given the withdraw amount more than balance", function () {
      expect(() => account.withdraw(INITIAL_BALANCE + 1))
        .throw(RangeError, "Withdraw amount can't be more than balance")
    })
  })

  describe("#transfer()", function () {
    let otherAccount

    beforeEach(function () {
      otherAccount = new BankAccount("Alice", INITIAL_BALANCE)
    })

    it("should transfer money to another bank account and save transaction history", function () {
      account.transfer(otherAccount, 5)

      expect(account.balance).to.equal(15)
      expect(otherAccount.balance).to.equal(25)
      expect(dateNowStub.callCount).to.equal(2)
      expect(account.transactions).to.deep.equal([{timestamp: fakeNow, amount: -5, message: "Transfer to Alice"}])
      expect(otherAccount.transactions).to.deep.equal([{timestamp: fakeNow, amount: 5, message: "Receive from Bob"}])
    })

    it("should throw error given a negative amount", function () {
      expect(() => account.transfer(otherAccount, -5))
        .throw(RangeError, "Withdraw amount can't be negative")
    })

    it("should throw error given the transfer amount more than balance", function () {
      expect(() => account.transfer(otherAccount, INITIAL_BALANCE + 1))
        .throw(RangeError, "Withdraw amount can't be more than balance")
    })
  })
})
