import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Security Toolkit running at http://localhost:${PORT}`);
  console.log('  - Dashboard: /');
  console.log('  - Hash Generator: /tools/hash-generator');
  console.log('  - Link Scanner: /tools/link-scanner');
  console.log('  - Password Strength Checker: /tools/password-strength-checker');
});
