
export interface Customer {
  CustomerID: number;
  Gender: 'Male' | 'Female';
  Age: number;
  'Annual Income (k$)': number;
  'Spending Score (1-100)': number;
}

export interface ProcessedCustomer extends Omit<Customer, 'Gender'> {
  Gender: number; // 0 for Male, 1 for Female
  cluster?: number;
}

export type Feature = 'Age' | 'Annual Income (k$)' | 'Spending Score (1-100)';

export interface Centroid {
  [key: string]: number;
}

export interface Cluster {
  centroid: Centroid;
  points: ProcessedCustomer[];
}

export interface GeminiInsight {
  clusterId: number;
  clusterName: string;
  description: string;
  marketingStrategies: string[];
}
