import type { Inquiry } from "../types";

/** Sample inbox for the demo supplier dashboard. Fictional. */
export const SEED_INQUIRIES: Inquiry[] = [
  {
    id: "i1",
    supplierId: "s2",
    buyerId: null,
    buyerName: "Rajan Thapa",
    buyerBusiness: "Hotel Himalaya Grill, Thamel",
    buyerType: "hotel",
    phone: "9841002233",
    email: "purchase@himalayagrill.example.np",
    message:
      "We need a standing weekly order for dressed broiler. Can you quote a fixed weekly rate if we commit to 150 kg per week for three months?",
    items: [
      { productId: "p15", name: "Dressed broiler chicken (whole)", quantity: 150, unit: "kg" },
      { productId: "p21", name: "Table eggs (white)", quantity: 30, unit: "crate" },
    ],
    status: "new",
    createdAt: "2026-11-24T04:20:00.000Z",
  },
  {
    id: "i2",
    supplierId: "s2",
    buyerId: null,
    buyerName: "Sunita Gurung",
    buyerBusiness: "Café Everest, Lakeside Pokhara",
    buyerType: "cafe",
    phone: "9856112233",
    email: null,
    message:
      "Do you deliver to Pokhara on Mondays? We would start with 40 kg boneless breast per week and grow from there.",
    items: [{ productId: "p16", name: "Boneless chicken breast", quantity: 40, unit: "kg" }],
    status: "responded",
    createdAt: "2026-11-21T09:05:00.000Z",
  },
  {
    id: "i3",
    supplierId: "s2",
    buyerId: null,
    buyerName: "Bikash Shrestha",
    buyerBusiness: "Momo Station, Koteshwor",
    buyerType: "restaurant",
    phone: "9808887766",
    email: "momostation@example.np",
    message:
      "Looking for chicken mince for momo filling, around 60 kg twice a week. What is your rate and can you do 15-day credit?",
    items: [{ productId: "p19", name: "Chicken mince (keema)", quantity: 60, unit: "kg" }],
    status: "quoted",
    createdAt: "2026-11-18T06:45:00.000Z",
  },
  {
    id: "i4",
    supplierId: "s2",
    buyerId: null,
    buyerName: "Prakash Adhikari",
    buyerBusiness: "Adhikari Catering Service",
    buyerType: "catering",
    phone: "9845556677",
    email: null,
    message:
      "One-off requirement for a wedding on 15 Poush — about 300 kg dressed chicken delivered to Bharatpur. Can you confirm availability?",
    items: [{ productId: "p15", name: "Dressed broiler chicken (whole)", quantity: 300, unit: "kg" }],
    status: "closed",
    createdAt: "2026-11-09T11:30:00.000Z",
  },
];
