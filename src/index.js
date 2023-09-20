const readline = require('readline');
const fs = require('fs');
const { askQuestion, getUserInput, validateAndContinue, askToSavePassword, postValidationContinuation } = require('./helpers');
const { UPPERCASE_CHARS, LOWERCASE_CHARS, NUMBER_CHARS, SPECIAL_CHARS } = require('./helpers');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função que gera uma senha com base nos critérios fornecidos
function generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecialChars) {
    let characters = '';
    if (includeUppercase === 's') characters += UPPERCASE_CHARS;
    if (includeLowercase === 's') characters += LOWERCASE_CHARS;
    if (includeNumbers === 's') characters += NUMBER_CHARS;
    if (includeSpecialChars === 's') characters += SPECIAL_CHARS;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
}

// Função para validar a senha
function validatePassword(password, includeUppercase, includeLowercase, includeNumbers, includeSpecialChars) {
    function containsCharsFromSet(charSet) {
        return password.split('').filter(char => charSet.includes(char)).length > 0;
    }

    if (includeUppercase === 's' && !containsCharsFromSet(UPPERCASE_CHARS)) return false;
    if (includeUppercase === 'n' && containsCharsFromSet(UPPERCASE_CHARS)) return false;

    if (includeLowercase === 's' && !containsCharsFromSet(LOWERCASE_CHARS)) return false;
    if (includeLowercase === 'n' && containsCharsFromSet(LOWERCASE_CHARS)) return false;

    if (includeNumbers === 's' && !containsCharsFromSet(NUMBER_CHARS)) return false;
    if (includeNumbers === 'n' && containsCharsFromSet(NUMBER_CHARS)) return false;

    if (includeSpecialChars === 's' && !containsCharsFromSet(SPECIAL_CHARS)) return false;
    if (includeSpecialChars === 'n' && containsCharsFromSet(SPECIAL_CHARS)) return false;

    return true;
}

// Função para salvar a senha fornecida em um arquivo
function savePasswordToFile(password) {
    return new Promise((resolve, reject) => {
        fs.writeFile('password.txt', password, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function init() {
    rl.question('Você deseja gerar uma nova senha ou validar uma existente? (gerar/validar) ', action => {
        if (action === 'gerar') {
            getUserInput(rl, generatePassword, askToSavePassword, savePasswordToFile);
        } else if (action === 'validar') {
            rl.question('Digite a senha que deseja validar: ', password => {
                askQuestion(rl, 'A senha deve incluir letras maiúsculas? (s/n) ', response => response.toLowerCase()).then(includeUppercase => {
                    askQuestion(rl, 'A senha deve incluir letras minúsculas? (s/n) ', response => response.toLowerCase()).then(includeLowercase => {
                        askQuestion(rl, 'A senha deve incluir números? (s/n) ', response => response.toLowerCase()).then(includeNumbers => {
                            askQuestion(rl, 'A senha deve incluir caracteres especiais? (s/n) ', response => response.toLowerCase()).then(includeSpecialChars => {
                                validateAndContinue(rl, validatePassword, password, includeUppercase, includeLowercase, includeNumbers, includeSpecialChars, postValidationContinuation, savePasswordToFile);
                            });
                        });
                    });
                });
            });
        } else {
            console.log("Opção inválida. Por favor, escolha 'gerar' ou 'validar'.");
            rl.close();
        }
    });
}

if (require.main === module) {
    init();
}

module.exports = {
    generatePassword: generatePassword,
    validatePassword: validatePassword,
    savePasswordToFile: savePasswordToFile,
    init: init
};