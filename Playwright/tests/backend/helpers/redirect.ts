/**
 * get a test path from a source path that can be a regex
 * 
 * @param sourcePath 
 * @returns 
 */
export function getTestPathFromSourcePath(
  sourcePath: string
): string {
  const regex = /^#\^\/.*\$#$/;

  if (sourcePath.match(regex)) {
    const parts = sourcePath.split('/');
    if (parts.length >= 3) {
      parts.shift();
      parts.pop();
      const pattern = parts.join('/');
      const pathRegex = new RegExp(pattern);
      const testString = '/' + parts.join('/') + '/';

      if (!testString.match(pathRegex)) {
        throw new Error(`The test string "${testString}" does not match the regex pattern "${pattern}".`);
      }

      console.info(`The source_path "${sourcePath}" is a regex. Using test string "${testString}" for the request.`);
      return testString;
    }
  }

  return sourcePath;
}