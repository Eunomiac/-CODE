module.exports = {
    // parser: "@babel/eslint-parser",
    env: {
        es6: true,
        browser: true,
        commonjs: true,
        jest: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "eslint-config-prettier"
        // "airbnb",

        /*
         * "prettier",
         * "plugin:prettier/recommended",
         * "prettier/@typescript-eslint",
         */
        /* "prettier/babel",
        "prettier/flowtype",
        "prettier/react",
        "prettier/standard",
        "prettier/unicorn",
        "prettier/vue" */
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        allowImportExportEverywhere: false,
        codeFrame: false,
        ecmaFeatures: {
            jsx: false,
            impliedStrict: true
        }
    },
    rules: {
        "accessor-pairs": ["warn"],
        "array-callback-return": "warn",
        /*
         * "babel/no-unused-expressions": 1,
         * "babel/object-curly-spacing": 1,
         * "babel/quotes": 1,
         */
        "block-scoped-var": "warn",
        "class-methods-use-this": "warn",
        "consistent-return": "warn",
        "comma-dangle": ["warn", "never"],
        curly: "warn",
        "default-case": "warn",
        // "dot-location": ["warn", "object"],
        "dot-notation": ["warn", {allowKeywords: false}],
        eqeqeq: ["warn", "always"],
        "function-paren-newline": "warn",
        indent: [
            "warn",
            4,
            {
                SwitchCase: 1,

                /*
                 * "VariableDeclarator": 1,
                 * "outerIIFEBody": 1,
                 * "MemberExpression": 1,
                 */
                FunctionDeclaration: {
                    parameters: "first"
                    // body: 1
                },
                FunctionExpression: {
                    parameters: "first"
                    // body: 1
                },
                CallExpression: {
                    arguments: "first"
                },
                ArrayExpression: "first",
                ObjectExpression: "first",
                ImportDeclaration: "first",
                flatTernaryExpressions: true
                // "ignoreComments": false
            }
        ],
        "linebreak-style": ["warn", "windows"],
        "lines-between-class-members": 0,
        "max-classes-per-file": 0,
        "max-len": 0,
        "no-console": 0,
        "no-constant-condition": ["warn", {checkLoops: false}],
        "no-continue": 0,
        "no-debugger": "warn",
        "no-else-return": "off",
        "no-empty-function": "warn",
        "no-eq-null": "warn",
        "no-eval": "warn",
        "no-extra-bind": "warn",

        /*
         * "no-extra-parens": ["warn", "all", { "conditionalAssign": false }],
         * "no-floating-decimal": "warn",
         */
        "no-implicit-coercion": "warn",
        "no-implicit-globals": "warn",
        "no-implied-eval": "warn",
        "no-invalid-this": "off",
        "babel/no-invalid-this": "off",
        "no-iterator": "warn",
        "no-labels": "warn",
        "no-lone-blocks": "warn",
        "no-lonely-if": 0,
        "no-loop-func": "warn",

        /*
         * "no-mixed-spaces-and-tabs": [
         *     "warn",
         *     "smart-tabs"
         * ],
         * "no-multi-spaces": "warn",
         */
        "no-multi-str": "warn",
        "no-multiple-empty-lines": "warn",
        "no-new": "warn",
        "no-param-reassign": 0,
        "no-plusplus": 0,
        "no-restricted-syntax": 0,
        "no-restricted-globals": 0,
        "no-tabs": ["warn", {allowIndentationTabs: true}],
        "no-template-curly-in-string": "warn",
        "no-trailing-spaces": "warn",
        "no-underscore-dangle": 0,
        "no-unreachable": 0,
        "no-unused-vars": 0, // "warn",
        "no-use-before-define": 0,
        "no-useless-computed-key": 0,
        "no-useless-constructor": "warn",
        "no-useless-escape": 0,
        // "no-magic-numbers": ["warn", { "ignoreArrayIndexes": true, "ignore": [0, 1], "enforceConst": true } ],
        "no-void": 0,
        "nonblock-statement-body-position": ["warn", "below"],
        "object-curly-newline": 0,
        "object-curly-spacing": ["warn", "never"],
        "one-var": ["warn", {var: "always", let: "consecutive", const: "never"}],
        "one-var-declaration-per-line": 0,
        "operator-linebreak": ["warn", "before"],
        "padded-blocks": 0,
        "prefer-arrow-callback": "warn",
        "prefer-const": ["warn", {destructuring: "all"}],
        "prefer-destructuring": 0,
        "prefer-object-spread": 0,

        /*
         * "prettier/prettier": 0,
         * "prettier/prettier": "warn",
         */
        quotes: ["warn", "double"],
        /* "babel/quotes": ["warn", "double", {avoidEscape: true, allowTemplateLiterals: false}], */
        radix: 0,
        semi: ["warn", "always", {omitLastInOneLineBlock: true}]
    },
    reportUnusedDisableDirectives: true,
    globals: {
        // START: "readonly",
        // SCRIPTS: "readonly",
        C: "readonly",
        ExaltedMain: "readonly",
        EssenceTracker: "readonly",
        TurnTracker: "readonly",
        // D: "readonly",
        // Listener: "readonly",
        // Char: "readonly",
        // Chat: "readonly",
        // Assets: "readonly",
        // Media: "readonly",
        // DragPads: "readonly",
        // Handouts: "readonly",
        // Roller: "readonly",
        // Complications: "readonly",
        // Locations: "readonly",
        // Session: "readonly",
        // Player: "readonly",
        // Fuzzy: "readonly",
        // Tester: "readonly",
        // TimeTracker: "readonly",
        // Soundscape: "readonly",
        // InitCommands: "readonly",
        _: "readonly",
        state: "writable",
        getAttrs: "readonly",
        setAttrs: "readonly",
        getSectionIDs: "readonly",
        getObj: "readonly",
        findObjs: "readonly",
        filterObjs: "readonly",
        getAllObjs: "readonly",
        getAttrByName: "readonly",
        removeRepeatingRow: "readonly",
        Campaign: "readonly",
        playerIsGM: "readonly",
        on: "readonly",
        log: "readonly",
        createObj: "readonly",
        console: "readonly",
        spawnFxWithDefinition: "readonly",
        sendChat: "readonly",
        toBack: "readonly",
        toFront: "readonly",
        randomInteger: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        getGMID: "readonly",
        sendChatMessage: "readonly",
        processStack: "readonly",
        arguments: "writable",
        generateRowID: "readonly",
        MarkStart: "readonly",
        MarkStop: "readonly",
        RandStr: "readonly",
        AlertFlag: "readonly"
    },
    plugins: [] // plugins: ["babel", "prettier"]
};