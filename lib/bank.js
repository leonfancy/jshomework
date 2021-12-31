const {randomUUID} = require('crypto')

const db = {
  accounts: [],
  transactions: [],
}

function findAccountById(id) {
  return db.accounts.find(account => account.id === id)
}

function findAllTransactionsByAccountId(accountId) {
  return db.transactions.filter(transaction => transaction.accountId === accountId)
}

function createTransaction(accountId, amount, message) {
  let transaction = {timestamp: Date.now(), accountId, amount, message}
  db.accounts.push(transaction)
  return transaction
}

function createAccount(name, balance) {
  if (balance < 0) {
    throw new RangeError("Account initial balance can't be negative")
  }

  let id = randomUUID()
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

  createTransaction(fromAccount, -amount, `Transfer to ${toAccount.name}`)
  createTransaction(toAccount, amount, `Receive from ${fromAccount.name}`)
}
