"use strict";

// IndexedDB setup for storing expense logs
let db;
const request = indexedDB.open('PetExpenseTracker', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const expenseStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
  expenseStore.createIndex('category', 'category', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayExpenses();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add new expense
function addExpense(category, amount, date) {
  const transaction = db.transaction(['expenses'], 'readwrite');
  const store = transaction.objectStore('expenses');
  store.add({ category, amount, date });

  transaction.oncomplete = function() {
    displayExpenses();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display all expenses
function displayExpenses() {
  const transaction = db.transaction(['expenses'], 'readonly');
  const store = transaction.objectStore('expenses');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const expenses = event.target.result;
    const expenseContainer = document.getElementById('expenseContainer');
    expenseContainer.innerHTML = '';

    expenses.forEach(expense => {
      const expenseItem = document.createElement('div');
      expenseItem.className = 'expense-item';
      expenseItem.innerHTML = `
        <p>Category: ${expense.category}</p>
        <p>Amount: ${expense.amount}</p>
        <p>Date: ${expense.date}</p>
      `;
      expenseContainer.appendChild(expenseItem);
    });

    visualizeSpendingTrends(expenses);
  };
}

// Visualize spending trends
function visualizeSpendingTrends(expenses) {
  const ctx = document.getElementById('spendingChart').getContext('2d');
  const labels = expenses.map(expense => expense.date);
  const data = expenses.map(expense => expense.amount);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Spending',
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Set monthly budget using localStorage
function setMonthlyBudget(amount) {
  localStorage.setItem('monthlyBudget', amount);
  displayBudget();
}

// Display monthly budget
function displayBudget() {
  const budget = localStorage.getItem('monthlyBudget');
  const budgetContainer = document.getElementById('budgetContainer');
  budgetContainer.innerHTML = `Monthly Budget: ${budget}`;
}

// Add event listeners for form submissions
document.getElementById('expenseForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const category = document.getElementById('category').value;
  const amount = document.getElementById('amount').value;
  const date = document.getElementById('date').value;

  addExpense(category, amount, date);
});

document.getElementById('budgetForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const amount = document.getElementById('budgetAmount').value;

  setMonthlyBudget(amount);
});

// Initialize display
window.onload = function() {
  displayExpenses();
  displayBudget();
};
