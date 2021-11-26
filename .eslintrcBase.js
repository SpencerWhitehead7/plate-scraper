// c/p from https://github.com/SpencerWhitehead7/eslint-config v0.1.1

module.exports = {
  extends: [`plugin:react-hooks/recommended`],
  plugins: [`react`],
  parserOptions: {
    ecmaVersion: `latest`,
    sourceType: `module`, // I THINK all my sources should be modules; this defaults to script
    ecmaFeatures: {
      globalReturn: false, // why would someone want this??
      impliedStrict: true, // goes with sourceType: 'module'
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
  },
  settings: {
    react: {
      version: `detect`, // necessary to silence an eslint-plugin-react config error
    },
  },
  reportUnusedDisableDirectives: true,
  rules: {

    // Vanilla JS

    // Possible Errors
    'for-direction': 2,
    'getter-return': 2,
    'no-async-promise-executor': 2,
    'no-await-in-loop': 2,
    'no-compare-neg-zero': 1,
    'no-cond-assign': 2,
    'no-console': 1,
    'no-constant-condition': [2, { checkLoops: false }],
    'no-control-regex': 2,
    'no-debugger': 2,
    'no-dupe-args': 2,
    'no-dupe-else-if': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty': 2,
    'no-empty-character-class': 2,
    'no-ex-assign': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [
      1, `all`, {
        conditionalAssign: true,
        returnAssign: true,
        nestedBinaryExpressions: true,
        ignoreJSX: `multi-line`,
        enforceForArrowConditionals: false,
        enforceForSequenceExpressions: true,
        enforceForNewInMemberExpressions: true,
        enforceForFunctionPrototypeMethods: true,
      },
    ],
    'no-extra-semi': 2,
    'no-func-assign': 2,
    'no-import-assign': 2,
    'no-inner-declarations': [2, `both`],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-loss-of-precision': 2,
    'no-misleading-character-class': 2, // not sure what this does
    'no-obj-calls': 2,
    'no-promise-executor-return': 2,
    'no-prototype-builtins': 0,
    'no-regex-spaces': 2,
    'no-setter-return': 2,
    'no-sparse-arrays': 2,
    'no-template-curly-in-string': 1,
    'no-unexpected-multiline': 2,
    'no-unreachable': 2,
    'no-unreachable-loop': 2,
    'no-unsafe-finally': 2,
    'no-unsafe-negation': [2, { enforceForOrderingRelations: true }],
    'no-unsafe-optional-chaining': [2, { disallowArithmeticOperators: true }],
    'no-useless-backreference': 1,
    'require-atomic-updates': 2,
    'use-isnan': [
      2, {
        enforceForSwitchCase: true,
        enforceForIndexOf: true,
      },
    ],
    'valid-typeof': [2, { requireStringLiterals: true }],

    // Best Practices
    'accessor-pairs': 2,
    'array-callback-return': [2, { allowImplicit: false }],
    'block-scoped-var': 0,
    'class-methods-use-this': 0,
    complexity: [0, { max: 20 }],
    'consistent-return': 0,
    curly: [1, `multi-line`, `consistent`],
    'default-case': 2,
    'default-case-last': 2,
    'default-param-last': 0,
    'dot-location': [1, `property`],
    'dot-notation': [0, { allowKeywords: false }],
    eqeqeq: [1, `smart`],
    'grouped-accessor-pairs': [2, `setBeforeGet`],
    'guard-for-in': 2,
    'max-classes-per-file': [1, 1],
    'no-alert': 1,
    'no-caller': 2,
    'no-case-declarations': 2,
    'no-constructor-return': 2,
    'no-div-regex': 2,
    'no-else-return': 0,
    'no-empty-function': 0,
    'no-empty-pattern': 2,
    'no-eq-null': 2,
    'no-eval': 2,
    'no-extend-native': 2,
    'no-extra-bind': 1,
    'no-extra-label': 1,
    'no-fallthrough': [2, { commentPattern: `fall[\\s\\w]through` }],
    'no-floating-decimal': 1,
    'no-global-assign': [1, { exceptions: [] }],
    'no-implicit-coercion': 1, // has other options, not important
    'no-implicit-globals': 0, // might alter
    'no-implied-eval': 2,
    'no-invalid-this': 0,
    'no-iterator': 2,
    'no-labels': 1, // has other options, not important
    'no-lone-blocks': 2,
    'no-loop-func': 2,
    'no-magic-numbers': [0, { ignore: [0, 1, 24, 60, 365] }],
    'no-multi-spaces': [1, { ignoreEOLComments: true }],
    'no-multi-str': 1,
    'no-new': 2,
    'no-new-func': 2,
    'no-new-wrappers': 2,
    'no-nonoctal-decimal-escape': 2,
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-param-reassign': [0, { props: true }], // might alter
    'no-proto': 2,
    'no-redeclare': [2, { builtinGlobals: true }],
    'no-restricted-properties': 0, // has other options, not important
    'no-return-assign': [2, `always`],
    'no-return-await': 1,
    'no-script-url': 2,
    'no-self-assign': [2, { props: true }],
    'no-self-compare': 2,
    'no-sequences': [1, { allowInParentheses: true }],
    'no-throw-literal': 2,
    'no-unmodified-loop-condition': 2,
    'no-unused-expressions': [
      2, {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
        enforceForJSX: true,
      },
    ],
    'no-unused-labels': 2,
    'no-useless-call': 1,
    'no-useless-catch': 1,
    'no-useless-concat': 1,
    'no-useless-escape': 1,
    'no-useless-return': 1,
    'no-void': 2,
    'no-warning-comments': 0,
    'no-with': 2,
    'prefer-named-capture-group': 2,
    'prefer-promise-reject-errors': 2,
    'prefer-regex-literals': 2,
    radix: [2, `as-needed`],
    'require-await': 2,
    'require-unicode-regexp': 0, // not sure what this does
    'vars-on-top': 2,
    'wrap-iife': [1, `inside`], // has other options, not important
    yoda: 2,

    // Strict Mode
    strict: 2,

    // Variables
    'init-declarations': 0,
    'no-delete-var': 2,
    'no-label-var': 2,
    'no-restricted-globals': 0,
    'no-shadow': [1, { builtinGlobals: false }],
    'no-shadow-restricted-names': 2,
    'no-undef': [2, { "typeof": false }],
    'no-undef-init': 2,
    'no-undefined': 0,
    'no-unused-vars': [
      1, {
        vars: `all`,
        args: `all`,
        ignoreRestSiblings: false,
        argsIgnorePattern: `^(next|_|req|res)$`,
      },
    ], // has other options, not important
    'no-use-before-define': 1, // has other options, not important

    // Stylistic Issues
    'array-bracket-newline': [1, { multiline: true }],
    'array-bracket-spacing': 1,
    'array-element-newline': [1, `consistent`],
    'block-spacing': 1,
    'brace-style': [1, `1tbs`, { allowSingleLine: true }],
    camelcase: 1, // has other options, not important
    'capitalized-comments': 0,
    'comma-dangle': [
      1, {
        arrays: `always-multiline`,
        objects: `always-multiline`,
        imports: `always-multiline`,
        exports: `always-multiline`,
        functions: `always-multiline`,
      },
    ],
    'comma-spacing': 1,
    'comma-style': [1, `last`], // has other options, not important
    'computed-property-spacing': 1,
    'consistent-this': [1, `that`],
    'eol-last': [1, `always`],
    'func-call-spacing': 1,
    'func-name-matching': [1, `always`], // has other options, not important
    'func-names': [0, `as-needed`],
    'func-style': [1, `expression`, { allowArrowFunctions: true }],
    'function-call-argument-newline': [1, `consistent`],
    'function-paren-newline': [1, `multiline`],
    'id-denylist': 0,
    'id-length': 0,
    'id-match': [0, `^[a-z]+([A-Z][a-z]+)*$`], // docs say this regex matches camelcase
    'implicit-arrow-linebreak': [1, `beside`],
    indent: [1, 2, { SwitchCase: 1 }],
    'jsx-quotes': [1, `prefer-double`],
    'key-spacing': 1,
    'keyword-spacing': 1,
    'line-comment-position': 0,
    'linebreak-style': [1, `unix`],
    'lines-around-comment': 0, // has other options, not important
    'lines-between-class-members': [1, `always`], // has other options, not important
    'max-depth': [1, { max: 5 }],
    'max-len': [
      0, {
        code: 80,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'max-lines': [
      0, {
        max: 250,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-lines-per-function': [
      0, {
        max: 50,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],
    'max-nested-callbacks': [1, { max: 5 }],
    'max-params': [0, { max: 5 }],
    'max-statements': [0, { max: 25 }],
    'max-statements-per-line': [1, { max: 2 }],
    'multiline-comment-style': 0, // has other options, not important
    'multiline-ternary': [1, `always-multiline`],
    'new-cap': [1, { capIsNewExceptions: [`Router`] }], // has other options, not important
    'new-parens': 1,
    'newline-per-chained-call': [1, { ignoreChainWithDepth: 3 }],
    'no-array-constructor': 1,
    'no-bitwise': 1,
    'no-continue': 1,
    'no-inline-comments': 0,
    'no-lonely-if': 1,
    'no-mixed-operators': 1,
    'no-mixed-spaces-and-tabs': 1,
    'no-multi-assign': 1, // has other options, not important
    'no-multiple-empty-lines': [
      1, {
        max: 50,
        maxEOF: 1,
        maxBOF: 0,
      },
    ],
    'no-negated-condition': 0,
    'no-nested-ternary': 0,
    'no-new-object': 1,
    'no-plusplus': 0,
    'no-restricted-syntax': 0, // has other options, not important
    'no-tabs': 1,
    'no-ternary': 0,
    'no-trailing-spaces': 1,
    'no-underscore-dangle': 0,
    'no-unneeded-ternary': [1, { defaultAssignment: true }],
    'no-whitespace-before-property': 1,
    'nonblock-statement-body-position': [1, `below`, { overrides: { "if": `any` } }],
    'object-curly-newline': [
      1, {
        consistent: true,
        multiline: true,
      },
    ],
    'object-curly-spacing': [
      1, `always`, {
        arraysInObjects: true,
        objectsInObjects: true,
      },
    ],
    'object-property-newline': [1, { allowAllPropertiesOnSameLine: true }],
    'one-var': [1, `never`], // has other options, not important
    'one-var-declaration-per-line': [1, `always`],
    'operator-assignment': [1, `always`],
    'operator-linebreak': [1, `after`, { overrides: { '?': `ignore`, ':': `ignore` } }],
    'padded-blocks': [1, `never`],
    'padding-line-between-statements': 0, // has other options, not important
    'prefer-exponentiation-operator': 2,
    'prefer-object-spread': 1,
    'quote-props': [2, `as-needed`, { keywords: true }],
    quotes: [
      1, `backtick`, {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    semi: [1, `never`],
    'semi-spacing': 1,
    'semi-style': [1, `last`],
    'sort-keys': 0,
    'sort-vars': 0,
    'space-before-blocks': 1,
    'space-before-function-paren': [1, `always`],
    'space-in-parens': 1,
    'space-infix-ops': 1,
    'space-unary-ops': [
      1, {
        words: true,
        nonwords: false,
        overrides: {},
      },
    ],
    'spaced-comment': [1, `always`, { block: { balanced: true } }], // might alter if I ever use a docs-from-comments utility
    'switch-colon-spacing': 1,
    'template-tag-spacing': [1, `never`],
    'unicode-bom': 0, // not sure what this does
    'wrap-regex': 1,

    // ECMAScript 6
    'arrow-body-style': [1, `as-needed`, { requireReturnForObjectLiteral: false }],
    'arrow-parens': [1, `as-needed`, { requireForBlockBody: false }],
    'arrow-spacing': 1,
    'constructor-super': 2,
    'generator-star-spacing': 1,
    'no-class-assign': 2,
    'no-confusing-arrow': [1, { allowParens: true }],
    'no-const-assign': 2,
    'no-dupe-class-members': 2,
    'no-duplicate-imports': [1, { includeExports: true }],
    'no-new-symbol': 2,
    'no-restricted-exports': 0,
    'no-restricted-imports': 0,
    'no-this-before-super': 2,
    'no-useless-computed-key': 1,
    'no-useless-constructor': 1,
    'no-useless-rename': 1, // has other options, not important
    'no-var': 2,
    'object-shorthand': [1, `always`], // has other options, not important
    'prefer-arrow-callback': 1,
    'prefer-const': 2,
    'prefer-destructuring': 0,
    'prefer-numeric-literals': 1,
    'prefer-rest-params': 1,
    'prefer-spread': 1,
    'prefer-template': 1,
    'require-yield': 2,
    'rest-spread-spacing': 1,
    'sort-imports': [
      0, {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: [`none`, `all`, `multiple`, `single`],
      },
    ],
    'symbol-description': 1,
    'template-curly-spacing': 1,
    'yield-star-spacing': 1,

    // REACT

    // General
    'react/boolean-prop-naming': [
      1, {
        // 'propTypeNames': [],
        rule: `^(is|has)[A-Z]([A-Za-z0-9]?)+`,
      },
    ], // has other options, not important
    'react/button-has-type': 2, // has other options, not important
    'react/default-props-match-prop-types': 2,
    'react/destructuring-assignment': [0, `always`],
    'react/display-name': 1, // might alter
    'react/forbid-component-props': 0,
    'react/forbid-dom-props': 0,
    'react/forbid-elements': 0,
    'react/forbid-foreign-prop-types': 0,
    'react/forbid-prop-types': 1,
    'react/function-component-definition': [
      1, {
        namedComponents: `arrow-function`,
        unnamedComponents: `arrow-function`,
      },
    ],
    'react/no-access-state-in-setstate': 2,
    'react/no-adjacent-inline-elements': 1,
    'react/no-array-index-key': 2,
    'react/no-children-prop': 0,
    'react/no-danger': 2,
    'react/no-danger-with-children': 2,
    'react/no-deprecated': 2,
    'react/no-did-mount-set-state': 0,
    'react/no-did-update-set-state': 0,
    'react/no-direct-mutation-state': 2,
    'react/no-find-dom-node': 2,
    'react/no-is-mounted': 2,
    'react/no-multi-comp': [0, { ignoreStateless: false }],
    'react/no-redundant-should-component-update': 2,
    'react/no-render-return-value': 2,
    'react/no-set-state': 0,
    'react/no-string-refs': [2, { noTemplateLiterals: true }],
    'react/no-this-in-sfc': 2,
    'react/no-typos': 2,
    'react/no-unescaped-entities': 0,
    'react/no-unknown-property': 2,
    'react/no-unsafe': 1,
    'react/no-unstable-nested-components': [2, { allowAsProps: false }],
    'react/no-unused-prop-types': 1,
    'react/no-unused-state': 1,
    'react/no-will-update-set-state': 2,
    'react/prefer-es6-class': [2, `always`],
    'react/prefer-read-only-props': 2,
    'react/prefer-stateless-function': [2, { ignorePureComponents: false }],
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 2,
    'react/require-default-props': 0,
    'react/require-optimization': 0,
    'react/require-render-return': 2,
    'react/self-closing-comp': [
      1, {
        component: true,
        html: true,
      },
    ],
    'react/sort-comp': 1,
    'react/sort-prop-types': 0, // has other options, not important
    'react/state-in-constructor': [2, `always`],
    'react/static-property-placement': [2, `static public field`], // has other options, not important
    'react/style-prop-object': 2,
    'react/void-dom-elements-no-children': 2,

    // JSX
    'react/jsx-boolean-value': [1, `never`],
    'react/jsx-child-element-spacing': 2,
    'react/jsx-closing-bracket-location': [1, `line-aligned`],
    'react/jsx-closing-tag-location': 1,
    'react/jsx-curly-brace-presence': [1, `never`],
    'react/jsx-curly-newline': 1, // has other options, not important
    'react/jsx-curly-spacing': [1, { when: `never` }], // has other options, not important
    'react/jsx-equals-spacing': 1,
    'react/jsx-filename-extension': [1, { allow: `as-needed` }],
    'react/jsx-first-prop-new-line': [1, `multiline`],
    'react/jsx-fragments': [1, `syntax`],
    'react/jsx-handler-names': [
      0, {
        eventHandlerPrefix: `handle`,
        eventHandlerPropPrefix: `on`,
        checkLocalVariables: false,
        checkInlineFunction: false,
      },
    ],
    'react/jsx-indent': [
      1, 2, {
        checkAttributes: true,
        indentLogicalExpressions: true,
      },
    ],
    'react/jsx-indent-props': [1, 2],
    'react/jsx-key': [
      2, {
        checkFragmentShorthand: true,
        checkKeyMustBeforeSpread: true,
      },
    ],
    'react/jsx-max-depth': [0, { max: 10 }],
    'react/jsx-max-props-per-line': [
      1, {
        maximum: 1,
        when: `multiline`,
      },
    ],
    'react/jsx-newline': 0,
    'react/jsx-no-bind': 0, // I think it's a good rule, but it's inconvenient
    'react/jsx-no-comment-textnodes': 1,
    'react/jsx-no-constructed-context-values': 2,
    'react/jsx-no-duplicate-props': [2, { ignoreCase: true }],
    'react/jsx-no-literals': 0,
    'react/jsx-no-script-url': 2,
    'react/jsx-no-target-blank': [
      2, {
        allowReferrer: false,
        enforceDynamicLinks: `always`,
        warnOnSpreadAttributes: true,
      }, // has other options, but specifuing them invalidates the config???
    ],
    'react/jsx-no-undef': [1, { allowGlobals: false }],
    'react/jsx-no-useless-fragment': 1,
    'react/jsx-one-expression-per-line': [1, { allow: `single-child` }],
    'react/jsx-pascal-case': 1, // has other options, not important
    'react/jsx-props-no-multi-spaces': 1,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-sort-default-props': 0,
    'react/jsx-sort-props': 0,
    'react/jsx-tag-spacing': [
      1, {
        closingSlash: `never`,
        beforeSelfClosing: `always`,
        afterOpening: `never`,
        beforeClosing: `never`,
      },
    ],
    'react/jsx-uses-react': 1,
    'react/jsx-uses-vars': 1,
    'react/jsx-wrap-multilines': [
      1, {
        declaration: `parens-new-line`,
        assignment: `parens-new-line`,
        "return": `parens-new-line`,
        arrow: `parens-new-line`,
        condition: `parens-new-line`,
        logical: `parens-new-line`,
        prop: `parens-new-line`,
      },
    ],
  },
}
