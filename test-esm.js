import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const dom = new JSDOM(htmlContent, {
  url: 'http://localhost:8080/',
  contentType: 'text/html',
});

// Setup globals safely
const safeDefine = (key, value) => {
  try {
    Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
  } catch (e) {
    globalThis[key] = value;
  }
};

safeDefine('window', dom.window);
safeDefine('document', dom.window.document);
safeDefine('localStorage', dom.window.localStorage);
safeDefine('navigator', dom.window.navigator);
safeDefine('HTMLElement', dom.window.HTMLElement);
safeDefine('customElements', dom.window.customElements);
safeDefine('Event', dom.window.Event);

console.log('Attempting to import app.js...');
import('./assets/js/app.js')
  .then(() => {
    console.log('Successfully imported app.js without errors!');
    
    // Simulate DOMContentLoaded event to trigger init
    const event = new dom.window.Event('DOMContentLoaded');
    dom.window.document.dispatchEvent(event);

    // Check if the DOM got populated
    const challengesContainer = document.getElementById('challenges-container');
    console.log('Challenges count:', challengesContainer ? challengesContainer.children.length : 'null');
    
    const mapsContainer = document.getElementById('maps-container');
    console.log('Maps count:', mapsContainer ? mapsContainer.children.length : 'null');
    
    const calendarContainer = document.getElementById('calendar-container');
    console.log('Calendar count:', calendarContainer ? calendarContainer.children.length : 'null');
  })
  .catch((err) => {
    console.error('Failed to import app.js:', err);
  });
