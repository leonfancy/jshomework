const crypto = require('crypto')

const db = {
  accounts: [],
  transactions: [],
}

function findAccountById(id) {
  let account = db.accounts.find(account => account.id === id);
  if (!account) {
    throw new Error("Account not found")
  }
  return account
}

function findAllTransactionsByAccountId(accountId) {
  return db.transactions.filter(transaction => transaction.accountId === accountId)
}

function createTransaction(accountId, amount, message) {
  let transaction = {timestamp: Date.now(), accountId, amount, message}
  db.transactions.push(transaction)
  return transaction
}

function createAccount(name, balance) {
  if (balance < 0) {
    throw new RangeError("Account initial balance can't be negative")
  }

  name = name && name.trim()

  if (!name || !/^[A-Za-z ]{1,20}$/.test(name)) {
    throw new Error("Account name must be 1 ~ 20 length string with alphabet and space character")
  }

  let id = crypto.randomUUID()
  let account = {id, name, balance}
  db.accounts.push(account)
  return account
}

function deposit(accountId, amount) {
  let account = findAccountById(accountId)

  if (amount <= 0) {
    throw new RangeError("Deposit amount can't be negative or zero")
  }

  account.balance += amount
  createTransaction(accountId, amount, "deposit")
}

function withdraw(accountId, amount) {
  let account = findAccountById(accountId)

  if (amount <= 0) {
    throw new RangeError("Withdraw amount can't be negative or zero")
  }

  if (amount > account.balance) {
    throw new RangeError("Withdraw amount can't be more than balance")
  }

  account.balance -= amount
  createTransaction(accountId, -amount, "withdraw")
}

function transfer(fromAccountId, toAccountId, amount) {
  if (fromAccountId === toAccountId) {
    throw new Error("Can't transfer money to the same account")
  }
  if (amount <= 0) {
    throw new RangeError("Transfer amount can't be negative or zero")
  }

  let fromAccount = findAccountById(fromAccountId)

  if (amount > fromAccount.balance) {
    throw new RangeError("Transfer amount can't be more than balance")
  }

  let toAccount = findAccountById(toAccountId)

  fromAccount.balance -= amount
  toAccount.balance += amount

  createTransaction(fromAccountId, -amount, `Transfer to ${toAccount.name}`)
  createTransaction(toAccountId, amount, `Receive from ${fromAccount.name}`)
}

module.exports = {
  db,
  findAccountById,
  findAllTransactionsByAccountId,
  createAccount,
  deposit,
  withdraw,
  transfer
}
