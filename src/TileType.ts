// There might be a temptation to rename or reorder these, but TileType is stored in the database
// as its number. Would have been better if this was stored as a string, but that ship has sailed,
// for now.
export enum TileType {
  GREENERY,
  OCEAN,
  CITY,
  CAPITAL,
  COMMERCIAL_DISTRICT,
  ECOLOGICAL_ZONE,
  INDUSTRIAL_CENTER,
  LAVA_FLOWS,
  MINING_AREA,
  MINING_RIGHTS,
  MOHOLE_AREA,
  NATURAL_PRESERVE,
  NUCLEAR_ZONE,
  RESTRICTED_AREA,

  DEIMOS_DOWN,
  GREAT_DAM,
  MAGNETIC_FIELD_GENERATORS,

  BIOFERTILIZER_FACILITY,
  METALLIC_ASTEROID,
  SOLAR_FARM,
  OCEAN_CITY,
  OCEAN_FARM,
  OCEAN_SANCTUARY,
  DUST_STORM_MILD,
  DUST_STORM_SEVERE,
  EROSION_MILD,
  EROSION_SEVERE,
  MINING_STEEL_BONUS,
  MINING_TITANIUM_BONUS,
  HOT_SPRING,
  WASTE_INCINERATOR,

  // The Moon
  MOON_MINE,
  MOON_COLONY,
  MOON_ROAD,
  LUNA_TRADE_STATION,
  LUNA_MINING_HUB,
  LUNA_TRAIN_STATION,
  LUNAR_MINE_URBANIZATION
}

const TO_STRING_MAP: Map<TileType, string> = new Map([
  [TileType.GREENERY, 'greenery'],
  [TileType.OCEAN, 'ocean'],
  [TileType.CITY, 'city'],

  [TileType.CAPITAL, 'Capital'],
  [TileType.COMMERCIAL_DISTRICT, 'Commercial District'],
  [TileType.ECOLOGICAL_ZONE, 'Ecological Zone'],
  [TileType.INDUSTRIAL_CENTER, 'Industrial Center'],
  [TileType.LAVA_FLOWS, 'Lava Flows'],
  [TileType.MINING_AREA, 'Mining Area'],
  [TileType.MINING_RIGHTS, 'Mining Rights'],
  [TileType.MOHOLE_AREA, 'Mohole Area'],
  [TileType.NATURAL_PRESERVE, 'Natural Preserve'],
  [TileType.NUCLEAR_ZONE, 'Nuclear Zone'],
  [TileType.RESTRICTED_AREA, 'Restricted Area'],
  [TileType.DEIMOS_DOWN, 'Deimos Down'],
  [TileType.GREAT_DAM, 'Great Dam'],
  [TileType.MAGNETIC_FIELD_GENERATORS, 'Magnetic Field Generators'],
  [TileType.BIOFERTILIZER_FACILITY, 'Bio-Fertilizer Facility'],
  [TileType.METALLIC_ASTEROID, 'Metallic Asteroid'],
  [TileType.SOLAR_FARM, 'Solar Farm'],
  [TileType.OCEAN_CITY, 'Ocean City'],
  [TileType.OCEAN_FARM, 'Ocean Farm'],
  [TileType.OCEAN_SANCTUARY, 'Ocean Sanctuary'],
  [TileType.DUST_STORM_MILD, 'Mild Dust Storm'],
  [TileType.DUST_STORM_SEVERE, 'Severe Dust Storm'],
  [TileType.EROSION_MILD, 'Mild Erosion'],
  [TileType.EROSION_SEVERE, 'Severe Erosion'],
  [TileType.MINING_STEEL_BONUS, 'Mining (Steel)'],
  [TileType.MINING_TITANIUM_BONUS, 'Mining (Titanium)'],
  [TileType.MOON_MINE, 'Moon Mine'],
  [TileType.MOON_COLONY, 'Moon Colony'],
  [TileType.MOON_ROAD, 'Moon Road'],
  [TileType.LUNA_TRADE_STATION, 'Luna Trade Station'],
  [TileType.LUNA_MINING_HUB, 'Luna Mining Hub'],
  [TileType.LUNA_TRAIN_STATION, 'Luna Train Station'],
  [TileType.LUNAR_MINE_URBANIZATION, 'Lunar Mine Urbanization'],
  [TileType.HOT_SPRING, 'Hot Spring'],
  [TileType.WASTE_INCINERATOR, 'Waste Incinerator'],
]);

export namespace TileType {
  export function toString(tileType: TileType): string {
    return TO_STRING_MAP.get(tileType) || `(unnamed tile, id ${tileType})`;
  }
}
