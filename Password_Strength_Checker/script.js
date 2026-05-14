const PasswordChecker = {
    generatedPasswordRaw: '',
    generatedVisible: false,

    init() {
        this.setupPasswordInput();
        this.setupGenerator();
        this.setupVisibilityToggles();
        this.updateLengthDisplay();
    },

    setupPasswordInput() {
        const passwordInput = document.getElementById('passwordInput');
        passwordInput.oninput = () => {
            this.checkPasswordStrength(passwordInput.value);
        };
    },

    setupGenerator() {
        document.getElementById('generateBtn').onclick = () => this.generatePassword();
        document.getElementById('passwordLength').oninput = () => this.updateLengthDisplay();
        
        // Copy generated password
        document.getElementById('generatedPassword').onclick = (e) => {
            const password = e.currentTarget.textContent.trim();
            if (password) {
                navigator.clipboard.writeText(password).then(() => {
                    const original = e.currentTarget.textContent;
                    e.currentTarget.textContent = '✅ Copied to clipboard!';
                    e.currentTarget.style.background = '#d4edda';
                    setTimeout(() => {
                        e.currentTarget.textContent = original;
                        e.currentTarget.style.background = '#f8f9fa';
                    }, 2000);
                });
            }
        };
    },

    setupVisibilityToggles() {
        const input = document.getElementById('passwordInput');
        const toggleInputBtn = document.getElementById('togglePasswordInput');
        const toggleGeneratedBtn = document.getElementById('toggleGeneratedPassword');

        toggleInputBtn.onclick = () => {
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            toggleInputBtn.textContent = show ? 'Hide' : 'Show';
        };

        toggleGeneratedBtn.onclick = () => {
            this.generatedVisible = !this.generatedVisible;
            toggleGeneratedBtn.textContent = this.generatedVisible ? 'Hide' : 'Show';
            this.renderGeneratedPassword();
        };
    },

    renderGeneratedPassword() {
        const generatedDiv = document.getElementById('generatedPassword');
        if (!this.generatedPasswordRaw) {
            generatedDiv.textContent = '';
            return;
        }
        generatedDiv.textContent = this.generatedVisible
            ? this.generatedPasswordRaw
            : '*'.repeat(this.generatedPasswordRaw.length);
    },

    updateLengthDisplay() {
        const length = document.getElementById('passwordLength').value;
        document.getElementById('lengthDisplay').textContent = `${length} characters`;
    },

    // 🔥 ADVANCED PASSWORD STRENGTH CHECKER
    checkPasswordStrength(password) {
        const strengthContainer = document.querySelector('.password-checker');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        const strengthScore = document.getElementById('strengthScore');

        if (!password) {
            strengthContainer.className = 'password-checker';
            strengthFill.style.width = '0%';
            strengthFill.style.background = '';
            strengthText.textContent = 'Enter password...';
            strengthScore.textContent = '';
            return;
        }

        // Advanced scoring algorithm (0-100)
        let score = 0;
        const length = password.length;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*(),.?":{}|<>[\$\\\/]/.test(password);
        const noConsecutive = !/(.)\1{2,}/.test(password);
        const noCommonWords = !/(password|123456|qwerty|admin|letmein|welcome|monkey|dragon)/i.test(password);
        const hasEntropy = password.length > 12 || (hasLower && hasUpper && hasNumbers && hasSymbols);

        // Scoring
        score += Math.min(length * 4, 30);           // Length (max 30)
        score += hasLower ? 12 : 0;                  // Lowercase
        score += hasUpper ? 12 : 0;                  // Uppercase
        score += hasNumbers ? 18 : 0;                // Numbers
        score += hasSymbols ? 18 : 0;                // Symbols
        score += noConsecutive ? 5 : 0;              // No repeats
        score += noCommonWords ? 5 : 0;              // No dictionary words
        score += hasEntropy ? 0 : -10;               // Entropy bonus/penalty

        // Determine strength level
        let level, colorClass;
        if (score < 40) {
            level = 'Very Weak';
            colorClass = 'strength-very-weak';
        } else if (score < 60) {
            level = 'Weak';
            colorClass = 'strength-weak';
        } else if (score < 75) {
            level = 'Fair';
            colorClass = 'strength-fair';
        } else if (score < 90) {
            level = 'Good';
            colorClass = 'strength-good';
        } else {
            level = 'Strong 💪';
            colorClass = 'strength-strong';
        }

        // Update UI
        strengthContainer.className = `password-checker ${colorClass}`;
        strengthText.textContent = level;
        strengthScore.textContent = `Score: ${Math.round(score)}/100`;

        // Show missing requirements
        const requirements = [];
        if (!hasLower) requirements.push('lowercase');
        if (!hasUpper) requirements.push('UPPERCASE');
        if (!hasNumbers) requirements.push('numbers');
        if (!hasSymbols) requirements.push('symbols');
        if (length < 12) requirements.push('12+ chars');
        if (requirements.length > 0) {
            strengthScore.textContent += ` | Needs: ${requirements.join(', ')}`;
        }
    },

    // 🎲 PASSWORD GENERATOR
    generatePassword() {
        const length = parseInt(document.getElementById('passwordLength').value);
        const includeUppercase = document.getElementById('includeUppercase').checked;
        const includeNumbers = document.getElementById('includeNumbers').checked;
        const includeSymbols = document.getElementById('includeSymbols').checked;

        let charset = 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (charset.length === 0) {
            alert('Please select at least one character type!');
            return;
        }

        let password = '';
        const types = [];
        if (includeUppercase) types.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (includeNumbers) types.push('0123456789');
        if (includeSymbols) types.push('!@#$%^&*()_+-=[]{}|;:,.<>?');

        // Ensure at least one of each selected type
        types.forEach(type => {
            password += type.charAt(Math.floor(Math.random() * type.length));
        });

        // Fill remaining length
        for (let i = types.length; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        // Shuffle password
        password = password.split('').sort(() => Math.random() - 0.5).join('');

        // Update UI
        const generatedDiv = document.getElementById('generatedPassword');
        this.generatedPasswordRaw = password;
        this.renderGeneratedPassword();
        generatedDiv.style.cursor = 'pointer';
        generatedDiv.style.background = '#071009';

        // Auto-test the generated password
        setTimeout(() => {
            document.getElementById('passwordInput').value = password;
            this.checkPasswordStrength(password);
        }, 100);
    }
};

document.addEventListener('DOMContentLoaded', () => PasswordChecker.init());
