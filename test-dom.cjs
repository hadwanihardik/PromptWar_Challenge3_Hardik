const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const htmlPath = path.join(__dirname, 'index.html');
console.log('Loading HTML from:', htmlPath);
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

// Wait a bit for scripts to load and execute
setTimeout(() => {
  console.log('DOM Content Loaded/Executed. checking body...');
  console.log('Document title:', dom.window.document.title);
  
  // Let's click the navigation links and see if they switch or crash
  const navLinks = dom.window.document.querySelectorAll('.nav__link');
  console.log('Found nav links:', navLinks.length);
  navLinks.forEach(link => {
    console.log('Nav Link:', link.textContent, 'href:', link.getAttribute('href'));
  });

  const sections = dom.window.document.querySelectorAll('.section');
  console.log('Found sections:', sections.length);
  sections.forEach(sec => {
    console.log('Section id:', sec.id, 'active:', sec.classList.contains('section--active'));
  });

}, 2000);
