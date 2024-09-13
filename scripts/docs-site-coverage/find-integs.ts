import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Not defined by default in module scope, I guess ...
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_DIRECTORY = `${__dirname}/../../packages/integration-tests/__tests__/defined-behavior`;

export type Region = {
  path: string;
  start: number;
  end: number;
  annotation?: string;
};

type RegionMarker = {
  type: 'start' | 'end';
  lineNumber: number;
  annotation?: string;
  line: string;
};

/**
 * Map of code snippet hashes to integ test region code.
 */
export type RegionMap = Record<string, Region[]>;

async function listDefinedBehaviorTestFiles() {
  return glob.glob(`${TEST_DIRECTORY}/**/*.ts`);
}

async function getAnnotatedRegionMarkers(
  path: string,
): Promise<RegionMarker[]> {
  const data = readFileSync(path).toString();
  const lines = data.split('\n');
  const markers: RegionMarker[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    const startRegion = line.trim().match(/\/\/\s+#region\s*(.*)$/);
    if (startRegion) {
      const annotation = startRegion[1];
      markers.push({ line, annotation, lineNumber, type: 'start' });
    }

    const endRegion = line.trim().match(/\/\/\s+#endregion/);
    if (endRegion) {
      markers.push({ line, lineNumber, type: 'end' });
    }
  }

  return markers;
}

async function getRegions(path: string): Promise<Region[]> {
  /**
   * To be used as a stack for matching pairs. Hence, should contain only
   * START markers.
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
        regions.push({
          annotation: startMarker!.annotation,
          start: startMarker!.lineNumber,
          end: endMarker.lineNumber,
          path,
        });
      } else {
        console.error(
          `Unexpected "${endMarker.lineNumber}" at ${path}:${endMarker.line}`,
        );
      }
    }
  }

  for (const marker of startMarkers) {
    console.error(`Unmatched "${marker.lineNumber}" at ${path}:${marker.line}`);
  }

  return regions;
}

function extractHashes(region: Region): string[] {
  return (
    region.annotation
      ?.trim()
      .toLowerCase()
      .match(/covers\s+([0-9a-f])+\s*$/)?.[1] || ''
  ).split(/,\s+/);
}

function convertToRegionMap(regions: Region[]): RegionMap {
  const map: RegionMap = {};

  for (const region of regions) {
    for (const hash of extractHashes(region)) {
      if (!map[hash]) map[hash] = [];
      map[hash].push(region);
    }
  }

  return map;
}

async function findAllRegions(): Promise<Region[]> {
  let regions: Region[] = [];
  const paths = await listDefinedBehaviorTestFiles();
  for (const path of paths) {
    regions = regions.concat(await getRegions(path));
  }
  return regions;
}

export async function buildRegionMap(): Promise<RegionMap> {
  return convertToRegionMap(await findAllRegions());
}
