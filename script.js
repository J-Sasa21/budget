// Class representing the budget tracker
class Budget {
  // Constructor initializes the budget by fetching data from local storage and updating the budget
  constructor() {
    // Retrieve income and expenses from local storage or initialize as empty arrays
    this.income = JSON.parse(localStorage.getItem("income")) || [];
    this.expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    // Update the budget summary
    this.updateBudget();
  }

  // Method to add income to the budget
  addIncome(description, amount) {
    // Check if description and amount are valid
    if (description && amount > 0) {
      // Add new income entry to the income array
      this.income.push({ id: Date.now(), description, amount });
      // Save data to local storage and update the budget summary
      this.saveData();
      this.updateBudget();
    } else {
      // Alert the user if inputs are invalid
      alert("Please enter a valid description and amount for income.");
    }
  }

  // Method to add expense to the budget
  addExpense(description, amount) {
    // Check if description and amount are valid
    if (description && amount > 0) {
      // Add new expense entry to the expenses array
      this.expenses.push({ id: Date.now(), description, amount });
      // Save data to local storage and update the budget summary
      this.saveData();
      this.updateBudget();
    } else {
      // Alert the user if inputs are invalid
      alert("Please enter a valid description and amount for expense.");
    }
  }

  // Method to edit an income or expense item
  editItem(type, id, newDescription, newAmount) {
    // Determine the array to edit based on type (income or expense)
    const items = type === "income" ? this.income : this.expenses;
    // Find the index of the item to edit
    const itemIndex = items.findIndex((item) => item.id === id);
    // Check if inputs are valid and item exists
    if (itemIndex > -1 && newDescription && newAmount > 0) {
      // Update description and amount of the item
      items[itemIndex].description = newDescription;
      items[itemIndex].amount = newAmount;
      // Save data to local storage and update the budget summary
      this.saveData();
      this.updateBudget();
    } else {
      // Alert the user if inputs are invalid
      alert("Please enter valid description and amount.");
    }
  }

  // Method to delete an income or expense item
  deleteItem(type, id) {
    // Determine the array to delete from based on type (income or expense)
    if (type === "income") {
      // Filter out the item with the specified id from income array
      this.income = this.income.filter((item) => item.id !== id);
    } else {
      // Filter out the item with the specified id from expenses array
      this.expenses = this.expenses.filter((item) => item.id !== id);
    }
    // Save data to local storage and update the budget summary
    this.saveData();
    this.updateBudget();
  }

  // Method to calculate total income
  getTotalIncome() {
    return this.income.reduce((total, item) => total + item.amount, 0);
  }

  // Method to calculate total expenses
  getTotalExpenses() {
    return this.expenses.reduce((total, item) => total + item.amount, 0);
  }

  // Method to calculate total budget (income - expenses)
  getTotalBudget() {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  // Method to save income and expenses data to local storage
  saveData() {
    localStorage.setItem("income", JSON.stringify(this.income));
    localStorage.setItem("expenses", JSON.stringify(this.expenses));
  }

  // Method to update the budget summary displayed on the webpage
  updateBudget() {
    document.getElementById(
      "total-income"
    ).innerText = `Total Income: $${this.getTotalIncome().toFixed(2)}`;
    document.getElementById(
      "total-expense"
    ).innerText = `Total Expense: $${this.getTotalExpenses().toFixed(2)}`;
    document.getElementById(
      "total-budget"
    ).innerText = `Total Budget: $${this.getTotalBudget().toFixed(2)}`;
    this.displayItems("income", this.income);
    this.displayItems("expense", this.expenses);
  }

  // Method to display income or expense items on the webpage
  displayItems(type, items) {
    const listElement = document.getElementById(`${type}-list`);
    listElement.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
              ${item.description}: $${item.amount.toFixed(2)}
              <button class="edit" onclick="editItem('${type}', ${
        item.id
      })">Edit</button>
              <button class="delete" onclick="deleteItem('${type}', ${
        item.id
      })">Delete</button>
          `;
      listElement.appendChild(li);
    });
  }
}

// Create a new instance of the Budget class
const budget = new Budget();

// Event listener for adding income
document.getElementById("add-income").addEventListener("click", () => {
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  budget.addIncome(description, amount);
  clearInputs();
});

// Event listener for adding expense
document.getElementById("add-expense").addEventListener("click", () => {
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  budget.addExpense(description, amount);
  clearInputs();
});

// Function to edit an income or expense item
function editItem(type, id) {
  const newDescription = prompt("Enter new description:");
  const newAmount = parseFloat(prompt("Enter new amount:"));
  budget.editItem(type, id, newDescription, newAmount);
}

// Function to delete an income or expense item
function deleteItem(type, id) {
  if (confirm("Are you sure you want to delete this item?")) {
    budget.deleteItem(type, id);
  }
}

// Function to clear input fields
function clearInputs() {
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
}

// Attach the edit and delete functions to the global window object to be accessible in the inline event handlers
window.editItem = editItem;
window.deleteItem = deleteItem;
