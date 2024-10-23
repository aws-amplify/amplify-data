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
  logger: Logger
): ts.LanguageService {
  const proxy: ts.LanguageService = Object.create(null);
  for (let k of Object.keys(info.languageService) as Array<
    keyof ts.LanguageService
  >) {
    const x = info.languageService[k];

    proxy[k] = (...args: any[]) =>
      (x as Function).apply(info.languageService, args);
  }

  proxy.getSemanticDiagnostics = (fileName: string) => {
    const prior = info.languageService.getSemanticDiagnostics(fileName);
    handleFileSave(fileName, filePattern, timestampPath, logger);
    return prior;
  };

  return proxy;
}

function handleFileSave(
  fileName: string,
  filePattern: string,
  dtsFilePath: string,
  logger: Logger
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
  logger: Logger
): void {
  try {
    generateSchemaTypes(fileName, dtsFilePath);

    logger(`Updated declarations file`);
  } catch (error) {
    console.error(`Error appending timestamp: ${error}`);
  }
}

export = init;
