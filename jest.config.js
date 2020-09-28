module.exports = {
  preset: 'ts-jest',
  roots: ['src'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/node_modules/',
  ],
};
