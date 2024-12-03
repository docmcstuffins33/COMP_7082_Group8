module.exports = {
    preset: 'react',
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest', // Ensure JSX and JS files are processed
    },
    transformIgnorePatterns: [
      '/node_modules/(?!your-esm-module-to-transform)/', // In case you're using ES modules
    ],
  };