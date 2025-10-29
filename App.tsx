import React, { useState, useRef } from 'react';
import { Tab } from './types';
import TabButton from './components/TabButton';
import { ImageIcon, ProductIcon, ModelIcon, EditIcon, BannerIcon, DownloadIcon, GeminiIcon, UMKMIcon } from './components/icons';
import CombineImagesTab from './components/CombineImagesTab';
import ProductPhotoshootTab from './components/ProductPhotoshootTab';
import ModelTab from './components/ModelTab';
import EditPhotoTab from './components/EditPhotoTab';
import BannerTab from './components/BannerTab';
import { generateImageFromTextAndImages } from './services/geminiService';
import UMKMProductTab from './components/UMKMProductTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.UMKM);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleImageGeneration = async (prompt: string, images: File[], count: number = 1) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    try {
      const result = await generateImageFromTextAndImages(prompt, images, count);
      setGeneratedImages(result);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan yang tidak diketahui.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case Tab.Combine:
        return <CombineImagesTab onSubmit={handleImageGeneration} isLoading={isLoading} />;
      case Tab.Product:
        return <ProductPhotoshootTab onSubmit={handleImageGeneration} isLoading={isLoading} />;
      case Tab.UMKM:
        return <UMKMProductTab onSubmit={handleImageGeneration} isLoading={isLoading} />;
      case Tab.Model:
        return <ModelTab onSubmit={handleImageGeneration} isLoading={isLoading} />;
      case Tab.Edit:
        return <EditPhotoTab onSubmit={handleImageGeneration} isLoading={isLoading} />;
      case Tab.Banner:
        return <BannerTab onSubmit={handleImageGeneration} isLoading={isLoading}/>;
      default:
        return null;
    }
  };

  const TABS = [
    { id: Tab.Combine, icon: <ImageIcon className="w-6 h-6"/> },
    { id: Tab.Product, icon: <ProductIcon className="w-6 h-6"/> },
    { id: Tab.UMKM, icon: <UMKMIcon className="w-6 h-6"/> },
    { id: Tab.Model, icon: <ModelIcon className="w-6 h-6"/> },
    { id: Tab.Edit, icon: <EditIcon className="w-6 h-6"/> },
    { id: Tab.Banner, icon: <BannerIcon className="w-6 h-6"/> },
  ];

  const handleDownload = (imageUrl: string) => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `db-ajaib-foto-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleTabClick = (tabId: Tab) => {
    setActiveTab(tabId);
    setGeneratedImages([]);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="w-full max-w-7xl mx-auto md:flex md:gap-8 md:p-6 lg:p-8">
        {/* --- Sidebar (Desktop) --- */}
        <aside className="hidden md:flex flex-col w-64 flex-shrink-0">
          <header className="text-center pt-2 pb-6 px-4">
            <p className="text-sm font-bold text-teal-600">AI</p>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">DB AJAIB FOTO</h1>
            <p className="text-gray-500 mt-1 text-sm">Ubah Foto Jadi Profesional</p>
          </header>
          <nav className="flex flex-col gap-2 px-4">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-teal-100 text-teal-700 font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {React.cloneElement(tab.icon, { className: 'w-6 h-6 text-teal-600 flex-shrink-0' })}
                <span>{tab.id}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto px-4 pb-4 space-y-2">
            <a 
              href="https://aistudio.google.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <GeminiIcon className="w-5 h-5 text-gray-400" />
              <span>Powered by Gemini</span>
            </a>
            <p className="text-center text-xs text-gray-400">powered by DB PROJECT</p>
          </div>
        </aside>

        {/* --- Main Content Area --- */}
        <div className="flex-1 min-w-0">
          {/* --- Mobile Header --- */}
          <header className="md:hidden text-center py-6 px-4 bg-white sticky top-0 z-10 shadow-sm">
            <p className="text-sm font-bold text-teal-600">AI</p>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">DB AJAIB FOTO</h1>
            <p className="text-gray-500 mt-1">Ubah Foto Seadanya Jadi Foto Profesional</p>
             <div className="mt-2">
              <a 
                href="https://aistudio.google.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <GeminiIcon className="w-4 h-4 text-gray-400" />
                <span>Powered by Gemini</span>
              </a>
               <p className="text-center text-[10px] text-gray-400 mt-1">powered by DB PROJECT</p>
            </div>
          </header>

          <div className="md:grid md:grid-cols-2 md:gap-8">
            {/* --- Left Column: Controls --- */}
            <main className="px-4 pb-32 md:pb-0 md:px-0">
              <div className="md:bg-white md:p-6 md:rounded-xl md:shadow-lg">
                {renderTabContent()}
              </div>
            </main>

            {/* --- Right Column: Results --- */}
            <aside ref={resultRef} className="px-4 pb-16 md:pb-4 md:px-0 md:sticky md:top-6 md:h-fit">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Hasil</h2>
                <div className="space-y-4">
                  {isLoading && (
                    <div className="text-center aspect-square flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-gray-50">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                      <p className="text-gray-600 mt-4 font-medium">AI sedang berkreasi...</p>
                    </div>
                  )}
                  {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                  
                  {generatedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {generatedImages.map((image, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img src={image} alt={`Generated by AI ${index + 1}`} className="rounded-lg shadow-md w-full h-full object-cover" />
                          <button
                            onClick={() => handleDownload(image)}
                            className="absolute top-2 right-2 bg-teal-600 text-white hover:bg-teal-700 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
                            aria-label="Unduh gambar"
                          >
                            <DownloadIcon className="w-5 h-5"/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isLoading && !error && generatedImages.length === 0 && (
                    <div className="text-center aspect-square flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-gray-50">
                        <ImageIcon className="w-16 h-16 mx-auto text-gray-300" />
                        <p className="text-gray-500 mt-4 font-medium">Hasil gambar Anda akan muncul di sini.</p>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* --- Mobile Footer --- */}
        <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
          <div className="flex justify-around items-center h-16">
            {TABS.map(tab => (
              <TabButton
                key={tab.id}
                label={tab.id}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => handleTabClick(tab.id)}
              />
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;