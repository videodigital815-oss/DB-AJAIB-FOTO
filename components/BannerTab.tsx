import React, { useState } from 'react';
import TabContentContainer from './TabContentContainer';
import { BannerIcon } from './icons';
import ImageUploader from './ImageUploader';
import VariationSelector from './VariationSelector';

interface BannerTabProps {
  onSubmit: (prompt: string, images: File[], count: number) => void;
  isLoading: boolean;
}

const BannerTab: React.FC<BannerTabProps> = ({ onSubmit, isLoading }) => {
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [variationCount, setVariationCount] = useState(4);

  const handleImageSelect = (file: File) => {
    setBannerImage(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setBannerImage(null);
    setBannerPreview(null);
    setPrompt('');
  };

  const handleSubmit = () => {
    if (!bannerImage || !prompt) return;
    const translatedPrompt = `Rancang sebuah banner iklan yang profesional, modern, dan sangat menarik secara visual, menggunakan gambar yang disediakan sebagai latar belakang. Tambahkan teks berikut: "${prompt}".
- **Prinsip Desain:** Terapkan prinsip desain grafis yang kuat. Gunakan hierarki tipografi yang jelas untuk memandu mata pembaca.
- **Tipografi:** Pilih kombinasi font yang elegan, modern, dan sangat mudah dibaca. Pastikan kontras warna yang sangat baik antara teks dan latar belakang untuk keterbacaan maksimal.
- **Komposisi:** Tempatkan teks secara strategis untuk menciptakan komposisi yang seimbang dan profesional. Manfaatkan ruang negatif secara efektif untuk desain yang bersih dan berdampak.
Hasilnya harus terlihat seperti dirancang oleh desainer grafis profesional untuk kampanye iklan digital premium.`;

    onSubmit(translatedPrompt, [bannerImage], variationCount);
  };

  return (
    <TabContentContainer
      icon={<BannerIcon className="w-6 h-6" />}
      title="Bikin Banner Iklan"
      description="Buat banner iklan profesional dengan teks khusus dari gambar Anda."
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">1. Unggah Gambar Latar</label>
        <ImageUploader 
            onFileSelect={handleImageSelect} 
            previewUrl={bannerPreview} 
            onRemove={handleImageRemove} 
            text="Unggah Gambar untuk Banner"
        />
      </div>
       <div>
        <label htmlFor="prompt-banner" className="block text-sm font-medium text-gray-700 mb-2">2. Teks untuk Banner</label>
        <textarea
          id="prompt-banner"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          placeholder="Contoh: Diskon Akhir Tahun Hingga 70%!"
        />
      </div>
      <VariationSelector selected={variationCount} onSelect={setVariationCount} />
      <button
        onClick={handleSubmit}
        disabled={!bannerImage || !prompt || isLoading}
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Memproses...' : `Buat ${variationCount} Variasi Gambar`}
      </button>
    </TabContentContainer>
  );
};

export default BannerTab;
