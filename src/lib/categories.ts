import type { Category } from "./types";

/**
 * Supply categories, written from the point of view of a restaurant owner
 * doing their weekly buying. Each one maps to a real trade in the Nepali
 * wholesale market.
 */
export const CATEGORIES: Category[] = [
  {
    id: "c1",
    slug: "poultry-eggs",
    name: "Poultry & Eggs",
    nameNe: "कुखुरा तथा अण्डा",
    icon: "Egg",
    description:
      "Poultry farms and broiler/layer suppliers — live birds, dressed chicken, and eggs by the crate.",
    sortOrder: 1,
  },
  {
    id: "c2",
    slug: "meat-fish",
    name: "Meat & Fish",
    nameNe: "मासु तथा माछा",
    icon: "Fish",
    description:
      "Mutton, buff, pork and fresh or frozen fish from wholesale butchers and cold stores.",
    sortOrder: 2,
  },
  {
    id: "c3",
    slug: "vegetables-fruits",
    name: "Vegetables & Fruits",
    nameNe: "तरकारी तथा फलफूल",
    icon: "Carrot",
    description:
      "Daily fresh produce from Kalimati-style wholesale traders and farm collection centres.",
    sortOrder: 3,
  },
  {
    id: "c4",
    slug: "rice-grains-pulses",
    name: "Rice, Grains & Pulses",
    nameNe: "चामल, अन्न तथा दाल",
    icon: "Wheat",
    description:
      "Rice mills and grain wholesalers — basmati, jeera masino, sona mansuli, dal, flour and beaten rice.",
    sortOrder: 4,
  },
  {
    id: "c5",
    slug: "wholesale-grocery",
    name: "Wholesale Grocery (Kirana)",
    nameNe: "थोक किराना",
    icon: "ShoppingBasket",
    description:
      "General kirana wholesalers stocking everything from noodles and sauces to tinned goods.",
    sortOrder: 5,
  },
  {
    id: "c6",
    slug: "dairy",
    name: "Dairy Products",
    nameNe: "दुग्ध पदार्थ",
    icon: "Milk",
    description:
      "Milk, curd, paneer, cheese, butter and cream from dairies and chilling centres.",
    sortOrder: 6,
  },
  {
    id: "c7",
    slug: "bakery",
    name: "Bakery & Confectionery",
    nameNe: "बेकरी तथा मिठाई",
    icon: "Croissant",
    description:
      "Wholesale bakeries supplying bread, buns, pastries, cakes and burger/momo buns daily.",
    sortOrder: 7,
  },
  {
    id: "c8",
    slug: "liquor-beverages",
    name: "Liquor & Beverages",
    nameNe: "मदिरा तथा पेय पदार्थ",
    icon: "Wine",
    description:
      "Licensed liquor distributors, beer depots and soft drink/mineral water wholesalers.",
    sortOrder: 8,
  },
  {
    id: "c9",
    slug: "oil-ghee",
    name: "Cooking Oil & Ghee",
    nameNe: "तेल तथा घिउ",
    icon: "Droplet",
    description:
      "Sunflower, soyabean and mustard oil in tins and jars, plus dalda and pure ghee.",
    sortOrder: 9,
  },
  {
    id: "c10",
    slug: "spices-masala",
    name: "Spices & Masala",
    nameNe: "मसला",
    icon: "Flame",
    description:
      "Whole and ground spices, timur, masala blends, dried chilli and pickling ingredients.",
    sortOrder: 10,
  },
  {
    id: "c11",
    slug: "noodles-wrappers",
    name: "Noodles & Momo Wrappers",
    nameNe: "चाउचाउ तथा मःमः पिठो",
    icon: "Soup",
    description:
      "Chowmein noodles, momo wrappers, maida and semi-prepared items for Nepali kitchens.",
    sortOrder: 11,
  },
  {
    id: "c12",
    slug: "tea-coffee",
    name: "Tea, Coffee & Café Supplies",
    nameNe: "चिया तथा कफी",
    icon: "Coffee",
    description:
      "Ilam orthodox tea, CTC dust, roasted coffee beans, syrups and café consumables.",
    sortOrder: 12,
  },
  {
    id: "c13",
    slug: "kitchen-equipment",
    name: "Kitchen Equipment",
    nameNe: "भान्सा उपकरण",
    icon: "CookingPot",
    description:
      "Commercial burners, tandoors, fridges, utensils, crockery and cutlery for restaurants.",
    sortOrder: 13,
  },
  {
    id: "c14",
    slug: "packaging-disposables",
    name: "Packaging & Disposables",
    nameNe: "प्याकेजिङ",
    icon: "Package",
    description:
      "Takeaway boxes, paper bags, foil containers, cups, straws and printed packaging.",
    sortOrder: 14,
  },
  {
    id: "c15",
    slug: "cleaning-hygiene",
    name: "Cleaning & Hygiene",
    nameNe: "सरसफाइ सामग्री",
    icon: "SprayCan",
    description:
      "Dishwash, floor cleaner, sanitiser, gloves, tissue and pest control supplies in bulk.",
    sortOrder: 15,
  },
  {
    id: "c16",
    slug: "gas-fuel",
    name: "LP Gas & Fuel",
    nameNe: "ग्यास तथा इन्धन",
    icon: "Fuel",
    description:
      "Commercial LPG cylinder dealers, briquette and charcoal suppliers with refill delivery.",
    sortOrder: 16,
  },
];

const bySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug);
}

export function getCategoryName(slug: string): string {
  return bySlug.get(slug)?.name ?? slug;
}

export function categoryExists(slug: string): boolean {
  return bySlug.has(slug);
}
