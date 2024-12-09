import React, { useState, useEffect } from 'react';

function BankingComponent() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch initial data, e.g., balance and transactions
    fetch('/api/balance')
      .then(response => response.json())
      .then(data => setBalance(data.balance));

    fetch('/api/transactions')
      .then(response => response.json())
      .then(data => setTransactions(data.transactions));
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleDeposit = (amount) => {
    fetch('/api/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    })
      .then(response => response.json())
      .then(data => {
        setBalance(data.balance);
        setTransactions(data.transactions);
      });
  };

  const handleWithdraw = (amount) => {
  fetch('/api/withdraw', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  })
    .then(response => response.json())
    .then(data => {
      setBalance(data.balance);
      setTransactions(data.transactions);
    });
};

  return (
    <div>
      <h1>Banking Site</h1>
      <p>Balance: ${balance}</p>
      <button onClick={() => handleDeposit(100)}>Deposit $100</button>
      <button onClick={() => handleWithdraw(50)}>Withdraw $50</button>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>{transaction}</li>
        ))}
      </ul>
    </div>
  );
}

export default BankingComponent;