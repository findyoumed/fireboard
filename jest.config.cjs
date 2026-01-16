module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^https://www.gstatic.com/firebasejs/10.7.1/(.*).js$': '<rootDir>/tests/__mocks__/firebase.js',
        '^\\./firebase-init.js$': '<rootDir>/tests/__mocks__/firebase.js'
    }
};
