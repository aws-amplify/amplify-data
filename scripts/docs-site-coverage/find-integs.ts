import { readFileSync } from 'fs';
import { glob } from 'glob';
import type { Config } from './config-type';

export type Region = {
  path: string;
  start: number;
  end: number;
  code: string;
  annotation?: string;
};

type RegionMarker = {
  type: 'start' | 'end';
  data: string;
  lineNumber: number;
  annotation?: string;
  line: string;
};

/**
 * Map of code snippet hashes to integ test region code.
 */
export type RegionMap = Record<string, Region[]>;

async function listDefinedBehaviorTestFiles(config: Config) {
  return glob.glob(`${config.testsDirectory}/**/*.ts`);
}

async function getAnnotatedRegionMarkers(
  path: string,
): Promise<RegionMarker[]> {
  const data = readFileSync(path).toString();
  const lines = data.split('\n');
  const markers: RegionMarker[] = [];

  for (const [zeroBasedLineNumber, line] of lines.entries()) {
    const lineNumber = zeroBasedLineNumber + 1;
    const startRegion = line.trim().match(/\/\/\s+#region\s*(.*)$/);
    if (startRegion) {
      const annotation = startRegion[1];
      markers.push({ data, line, annotation, lineNumber, type: 'start' });
    }

    const endRegion = line.trim().match(/\/\/\s+#endregion/);
    if (endRegion) {
      markers.push({ data, line, lineNumber, type: 'end' });
    }
  }

  return markers;
}

async function getRegions(path: string): Promise<Region[]> {
  /**
   * A stack for matching region open/close pairs.
   */
  const startMarkers: RegionMarker[] = [];
  const regions: Region[] = [];

  for (const marker of await getAnnotatedRegionMarkers(path)) {
    if (marker.type === 'start') {
      startMarkers.push(marker);
    } else {
      const endMarker = marker; // just aliasing for later clarity.
      if (startMarkers.length > 0) {
        const startMarker = startMarkers.pop();
        const code =
          startMarker?.data
            .split('\n')
            .slice(startMarker.lineNumber - 1, endMarker.lineNumber)
            .join('\n') || 'ERROR EXTRACTING CODE!';
        regions.push({
          annotation: startMarker!.annotation,
          start: startMarker!.lineNumber,
          end: endMarker.lineNumber,
          path,
          code,
        });
      } else {
        console.error(
          `Unexpected "${endMarker.line}" at ${path}:${endMarker.lineNumber}`,
        );
      }
    }
  }

  for (const marker of startMarkers) {
    console.error(`Unmatched "${marker.line}" at ${path}:${marker.lineNumber}`);
  }

  return regions;
}

function extractHashes(region: Region): string[] {
  const normalizedAnnotation = region.annotation?.trim().toLowerCase() || '';
  const match = normalizedAnnotation.match(/covers\s+([0-9a-f, ]+)/);
  const hashes = match?.[1].split(/,\s+/) || [];
  return hashes;
}

function convertToRegionMap(regions: Region[]): RegionMap {
  const map: RegionMap = {};

  for (const region of regions) {
    for (const hash of extractHashes(region)) {
      if (hash) {
        if (!map[hash]) map[hash] = [];
        map[hash].push(region);
      }
    }
  }

  return map;
}

async function findAllRegions(config: Config): Promise<Region[]> {
  let regions: Region[] = [];
  const paths = await listDefinedBehaviorTestFiles(config);
  for (const path of paths) {
    regions = regions.concat(await getRegions(path));
  }
  return regions;
}

export async function buildRegionMap(config: Config): Promise<RegionMap> {
  return convertToRegionMap(await findAllRegions(config));
}
