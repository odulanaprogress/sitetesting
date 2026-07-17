import product1 from '../../imports/product_1-1.jpeg';
import product2 from '../../imports/product2-1.jpeg';
import product2b from '../../imports/product2-2.jpeg';
import product3 from '../../imports/product_3-1.jpeg';
import product4 from '../../imports/product4-1.jpeg';
import product5 from '../../imports/product5-1.jpeg';
import product6 from '../../imports/product6-1.jpeg';
import product7 from '../../imports/product7-1.jpeg';
import product8 from '../../imports/product8.jpeg';
import product9 from '../../imports/product9-1.jpeg';

export interface Product {
  id: string;
  name: string;
  price: number;
  wholesalePrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  images?: string[];
  shortDescription?: string;
  description: string;
  stock: number;
  rating: number;
  reviews: number;
  variants?: { name: string; options: string[] }[];
  featured?: boolean;
  hot?: boolean;
  wholesaleAvailable?: boolean;
  isNewArrival?: boolean;
}

export const categories = [
  { id: 'phone-accessories', name: 'Phone Accessories', icon: '📱' },
  { id: 'charging-accessories', name: 'Charging Accessories', icon: '🔋' },
  { id: 'computer-accessories', name: 'Computer Accessories', icon: '💻' },
  { id: 'audio', name: 'Audio', icon: '🔊' },
  { id: 'gadgets', name: 'Gadgets', icon: '🎮' },
  { id: 'storage', name: 'Storage', icon: '💾' },
  { id: 'networking', name: 'Networking', icon: '🌐' },
];

export const subcategories: Record<string, { id: string; name: string; icon: string }[]> = {
  'phone-accessories': [
    { id: 'earbuds', name: 'Earbuds', icon: '🎧' },
    { id: 'phone-coolers', name: 'Phone Coolers', icon: '❄️' },
    { id: 'phone-holders', name: 'Phone Holders', icon: '📱' },
    { id: 'smart-watches', name: 'Smart Watches', icon: '⌚' },
    { id: 'earpieces', name: 'Earpieces', icon: '🎧' },
    { id: 'phone-cases', name: 'Phone Cases', icon: '📱' },
    { id: 'screen-protectors', name: 'Screen Protectors', icon: '🛡️' },
    { id: 'phone-stands', name: 'Phone Stands', icon: '📐' },
  ],
  'charging-accessories': [
    { id: 'power-banks', name: 'Power Banks', icon: '🔋' },
    { id: 'chargers', name: 'Chargers', icon: '🔌' },
    { id: 'cables', name: 'Cables', icon: '🔌' },
    { id: 'power-stations', name: 'Power Stations', icon: '⚡' },
    { id: 'wireless-chargers', name: 'Wireless Chargers', icon: '📶' },
    { id: 'car-inverters', name: 'Car Inverters', icon: '🚗' },
  ],
  'computer-accessories': [
    { id: 'keyboards', name: 'Keyboards', icon: '⌨️' },
    { id: 'mice', name: 'Mouse', icon: '🖱️' },
    { id: 'webcams', name: 'Webcams', icon: '📹' },
    { id: 'headphones', name: 'Headphones', icon: '🎧' },
    { id: 'conference-equipment', name: 'Conference Equipment', icon: '🎙️' },
    { id: 'laptop-stands', name: 'Laptop Stands', icon: '💻' },
    { id: 'laptop-bags', name: 'Laptop Bags', icon: '💼' },
  ],
  'audio': [
    { id: 'bluetooth-speakers', name: 'Bluetooth Speakers', icon: '🔊' },
    { id: 'soundbars', name: 'Soundbars', icon: '🎵' },
    { id: 'wireless-headphones', name: 'Wireless Headphones', icon: '🎧' },
    { id: 'portable-speakers', name: 'Portable Speakers', icon: '🔊' },
  ],
  'gadgets': [
    { id: 'content-creation', name: 'Content Creation Kits', icon: '🎥' },
    { id: 'tripods', name: 'Tripods & Stands', icon: '📷' },
    { id: 'microphones', name: 'Microphones', icon: '🎤' },
    { id: 'ring-lights', name: 'Ring Lights', icon: '💡' },
    { id: 'gimbals', name: 'Gimbals', icon: '🎬' },
  ],
  'storage': [
    { id: 'flash-drives', name: 'Flash Drives', icon: '💾' },
    { id: 'memory-cards', name: 'Memory Cards', icon: '💳' },
    { id: 'hard-drives', name: 'Hard Drives', icon: '🖥️' },
    { id: 'ssd', name: 'SSD', icon: '💻' },
    { id: 'hdd-enclosures', name: 'HDD Enclosures', icon: '📦' },
  ],
  'networking': [
    { id: 'routers', name: 'Routers', icon: '📡' },
    { id: 'hubs', name: 'USB Hubs', icon: '🔌' },
    { id: 'switches', name: 'Network Switches', icon: '🔗' },
    { id: 'range-extenders', name: 'Range Extenders', icon: '📶' },
  ],
};

export const DATA_VERSION = 'v3-power-banks';

export const products: Product[] = [
  {
    id: 'infinix-xpower30',
    name: 'INFINIX XPOWER30 30000mAh',
    price: 22000,
    wholesalePrice: 18800,
    category: 'charging-accessories',
    subcategory: 'power-banks',
    image: product1,
    images: [product1, product2, product2b, product3],
    description: 'High-capacity 30000mAh portable power bank from Infinix. Supports fast charging with dual USB output ports and USB-C input. Built-in LED power indicator. Perfect for heavy users, travellers and businesses.',
    stock: 50,
    rating: 4.8,
    reviews: 124,
    featured: true,
    hot: true,
  },
  {
    id: 'infinix-xpower20',
    name: 'INFINIX XPOWER20 (GO) 20000mAh',
    price: 12500,
    wholesalePrice: 10800,
    category: 'charging-accessories',
    subcategory: 'power-banks',
    image: product4,
    images: [product4, product5, product6],
    description: 'The INFINIX XPOWER20 GO packs 20000mAh into a slim, lightweight build. Fast charging technology keeps your devices powered on the go. Dual USB-A and USB-C output for simultaneous charging.',
    stock: 60,
    rating: 4.7,
    reviews: 98,
    featured: true,
  },
  {
    id: 'infinix-xpower10',
    name: 'INFINIX XPOWER10 [GO] 10000mAh',
    price: 9000,
    wholesalePrice: 7960,
    category: 'charging-accessories',
    subcategory: 'power-banks',
    image: product7,
    images: [product7, product8, product9],
    description: 'Compact and pocket-friendly 10000mAh power bank. Charges your smartphone up to 2 full times. Slim body that fits anywhere. USB-C and USB-A output for universal compatibility.',
    stock: 80,
    rating: 4.6,
    reviews: 76,
    hot: true,
  },
];

export const testimonials = [
  {
    id: '1',
    name: 'Chioma Adeyemi',
    text: 'Best prices for power banks and phone accessories in Lagos! Ordered wholesale and got amazing discounts. Fast delivery!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=entropy&cs=tinysrgb&fit=crop&w=100&h=100',
  },
  {
    id: '2',
    name: 'Ibrahim Musa',
    text: 'Been buying electronics from Zeetech for 2 years. Always genuine products. The Infinix power banks are fire!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1659422440915-d516c6dc932e?crop=entropy&cs=tinysrgb&fit=crop&w=100&h=100',
  },
  {
    id: '3',
    name: 'Funke Olatunji',
    text: 'Excellent customer service and quality gadgets. My go-to store for all tech accessories in Lagos!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?crop=entropy&cs=tinysrgb&fit=crop&w=100&h=100',
  },
];

export const banners = [
  {
    id: '1',
    title: 'Power Up Your Life',
    subtitle: 'Genuine Infinix power banks at the best prices in Lagos',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200',
    cta: 'Shop Power Banks',
  },
  {
    id: '2',
    title: 'Wholesale Deals',
    subtitle: 'Buy in bulk and save more — lowest wholesale prices guaranteed',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200',
    cta: 'Learn More',
  },
  {
    id: '3',
    title: 'Tech Accessories',
    subtitle: 'Latest gadgets and accessories just landed at Zeetech',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200',
    cta: 'Explore',
  },
];
