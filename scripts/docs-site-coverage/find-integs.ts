import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Not defined by default in module scope, I guess ...
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_DIRECTORY = `${__dirname}/../../packages/integration-tests/__tests__/defined-behavior`;

type Region = {
  path: string;
  start: number;
  end: number;
  annotation: string;
};

type RegionMarker = {
  type: 'start' | 'end';
  lineNumber: number;
  annotation: string;
  line: string;
};

async function listDefinedBehaviorTestFiles() {
  return glob.glob(`${TEST_DIRECTORY}/**/*.ts`);
}

async function getAnnotatedRegionMarkers(
  path: string,
): Promise<RegionMarker[]> {
  const data = readFileSync(path).toString();
  const lines = data.split('\n');
  const markers: RegionMarker[] = [];

  for (const [lineNumber, line] of lines.entries()) {
    const startRegion = line.trim().match(/\/\/\s+#region\s+(.+)$/);
    if (startRegion) {
      const annotation = startRegion[1];
      markers.push({ line, annotation, lineNumber, type: 'start' });
    }

    const endRegion = line.trim().match(/\/\/\s+#endregion\s+(.+)$/);
    if (endRegion) {
      const annotation = endRegion[1];
      markers.push({ line, annotation, lineNumber, type: 'end' });
    }
  }

  return markers;
}

async function getRegions(path: string): Promise<Region[]> {
  const regions: Region[] = [];
  const markerStack: RegionMarker[] = [];

  for (const marker of await getAnnotatedRegionMarkers(path)) {
    if (marker.type === 'start') {
      markerStack.push(marker);
    } else {
      if (
        marker.annotation === markerStack[markerStack.length - 1]?.annotation
      ) {
        const startMarker = markerStack.pop();
        regions.push({
          annotation: marker.annotation,
          start: startMarker!.lineNumber,
          end: marker.lineNumber,
          path,
        });
      } else {
        console.error(`Unexpected region end: ${JSON.stringify(marker)}`);
      }
    }
  }

  if (markerStack.length > 0) {
    console.error(
      `Unmatched region starts: ${JSON.stringify(markerStack, null, 2)}`,
    );
  }

  return regions;
}

const paths = await listDefinedBehaviorTestFiles();
for (const path of paths) {
  const regions = await getRegions(path);
  if (regions.length > 0) console.log(path, regions);
}
