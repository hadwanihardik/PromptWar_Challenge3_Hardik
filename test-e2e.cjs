const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const virtualConsole = new VirtualConsole();
virtualConsole.on('error', (...args) => console.error('JSDOM Error:', ...args));
virtualConsole.on('warn', (...args) => console.warn('JSDOM Warn:', ...args));
virtualConsole.on('log', (...args) => console.log('JSDOM Log:', ...args));

const dom = new JSDOM(htmlContent, {
  url: 'http://localhost:8080/',
  referrer: 'http://localhost:8080/',
  contentType: 'text/html',
  runScripts: 'dangerously',
  resources: 'usable',
  virtualConsole
});

const { window } = dom;

// Wait for DOM to load
setTimeout(() => {
  try {
    console.log('\n--- SIMULATING APP USAGE ---');
    
    // Check initial state
    const homeActive = window.document.getElementById('home').classList.contains('section--active');
    console.log('Is Home active on start?', homeActive);

    // Let's check if challenges loaded
    const challengesContainer = window.document.getElementById('challenges-container');
    console.log('Challenges loaded:', challengesContainer.children.length > 0 ? 'YES' : 'NO', `(Count: ${challengesContainer.children.length})`);

    // Let's check maps
    const mapsContainer = window.document.getElementById('maps-container');
    console.log('Maps loaded:', mapsContainer.children.length > 0 ? 'YES' : 'NO', `(Count: ${mapsContainer.children.length})`);

    // Let's check calendar
    const calendarContainer = window.document.getElementById('calendar-container');
    console.log('Calendar loaded:', calendarContainer.children.length > 0 ? 'YES' : 'NO', `(Count: ${calendarContainer.children.length})`);

    // Let's check dashboard container initially
    const dashContainer = window.document.getElementById('dashboard-container');
    console.log('Dashboard initial text:', dashContainer.textContent.trim());

    // Let's fill out the calculator and submit it
    console.log('\n--- Submitting Calculator Form ---');
    const form = window.document.getElementById('calc-form');
    
    // Set some input values
    window.document.getElementById('dailyDistanceKm').value = '15';
    window.document.getElementById('vehicleType').value = 'carDiesel';
    window.document.getElementById('monthlyKwh').value = '300';
    window.document.getElementById('newClothingItemsPerMonth').value = '3';
    
    // Dispatch submit event
    const submitEvent = new window.Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    // Let's see if we navigated to dashboard
    const dashActive = window.document.getElementById('dashboard').classList.contains('section--active');
    console.log('Is Dashboard active after submit?', dashActive);
    console.log('Dashboard text after submit:', dashContainer.textContent.trim().substring(0, 200) + '...');

    // Check recommendations container
    const recsContainer = window.document.getElementById('recommendations-container');
    console.log('Recommendations loaded after submit:', recsContainer.children.length > 0 ? 'YES' : 'NO', `(Count: ${recsContainer.children.length})`);
    console.log('Recommendations content:', recsContainer.innerHTML.trim().substring(0, 200) + '...');

  } catch (err) {
    console.error('Failure in simulation:', err);
  }
}, 2000);
