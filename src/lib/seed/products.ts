import type { Product, Unit } from "../types";

/**
 * Sample product + price rows for the demo suppliers.
 *
 * Prices are FICTIONAL but set at plausible Nepali wholesale levels so the
 * price-comparison views look like real trade data.
 */

let seq = 0;

interface Extra {
  nameNe?: string;
  description?: string;
  brand?: string;
  bulkPrice?: number;
  bulkMinQuantity?: number;
  minQuantity?: number;
  inStock?: boolean;
  /** Days before the reference date the supplier last confirmed this price. */
  updatedDaysAgo?: number;
}

/** Reference "today" for the seed data, so freshness badges stay stable. */
const REFERENCE_DATE = new Date("2026-11-26T00:00:00.000Z");

function daysAgo(days: number): string {
  return new Date(REFERENCE_DATE.getTime() - days * 86_400_000).toISOString();
}

function p(
  supplierId: string,
  categorySlug: string,
  name: string,
  unit: Unit,
  price: number,
  extra: Extra = {},
): Product {
  seq += 1;
  return {
    id: `p${seq}`,
    supplierId,
    name,
    nameNe: extra.nameNe ?? null,
    description: extra.description ?? null,
    categorySlug,
    brand: extra.brand ?? null,
    unit,
    price,
    bulkPrice: extra.bulkPrice ?? null,
    bulkMinQuantity: extra.bulkMinQuantity ?? null,
    minQuantity: extra.minQuantity ?? 1,
    inStock: extra.inStock ?? true,
    imageUrl: null,
    priceUpdatedAt: daysAgo(extra.updatedDaysAgo ?? 3),
  };
}

export const SEED_PRODUCTS: Product[] = [
  // --- s1 Kalimati Fresh Vegetable Suppliers -------------------------------
  p("s1", "vegetables-fruits", "Tomato (local)", "kg", 72, {
    nameNe: "गोलभेँडा",
    minQuantity: 10,
    bulkPrice: 66,
    bulkMinQuantity: 50,
    updatedDaysAgo: 0,
    description: "Firm local tomato, graded. Indian tomato available when the local crop is short.",
  }),
  p("s1", "vegetables-fruits", "Potato (red, Mude)", "kg", 58, {
    nameNe: "आलु",
    minQuantity: 25,
    bulkPrice: 53,
    bulkMinQuantity: 100,
    updatedDaysAgo: 0,
  }),
  p("s1", "vegetables-fruits", "Onion (dry)", "kg", 84, {
    nameNe: "प्याज",
    minQuantity: 25,
    bulkPrice: 79,
    bulkMinQuantity: 100,
    updatedDaysAgo: 0,
  }),
  p("s1", "vegetables-fruits", "Cauliflower", "kg", 62, { nameNe: "काउली", minQuantity: 10, updatedDaysAgo: 0 }),
  p("s1", "vegetables-fruits", "Cabbage", "kg", 45, { nameNe: "बन्दा", minQuantity: 10, updatedDaysAgo: 0 }),
  p("s1", "vegetables-fruits", "Carrot", "kg", 76, { nameNe: "गाजर", minQuantity: 10, updatedDaysAgo: 0 }),
  p("s1", "vegetables-fruits", "Green chilli", "kg", 115, { nameNe: "हरियो खुर्सानी", minQuantity: 5, updatedDaysAgo: 0 }),
  p("s1", "vegetables-fruits", "Ginger", "kg", 168, { nameNe: "अदुवा", minQuantity: 5, updatedDaysAgo: 0 }),
  p("s1", "vegetables-fruits", "Garlic (Chinese)", "kg", 245, { nameNe: "लसुन", minQuantity: 5, updatedDaysAgo: 0 }),
  p("s1", "vegetables-fruits", "Coriander leaf", "kg", 130, { nameNe: "धनियाँ", minQuantity: 2, updatedDaysAgo: 0 }),
  p("s1", "vegetables-fruits", "Capsicum (green)", "kg", 135, { minQuantity: 5, updatedDaysAgo: 0 }),
  p("s1", "vegetables-fruits", "Mushroom (button)", "kg", 290, { minQuantity: 2, updatedDaysAgo: 1 }),
  p("s1", "vegetables-fruits", "Lemon", "kg", 160, { nameNe: "कागती", minQuantity: 5, updatedDaysAgo: 1 }),
  p("s1", "vegetables-fruits", "Banana (Malbhog)", "dozen", 165, { minQuantity: 5, updatedDaysAgo: 1 }),

  // --- s2 Sunrise Poultry Farm & Hatchery ----------------------------------
  p("s2", "poultry-eggs", "Dressed broiler chicken (whole)", "kg", 392, {
    nameNe: "कुखुराको मासु",
    minQuantity: 60,
    bulkPrice: 378,
    bulkMinQuantity: 200,
    updatedDaysAgo: 2,
    description: "Chilled, whole dressed bird with skin. Billed on post-dressing chilled weight.",
  }),
  p("s2", "poultry-eggs", "Boneless chicken breast", "kg", 585, { minQuantity: 20, bulkPrice: 565, bulkMinQuantity: 80, updatedDaysAgo: 2 }),
  p("s2", "poultry-eggs", "Chicken leg / thigh (curry cut)", "kg", 445, { minQuantity: 20, updatedDaysAgo: 2 }),
  p("s2", "poultry-eggs", "Chicken wings", "kg", 410, { minQuantity: 10, updatedDaysAgo: 2 }),
  p("s2", "poultry-eggs", "Chicken mince (keema)", "kg", 520, { minQuantity: 10, updatedDaysAgo: 2 }),
  p("s2", "poultry-eggs", "Live broiler", "kg", 298, { nameNe: "जिउँदो ब्रोइलर", minQuantity: 100, bulkPrice: 288, bulkMinQuantity: 500, updatedDaysAgo: 2 }),
  p("s2", "poultry-eggs", "Table eggs (white)", "crate", 438, {
    nameNe: "अण्डा",
    description: "30-egg crate, grade A, farm-fresh within 48 hours of laying.",
    minQuantity: 10,
    bulkPrice: 425,
    bulkMinQuantity: 50,
    updatedDaysAgo: 1,
  }),
  p("s2", "poultry-eggs", "Table eggs (brown)", "crate", 492, { minQuantity: 10, updatedDaysAgo: 1 }),
  p("s2", "poultry-eggs", "Local (sakini) chicken, dressed", "kg", 790, { minQuantity: 10, inStock: false, updatedDaysAgo: 9 }),
  p("s2", "poultry-eggs", "Chicken liver & gizzard", "kg", 285, { minQuantity: 5, updatedDaysAgo: 2 }),

  // --- s3 Everest Rice Mill ------------------------------------------------
  p("s3", "rice-grains-pulses", "Jeera Masino rice — 25 kg bora", "bora", 2890, {
    nameNe: "जिरा मसिनो चामल",
    minQuantity: 20,
    bulkPrice: 2810,
    bulkMinQuantity: 100,
    updatedDaysAgo: 6,
    description: "Mill-fresh aromatic short grain, the everyday choice for dal bhat service.",
  }),
  p("s3", "rice-grains-pulses", "Sona Mansuli rice — 50 kg bora", "bora", 3980, { minQuantity: 10, bulkPrice: 3870, bulkMinQuantity: 50, updatedDaysAgo: 6 }),
  p("s3", "rice-grains-pulses", "Basmati rice (aged) — 25 kg bora", "bora", 4750, { minQuantity: 10, updatedDaysAgo: 6 }),
  p("s3", "rice-grains-pulses", "Parboiled (usina) rice — 50 kg bora", "bora", 3420, { minQuantity: 10, updatedDaysAgo: 6 }),
  p("s3", "rice-grains-pulses", "Masoor dal (red lentil)", "kg", 178, { nameNe: "मसुरको दाल", minQuantity: 30, bulkPrice: 170, bulkMinQuantity: 100, updatedDaysAgo: 8 }),
  p("s3", "rice-grains-pulses", "Mung dal (split)", "kg", 212, { nameNe: "मुगको दाल", minQuantity: 30, updatedDaysAgo: 8 }),
  p("s3", "rice-grains-pulses", "Chana dal", "kg", 158, { minQuantity: 30, updatedDaysAgo: 8 }),
  p("s3", "rice-grains-pulses", "Rahar dal (toor)", "kg", 235, { nameNe: "रहरको दाल", minQuantity: 30, updatedDaysAgo: 8 }),
  p("s3", "rice-grains-pulses", "Beaten rice (chiura)", "kg", 112, { nameNe: "चिउरा", minQuantity: 25, updatedDaysAgo: 8 }),
  p("s3", "rice-grains-pulses", "Wheat flour (atta) — 50 kg", "bora", 3180, { nameNe: "गहुँको पिठो", minQuantity: 10, updatedDaysAgo: 8 }),
  p("s3", "rice-grains-pulses", "Maida (refined flour) — 50 kg", "bora", 3340, { minQuantity: 10, updatedDaysAgo: 8 }),
  p("s3", "rice-grains-pulses", "Rice bran (for feed)", "sack", 980, { minQuantity: 5, inStock: false, updatedDaysAgo: 22 }),

  // --- s4 Himalayan Dairy Udyog --------------------------------------------
  p("s4", "dairy", "Pasteurised whole milk", "litre", 96, {
    nameNe: "दूध",
    minQuantity: 20,
    bulkPrice: 92,
    bulkMinQuantity: 100,
    updatedDaysAgo: 4,
    description: "Delivered in 20-litre cans or 1-litre pouches. Can deposit refundable.",
  }),
  p("s4", "dairy", "Curd (dahi)", "kg", 148, { nameNe: "दही", minQuantity: 10, updatedDaysAgo: 4 }),
  p("s4", "dairy", "Paneer (fresh)", "kg", 645, { nameNe: "पनिर", minQuantity: 5, bulkPrice: 625, bulkMinQuantity: 20, updatedDaysAgo: 4 }),
  p("s4", "dairy", "Mozzarella cheese", "kg", 1020, { minQuantity: 2, bulkPrice: 985, bulkMinQuantity: 10, updatedDaysAgo: 4 }),
  p("s4", "dairy", "Processed cheese slices", "kg", 890, { minQuantity: 2, updatedDaysAgo: 11 }),
  p("s4", "dairy", "Table butter (unsalted)", "kg", 1080, { minQuantity: 2, updatedDaysAgo: 11 }),
  p("s4", "dairy", "Fresh cream (35% fat)", "litre", 560, { minQuantity: 2, updatedDaysAgo: 11 }),
  p("s4", "dairy", "Khuwa (mawa)", "kg", 820, { nameNe: "खुवा", minQuantity: 2, updatedDaysAgo: 11 }),
  p("s4", "dairy", "Pure cow ghee", "kg", 1395, { nameNe: "गाईको घिउ", minQuantity: 2, updatedDaysAgo: 14 }),
  p("s4", "dairy", "Lassi (sweetened, 200 ml)", "piece", 32, { minQuantity: 48, updatedDaysAgo: 14 }),

  // --- s5 Annapurna Wholesale Kirana ---------------------------------------
  p("s5", "wholesale-grocery", "White sugar — 50 kg bora", "bora", 5450, { nameNe: "चिनी", minQuantity: 2, updatedDaysAgo: 5 }),
  p("s5", "wholesale-grocery", "Iodised salt (1 kg × 50 packets)", "carton", 1180, { nameNe: "नुन", minQuantity: 2, updatedDaysAgo: 5 }),
  p("s5", "oil-ghee", "Sunflower oil — 15 litre tin", "tin", 3240, { brand: "Assorted refinery brands", minQuantity: 2, bulkPrice: 3180, bulkMinQuantity: 10, updatedDaysAgo: 2 }),
  p("s5", "oil-ghee", "Soyabean oil — 15 litre tin", "tin", 3060, { minQuantity: 2, updatedDaysAgo: 2 }),
  p("s5", "wholesale-grocery", "Tomato ketchup — 1 kg × 12", "carton", 1890, { minQuantity: 1, updatedDaysAgo: 12 }),
  p("s5", "wholesale-grocery", "Soy sauce — 700 ml × 12", "carton", 1560, { minQuantity: 1, updatedDaysAgo: 12 }),
  p("s5", "wholesale-grocery", "Vinegar — 700 ml × 12", "carton", 960, { minQuantity: 1, updatedDaysAgo: 12 }),
  p("s5", "wholesale-grocery", "Instant noodles — 75 g × 30", "carton", 735, { brand: "Mixed brands", minQuantity: 5, updatedDaysAgo: 12 }),
  p("s5", "wholesale-grocery", "Baking powder — 500 g", "packet", 185, { minQuantity: 6, updatedDaysAgo: 19 }),
  p("s5", "wholesale-grocery", "Corn flour — 1 kg", "packet", 155, { minQuantity: 10, updatedDaysAgo: 19 }),
  p("s5", "wholesale-grocery", "Tea bags — 100 pcs", "packet", 310, { minQuantity: 10, updatedDaysAgo: 19 }),
  p("s5", "spices-masala", "Turmeric powder — 1 kg", "packet", 335, { nameNe: "बेसार", minQuantity: 10, updatedDaysAgo: 19 }),
  p("s5", "wholesale-grocery", "Cashew nut (broken, W320)", "kg", 1680, { minQuantity: 5, updatedDaysAgo: 24 }),
  p("s5", "wholesale-grocery", "Raisin (kishmish)", "kg", 620, { minQuantity: 5, updatedDaysAgo: 24 }),

  // --- s6 Newa Bakery House ------------------------------------------------
  p("s6", "bakery", "Burger bun (75 mm, sesame)", "piece", 19, {
    minQuantity: 50,
    bulkPrice: 17,
    bulkMinQuantity: 300,
    updatedDaysAgo: 7,
    description: "Standard restaurant size. Custom diameters from 65–100 mm on a one-week lead time.",
  }),
  p("s6", "bakery", "Burger bun (plain, no sesame)", "piece", 17, { minQuantity: 50, bulkPrice: 15, bulkMinQuantity: 300, updatedDaysAgo: 7 }),
  p("s6", "bakery", "Sandwich bread loaf (400 g)", "piece", 78, { minQuantity: 20, updatedDaysAgo: 7 }),
  p("s6", "bakery", "Baguette (250 g)", "piece", 95, { minQuantity: 10, updatedDaysAgo: 7 }),
  p("s6", "bakery", "Pizza base (10 inch)", "piece", 62, { minQuantity: 20, bulkPrice: 56, bulkMinQuantity: 100, updatedDaysAgo: 7 }),
  p("s6", "bakery", "Croissant (plain)", "piece", 58, { minQuantity: 20, updatedDaysAgo: 13 }),
  p("s6", "bakery", "Pastry shell (tart, 3 inch)", "piece", 28, { minQuantity: 50, updatedDaysAgo: 13 }),
  p("s6", "bakery", "Chocolate cake sheet (1 kg)", "kg", 720, { minQuantity: 2, updatedDaysAgo: 13 }),
  p("s6", "bakery", "Dinner roll (50 g)", "piece", 14, { minQuantity: 100, updatedDaysAgo: 13 }),
  p("s6", "bakery", "Rusk / toast — 300 g packet", "packet", 95, { minQuantity: 20, updatedDaysAgo: 20 }),

  // --- s7 Gorkha Liquor & Beverage Distributors ----------------------------
  p("s7", "liquor-beverages", "Nepali lager beer 650 ml — crate of 12", "crate", 3480, {
    minQuantity: 5,
    bulkPrice: 3390,
    bulkMinQuantity: 20,
    updatedDaysAgo: 10,
    description: "Returnable crate and bottles. Deposit credited when empties come back.",
  }),
  p("s7", "liquor-beverages", "Nepali lager beer 330 ml can — carton of 24", "carton", 4320, { minQuantity: 2, updatedDaysAgo: 10 }),
  p("s7", "liquor-beverages", "Imported beer 330 ml — carton of 24", "carton", 7680, { minQuantity: 1, updatedDaysAgo: 10 }),
  p("s7", "liquor-beverages", "Blended whisky 750 ml (standard)", "bottle", 1480, { minQuantity: 6, updatedDaysAgo: 10 }),
  p("s7", "liquor-beverages", "Vodka 750 ml", "bottle", 1240, { minQuantity: 6, updatedDaysAgo: 10 }),
  p("s7", "liquor-beverages", "Rum 750 ml", "bottle", 1120, { minQuantity: 6, updatedDaysAgo: 10 }),
  p("s7", "liquor-beverages", "Red wine 750 ml (table)", "bottle", 1650, { minQuantity: 6, updatedDaysAgo: 16 }),
  p("s7", "liquor-beverages", "Cola 250 ml glass — crate of 24", "crate", 1320, { minQuantity: 5, updatedDaysAgo: 16 }),
  p("s7", "liquor-beverages", "Mineral water 1 litre — carton of 12", "carton", 288, { minQuantity: 10, bulkPrice: 275, bulkMinQuantity: 50, updatedDaysAgo: 16 }),
  p("s7", "liquor-beverages", "Mineral water 20 litre jar", "piece", 95, { minQuantity: 10, updatedDaysAgo: 16 }),
  p("s7", "liquor-beverages", "Energy drink 250 ml — carton of 24", "carton", 3120, { minQuantity: 2, updatedDaysAgo: 16 }),
  p("s7", "liquor-beverages", "Tonic water 250 ml — carton of 24", "carton", 1860, { minQuantity: 2, inStock: false, updatedDaysAgo: 34 }),

  // --- s8 Machhapuchhre Meat & Cold Store ----------------------------------
  p("s8", "meat-fish", "Mutton (khasi, curry cut)", "kg", 1285, { nameNe: "खसीको मासु", minQuantity: 5, bulkPrice: 1250, bulkMinQuantity: 25, updatedDaysAgo: 3 }),
  p("s8", "meat-fish", "Buff boneless", "kg", 545, { nameNe: "रांगाको मासु", minQuantity: 10, bulkPrice: 525, bulkMinQuantity: 50, updatedDaysAgo: 3 }),
  p("s8", "meat-fish", "Buff keema (mince)", "kg", 575, { minQuantity: 5, updatedDaysAgo: 3 }),
  p("s8", "meat-fish", "Pork belly", "kg", 680, { nameNe: "सुँगुरको मासु", minQuantity: 5, updatedDaysAgo: 3 }),
  p("s8", "meat-fish", "Pork ribs", "kg", 620, { minQuantity: 5, updatedDaysAgo: 3 }),
  p("s8", "meat-fish", "Dressed broiler chicken", "kg", 405, { minQuantity: 10, updatedDaysAgo: 3 }),
  p("s8", "meat-fish", "Rohu fish (fresh, whole)", "kg", 445, { nameNe: "रोहु माछा", minQuantity: 5, updatedDaysAgo: 5 }),
  p("s8", "meat-fish", "Trout (farmed, whole)", "kg", 1150, { minQuantity: 3, updatedDaysAgo: 5 }),
  p("s8", "meat-fish", "Prawns (frozen, medium)", "kg", 1380, { minQuantity: 2, updatedDaysAgo: 5 }),
  p("s8", "meat-fish", "Buff sukuti (dried)", "kg", 1750, { nameNe: "सुकुटी", minQuantity: 2, updatedDaysAgo: 18 }),
  p("s8", "meat-fish", "Sausage (pork, 1 kg pack)", "kg", 820, { minQuantity: 5, updatedDaysAgo: 18 }),

  // --- s9 Thamel Café Supply Co. -------------------------------------------
  p("s9", "tea-coffee", "Arabica coffee beans — medium roast", "kg", 1480, {
    minQuantity: 5,
    bulkPrice: 1420,
    bulkMinQuantity: 20,
    updatedDaysAgo: 8,
    description: "Washed Nepali arabica from Gulmi and Syangja. Roasted to order, whole bean or ground.",
  }),
  p("s9", "tea-coffee", "Arabica coffee beans — dark roast", "kg", 1450, { minQuantity: 5, updatedDaysAgo: 8 }),
  p("s9", "tea-coffee", "Espresso blend (arabica/robusta)", "kg", 1250, { minQuantity: 5, bulkPrice: 1195, bulkMinQuantity: 20, updatedDaysAgo: 8 }),
  p("s9", "tea-coffee", "Drinking chocolate powder", "kg", 980, { minQuantity: 3, updatedDaysAgo: 8 }),
  p("s9", "tea-coffee", "Vanilla syrup — 750 ml", "bottle", 760, { minQuantity: 6, updatedDaysAgo: 15 }),
  p("s9", "tea-coffee", "Caramel syrup — 750 ml", "bottle", 760, { minQuantity: 6, updatedDaysAgo: 15 }),
  p("s9", "tea-coffee", "Hazelnut syrup — 750 ml", "bottle", 795, { minQuantity: 6, updatedDaysAgo: 15 }),
  p("s9", "tea-coffee", "Paper cup 8 oz — sleeve of 50", "packet", 285, { minQuantity: 10, updatedDaysAgo: 15 }),
  p("s9", "tea-coffee", "Paper cup 12 oz — sleeve of 50", "packet", 340, { minQuantity: 10, updatedDaysAgo: 15 }),
  p("s9", "tea-coffee", "Espresso machine cleaning powder — 1 kg", "packet", 1150, { minQuantity: 1, updatedDaysAgo: 28 }),
  p("s9", "tea-coffee", "Green tea leaf (Ilam)", "kg", 1320, { minQuantity: 2, updatedDaysAgo: 28 }),

  // --- s10 Shree Ganesh Oil & Ghee Bhandar ---------------------------------
  p("s10", "oil-ghee", "Sunflower oil — 15 litre tin", "tin", 3150, { minQuantity: 5, bulkPrice: 3085, bulkMinQuantity: 20, updatedDaysAgo: 1 }),
  p("s10", "oil-ghee", "Soyabean oil — 15 litre tin", "tin", 2980, { minQuantity: 5, bulkPrice: 2920, bulkMinQuantity: 20, updatedDaysAgo: 1 }),
  p("s10", "oil-ghee", "Mustard oil (kachi ghani) — 15 litre tin", "tin", 3920, { nameNe: "तोरीको तेल", minQuantity: 5, updatedDaysAgo: 1 }),
  p("s10", "oil-ghee", "Rice bran oil — 15 litre tin", "tin", 3480, { minQuantity: 5, updatedDaysAgo: 1 }),
  p("s10", "oil-ghee", "Sunflower oil — 1 litre jar × 12", "carton", 2760, { minQuantity: 2, updatedDaysAgo: 6 }),
  p("s10", "oil-ghee", "Vanaspati ghee (dalda) — 15 kg tin", "tin", 3650, { minQuantity: 2, updatedDaysAgo: 6 }),
  p("s10", "oil-ghee", "Pure cow ghee — 1 kg jar", "piece", 1340, { minQuantity: 6, updatedDaysAgo: 6 }),
  p("s10", "oil-ghee", "Buffalo ghee — 1 kg jar", "piece", 1180, { minQuantity: 6, updatedDaysAgo: 6 }),
  p("s10", "oil-ghee", "Palm olein — 15 litre tin", "tin", 2680, { minQuantity: 5, inStock: false, updatedDaysAgo: 40 }),

  // --- s11 Pashupati Masala Udyog ------------------------------------------
  p("s11", "spices-masala", "Chilli powder (hot)", "kg", 495, { nameNe: "खुर्सानीको धुलो", minQuantity: 5, bulkPrice: 465, bulkMinQuantity: 25, updatedDaysAgo: 4 }),
  p("s11", "spices-masala", "Turmeric powder", "kg", 325, { nameNe: "बेसार", minQuantity: 5, bulkPrice: 305, bulkMinQuantity: 25, updatedDaysAgo: 4 }),
  p("s11", "spices-masala", "Coriander powder", "kg", 360, { nameNe: "धनियाँको धुलो", minQuantity: 5, updatedDaysAgo: 4 }),
  p("s11", "spices-masala", "Cumin powder", "kg", 780, { nameNe: "जिराको धुलो", minQuantity: 5, updatedDaysAgo: 4 }),
  p("s11", "spices-masala", "Garam masala", "kg", 920, { minQuantity: 2, updatedDaysAgo: 9 }),
  p("s11", "spices-masala", "Momo masala (house blend)", "kg", 880, { nameNe: "मःमः मसला", minQuantity: 2, updatedDaysAgo: 9 }),
  p("s11", "spices-masala", "Meat masala (house blend)", "kg", 940, { minQuantity: 2, updatedDaysAgo: 9 }),
  p("s11", "spices-masala", "Timur (Sichuan pepper), whole", "kg", 1450, { nameNe: "टिमुर", minQuantity: 1, updatedDaysAgo: 9 }),
  p("s11", "spices-masala", "Bay leaf (tejpat)", "kg", 420, { minQuantity: 2, updatedDaysAgo: 17 }),
  p("s11", "spices-masala", "Black cardamom (alainchi)", "kg", 2850, { nameNe: "अलैंची", minQuantity: 1, updatedDaysAgo: 17 }),
  p("s11", "spices-masala", "Dried red chilli (whole)", "kg", 530, { minQuantity: 5, updatedDaysAgo: 17 }),
  p("s11", "spices-masala", "Fenugreek (methi), whole", "kg", 215, { nameNe: "मेथी", minQuantity: 5, updatedDaysAgo: 17 }),

  // --- s12 Boudha Momo Wrapper & Noodle Udyog ------------------------------
  p("s12", "noodles-wrappers", "Momo wrapper 75 mm — 500 g packet", "packet", 98, {
    nameNe: "मःमः पिठो",
    minQuantity: 10,
    bulkPrice: 92,
    bulkMinQuantity: 50,
    updatedDaysAgo: 2,
    description: "About 55 wrappers per packet at 0.6 mm. Diameter and thickness made to order.",
  }),
  p("s12", "noodles-wrappers", "Momo wrapper 85 mm — 500 g packet", "packet", 102, { minQuantity: 10, updatedDaysAgo: 2 }),
  p("s12", "noodles-wrappers", "Wonton sheet — 500 g packet", "packet", 110, { minQuantity: 10, updatedDaysAgo: 2 }),
  p("s12", "noodles-wrappers", "Chowmein noodles (fresh) — 1 kg", "kg", 118, { nameNe: "चाउचाउ", minQuantity: 10, bulkPrice: 110, bulkMinQuantity: 50, updatedDaysAgo: 2 }),
  p("s12", "noodles-wrappers", "Thukpa noodles (flat) — 1 kg", "kg", 125, { minQuantity: 10, updatedDaysAgo: 5 }),
  p("s12", "noodles-wrappers", "Egg noodles — 1 kg", "kg", 148, { minQuantity: 10, updatedDaysAgo: 5 }),
  p("s12", "noodles-wrappers", "Spring roll sheet — 500 g packet", "packet", 135, { minQuantity: 10, updatedDaysAgo: 5 }),
  p("s12", "noodles-wrappers", "Maida (refined flour) — 25 kg", "bora", 1720, { minQuantity: 2, updatedDaysAgo: 12 }),

  // --- s13 Pokhara Hotel Equipment Centre ----------------------------------
  p("s13", "kitchen-equipment", "Commercial Chinese burner (single)", "piece", 28500, { minQuantity: 1, updatedDaysAgo: 21 }),
  p("s13", "kitchen-equipment", "Commercial gas range (4 burner)", "piece", 46500, { minQuantity: 1, updatedDaysAgo: 21 }),
  p("s13", "kitchen-equipment", "Clay tandoor (medium, insulated)", "piece", 38000, { minQuantity: 1, updatedDaysAgo: 21 }),
  p("s13", "kitchen-equipment", "Deep fryer (12 litre, electric)", "piece", 24500, { minQuantity: 1, updatedDaysAgo: 21 }),
  p("s13", "kitchen-equipment", "Stainless steel working table (6 ft)", "piece", 19800, { minQuantity: 1, updatedDaysAgo: 26 }),
  p("s13", "kitchen-equipment", "Under-counter chiller (2 door)", "piece", 92000, { minQuantity: 1, updatedDaysAgo: 26 }),
  p("s13", "kitchen-equipment", "Deep freezer (400 litre)", "piece", 72500, { minQuantity: 1, updatedDaysAgo: 26 }),
  p("s13", "kitchen-equipment", "Exhaust hood with filter (per running foot)", "piece", 4800, { minQuantity: 4, updatedDaysAgo: 26 }),
  p("s13", "kitchen-equipment", "Dinner plate, melamine (dozen)", "dozen", 2640, { minQuantity: 2, updatedDaysAgo: 33 }),
  p("s13", "kitchen-equipment", "Stainless steel stock pot (50 litre)", "piece", 8900, { minQuantity: 1, updatedDaysAgo: 33 }),
  p("s13", "kitchen-equipment", "Chef knife set (6 piece)", "piece", 6400, { minQuantity: 1, updatedDaysAgo: 33 }),

  // --- s14 Green Pack Nepal ------------------------------------------------
  p("s14", "packaging-disposables", "Kraft meal box 750 ml — pack of 50", "packet", 940, {
    minQuantity: 5,
    bulkPrice: 890,
    bulkMinQuantity: 20,
    updatedDaysAgo: 6,
    description: "Food-grade kraft with PE lining, leak resistant. Printable with your logo.",
  }),
  p("s14", "packaging-disposables", "Kraft meal box 1000 ml — pack of 50", "packet", 1180, { minQuantity: 5, updatedDaysAgo: 6 }),
  p("s14", "packaging-disposables", "Aluminium foil container 450 ml — pack of 100", "packet", 1420, { minQuantity: 2, updatedDaysAgo: 6 }),
  p("s14", "packaging-disposables", "Paper carry bag (medium) — pack of 100", "packet", 880, { minQuantity: 5, updatedDaysAgo: 6 }),
  p("s14", "packaging-disposables", "Paper cup 8 oz — pack of 100", "packet", 540, { minQuantity: 5, bulkPrice: 505, bulkMinQuantity: 30, updatedDaysAgo: 11 }),
  p("s14", "packaging-disposables", "Plastic lid for 8 oz cup — pack of 100", "packet", 320, { minQuantity: 5, updatedDaysAgo: 11 }),
  p("s14", "packaging-disposables", "Wooden cutlery set — pack of 100", "packet", 760, { minQuantity: 5, updatedDaysAgo: 11 }),
  p("s14", "packaging-disposables", "Paper straw — pack of 200", "packet", 420, { minQuantity: 5, updatedDaysAgo: 11 }),
  p("s14", "packaging-disposables", "Cling film 30 cm × 300 m", "piece", 680, { minQuantity: 6, updatedDaysAgo: 23 }),
  p("s14", "packaging-disposables", "Aluminium foil roll 30 cm × 150 m", "piece", 950, { minQuantity: 6, updatedDaysAgo: 23 }),
  p("s14", "packaging-disposables", "Custom-printed meal box (min 2,000 pcs)", "piece", 26, { minQuantity: 2000, updatedDaysAgo: 23 }),

  // --- s15 CleanPro Hygiene Supplies ---------------------------------------
  p("s15", "cleaning-hygiene", "Dishwash liquid concentrate — 5 litre", "piece", 880, { minQuantity: 4, bulkPrice: 840, bulkMinQuantity: 12, updatedDaysAgo: 9 }),
  p("s15", "cleaning-hygiene", "Kitchen degreaser — 5 litre", "piece", 1240, { minQuantity: 2, updatedDaysAgo: 9 }),
  p("s15", "cleaning-hygiene", "Floor cleaner (phenyl) — 5 litre", "piece", 620, { minQuantity: 4, updatedDaysAgo: 9 }),
  p("s15", "cleaning-hygiene", "Hand sanitiser 70% — 5 litre", "piece", 1480, { minQuantity: 2, updatedDaysAgo: 9 }),
  p("s15", "cleaning-hygiene", "Liquid hand wash — 5 litre", "piece", 790, { minQuantity: 2, updatedDaysAgo: 14 }),
  p("s15", "cleaning-hygiene", "Nitrile gloves (M) — box of 100", "packet", 740, { minQuantity: 5, updatedDaysAgo: 14 }),
  p("s15", "cleaning-hygiene", "Disposable chef cap — pack of 100", "packet", 310, { minQuantity: 5, updatedDaysAgo: 14 }),
  p("s15", "cleaning-hygiene", "Kitchen tissue roll — pack of 12", "packet", 690, { minQuantity: 4, updatedDaysAgo: 14 }),
  p("s15", "cleaning-hygiene", "Garbage bag (large) — pack of 50", "packet", 420, { minQuantity: 10, updatedDaysAgo: 29 }),
  p("s15", "cleaning-hygiene", "Scrub pad (heavy duty) — pack of 12", "packet", 360, { minQuantity: 5, updatedDaysAgo: 29 }),

  // --- s16 Bagmati Gas Udyog -----------------------------------------------
  p("s16", "gas-fuel", "LPG refill — 14.2 kg domestic cylinder", "piece", 1910, {
    nameNe: "ग्यास सिलिन्डर",
    minQuantity: 1,
    updatedDaysAgo: 30,
    description: "Government-regulated price. Empty cylinder must be exchanged at the time of delivery.",
  }),
  p("s16", "gas-fuel", "LPG refill — 45 kg commercial cylinder", "piece", 6950, { minQuantity: 1, updatedDaysAgo: 30 }),
  p("s16", "gas-fuel", "New 14.2 kg cylinder with deposit", "piece", 5200, { minQuantity: 1, updatedDaysAgo: 30 }),
  p("s16", "gas-fuel", "Commercial gas regulator (high pressure)", "piece", 2450, { minQuantity: 1, updatedDaysAgo: 30 }),
  p("s16", "gas-fuel", "LPG hose pipe (ISI, per metre)", "piece", 340, { minQuantity: 2, updatedDaysAgo: 36 }),
  p("s16", "gas-fuel", "Charcoal (hardwood) — 20 kg sack", "sack", 1280, { minQuantity: 2, updatedDaysAgo: 36 }),
  p("s16", "gas-fuel", "Briquette (beehive) — 25 kg sack", "sack", 920, { minQuantity: 2, updatedDaysAgo: 36 }),

  // --- s17 Terai Fresh Fish Centre -----------------------------------------
  p("s17", "meat-fish", "Rohu (live/iced, 1–2 kg size)", "kg", 385, { nameNe: "रोहु", minQuantity: 20, bulkPrice: 370, bulkMinQuantity: 100, updatedDaysAgo: 3 }),
  p("s17", "meat-fish", "Naini (mrigal)", "kg", 360, { minQuantity: 20, updatedDaysAgo: 3 }),
  p("s17", "meat-fish", "Common carp", "kg", 340, { minQuantity: 20, updatedDaysAgo: 3 }),
  p("s17", "meat-fish", "Mangur (catfish)", "kg", 420, { nameNe: "मंगुर", minQuantity: 10, updatedDaysAgo: 3 }),
  p("s17", "meat-fish", "Tilapia", "kg", 310, { minQuantity: 20, updatedDaysAgo: 7 }),
  p("s17", "meat-fish", "Grass carp", "kg", 355, { minQuantity: 20, updatedDaysAgo: 7 }),
  p("s17", "meat-fish", "Silver carp", "kg", 295, { minQuantity: 20, updatedDaysAgo: 7 }),
  p("s17", "meat-fish", "Fish fillet (rohu, cleaned)", "kg", 640, { minQuantity: 10, updatedDaysAgo: 7 }),

  // --- s18 Ilam Tea Traders ------------------------------------------------
  p("s18", "tea-coffee", "Orthodox whole leaf (first flush)", "kg", 2150, {
    minQuantity: 20,
    bulkPrice: 2050,
    bulkMinQuantity: 100,
    updatedDaysAgo: 12,
    description: "Spring-picked Ilam orthodox. Bright, floral cup for hotel service.",
  }),
  p("s18", "tea-coffee", "Orthodox whole leaf (second flush)", "kg", 1820, { minQuantity: 20, updatedDaysAgo: 12 }),
  p("s18", "tea-coffee", "CTC dust (strong, for milk tea)", "kg", 435, { nameNe: "चिया धुलो", minQuantity: 25, bulkPrice: 415, bulkMinQuantity: 100, updatedDaysAgo: 12 }),
  p("s18", "tea-coffee", "CTC granule (premium)", "kg", 560, { minQuantity: 25, updatedDaysAgo: 12 }),
  p("s18", "tea-coffee", "Green tea (hand rolled)", "kg", 1980, { minQuantity: 10, updatedDaysAgo: 20 }),
  p("s18", "tea-coffee", "White tea (silver needle)", "kg", 6800, { minQuantity: 2, updatedDaysAgo: 20 }),
  p("s18", "tea-coffee", "Masala chiya blend", "kg", 720, { minQuantity: 10, updatedDaysAgo: 20 }),
  p("s18", "tea-coffee", "Lemongrass tea (dried)", "kg", 880, { minQuantity: 5, inStock: false, updatedDaysAgo: 45 }),

  // --- s19 Ason Chamal & Dal Bhandar (valley stockist, above mill rate) ----
  p("s19", "rice-grains-pulses", "Jeera Masino rice — 25 kg bora", "bora", 3050, {
    nameNe: "जिरा मसिनो चामल",
    minQuantity: 5,
    bulkPrice: 2985,
    bulkMinQuantity: 25,
    updatedDaysAgo: 2,
    description: "Mill stock from Morang, broken down for valley kitchens. Five bora minimum.",
  }),
  p("s19", "rice-grains-pulses", "Sona Mansuli rice — 50 kg bora", "bora", 4180, { minQuantity: 5, updatedDaysAgo: 2 }),
  p("s19", "rice-grains-pulses", "Basmati rice (aged) — 25 kg bora", "bora", 4950, { minQuantity: 5, updatedDaysAgo: 2 }),
  p("s19", "rice-grains-pulses", "Masoor dal (red lentil)", "kg", 186, { nameNe: "मसुरको दाल", minQuantity: 10, updatedDaysAgo: 4 }),
  p("s19", "rice-grains-pulses", "Mung dal (split)", "kg", 222, { nameNe: "मुगको दाल", minQuantity: 10, updatedDaysAgo: 4 }),
  p("s19", "rice-grains-pulses", "Chana dal", "kg", 165, { minQuantity: 10, updatedDaysAgo: 4 }),
  p("s19", "rice-grains-pulses", "Beaten rice (chiura)", "kg", 118, { nameNe: "चिउरा", minQuantity: 10, updatedDaysAgo: 4 }),
  p("s19", "rice-grains-pulses", "Wheat flour (atta) — 50 kg", "bora", 3320, { nameNe: "गहुँको पिठो", minQuantity: 2, updatedDaysAgo: 9 }),
  p("s19", "rice-grains-pulses", "Maida (refined flour) — 50 kg", "bora", 3480, { minQuantity: 2, updatedDaysAgo: 9 }),

  // --- s20 Birgunj Grain & Pulse Traders (border importer, keenest on dal) -
  p("s20", "rice-grains-pulses", "Masoor dal (red lentil)", "kg", 171, {
    nameNe: "मसुरको दाल",
    minQuantity: 30,
    bulkPrice: 164,
    bulkMinQuantity: 300,
    updatedDaysAgo: 5,
    description: "30 kg bags. Our keenest line — we import direct through the Birgunj crossing.",
  }),
  p("s20", "rice-grains-pulses", "Mung dal (split)", "kg", 205, { nameNe: "मुगको दाल", minQuantity: 30, updatedDaysAgo: 5 }),
  p("s20", "rice-grains-pulses", "Chana dal", "kg", 152, { minQuantity: 30, bulkPrice: 146, bulkMinQuantity: 300, updatedDaysAgo: 5 }),
  p("s20", "rice-grains-pulses", "Rahar dal (toor)", "kg", 228, { nameNe: "रहरको दाल", minQuantity: 30, updatedDaysAgo: 5 }),
  p("s20", "rice-grains-pulses", "Urad dal (black gram)", "kg", 248, { minQuantity: 30, updatedDaysAgo: 11 }),
  p("s20", "rice-grains-pulses", "Jeera Masino rice — 25 kg bora", "bora", 2980, { minQuantity: 20, updatedDaysAgo: 11 }),
  p("s20", "rice-grains-pulses", "Sona Mansuli rice — 50 kg bora", "bora", 4050, { minQuantity: 20, updatedDaysAgo: 11 }),
  p("s20", "wholesale-grocery", "White sugar — 50 kg bora", "bora", 5280, { nameNe: "चिनी", minQuantity: 5, updatedDaysAgo: 11 }),
  p("s20", "wholesale-grocery", "Iodised salt (1 kg × 50 packets)", "carton", 1120, { minQuantity: 5, updatedDaysAgo: 18 }),

  // --- s21 Nepal Agro Poultry Centre (valley, low minimum, slight premium) -
  p("s21", "poultry-eggs", "Dressed broiler chicken (whole)", "kg", 406, {
    nameNe: "कुखुराको मासु",
    minQuantity: 10,
    bulkPrice: 396,
    bulkMinQuantity: 60,
    updatedDaysAgo: 1,
    description: "Dressed the morning of delivery at our Satdobato unit. 10 kg minimum.",
  }),
  p("s21", "poultry-eggs", "Boneless chicken breast", "kg", 598, { minQuantity: 5, updatedDaysAgo: 1 }),
  p("s21", "poultry-eggs", "Chicken leg / thigh (curry cut)", "kg", 458, { minQuantity: 5, updatedDaysAgo: 1 }),
  p("s21", "poultry-eggs", "Chicken mince (keema)", "kg", 535, { minQuantity: 5, updatedDaysAgo: 1 }),
  p("s21", "poultry-eggs", "Chicken wings", "kg", 425, { minQuantity: 5, updatedDaysAgo: 1 }),
  p("s21", "poultry-eggs", "Table eggs (white)", "crate", 449, { nameNe: "अण्डा", minQuantity: 5, updatedDaysAgo: 2 }),
  p("s21", "poultry-eggs", "Table eggs (brown)", "crate", 505, { minQuantity: 5, updatedDaysAgo: 2 }),
  p("s21", "poultry-eggs", "Local (sakini) chicken, dressed", "kg", 815, { minQuantity: 5, updatedDaysAgo: 6 }),

  // --- s22 Lakeside Fresh Vegetable Mart (Pokhara) -------------------------
  p("s22", "vegetables-fruits", "Tomato (local)", "kg", 78, { nameNe: "गोलभेँडा", minQuantity: 5, updatedDaysAgo: 0 }),
  p("s22", "vegetables-fruits", "Potato (red, Mude)", "kg", 62, { nameNe: "आलु", minQuantity: 10, bulkPrice: 57, bulkMinQuantity: 50, updatedDaysAgo: 0 }),
  p("s22", "vegetables-fruits", "Onion (dry)", "kg", 89, { nameNe: "प्याज", minQuantity: 10, updatedDaysAgo: 0 }),
  p("s22", "vegetables-fruits", "Cauliflower", "kg", 58, { nameNe: "काउली", minQuantity: 5, updatedDaysAgo: 0 }),
  p("s22", "vegetables-fruits", "Cabbage", "kg", 48, { nameNe: "बन्दा", minQuantity: 5, updatedDaysAgo: 0 }),
  p("s22", "vegetables-fruits", "Carrot", "kg", 82, { nameNe: "गाजर", minQuantity: 5, updatedDaysAgo: 0 }),
  p("s22", "vegetables-fruits", "Green chilli", "kg", 125, { nameNe: "हरियो खुर्सानी", minQuantity: 3, updatedDaysAgo: 1 }),
  p("s22", "vegetables-fruits", "Ginger", "kg", 175, { nameNe: "अदुवा", minQuantity: 3, updatedDaysAgo: 1 }),
  p("s22", "vegetables-fruits", "Mushroom (button)", "kg", 305, { minQuantity: 2, updatedDaysAgo: 1 }),
  p("s22", "vegetables-fruits", "Avocado (seasonal)", "kg", 420, { minQuantity: 2, inStock: false, updatedDaysAgo: 26 }),

  // --- s23 Koshi Wholesale Kirana Centre -----------------------------------
  p("s23", "oil-ghee", "Sunflower oil — 15 litre tin", "tin", 3190, { minQuantity: 2, bulkPrice: 3120, bulkMinQuantity: 15, updatedDaysAgo: 3 }),
  p("s23", "oil-ghee", "Soyabean oil — 15 litre tin", "tin", 3020, { minQuantity: 2, updatedDaysAgo: 3 }),
  p("s23", "oil-ghee", "Mustard oil (kachi ghani) — 15 litre tin", "tin", 3980, { nameNe: "तोरीको तेल", minQuantity: 2, updatedDaysAgo: 3 }),
  p("s23", "wholesale-grocery", "White sugar — 50 kg bora", "bora", 5320, { nameNe: "चिनी", minQuantity: 2, updatedDaysAgo: 3 }),
  p("s23", "wholesale-grocery", "Iodised salt (1 kg × 50 packets)", "carton", 1140, { minQuantity: 2, updatedDaysAgo: 8 }),
  p("s23", "wholesale-grocery", "Tomato ketchup — 1 kg × 12", "carton", 1820, { minQuantity: 1, updatedDaysAgo: 8 }),
  p("s23", "wholesale-grocery", "Soy sauce — 700 ml × 12", "carton", 1490, { minQuantity: 1, updatedDaysAgo: 8 }),
  p("s23", "wholesale-grocery", "Instant noodles — 75 g × 30", "carton", 710, { minQuantity: 5, updatedDaysAgo: 8 }),
  p("s23", "wholesale-grocery", "Corn flour — 1 kg", "packet", 148, { minQuantity: 10, updatedDaysAgo: 15 }),
  p("s23", "oil-ghee", "Vanaspati ghee (dalda) — 15 kg tin", "tin", 3580, { minQuantity: 2, updatedDaysAgo: 15 }),

  // --- s24 Patan Bread Factory (volume, cheaper per piece) -----------------
  p("s24", "bakery", "Burger bun (75 mm, sesame)", "piece", 16, {
    minQuantity: 200,
    bulkPrice: 14.5,
    bulkMinQuantity: 1000,
    updatedDaysAgo: 5,
    description: "Machine-portioned to a set weight, so every bun matches. 200-piece minimum.",
  }),
  p("s24", "bakery", "Burger bun (plain, no sesame)", "piece", 14.5, { minQuantity: 200, bulkPrice: 13, bulkMinQuantity: 1000, updatedDaysAgo: 5 }),
  p("s24", "bakery", "Sandwich bread loaf (400 g)", "piece", 70, { minQuantity: 200, updatedDaysAgo: 5 }),
  p("s24", "bakery", "Pizza base (10 inch)", "piece", 54, { minQuantity: 200, bulkPrice: 49, bulkMinQuantity: 1000, updatedDaysAgo: 5 }),
  p("s24", "bakery", "Dinner roll (50 g)", "piece", 11.5, { minQuantity: 200, updatedDaysAgo: 10 }),
  p("s24", "bakery", "Hot dog roll (6 inch)", "piece", 17, { minQuantity: 200, updatedDaysAgo: 10 }),
  p("s24", "bakery", "Garlic bread base", "piece", 46, { minQuantity: 200, updatedDaysAgo: 10 }),

  // --- s25 Valley Dairy Collection Centre ----------------------------------
  p("s25", "dairy", "Pasteurised whole milk", "litre", 92, {
    nameNe: "दूध",
    minQuantity: 10,
    bulkPrice: 89,
    bulkMinQuantity: 60,
    updatedDaysAgo: 2,
    description: "Collected from 180 households in Bhaktapur and Kavre. 20-litre cans or pouches.",
  }),
  p("s25", "dairy", "Curd (dahi)", "kg", 142, { nameNe: "दही", minQuantity: 5, updatedDaysAgo: 2 }),
  p("s25", "dairy", "Paneer (fresh)", "kg", 620, { nameNe: "पनिर", minQuantity: 2, updatedDaysAgo: 2 }),
  p("s25", "dairy", "Table butter (unsalted)", "kg", 1050, { minQuantity: 1, updatedDaysAgo: 7 }),
  p("s25", "dairy", "Juju dhau (clay pot, 200 g)", "piece", 88, {
    nameNe: "जुजु धौ",
    minQuantity: 20,
    updatedDaysAgo: 7,
    description: "Bhaktapur's king curd, set in clay. Pots are included and not returnable.",
  }),
  p("s25", "dairy", "Khuwa (mawa)", "kg", 795, { nameNe: "खुवा", minQuantity: 2, updatedDaysAgo: 7 }),
  p("s25", "dairy", "Pure cow ghee", "kg", 1360, { nameNe: "गाईको घिउ", minQuantity: 1, updatedDaysAgo: 13 }),

  // --- s26 Butwal Beverage Depot -------------------------------------------
  p("s26", "liquor-beverages", "Nepali lager beer 650 ml — crate of 12", "crate", 3420, {
    minQuantity: 5,
    bulkPrice: 3340,
    bulkMinQuantity: 25,
    updatedDaysAgo: 6,
    description: "Returnable crate and bottles, credited against the agreed deposit.",
  }),
  p("s26", "liquor-beverages", "Nepali lager beer 330 ml can — carton of 24", "carton", 4260, { minQuantity: 2, updatedDaysAgo: 6 }),
  p("s26", "liquor-beverages", "Blended whisky 750 ml (standard)", "bottle", 1455, { minQuantity: 6, updatedDaysAgo: 6 }),
  p("s26", "liquor-beverages", "Vodka 750 ml", "bottle", 1215, { minQuantity: 6, updatedDaysAgo: 6 }),
  p("s26", "liquor-beverages", "Rum 750 ml", "bottle", 1095, { minQuantity: 6, updatedDaysAgo: 12 }),
  p("s26", "liquor-beverages", "Mineral water 1 litre — carton of 12", "carton", 282, { minQuantity: 10, updatedDaysAgo: 12 }),
  p("s26", "liquor-beverages", "Mineral water 20 litre jar", "piece", 88, { minQuantity: 10, updatedDaysAgo: 12 }),
  p("s26", "liquor-beverages", "Cola 250 ml glass — crate of 24", "crate", 1290, { minQuantity: 5, updatedDaysAgo: 12 }),
];
