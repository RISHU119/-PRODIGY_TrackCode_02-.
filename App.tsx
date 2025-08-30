
import React, { useState, useMemo } from 'react';
import DataExplorer from './components/DataExplorer';
import KMeansControls from './components/KMeansControls';
import ClusterVisualizer from './components/ClusterVisualizer';
import InsightsPanel from './components/InsightsPanel';
import { customerData } from './data/customerData';
import { Customer, Cluster, ProcessedCustomer, Feature } from './types';
import { runKMeans } from './services/kmeans';

const App: React.FC = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>(['Annual Income (k$)', 'Spending Score (1-100)']);
  const [numClusters, setNumClusters] = useState<number>(5);
  const [clusters, setClusters] = useState<Cluster[] | null>(null);
  const [clusteredData, setClusteredData] = useState<ProcessedCustomer[] | null>(null);
  const [isClustering, setIsClustering] = useState(false);

  const processedData = useMemo((): ProcessedCustomer[] => {
    return customerData.map((customer: Customer) => ({
      ...customer,
      Gender: customer.Gender === 'Male' ? 0 : 1, // Encode gender
    }));
  }, []);

  const handleRunClustering = async () => {
    setIsClustering(true);
    setClusters(null);
    setClusteredData(null);
    await new Promise(resolve => setTimeout(resolve, 50)); // Allow UI to update
    
    const { clusters: newClusters, assignments } = runKMeans(processedData, numClusters, selectedFeatures);
    
    const newClusteredData = processedData.map((customer, index) => ({
      ...customer,
      cluster: assignments[index],
    }));
    
    setClusters(newClusters);
    setClusteredData(newClusteredData);
    setIsClustering(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Customer Segmentation AI
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls & EDA */}
          <div className="lg:col-span-4 space-y-8">
            <KMeansControls
              numClusters={numClusters}
              setNumClusters={setNumClusters}
              selectedFeatures={selectedFeatures}
              setSelectedFeatures={setSelectedFeatures}
              onRunClustering={handleRunClustering}
              isClustering={isClustering}
              data={processedData}
            />
            <DataExplorer data={processedData} />
          </div>

          {/* Right Column: Visualizations & Insights */}
          <div className="lg:col-span-8 space-y-8">
             <ClusterVisualizer
                data={clusteredData}
                clusters={clusters}
                features={selectedFeatures}
              />
              <InsightsPanel
                clusteredData={clusteredData}
                isClustering={isClustering}
              />
          </div>

        </div>
      </main>
      <footer className="text-center py-4 mt-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>Powered by React, Tailwind CSS, and Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
