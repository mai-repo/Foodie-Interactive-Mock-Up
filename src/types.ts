export type BuyerSignal = 'VIP' | 'Low Engagement' | 'Price Sensitive' | 'Seasonal' | 'Frequent' | 'Birthday' | 'Anniversary' | 'Recent Complaint';
export type BuyerTone = 'Direct' | 'Casual' | 'Formal' | 'Professional';

export interface ImportantDate {
  label: string;
  date: string;
}

export interface Buyer {
  id: string;
  name: string;
  company: string;
  avatar?: string;
  email: string;
  location: string;
  orderHistory: Order[];
  preferences: string[];
  relationshipNotes?: string;
  tone?: BuyerTone;
  importantDates?: ImportantDate[];
  acceptedSubstitutions?: string[];
  rejectedSubstitutions?: string[];
  signals: BuyerSignal[];
  engagementScore: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  items: string[];
}

export interface DraftRecommendation {
  id: string;
  productId: string;
  productName?: string;
  substituteId?: string;
  suggestedQty: number;
  reason: string;
}

export interface Message {
  id: string;
  buyerId: string;
  content: string;
  timestamp: string;
  type: 'inbound' | 'outbound';
  aiDraft?: {
    content: string;
    skus: SKU[];
    suggestedSubs?: SKU[];
    fitScore: 'High Fit' | 'Good Fit' | 'Needs Personalization' | 'Weak Substitute Match' | 'Low Engagement';
    fitReason: string;
    relationshipContext?: string;
    recommendations: DraftRecommendation[];
  };
}

export interface SKU {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  suggestedQty?: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'finished';
  targetBuyersCount: number;
  description: string;
  productImage?: string;
  buyers: CampaignBuyer[];
}

export interface CampaignBuyer {
  buyerId: string;
  personalizedDraft: string;
  suggestedSKUs: SKU[];
}
