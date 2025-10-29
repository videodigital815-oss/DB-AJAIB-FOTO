import React, { useState } from 'react';
import TabContentContainer from './TabContentContainer';
import { ModelIcon } from './icons';
import ImageUploader from './ImageUploader';
import VariationSelector from './VariationSelector';

interface ModelTabProps {
  onSubmit: (prompt: string, images: File[], count: number) => void;
  isLoading: boolean;
}

const ModelTab: React.FC<ModelTabProps> = ({ onSubmit, isLoading }) => {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [variationCount, setVariationCount] = useState(4);
  
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [clothingPreview, setClothingPreview] = useState<string | null>(null);
  
  const handlePersonImage = (file: File) => {
    setPersonImage(file);
    setPersonPreview(URL.createObjectURL(file));
  }
  
  const handleClothingImage = (file: File) => {
    setClothingImage(file);
    setClothingPreview(URL.createObjectURL(file));
  }

  const handleSubmit = () => {
    if (personImage && clothingImage) {
      const prompt = `Ciptakan foto model yang sangat realistis dan estetis, seolah-olah diambil oleh fotografer fashion profesional untuk majalah high-end. Pasangkan pakaian dari gambar kedua pada model di gambar pertama.
- **Kecocokan Pakaian:** Pakaian harus membungkus tubuh model secara alami, dengan lipatan, kerutan, dan bayangan kain yang realistis yang mengikuti postur tubuh.
- **Detail Tekstur:** Pastikan tekstur kain (misalnya, katun, sutra, denim) terlihat jelas dan nyata.
- **Pencahayaan:** Gunakan pencahayaan studio yang lembut dan profesional yang menonjolkan detail pakaian dan bentuk model.
- **Latar Belakang:** Latar belakang harus bersih, netral (misalnya, abu-abu muda atau krem), dan tidak mengganggu, agar fokus utama tetap pada model dan pakaiannya.
- **Kualitas Akhir:** Hasilnya harus memiliki kualitas editorial, dengan komposisi yang sempurna, warna yang seimbang, dan tingkat detail yang sangat tinggi.`;
      onSubmit(prompt, [personImage, clothingImage], variationCount);
    }
  };

  return (
    <TabContentContainer
      icon={<ModelIcon className="w-6 h-6" />}
      title="Foto Model AI"
      description="Unggah foto model dan pakaian untuk menciptakan foto model AI profesional."
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">1. Unggah Foto Model</label>
        <ImageUploader onFileSelect={handlePersonImage} previewUrl={personPreview} text="Unggah foto seluruh badan" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">2. Unggah Foto Pakaian</label>
        <ImageUploader onFileSelect={handleClothingImage} previewUrl={clothingPreview} text="Unggah foto item pakaian" />
      </div>
      <VariationSelector selected={variationCount} onSelect={setVariationCount} />
      <button
        onClick={handleSubmit}
        disabled={!personImage || !clothingImage || isLoading}
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Memproses...' : `Buat ${variationCount} Variasi Gambar`}
      </button>
    </TabContentContainer>
  );
};

export default ModelTab;
