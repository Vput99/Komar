export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageColor: string;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Lumina Glow Serum",
    description: "Botanical extracts for a radiant, dewy finish.",
    price: 345000,
    category: "Serum",
    imageColor: "bg-pastel-rose",
  },
  {
    id: "p2",
    name: "Aura Rose Mist",
    description: "Hydrating floral water that revitalizes tired skin.",
    price: 185000,
    category: "Toner",
    imageColor: "bg-pastel-sage",
  },
  {
    id: "p3",
    name: "Earth Clay Mask",
    description: "Purifying natural clay to detoxify and smooth.",
    price: 225000,
    category: "Mask",
    imageColor: "bg-pastel-sage-dark",
  },
  {
    id: "p4",
    name: "Botanica Face Cream",
    description: "Rich, nourishing cream with essential herbal oils.",
    price: 415000,
    category: "Moisturizer",
    imageColor: "bg-pastel-rose-dark",
  },
];

export const shippingOptions = [
  { id: "s1", name: "Eco Standard", price: 15000, est: "3-5 Days" },
  { id: "s2", name: "Swift Priority", price: 35000, est: "1-2 Days" },
];

export const paymentOptions = [
  { id: "pay1", name: "Bank Transfer", details: "BCA, Mandiri, BNI" },
  { id: "pay2", name: "E-Wallet", details: "GoPay, OVO, ShopeePay" },
  { id: "pay3", name: "Credit Card", details: "Visa, Mastercard" },
];

export const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
