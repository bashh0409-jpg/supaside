export interface Product {
  id: string;
  name: string;
  brand: string;
  color: string;
  style: string;
  description: string;
  imageUrl: string;
  images?: { src: string; alt: string }[];
  priceCents: number;
  compareAtPriceCents?: number;
  isBestSelling: boolean;
}

export const sampleUkSizes = [
  { size: "3", available: false },
  { size: "3.5", available: true },
  { size: "4", available: true },
  { size: "4.5", available: true },
  { size: "5", available: true },
  { size: "5.5", available: false },
  { size: "6", available: true },
  { size: "6.5", available: true },
  { size: "7", available: true },
  { size: "7.5", available: true },
  { size: "8", available: true },
  { size: "8.5", available: true },
  { size: "9", available: true },
  { size: "9.5", available: false },
  { size: "10", available: true },
  { size: "10.5", available: false },
  { size: "11", available: true },
  { size: "12", available: false },
] as const;

export const sampleProducts: Product[] = [
  {
    id: "Nike_Air_Force_1",
    name: "Nike Air Force 1 '07",
    brand: "Nike",
    color: "White / Black",
    style: "CW2288-111",
    description:
      "A basketball original with crisp leather, classic Nike Air cushioning and an easy-to-style low profile.",
    imageUrl:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    priceCents: 179900,
    compareAtPriceCents: 199900,
    isBestSelling: true,
  },
  {
    id: "NIKE_AIR_FORCE_1_07_LV8_CD",
    name: "Nike Airforce 1 '07 LV8 CD",
    brand: "Nike",
    color: "White / Black",
    style: "CW2284-111",
    description:
      "The radiance lives on in the Nike Air Force 1 Low '07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colours and the perfect amount of flash to make you shine. Water-repellent Cordura fabric makes these kicks your favourites on rainy days.",
    imageUrl:
      "/original.avif",
    priceCents: 179900,
    images: [
      { src: "/original.avif", alt: "Nike airforce 1 '07 LVB CD side view" },
      { src: "/originalsole.avif", alt: "Nike airforce 1 '07 LVB CD outsole" },
    ],
    compareAtPriceCents: 199900,
    isBestSelling: true,
  },
  {
    id: "Nike_Dunk_Low_Retro",
    name: "Nike Dunk Low Retro",
    brand: "Nike",
    color: "White / Grey",
    style: "IB4417-100",
    description:
      "Born on the basketball court, the Nike Dunk became a skateboarding favourite with its flat, grippy sole and timeless low-top shape.",
    imageUrl: "/nike.avif",
    images: [
      { src: "/nike.avif", alt: "Nike Dunk Low Retro side view" },
      { src: "/nikelo.avif", alt: "Nike Dunk Low Retro outsole" },
    ],
    priceCents: 189900,
    compareAtPriceCents: 199900,
    isBestSelling: true,
  },
  {
    id: "Adidas_Samba_OG",
    name: "Adidas Samba OG",
    brand: "Adidas",
    color: "White / Black",
    style: "B75806",
    description:
      "A terrace classic with a smooth leather upper, suede overlays and the signature gum rubber outsole.",
    imageUrl:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    priceCents: 169900,
    compareAtPriceCents: 189900,
    isBestSelling: true,
  },
  {
    id: "New_Balance_550",
    name: "New Balance 550",
    brand: "New Balance",
    color: "White / Green",
    style: "BB550",
    description:
      "Inspired by an original 1989 basketball design, the New Balance 550 pairs a clean court profile with everyday comfort.",
    imageUrl:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=800&q=80",
    priceCents: 199900,
    isBestSelling: false,
  },
  {
    id: "Nike_Air_Max_90",
    name: "Nike Air Max 90",
    brand: "Nike",
    color: "Black / Red",
    style: "CN8490-002",
    description:
      "A streetwear staple with visible Air cushioning and the bold lines of the original 1990 design.",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    priceCents: 209900,
    compareAtPriceCents: 239900,
    isBestSelling: true,
  },
  {
    id: "Adidas_Campus_00s",
    name: "Adidas Campus 00s",
    brand: "Adidas",
    color: "Grey / White",
    style: "HQ8708",
    description:
      "A skate-inspired take on the Campus, updated with a plush suede upper and an oversized, laid-back profile.",
    imageUrl:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
    priceCents: 159900,
    isBestSelling: false,
  },
  {
    id: "Adidas_Campus_00s_2",
    name: "Adidas Campus 00s",
    brand: "Adidas",
    color: "Grey / White",
    style: "HQ8708",
    description:
      "A skate-inspired take on the Campus, updated with a plush suede upper and an oversized, laid-back profile.",
    imageUrl:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
    priceCents: 159900,
    isBestSelling: false,
  },
  {
    id: "Adidas_Campus_00s_3",
    name: "Adidas Campus 00s",
    brand: "Adidas",
    color: "Grey / White",
    style: "HQ8708",
    description:
      "A skate-inspired take on the Campus, updated with a plush suede upper and an oversized, laid-back profile.",
    imageUrl:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
    priceCents: 159900,
    isBestSelling: false,
  },
];
