import type { Review } from "../types";

/** Sample reviews left by buyer businesses. Fictional, for demo mode only. */
export const SEED_REVIEWS: Review[] = [
  {
    id: "r1",
    supplierId: "s1",
    authorName: "Bibek Shrestha",
    authorBusiness: "Momo Ghar, Jhamsikhel",
    rating: 5,
    comment:
      "Three years with them now. The 4:30 AM truck has never let us down, and if the tomato quality is poor they call us before loading instead of just sending it.",
    createdAt: "2026-09-18T05:12:00.000Z",
  },
  {
    id: "r2",
    supplierId: "s1",
    authorName: "Sarita Maharjan",
    authorBusiness: "Newa Kitchen, Patan",
    rating: 4,
    comment:
      "Good rates and reliable, but the daily rate system means I cannot budget a month ahead. Fine once you get used to calling every evening.",
    createdAt: "2026-10-02T09:40:00.000Z",
  },
  {
    id: "r3",
    supplierId: "s2",
    authorName: "Rajan Thapa",
    authorBusiness: "Hotel Himalaya Grill, Thamel",
    rating: 5,
    comment:
      "The weekly fixed rate saved us during the Dashain price spike. Cold chain is genuinely maintained — the crates still have ice when they reach us.",
    createdAt: "2026-10-28T11:05:00.000Z",
  },
  {
    id: "r4",
    supplierId: "s2",
    authorName: "Anisha Gurung",
    authorBusiness: "Chicken House, Bharatpur",
    rating: 5,
    comment: "Weighing slip with every crate means no arguments at month end. Very professional operation.",
    createdAt: "2026-11-05T06:30:00.000Z",
  },
  {
    id: "r5",
    supplierId: "s3",
    authorName: "Dipesh Karki",
    authorBusiness: "Annapurna Hostel Mess, Biratnagar",
    rating: 5,
    comment:
      "Mill-direct pricing is roughly Rs 150 per bora cheaper than our old wholesaler. For 60 bora a month that is real money.",
    createdAt: "2026-08-22T07:15:00.000Z",
  },
  {
    id: "r6",
    supplierId: "s3",
    authorName: "Kiran Rai",
    authorBusiness: "Everest Caterers",
    rating: 4,
    comment:
      "Quality is consistent. The only pain is the Wednesday-only truck to Kathmandu — if you miss it you wait a week.",
    createdAt: "2026-09-30T04:50:00.000Z",
  },
  {
    id: "r7",
    supplierId: "s4",
    authorName: "Pemba Sherpa",
    authorBusiness: "Café Soma, Baluwatar",
    rating: 5,
    comment:
      "Standing order is exactly what a café needs. Milk and paneer are at the door by 5:30 every morning without a single phone call from us.",
    createdAt: "2026-11-12T03:20:00.000Z",
  },
  {
    id: "r8",
    supplierId: "s4",
    authorName: "Nirmala Tamang",
    authorBusiness: "Sweet Corner, Pulchowk",
    rating: 4,
    comment: "Mozzarella is good value compared to imported. Crate deposit system is a bit of paperwork but fair.",
    createdAt: "2026-10-14T08:00:00.000Z",
  },
  {
    id: "r9",
    supplierId: "s5",
    authorName: "Hari Bahadur Basnet",
    authorBusiness: "Basnet Bhojanalaya, Kalimati",
    rating: 4,
    comment:
      "Not the cheapest on any single item, but I send one list and get everything in one delivery. The time saved is worth the few rupees.",
    createdAt: "2026-07-19T10:25:00.000Z",
  },
  {
    id: "r10",
    supplierId: "s6",
    authorName: "Suman Lama",
    authorBusiness: "Burger Point, Koteshwor",
    rating: 5,
    comment:
      "They made us a custom 90 mm bun for our signature burger with no extra charge. Delivered at 5 AM sharp every single day.",
    createdAt: "2026-11-01T02:45:00.000Z",
  },
  {
    id: "r11",
    supplierId: "s7",
    authorName: "Arjun Shahi",
    authorBusiness: "The Attic Bar, Lazimpat",
    rating: 4,
    comment:
      "Full bar stock on one invoice and one delivery. Licence verification took three days at the start but that is reassuring, not annoying.",
    createdAt: "2026-09-07T12:10:00.000Z",
  },
  {
    id: "r12",
    supplierId: "s8",
    authorName: "Milan Poudel",
    authorBusiness: "Lakeside Steakhouse, Pokhara",
    rating: 5,
    comment:
      "Cut-to-spec is the big one for us. We order boneless at a set thickness and it arrives exactly that way, vacuum packed.",
    createdAt: "2026-10-20T13:35:00.000Z",
  },
  {
    id: "r13",
    supplierId: "s9",
    authorName: "Pratima Joshi",
    authorBusiness: "Brew Lab, Jhamsikhel",
    rating: 5,
    comment:
      "Roast-to-order makes a visible difference in the cup. Free grinder calibration every month has kept our shots consistent.",
    createdAt: "2026-11-08T07:55:00.000Z",
  },
  {
    id: "r14",
    supplierId: "s11",
    authorName: "Ramesh Shrestha",
    authorBusiness: "Spice Route Restaurant, Durbarmarg",
    rating: 5,
    comment:
      "They matched our old chef's masala recipe after two sample batches. Grind date printed on the pouch is a nice touch.",
    createdAt: "2026-10-06T09:05:00.000Z",
  },
  {
    id: "r15",
    supplierId: "s12",
    authorName: "Tashi Dolma",
    authorBusiness: "Boudha Momo Centre",
    rating: 5,
    comment: "Fresh wrappers twice a day at our thickness. We stopped making our own and never looked back.",
    createdAt: "2026-11-15T04:10:00.000Z",
  },
  {
    id: "r16",
    supplierId: "s14",
    authorName: "Sabin Maharjan",
    authorBusiness: "Wrap It Up (cloud kitchen)",
    rating: 4,
    comment:
      "Printed boxes came out well and the 2,000-piece minimum is manageable. Plain stock same-day is a lifesaver when we run short.",
    createdAt: "2026-09-25T06:20:00.000Z",
  },
  {
    id: "r17",
    supplierId: "s16",
    authorName: "Gopal Adhikari",
    authorBusiness: "Adhikari Sekuwa Corner",
    rating: 4,
    comment: "Same-day swap genuinely works. They also replaced our old hose during a routine check without being asked.",
    createdAt: "2026-10-30T15:00:00.000Z",
  },
  {
    id: "r18",
    supplierId: "s18",
    authorName: "Deepak Limbu",
    authorBusiness: "Hotel Kanchanjangha, Birtamod",
    rating: 5,
    comment:
      "Sent us three free samples before we committed. The second flush orthodox is what we now serve in all our rooms.",
    createdAt: "2026-08-11T05:45:00.000Z",
  },
  {
    id: "r19",
    supplierId: "s19",
    authorName: "Krishna Maharjan",
    authorBusiness: "Maharjan Bhojanalaya, Kalimati",
    rating: 4,
    comment:
      "A bit dearer than buying from the mill, but we only get through eight bora a month — nobody in Biratnagar wants that order. They deliver the same day and will take back a bad bora without arguing.",
    createdAt: "2026-10-11T07:30:00.000Z",
  },
  {
    id: "r20",
    supplierId: "s20",
    authorName: "Suresh Yadav",
    authorBusiness: "Yadav Caterers, Birgunj",
    rating: 4,
    comment:
      "Best dal rates I have found anywhere. The catch is the 30,000 minimum and the two-day wait for a Kathmandu truck — fine if you plan a month ahead.",
    createdAt: "2026-09-14T05:50:00.000Z",
  },
  {
    id: "r21",
    supplierId: "s21",
    authorName: "Rita Tamang",
    authorBusiness: "Tamang Momo Corner, Satdobato",
    rating: 5,
    comment:
      "The 4,000 minimum is what makes them work for a shop our size. Chicken is dressed that morning and the 1 PM run saves us when we sell out at lunch.",
    createdAt: "2026-11-19T08:15:00.000Z",
  },
  {
    id: "r22",
    supplierId: "s22",
    authorName: "Dawa Sherpa",
    authorBusiness: "Lakeside Kitchen, Pokhara",
    rating: 4,
    comment:
      "Reliable morning delivery through the season. Rates climb in monsoon but so does everyone's. Rejecting a crate at the door is genuinely no trouble with them.",
    createdAt: "2026-10-25T04:05:00.000Z",
  },
  {
    id: "r23",
    supplierId: "s24",
    authorName: "Anil Shakya",
    authorBusiness: "Burger Yard (3 outlets)",
    rating: 5,
    comment:
      "We moved 1,200 buns a week here from a smaller bakery and saved about Rs 3,600 a week. Every bun is the same weight, which matters when you are costing a menu.",
    createdAt: "2026-11-03T09:40:00.000Z",
  },
  {
    id: "r24",
    supplierId: "s25",
    authorName: "Sabina Duwal",
    authorBusiness: "Thimi Chiya Pasal",
    rating: 5,
    comment:
      "Rs 1,500 minimum means a small shop can buy straight from a chilling centre. The juju dhau in clay pots sells out every Saturday.",
    createdAt: "2026-11-16T06:25:00.000Z",
  },
  {
    id: "r25",
    supplierId: "s26",
    authorName: "Manoj Chaudhary",
    authorBusiness: "Riverside Party Palace, Butwal",
    rating: 4,
    comment:
      "Dependable for events. Plan around dry days — they warn you, but you still have to think a week ahead for a wedding.",
    createdAt: "2026-10-08T11:20:00.000Z",
  },
  {
    id: "r26",
    supplierId: "s23",
    authorName: "Narayan Limbu",
    authorBusiness: "Limbu Hostel Mess, Dharan",
    rating: 4,
    comment:
      "One monthly list, one delivery, one invoice. Oil tins are a touch above the Butwal depot but we are in the east, so freight more than makes up for it.",
    createdAt: "2026-09-21T10:00:00.000Z",
  },
];
