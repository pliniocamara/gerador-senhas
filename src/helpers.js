// Conjuntos de caracteres que podem ser usados para gerar a senha
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SPECIAL_CHARS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

// Função de alta ordem que encapsula a lógica de questionar o usuário e processar a resposta
function askQuestion(rl, question, transformFunc) {
    return new Promise((resolve) => {
        rl.question(question, (response) => {
            resolve(transformFunc(response));
        });
    });
}

// Captura o input do usuário para gerar senha
function getUserInput(rl, generatePassword, askToSavePassword, savePasswordToFile) {
    askQuestion(rl, 'Qual o comprimento da senha? ', String).then((length) => {
        askQuestion(rl, 'Deseja incluir letras maiúsculas? (s/n) ', response => response.toLowerCase()).then((includeUppercase) => {
            askQuestion(rl, 'Deseja incluir letras minúsculas? (s/n) ', response => response.toLowerCase()).then((includeLowercase) => {
                askQuestion(rl, 'Deseja incluir números? (s/n) ', response => response.toLowerCase()).then((includeNumbers) => {
                    askQuestion(rl, 'Deseja incluir caracteres especiais? (s/n) ', response => response.toLowerCase()).then((includeSpecialChars) => {

                        let characters = '';
                        if (includeUppercase === 's') characters += UPPERCASE_CHARS;
                        if (includeLowercase === 's') characters += LOWERCASE_CHARS;
                        if (includeNumbers === 's') characters += NUMBER_CHARS;
                        if (includeSpecialChars === 's') characters += SPECIAL_CHARS;

                        if (characters.length === 0) {
                            console.log("Você precisa selecionar pelo menos uma categoria de caracteres para gerar uma senha. Tente novamente.");
                            getUserInput();  // Reinicia o processo de coleta de opções
                            return;
                        }

                        const password = generatePassword(
                            parseInt(length),
                            includeUppercase,
                            includeLowercase,
                            includeNumbers,
                            includeSpecialChars
                        );
                        
                        console.log(`Sua senha gerada é: ${password}`);
                        askToSavePassword(rl, savePasswordToFile, password);
                    });
                });
            });
        });
    });
}

// Função para validar a senha e depois chamar a função de continuação para decidir os próximos passos
function validateAndContinue(rl, validatePassword, password, includeUppercase, includeLowercase, includeNumbers, includeSpecialChars, continuationFunction, savePasswordToFile) {
    const isValid = validatePassword(password, includeUppercase, includeLowercase, includeNumbers, includeSpecialChars);
    continuationFunction(rl, isValid, password, savePasswordToFile);
}

// Função para perguntar ao usuário se ele deseja salvar a senha em um arquivo
function askToSavePassword(rl, savePasswordToFile, password) {
    askQuestion(rl, 'Deseja salvar a senha em um arquivo? (s/n) ', response => response.toLowerCase()).then(response => {
        if (response === 's') {
            savePasswordToFile(password).then(() => {
                console.log("Senha salva com sucesso!");
                rl.close();
            }).catch(err => {
                console.log("Ocorreu um erro ao salvar a senha:", err);
                rl.close();
            });
        } else {
            console.log("Ok, não salvaremos a senha.");
            rl.close();
        }
    });
}

// Função de continuação que decide o que fazer após a validação da senha
function postValidationContinuation(rl, isValid, password, savePasswordToFile) {
    if (isValid) {
        console.log("Senha válida!");
        askToSavePassword(rl, savePasswordToFile, password);
    } else {
        console.log("Senha inválida!");
        rl.close();
    }
}

module.exports = {
    askQuestion,
    getUserInput,
    validateAndContinue,
    askToSavePassword,
    postValidationContinuation,
    UPPERCASE_CHARS,
    LOWERCASE_CHARS,
    NUMBER_CHARS,
    SPECIAL_CHARS
};
