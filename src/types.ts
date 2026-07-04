export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Trends' | 'Materials' | 'Smart Home' | 'Architecture' | 'Sustainability';
  imageUrl: string;
  date: string;
  author: string;
}

export interface DesignSpecification {
  area: string;
  bedrooms: string;
  bathrooms: string;
  materials: string[];
  duration: string;
}

export interface Design {
  id: string;
  title: string;
  style: 'Modernist' | 'Scandinavian' | 'Industrial' | 'Eco-Friendly' | 'Custom';
  description: string;
  imageUrl: string;
  specifications: DesignSpecification;
  createdAt: string;
}

export interface AiProposalRequest {
  style: string;
  budget: string;
  bedrooms: number;
  bathrooms: number;
  materialsPreference: string;
  additionalRequests?: string;
}

export interface AiProposalResponse {
  title: string;
  styleDescription: string;
  materialsList: string[];
  estimatedCostRange: string;
  constructionTimeline: string;
  structuralFeatures: string[];
  designTips: string[];
}
