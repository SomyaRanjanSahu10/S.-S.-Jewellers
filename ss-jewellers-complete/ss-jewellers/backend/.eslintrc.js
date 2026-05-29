module.exports = {
  env: {
    node:    true,
    es2022:  true,
    jest:    true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType:  'commonjs',
  },
  rules: {
    'no-console':         ['warn', { allow: ['log', 'warn', 'error'] }],
    'no-unused-vars':     ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-undef':            'error',
    'no-var':              'error',
    'prefer-const':        'warn',
    'eqeqeq':             ['error', 'always'],
    'curly':               'warn',
    'no-throw-literal':    'error',
    'handle-callback-err': 'warn',
    'no-process-exit':     'warn',
  },
  ignorePatterns: ['node_modules/', 'coverage/', 'logs/'],
};
