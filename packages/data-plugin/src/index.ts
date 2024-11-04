import * as ts from 'typescript/lib/tsserverlibrary';
import * as path from 'path';
import { minimatch } from 'minimatch';
import { generateSchemaTypes } from './typeGen';
import { fileHashChanged } from './checkHash';

type Logger = (msg: string) => void;
const DECLARATIONS_FILE = 'schema.d.ts';

/**
 * ref: https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin
 */
function init() {
  function create(info: ts.server.PluginCreateInfo) {
    const logger = createLogger(info);
    const projectRoot = info.project.getCurrentDirectory();
    const dtsFilePath = path.join(projectRoot, DECLARATIONS_FILE);
    const filePattern = getFilePattern(info.config);

    return createProxy(info, dtsFilePath, filePattern, logger);
  }

  return { create };
}

function createLogger(info: ts.server.PluginCreateInfo): Logger {
  return (msg: string) =>
    info.project.projectService.logger.info(`[data-plugin] ${msg}`);
}

function getFilePattern(config: any): string {
  return config.filePattern || '**/example/**/*';
}

/**
 * Wrap the language service to intercept file edits & saves
 *
 * Allows us to perform arbitrary work in the LSP
 */
function createProxy(
  info: ts.server.PluginCreateInfo,
  timestampPath: string,
  filePattern: string,
  logger: Logger,
): ts.LanguageService {
  const proxy: ts.LanguageService = Object.create(null);
  for (const k of Object.keys(info.languageService) as Array<
    keyof ts.LanguageService
  >) {
    const x = info.languageService[k];

    proxy[k] = (...args: any[]) =>
      // eslint-disable-next-line @typescript-eslint/ban-types
      (x as Function).apply(info.languageService, args);
  }

  proxy.getSemanticDiagnostics = (fileName: string) => {
    const prior = info.languageService.getSemanticDiagnostics(fileName);
    // Get the source file from the program
    const source = info.languageService.getProgram()?.getSourceFile(fileName);

    if (!source) {
      //
      return [
        ...prior,
        {
          file: source,
          category: ts.DiagnosticCategory.Error,
          code: 9999, // Custom error code
          messageText: `@aws-amplify/data-plugin Exception: no source`,
          start: 0,
          length: 99999999999,
        },
      ];
    }

    try {
      handleFileSave(fileName, filePattern, timestampPath, logger);
      return prior;
    } catch (error: any) {
      if (minimatch(fileName, filePattern, { matchBase: true })) {
        return [
          ...prior,
          {
            file: source,
            category: ts.DiagnosticCategory.Error,
            code: 9999, // Custom error code
            messageText: `@aws-amplify/data-plugin Exception: ${error.message}. See https://docs.amplify.aws/errors/`,
            start: 0,
            length: 99999999999,
          },
        ];
      }
      return prior;
    }
  };

  return proxy;
}

function handleFileSave(
  fileName: string,
  filePattern: string,
  dtsFilePath: string,
  logger: Logger,
): void {
  logger(`Filename: ${fileName}`);

  if (minimatch(fileName, filePattern, { matchBase: true })) {
    logger(`Filename matches`);

    if (fileHashChanged(fileName)) {
      logger(`File content has changed.`);
      writeDeclarations(fileName, dtsFilePath, logger);
    } else {
      logger(`File content unchanged. Skipping update.`);
    }
  } else {
    logger(`Filename Does not match`);
  }
}

function writeDeclarations(
  fileName: string,
  dtsFilePath: string,
  logger: Logger,
): void {
  try {
    generateSchemaTypes(fileName, dtsFilePath);

    logger(`Updated declarations file`);
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
}

export = init;
