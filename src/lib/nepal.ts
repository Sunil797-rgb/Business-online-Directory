/**
 * Nepal administrative geography + locale helpers.
 *
 * Districts are the unit buyers actually think in ("I need a supplier in
 * Lalitpur"), so they drive the location filter. Provinces group them for the
 * wider "anywhere in Bagmati" search.
 */

export interface Province {
  id: number;
  name: string;
  nameNe: string;
}

export interface District {
  slug: string;
  name: string;
  nameNe: string;
  provinceId: number;
  /** Rough population centre, used to order the picker sensibly. */
  isMajorMarket?: boolean;
}

export const PROVINCES: Province[] = [
  { id: 1, name: "Koshi", nameNe: "कोशी" },
  { id: 2, name: "Madhesh", nameNe: "मधेश" },
  { id: 3, name: "Bagmati", nameNe: "बागमती" },
  { id: 4, name: "Gandaki", nameNe: "गण्डकी" },
  { id: 5, name: "Lumbini", nameNe: "लुम्बिनी" },
  { id: 6, name: "Karnali", nameNe: "कर्णाली" },
  { id: 7, name: "Sudurpashchim", nameNe: "सुदूरपश्चिम" },
];

export const DISTRICTS: District[] = [
  // Koshi
  { slug: "bhojpur", name: "Bhojpur", nameNe: "भोजपुर", provinceId: 1 },
  { slug: "dhankuta", name: "Dhankuta", nameNe: "धनकुटा", provinceId: 1 },
  { slug: "ilam", name: "Ilam", nameNe: "इलाम", provinceId: 1 },
  { slug: "jhapa", name: "Jhapa", nameNe: "झापा", provinceId: 1, isMajorMarket: true },
  { slug: "khotang", name: "Khotang", nameNe: "खोटाङ", provinceId: 1 },
  { slug: "morang", name: "Morang", nameNe: "मोरङ", provinceId: 1, isMajorMarket: true },
  { slug: "okhaldhunga", name: "Okhaldhunga", nameNe: "ओखलढुंगा", provinceId: 1 },
  { slug: "panchthar", name: "Panchthar", nameNe: "पाँचथर", provinceId: 1 },
  { slug: "sankhuwasabha", name: "Sankhuwasabha", nameNe: "संखुवासभा", provinceId: 1 },
  { slug: "solukhumbu", name: "Solukhumbu", nameNe: "सोलुखुम्बु", provinceId: 1 },
  { slug: "sunsari", name: "Sunsari", nameNe: "सुनसरी", provinceId: 1, isMajorMarket: true },
  { slug: "taplejung", name: "Taplejung", nameNe: "ताप्लेजुङ", provinceId: 1 },
  { slug: "terhathum", name: "Terhathum", nameNe: "तेह्रथुम", provinceId: 1 },
  { slug: "udayapur", name: "Udayapur", nameNe: "उदयपुर", provinceId: 1 },

  // Madhesh
  { slug: "bara", name: "Bara", nameNe: "बारा", provinceId: 2, isMajorMarket: true },
  { slug: "dhanusha", name: "Dhanusha", nameNe: "धनुषा", provinceId: 2, isMajorMarket: true },
  { slug: "mahottari", name: "Mahottari", nameNe: "महोत्तरी", provinceId: 2 },
  { slug: "parsa", name: "Parsa", nameNe: "पर्सा", provinceId: 2, isMajorMarket: true },
  { slug: "rautahat", name: "Rautahat", nameNe: "रौतहट", provinceId: 2 },
  { slug: "saptari", name: "Saptari", nameNe: "सप्तरी", provinceId: 2 },
  { slug: "sarlahi", name: "Sarlahi", nameNe: "सर्लाही", provinceId: 2 },
  { slug: "siraha", name: "Siraha", nameNe: "सिरहा", provinceId: 2 },

  // Bagmati
  { slug: "bhaktapur", name: "Bhaktapur", nameNe: "भक्तपुर", provinceId: 3, isMajorMarket: true },
  { slug: "chitwan", name: "Chitwan", nameNe: "चितवन", provinceId: 3, isMajorMarket: true },
  { slug: "dhading", name: "Dhading", nameNe: "धादिङ", provinceId: 3 },
  { slug: "dolakha", name: "Dolakha", nameNe: "दोलखा", provinceId: 3 },
  { slug: "kathmandu", name: "Kathmandu", nameNe: "काठमाडौं", provinceId: 3, isMajorMarket: true },
  { slug: "kavrepalanchok", name: "Kavrepalanchok", nameNe: "काभ्रेपलाञ्चोक", provinceId: 3 },
  { slug: "lalitpur", name: "Lalitpur", nameNe: "ललितपुर", provinceId: 3, isMajorMarket: true },
  { slug: "makwanpur", name: "Makwanpur", nameNe: "मकवानपुर", provinceId: 3, isMajorMarket: true },
  { slug: "nuwakot", name: "Nuwakot", nameNe: "नुवाकोट", provinceId: 3 },
  { slug: "ramechhap", name: "Ramechhap", nameNe: "रामेछाप", provinceId: 3 },
  { slug: "rasuwa", name: "Rasuwa", nameNe: "रसुवा", provinceId: 3 },
  { slug: "sindhuli", name: "Sindhuli", nameNe: "सिन्धुली", provinceId: 3 },
  { slug: "sindhupalchok", name: "Sindhupalchok", nameNe: "सिन्धुपाल्चोक", provinceId: 3 },

  // Gandaki
  { slug: "baglung", name: "Baglung", nameNe: "बागलुङ", provinceId: 4 },
  { slug: "gorkha", name: "Gorkha", nameNe: "गोरखा", provinceId: 4 },
  { slug: "kaski", name: "Kaski", nameNe: "कास्की", provinceId: 4, isMajorMarket: true },
  { slug: "lamjung", name: "Lamjung", nameNe: "लमजुङ", provinceId: 4 },
  { slug: "manang", name: "Manang", nameNe: "मनाङ", provinceId: 4 },
  { slug: "mustang", name: "Mustang", nameNe: "मुस्ताङ", provinceId: 4 },
  { slug: "myagdi", name: "Myagdi", nameNe: "म्याग्दी", provinceId: 4 },
  { slug: "nawalpur", name: "Nawalpur", nameNe: "नवलपुर", provinceId: 4 },
  { slug: "parbat", name: "Parbat", nameNe: "पर्वत", provinceId: 4 },
  { slug: "syangja", name: "Syangja", nameNe: "स्याङ्जा", provinceId: 4 },
  { slug: "tanahun", name: "Tanahun", nameNe: "तनहुँ", provinceId: 4 },

  // Lumbini
  { slug: "arghakhanchi", name: "Arghakhanchi", nameNe: "अर्घाखाँची", provinceId: 5 },
  { slug: "banke", name: "Banke", nameNe: "बाँके", provinceId: 5, isMajorMarket: true },
  { slug: "bardiya", name: "Bardiya", nameNe: "बर्दिया", provinceId: 5 },
  { slug: "dang", name: "Dang", nameNe: "दाङ", provinceId: 5, isMajorMarket: true },
  { slug: "gulmi", name: "Gulmi", nameNe: "गुल्मी", provinceId: 5 },
  { slug: "kapilvastu", name: "Kapilvastu", nameNe: "कपिलवस्तु", provinceId: 5 },
  { slug: "parasi", name: "Parasi", nameNe: "परासी", provinceId: 5 },
  { slug: "palpa", name: "Palpa", nameNe: "पाल्पा", provinceId: 5 },
  { slug: "pyuthan", name: "Pyuthan", nameNe: "प्युठान", provinceId: 5 },
  { slug: "rolpa", name: "Rolpa", nameNe: "रोल्पा", provinceId: 5 },
  { slug: "rukum-east", name: "Rukum East", nameNe: "पूर्वी रुकुम", provinceId: 5 },
  { slug: "rupandehi", name: "Rupandehi", nameNe: "रुपन्देही", provinceId: 5, isMajorMarket: true },

  // Karnali
  { slug: "dailekh", name: "Dailekh", nameNe: "दैलेख", provinceId: 6 },
  { slug: "dolpa", name: "Dolpa", nameNe: "डोल्पा", provinceId: 6 },
  { slug: "humla", name: "Humla", nameNe: "हुम्ला", provinceId: 6 },
  { slug: "jajarkot", name: "Jajarkot", nameNe: "जाजरकोट", provinceId: 6 },
  { slug: "jumla", name: "Jumla", nameNe: "जुम्ला", provinceId: 6 },
  { slug: "kalikot", name: "Kalikot", nameNe: "कालिकोट", provinceId: 6 },
  { slug: "mugu", name: "Mugu", nameNe: "मुगु", provinceId: 6 },
  { slug: "rukum-west", name: "Rukum West", nameNe: "पश्चिम रुकुम", provinceId: 6 },
  { slug: "salyan", name: "Salyan", nameNe: "सल्यान", provinceId: 6 },
  { slug: "surkhet", name: "Surkhet", nameNe: "सुर्खेत", provinceId: 6, isMajorMarket: true },

  // Sudurpashchim
  { slug: "achham", name: "Achham", nameNe: "अछाम", provinceId: 7 },
  { slug: "baitadi", name: "Baitadi", nameNe: "बैतडी", provinceId: 7 },
  { slug: "bajhang", name: "Bajhang", nameNe: "बझाङ", provinceId: 7 },
  { slug: "bajura", name: "Bajura", nameNe: "बाजुरा", provinceId: 7 },
  { slug: "dadeldhura", name: "Dadeldhura", nameNe: "डडेल्धुरा", provinceId: 7 },
  { slug: "darchula", name: "Darchula", nameNe: "दार्चुला", provinceId: 7 },
  { slug: "doti", name: "Doti", nameNe: "डोटी", provinceId: 7 },
  { slug: "kailali", name: "Kailali", nameNe: "कैलाली", provinceId: 7, isMajorMarket: true },
  { slug: "kanchanpur", name: "Kanchanpur", nameNe: "कञ्चनपुर", provinceId: 7 },
];

const districtBySlug = new Map(DISTRICTS.map((d) => [d.slug, d]));
const provinceById = new Map(PROVINCES.map((p) => [p.id, p]));

export function getDistrict(slug: string): District | undefined {
  return districtBySlug.get(slug);
}

export function getDistrictName(slug: string): string {
  return districtBySlug.get(slug)?.name ?? slug;
}

export function getProvince(id: number): Province | undefined {
  return provinceById.get(id);
}

/** Major trading districts first, then the rest alphabetically. */
export const DISTRICTS_BY_PROMINENCE: District[] = [
  ...DISTRICTS.filter((d) => d.isMajorMarket).sort((a, b) => a.name.localeCompare(b.name)),
  ...DISTRICTS.filter((d) => !d.isMajorMarket).sort((a, b) => a.name.localeCompare(b.name)),
];

export function districtsInProvince(provinceId: number): District[] {
  return DISTRICTS.filter((d) => d.provinceId === provinceId);
}
