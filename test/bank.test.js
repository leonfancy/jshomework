const sinon = require("sinon");
const expect = require('chai').expect
const crypto = require('crypto')

const {
  createAccount,
  findAccountById,
  deposit,
  findAllTransactionsByAccountId,
  withdraw,
  transfer
} = require("../lib/bank");

beforeEach(function () {
  sinon.replace(Date, "now", sinon.fake(Date.now));
  sinon.replace(crypto, "randomUUID", sinon.fake(crypto.randomUUID));
});

afterEach(function () {
  sinon.restore()
});

describe("#createAccount()", function () {
  it("should create a banking account with valid initial balance and name", function () {
    let account = createAccount("Bob", 0);

    expect(account.id).to.equal(crypto.randomUUID.returnValues[0])
    expect(account.name).to.equal("Bob")
    expect(account.balance).to.equal(0)
  })

  it("should trim the account name", function () {
    let account = createAccount(" Bob\n", 0);

    expect(account.name).to.equal("Bob")
  })

  it("should throw error given a negative balance", function () {
    expect(() => createAccount("Bob", -1))
      .throw("Account initial balance can't be negative")
  })

  it("should throw error if account name is not a 1 ~ 20 length string with alphabet and space character", function () {
    [null, undefined, "", "   ", "\n\t", "aaaaaaaaaaaaaaaaaaaaa"].forEach(name => {
      expect(() => createAccount(name, 0))
        .throw("Account name must be 1 ~ 20 length string with alphabet and space character")
    })
  })
})

describe("#findAccountById()", function () {
  it("should find the correct account by id in db", function () {
    createAccount("Alice", 0);
    let accountBob = createAccount("Bob", 0);
    createAccount("Lisa", 0);

    let foundAccount = findAccountById(accountBob.id);

    expect(foundAccount).to.deep.equal(accountBob)
  })

  it("should throw error if account not found", function () {
    expect(() => findAccountById("account-id-not-exist"))
      .throw("Account not found")
  })
})

describe("#deposit()", function () {
  const INIT_BALANCE = 20;
  let accountId;

  beforeEach(function () {
    let account = createAccount("Bob", INIT_BALANCE);
    accountId = account.id
  });

  it("should increment balance by given amount and save transaction history", function () {
    deposit(accountId, 10)

    let account = findAccountById(accountId);
    let accountTransactions = findAllTransactionsByAccountId(accountId);
    expect(account.balance).to.equal(INIT_BALANCE + 10)
    expect(accountTransactions).to.deep.equal([{
      timestamp: Date.now.returnValues[0],
      accountId: accountId,
      amount: 10,
      message: "deposit"
    }])
  })

  it("should throw error given a negative amount", function () {
    expect(() => deposit(accountId, -10))
      .throw("Deposit amount can't be negative or zero")
  })

  it("should throw error given a zero amount", function () {
    expect(() => deposit(accountId, 0))
      .throw("Deposit amount can't be negative or zero")
  })
})

describe("#withdraw()", function () {
  const INIT_BALANCE = 20;
  let accountId;

  beforeEach(function () {
    let account = createAccount("Bob", INIT_BALANCE);
    accountId = account.id
  });

  it("should decrement balance by given amount and save transaction history", function () {

    withdraw(accountId, 5)

    let account = findAccountById(accountId);
    let accountTransactions = findAllTransactionsByAccountId(accountId);
    expect(account.balance).to.equal(INIT_BALANCE - 5)
    expect(accountTransactions).to.deep.equal([{
      timestamp: Date.now.returnValues[0],
      accountId: accountId,
      amount: -5,
      message: "withdraw"
    }])
  })

  it("should throw error given a negative amount", function () {
    expect(() => withdraw(accountId, -1))
      .throw("Withdraw amount can't be negative or zero")
  })

  it("should throw error given a zero amount", function () {
    expect(() => withdraw(accountId, 0))
      .throw("Withdraw amount can't be negative or zero")
  })

  it("should throw error given the withdraw amount more than balance", function () {
    expect(() => withdraw(accountId, INIT_BALANCE + 1))
      .throw("Withdraw amount can't be more than balance")
  })
})

describe("#transfer()", function () {
  const INIT_BALANCE = 20;
  let fromAccountId;
  let toAccountId;

  beforeEach(function () {
    fromAccountId = createAccount("Bob", INIT_BALANCE).id
    toAccountId = createAccount("Alice", INIT_BALANCE).id
  });

  it("should transfer money to another bank account and save transaction history", function () {
    transfer(fromAccountId, toAccountId, 5)

    let fromAccount = findAccountById(fromAccountId);
    let toAccount = findAccountById(toAccountId);
    let fromAccountTransactions = findAllTransactionsByAccountId(fromAccountId);
    let toAccountTransactions = findAllTransactionsByAccountId(toAccountId);

    expect(fromAccount.balance).to.equal(INIT_BALANCE - 5)
    expect(toAccount.balance).to.equal(INIT_BALANCE + 5)
    expect(fromAccountTransactions).to.deep.equal([{
      timestamp: Date.now.returnValues[0],
      accountId: fromAccountId,
      amount: -5,
      message: "Transfer to Alice"
    }])
    expect(toAccountTransactions).to.deep.equal([{
      timestamp: Date.now.returnValues[1],
      accountId: toAccountId,
      amount: 5,
      message: "Receive from Bob"
    }])
  })

  it("should throw error given a negative amount", function () {
    expect(() => transfer(fromAccountId, toAccountId, -5))
      .throw("Transfer amount can't be negative or zero")
  })

  it("should throw error given the transfer amount more than balance", function () {
    expect(() => transfer(fromAccountId, toAccountId, INIT_BALANCE + 1))
      .throw("Transfer amount can't be more than balance")
  })

  it("should throw error given fromAccountId equals to toAccountId", function () {
    expect(() => transfer(fromAccountId, fromAccountId, 1))
      .throw("Can't transfer money to the same account")
  })
})

describe("#findAllTransactionsByAccountId()", function () {
  let bobAccountId;
  let aliceAccountId;

  beforeEach(function () {
    bobAccountId = createAccount("Bob", 0).id
    aliceAccountId = createAccount("Alice", 0).id
  });

  it("should return empty array if no transactions", function () {
    let bobTransactions = findAllTransactionsByAccountId(bobAccountId);
    expect(bobTransactions).to.be.an('array').that.is.empty
  })

  it("should find all transactions by account id", function () {
    deposit(bobAccountId, 10)
    deposit(aliceAccountId, 10)
    withdraw(bobAccountId, 5)
    transfer(aliceAccountId, bobAccountId, 5)

    let bobTransactions = findAllTransactionsByAccountId(bobAccountId);
    let aliceTransactions = findAllTransactionsByAccountId(aliceAccountId);

    expect(bobTransactions).to.deep.equal([
      {
        timestamp: Date.now.returnValues[0],
        accountId: bobAccountId,
        amount: 10,
        message: "deposit"
      },
      {
        timestamp: Date.now.returnValues[2],
        accountId: bobAccountId,
        amount: -5,
        message: "withdraw"
      },
      {
        timestamp: Date.now.returnValues[4],
        accountId: bobAccountId,
        amount: 5,
        message: "Receive from Alice"
      }
    ])
    expect(aliceTransactions).to.deep.equal([
      {
        timestamp: Date.now.returnValues[1],
        accountId: aliceAccountId,
        amount: 10,
        message: "deposit"
      },
      {
        timestamp: Date.now.returnValues[3],
        accountId: aliceAccountId,
        amount: -5,
        message: "Transfer to Bob"
      }
    ])
  })
})
