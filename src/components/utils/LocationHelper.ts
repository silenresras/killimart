import kenyaLocations from "./KenyaLocations.json";

interface SubCounty {
  name: string;
  towns: string[];
}

interface County {
  county: string;
  subCounties: SubCounty[];
}

const locations: County[] = kenyaLocations;

// Get all counties
export function getCounties(): string[] {
  return locations.map((location: County) => location.county);
}

// Get sub-counties by county
export function getSubCounties(countyName: string): string[] {
  const county = locations.find((c: County) => c.county === countyName);
  return county ? county.subCounties.map((s: SubCounty) => s.name) : [];
}

// Get towns by sub-county
export function getTowns(countyName: string, subCountyName: string): string[] {
  const county = locations.find((c: County) => c.county === countyName);
  if (!county) return [];

  const subCounty = county.subCounties.find((s: SubCounty) => s.name === subCountyName);
  return subCounty ? subCounty.towns : [];
}
