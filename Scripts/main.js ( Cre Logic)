// Dynamically load app scripts based on the selected tab
const appContainer = document.getElementById('app-container');
const tabs = document.querySelectorAll('.tab-btn');

// Load initial app (e.g., Diet Planner)
loadApp('dietPlanner');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    loadApp(tab.dataset.app);
  });
});

async function loadApp(appName) {
  try {
    const appModule = await import(`./${appName}.js`);
    appContainer.innerHTML = appModule.render(); // Each app exposes a render() function
    appModule.init(); // Initialize event listeners and logic
  } catch (err) {
    appContainer.innerHTML = `<p>Error loading ${appName}. Please refresh.</p>`;
  }
}
