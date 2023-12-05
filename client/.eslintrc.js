module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },

    parser: "vue-eslint-parser",
    "extends": "eslint:recommended",
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
        ecmaVersion: 2018,
        sourceType: 'module' 
    },
  };