function createTransaction(amount, message) {
  return {
    timestamp: Date.now(),
    amount,
    message
  }
}

class BankAccount {
  constructor(name, balance) {
    this.name = name
    this.balance = balance
    this.transactions = []
  }

  deposit(amount, message = "deposit") {
    if (amount <= 0) {
      throw new RangeError("Deposit amount can't be negative or zero")
    }

    this.balance += amount
    this.transactions.push(createTransaction(amount, message))
  }

  withdraw(amount, message = "withdraw") {
    if (amount <= 0) {
      throw new RangeError("Withdraw amount can't be negative or zero")
    }

    if (amount > this.balance) {
      throw new RangeError("Withdraw amount can't be more than balance")
    }

    this.balance -= amount
    this.transactions.push(createTransaction(-amount, message))
  }

  transfer(otherAccount, amount) {
    this.withdraw(amount, `Transfer to ${otherAccount.name}`)
    otherAccount.deposit(amount, `Receive from ${this.name}`)
  }
}

module.exports = {
  BankAccount
}

