

export enum Material {
  Amber = 'Amber',
  Spinel = 'Spinel',
  Ruby = 'Ruby',
  Sapphire = 'Sapphire',
  FossilCoral = 'Fossil Coral',
  Agate = 'Agate',
  Jade = 'Jade',
}

export enum Metal {
  None = 'None',
  Gold = 'Yellow Gold 96.5%',
  Silver = 'Silver',
  Gold18K = '18K Gold',
  Gold14K = '14K Gold',
  Gold9K = '9K Gold',
  Copper = 'Copper',
  Brass = 'Brass',
}

export type BeadSize = number;
export type BeadQuantity = 27 | 54 | 99 | 108;

export type ClarityTier = 'all' | 'visible' | 'semi-clear' | 'high';
export type Grade = 'Standard' | 'Silver' | 'High';

// New Grade enum specifically for the Tesbih/Rosary builder to avoid conflicts
export enum TesbihRosaryGrade {
  Standard = 'Standard Grade',
  Premium = 'Premium Grade',
  Exceptional = 'Exceptional Grade',
}

export interface NavLink {
  name: string;
  path?: string;
  submenus?: NavLink[];
}

export interface ShopCategory {
  name: string;
  slug: string;
  subCategories?: ShopCategory[];
}


export interface Filters {
  amberColors: string[];
  clarity: ClarityTier;
  beadSizeMax: number;
  certifications: string[];
}

export interface Product {
  id: string; // Unique ID for this specific configuration
  sku: string;
  name: string; // e.g., "Mila Amber Bracelet (8mm, 108 beads)"
  category: string; // e.g., 'bracelets', 'prayer-beads-108', 'rings'
  material: Material;

  // For display on cards and lists
  price: number; // Final price for this specific product in THB
  bestseller?: boolean;
  isNewArrival?: boolean;

  // Detailed information
  story: string;
  energyProperties: string[];
  
  // All products have media
  media: {
    mainImageUrl: string;
    gallery: string[];
  };

  // All products have specs
  specifications: {
    beadSize_mm?: BeadSize;
    beadCount?: BeadQuantity;
    ringSize?: string;
    pendantMetal?: Metal;
    totalWeight_grams: number;
    clarityLevel?: string;
    finish?: string;
    patterns?: string; // Optional
    origin: string;
  };

  // Certification is for all
  certification: {
    isCertified: boolean;
    authority?: 'GIA' | 'GIT' | 'In-house';
    certificateNumber?: string;
  };
  
  // Amber-specific details
  amberDetails?: {
    colorTier: string; // "Mila (Emperor Gold)"
    colorSlug: string; // "mila"
    description: string;
    rarity: string;
    specialNote: string;
    basePricePerGram: number;
    richnessScore?: number; // For Mila (e.g., 1-10)
    purityLevel?: 'Standard' | 'Pure' | 'Deep Black'; // For Black Amber
  };

  tierExplanations?: { // For special amber like Mila, Black
    [key: string]: string;
  };

  inventory: {
    stock: number;
    isAvailable: boolean;
  };
}


export interface Amulet {
  id: string;
  name: string;
  price: number;
  material: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  beadSize: BeadSize;
  quantity: BeadQuantity;
  metal: Metal;
  amulet?: Amulet;
  blessing: boolean;
  totalPrice: number;
}

export interface MaterialDetail {
  name: Material;
  description: string;
  significance: string;
  imageUrl: string;
}

export interface Author {
    name: string;
    title: string;
    imageUrl: string;
    bio: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: 'Soul' | 'Science' | 'Craftsmanship';
  summary: string;
  author: Author;
  date: string;
  featuredImage: string;
  readingTime: number;
}

export interface AmberColorDetail {
  id: string;
  name: string;
  priceRange: string;
  description: string;
  rarity: string;
  specialNote: string;
  imageUrl: string;
  basePricePerGram: number; // in THB
  cuttingYield?: string;
  appearance?: string;
  qualityNote?: string;
  selectionCriteria?: string;
}

export interface CustomPreOrderDetails {
    amberColor: AmberColorDetail;
    grade: Grade;
    beadSize: BeadSize;
    beadQuantity: BeadQuantity;
    amulet: Amulet | null;
    metal: Metal;
    blessing: boolean;
}

export interface PriceBreakdown {
  beadsPrice: number;
  amuletPrice: number;
  metalPrice: number;
  blessingPrice: number;
  totalPrice: number;
}

export interface CustomBraceletDetails {
    wristSize_cm: number;
    beadSize_mm: BeadSize;
    comfortFit_cm: number;
    amberColor: AmberColorDetail;
    beadCount: number;
    totalWeight_g: number;
    totalPrice: number;
}


export interface AmberSpectrumDetail {
  id: string;
  title: string;
  subtitle: string;
  visual: string;
  science: string;
  rarity: string;
  symbolism: string;
  suits: string;
  element: string;
  why: string;
  bgColor: string;
  borderColor: string;
  textColor?: string;
  imageUrl: string;
}

export interface BeadConfig {
  id: string;
  colorId: string;
  size: BeadSize;
}

export interface CustomBraceletFromBuilderDetails {
    designCode: string;
    beads: BeadConfig[];
    totalLength_mm: number;
    estimatedWristSize_cm: number;
    totalWeight_g: number;
    totalPrice: number;
}

// --- New Types for Tesbih & Rosary Builder ---

export interface TesbihRosaryMaterial {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    prices: {
        [TesbihRosaryGrade.Standard]: number;
        [TesbihRosaryGrade.Premium]: number;
        [TesbihRosaryGrade.Exceptional]: number;
    }
}

export interface TesbihRosaryComponent {
    id: string;
    name: string;
    type: 'tassel' | 'imame' | 'disk' | 'crucifix' | 'centerpiece';
    weight_g: number;
    price_thb: number; // Can be a fixed price for some components
    material: string;
    imageUrl: string;
}

export interface CustomTesbihRosaryDetails {
    tradition: 'Tesbih' | 'Rosary';
    grade: TesbihRosaryGrade;
    mainBeadMaterial: TesbihRosaryMaterial | AmberColorDetail;
    beadSize: BeadSize;
    beadCount: 33 | 99 | 59; // 53 Hail Mary + 6 Our Father
    totalWeight_g: number;
    totalPrice: number;
    // Component details can be added here
}
