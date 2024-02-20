var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
var splashScreen = document.getElementById('splash-screen');

// set accent.background-secondary
if (isDark) {
  // darkModeInk.2
  splashScreen.style.backgroundColor = '#2C2A24';
} else {
  // lightModeInk.3
  splashScreen.style.backgroundColor = '#F5F1ED';
}
