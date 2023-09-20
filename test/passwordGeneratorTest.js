const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;

const {
    generatePassword,
    validatePassword,
    savePasswordToFile,
    init
} = require('../src/index');

describe('Password Generator', function() {
    it('should generate a password of the specified length', function() {
        const password = generatePassword(10, 's', 's', 's', 's');
        expect(password.length).to.equal(10);
    });
});

describe('Password Validator', function() {

    it('should validate password with uppercase when uppercase is required', function() {
        const result = validatePassword('QWEHFUSDNVQASQ', 's', 'n', 'n', 'n');
        assert.equal(result, true);
    });

    it('should not validate password with lowercase when lowercase is not required', function() {
        const result = validatePassword('ABCabc123!', 's', 'n', 's', 's');
        assert.equal(result, false);
    });

    it('should validate password with numbers when numbers are required', function() {
        const result = validatePassword('0123456789', 'n', 'n', 's', 'n');
        assert.equal(result, true);
    });

    it('should not validate password without special chars when they are required', function() {
        const result = validatePassword('ABCabc123', 's', 's', 's', 's');
        assert.equal(result, false);
    });

});

describe('Password Generator Function', function() {

    function containsAtLeastOneCharFromSet(password, charSet) {
        for (let i = 0; i < password.length; i++) {
            if (charSet.includes(password[i])) {
                return true;
            }
        }
        return false;
    }

    it('should generate a password with all criteria activated', function() {
        const password = generatePassword(10, 's', 's', 's', 's');
        assert.strictEqual(containsAtLeastOneCharFromSet(password, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), true, 'Contains uppercase');
        assert.strictEqual(containsAtLeastOneCharFromSet(password, 'abcdefghijklmnopqrstuvwxyz'), true, 'Contains lowercase');
        assert.strictEqual(containsAtLeastOneCharFromSet(password, '0123456789'), true, 'Contains numbers');
        assert.strictEqual(containsAtLeastOneCharFromSet(password, '!@#$%^&*()-_=+[]{}|;:,.<>?'), true, 'Contains special characters');
    });

    it('should generate a password with only uppercase', function() {
        const password = generatePassword(10, 's', 'n', 'n', 'n');
        assert.strictEqual(containsAtLeastOneCharFromSet(password, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') && password.length === 10, true, 'Only contains uppercase');
    });

    it('should generate a password with only lowercase', function() {
        const password = generatePassword(10, 'n', 's', 'n', 'n');
        assert.strictEqual(containsAtLeastOneCharFromSet(password, 'abcdefghijklmnopqrstuvwxyz') && password.length === 10, true, 'Only contains lowercase');
    });

    it('should generate a password with only numbers', function() {
        const password = generatePassword(10, 'n', 'n', 's', 'n');
        assert.strictEqual(containsAtLeastOneCharFromSet(password, '0123456789') && password.length === 10, true, 'Only contains numbers');
    });

    it('should generate a password with only special characters', function() {
        const password = generatePassword(10, 'n', 'n', 'n', 's');
        assert.strictEqual(containsAtLeastOneCharFromSet(password, '!@#$%^&*()-_=+[]{}|;:,.<>?') && password.length === 10, true, 'Only contains special characters');
    });

    it('should not generate a password when no criteria are activated', function() {
        const password = generatePassword(10, 'n', 'n', 'n', 'n');
        assert.strictEqual(password, 'undefinedundefinedundefinedundefinedundefinedundefinedundefinedundefinedundefinedundefined', 'Password is as expected');
    });

});

const sinon = require('sinon');
const fs = require('fs');

describe('Utility Functions', function() {
    
    const assert = chai.assert;

    afterEach(function() {
        // Limpe todas as simulações após cada teste
        sinon.restore();
    });

    it('should save password to a file', function(done) {
        // Simula a função writeFile para que ela não crie um arquivo real
        sinon.stub(fs, 'writeFile').callsFake((path, data, cb) => {
            cb(null);  // Simula um callback bem-sucedido
        });

        savePasswordToFile('testPassword').then(() => {
            // Verifica se writeFile foi chamada com os argumentos corretos
            assert.isTrue(fs.writeFile.calledWith('password.txt', 'testPassword'));
            done();  // Indica que o teste assíncrono está concluído
        }).catch(err => {
            done(err);  // Indica que o teste assíncrono falhou
        });
    });

});