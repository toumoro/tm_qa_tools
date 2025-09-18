/**
 * Will return the env variable or throw an error
 * Limit the case where the test fail because of a missing env variable.
 * @param {string} variableName
 * @returns {string} env variable value
 * @throws {Error} If the environment variable is missing or undefined.
 */
export const getEnvVariable = (variableName: string): string => {
  const variable = process.env?.[variableName];

  if (variable) {
    return variable;
  } else {
    throw new Error(`Env variable [${variableName}] is missing.`);
  }
};
