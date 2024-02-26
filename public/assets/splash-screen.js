var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
var splashScreen = document.getElementById('splash-screen');

// set ink.background-secondary
if (isDark) {
  // background-secondary (_dark)
  splashScreen.style.backgroundColor = '#12100F';
} else {
  // background-secondary (base)
  splashScreen.style.backgroundColor = '#F5F1ED';
}
