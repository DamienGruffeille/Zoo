/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.ts'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
    setupFiles: ['./src/__tests__/testEnv.ts']
};

/** setupFiles permet d'indiquer à Jest d'utiliser les données dans testEnv.ts
 * et supprimer les erreurs liées à l'utilisation simultanée du port 3000.
 * Autre solution : utiliser --runInBand dans le script test du package.json
 */
