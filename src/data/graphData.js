import { DESTINATIONS } from './destinations';

// Realistic highway road distance matrix (in km) between the 10 Indian destinations
export const ROAD_DISTANCES = {
  pune: {
    pune: 0,
    mumbai: 148,
    lonavala: 65,
    mahabaleshwar: 120,
    goa: 440,
    hyderabad: 560,
    udaipur: 890,
    jaipur: 1190,
    delhi: 1420,
    manali: 1950,
  },
  mumbai: {
    pune: 148,
    mumbai: 0,
    lonavala: 84,
    mahabaleshwar: 260,
    goa: 580,
    hyderabad: 710,
    udaipur: 760,
    jaipur: 1150,
    delhi: 1400,
    manali: 1930,
  },
  lonavala: {
    pune: 65,
    mumbai: 84,
    lonavala: 0,
    mahabaleshwar: 180,
    goa: 505,
    hyderabad: 625,
    udaipur: 844,
    jaipur: 1170,
    delhi: 1410,
    manali: 1940,
  },
  mahabaleshwar: {
    pune: 120,
    mumbai: 260,
    lonavala: 180,
    mahabaleshwar: 0,
    goa: 380,
    hyderabad: 590,
    udaipur: 1010,
    jaipur: 1310,
    delhi: 1540,
    manali: 2070,
  },
  goa: {
    pune: 440,
    mumbai: 580,
    lonavala: 505,
    mahabaleshwar: 380,
    goa: 0,
    hyderabad: 645,
    udaipur: 1330,
    jaipur: 1630,
    delhi: 1860,
    manali: 2390,
  },
  hyderabad: {
    pune: 560,
    mumbai: 710,
    lonavala: 625,
    mahabaleshwar: 590,
    goa: 645,
    hyderabad: 0,
    udaipur: 1180,
    jaipur: 1470,
    delhi: 1560,
    manali: 2090,
  },
  udaipur: {
    pune: 890,
    mumbai: 760,
    lonavala: 844,
    mahabaleshwar: 1010,
    goa: 1330,
    hyderabad: 1180,
    udaipur: 0,
    jaipur: 395,
    delhi: 660,
    manali: 1190,
  },
  jaipur: {
    pune: 1190,
    mumbai: 1150,
    lonavala: 1170,
    mahabaleshwar: 1310,
    goa: 1630,
    hyderabad: 1470,
    udaipur: 395,
    jaipur: 0,
    delhi: 280,
    manali: 810,
  },
  delhi: {
    pune: 1420,
    mumbai: 1400,
    lonavala: 1410,
    mahabaleshwar: 1540,
    goa: 1860,
    hyderabad: 1560,
    udaipur: 660,
    jaipur: 280,
    delhi: 0,
    manali: 535,
  },
  manali: {
    pune: 1950,
    mumbai: 1930,
    lonavala: 1940,
    mahabaleshwar: 2070,
    goa: 2390,
    hyderabad: 2090,
    udaipur: 1190,
    jaipur: 810,
    delhi: 535,
    manali: 0,
  }
};

// Explicit Road Network Graph for Dijkstra's Algorithm (National Highways connecting cities)
// Represents major transit corridors (NH48, NH44, NH66, Mumbai-Pune Expressway, etc.)
export const NETWORK_EDGES = [
  { from: "mumbai", to: "lonavala", weight: 84, highway: "Mumbai-Pune Expressway" },
  { from: "lonavala", to: "pune", weight: 65, highway: "NH 48" },
  { from: "pune", to: "mahabaleshwar", weight: 120, highway: "NH 48 / SH 72" },
  { from: "mahabaleshwar", to: "goa", weight: 380, highway: "NH 66 (Konkan Coast)" },
  { from: "pune", to: "goa", weight: 440, highway: "NH 48 via Kolhapur" },
  { from: "pune", to: "hyderabad", weight: 560, highway: "NH 65 via Solapur" },
  { from: "mumbai", to: "udaipur", weight: 760, highway: "NH 48 via Surat & Vadodara" },
  { from: "udaipur", to: "jaipur", weight: 395, highway: "NH 58 & NH 48" },
  { from: "jaipur", to: "delhi", weight: 280, highway: "NH 48 (Delhi-Jaipur Expy)" },
  { from: "delhi", to: "manali", weight: 535, highway: "NH 44 & NH 3 via Chandigarh" },
  { from: "hyderabad", to: "delhi", weight: 1560, highway: "NH 44 (North-South Corridor)" },
  { from: "hyderabad", to: "goa", weight: 645, highway: "NH 67 via Raichur" },
  { from: "mumbai", to: "pune", weight: 148, highway: "NH 48 Direct Route" },
  { from: "lonavala", to: "mahabaleshwar", weight: 180, highway: "State Highway 70" },
  { from: "delhi", to: "agra", weight: 210, highway: "Yamuna Expressway" },
  { from: "jaipur", to: "agra", weight: 240, highway: "NH 21 (Bikaner-Agra Road)" },
  { from: "agra", to: "varanasi", weight: 590, highway: "Agra-Lucknow & Purvanchal Expy" },
  { from: "varanasi", to: "kolkata", weight: 680, highway: "NH 19 (Grand Trunk Road)" },
  { from: "delhi", to: "rishikesh", weight: 240, highway: "NH 334 via Meerut" },
  { from: "delhi", to: "amritsar", weight: 450, highway: "NH 44 (Grand Trunk Road)" },
  { from: "delhi", to: "shimla", weight: 345, highway: "NH 44 & NH 5 via Chandigarh" },
  { from: "shimla", to: "manali", weight: 240, highway: "NH 205 & NH 3 via Mandi" },
  { from: "hyderabad", to: "bengaluru", weight: 570, highway: "NH 44 (North-South Corridor)" },
  { from: "pune", to: "bengaluru", weight: 840, highway: "NH 48 via Kolhapur & Belagavi" },
  { from: "bengaluru", to: "ooty", weight: 270, highway: "NH 275 & NH 766 via Mysuru" },
  { from: "bengaluru", to: "kochi", weight: 540, highway: "NH 44 & NH 544 via Coimbatore" },
  { from: "goa", to: "kochi", weight: 750, highway: "NH 66 (Konkan & Malabar Coast)" },
  { from: "kolkata", to: "darjeeling", weight: 610, highway: "NH 12 & NH 27 via Siliguri" }
];

// Helper: Haversine distance for arbitrary coords
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Helper to get distance between any 2 destination IDs
export function getDistance(id1, id2) {
  if (id1 === id2) return 0;
  if (ROAD_DISTANCES[id1] && ROAD_DISTANCES[id1][id2] !== undefined) {
    return ROAD_DISTANCES[id1][id2];
  }
  const dest1 = DESTINATIONS.find(d => d.id === id1);
  const dest2 = DESTINATIONS.find(d => d.id === id2);
  if (dest1 && dest2) {
    return calculateHaversineDistance(dest1.lat, dest1.lng, dest2.lat, dest2.lng);
  }
  return 300;
}
