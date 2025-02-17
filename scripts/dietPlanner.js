// Diet Planner (App 2)
export function render() {
  return `
    <h2>Diet Planner</h2>
    <div class="form-group">
      <input type="text" id="food-name" placeholder="Food name">
      <input type="number" id="food-amount" placeholder="Amount (g)">
      <button id="log-food">Log Food</button>
    </div>
    <div id="food-log"></div>
  `;
}

export function init() {
  const foodLog = JSON.parse(localStorage.getItem('petDietLog')) || [];
  const logFoodBtn = document.getElementById('log-food');

  logFoodBtn.addEventListener('click', () => {
    const foodName = document.getElementById('food-name').value;
    const amount = document.getElementById('food-amount').value;
    foodLog.push({ foodName, amount, date: new Date().toISOString() });
    localStorage.setItem('petDietLog', JSON.stringify(foodLog));
    updateLogDisplay();
  });

  function updateLogDisplay() {
    const logDiv = document.getElementById('food-log');
    logDiv.innerHTML = foodLog.map(entry => 
      `<p>${entry.date}: ${entry.foodName} (${entry.amount}g)</p>`
    ).join('');
  }

  updateLogDisplay();
}
