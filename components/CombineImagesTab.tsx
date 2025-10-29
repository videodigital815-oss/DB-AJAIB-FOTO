import React, { useState } from 'react';
import TabContentContainer from './TabContentContainer';
import { ImageIcon, ShuffleIcon } from './icons';
import { MultiImageUploader } from './ImageUploader';
import VariationSelector from './VariationSelector';

interface CombineImagesTabProps {
  onSubmit: (prompt: string, images: File[], count: number) => void;
  isLoading: boolean;
}

const CombineImagesTab: React.FC<CombineImagesTabProps> = ({ onSubmit, isLoading }) => {
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [variationCount, setVariationCount] = useState(4);
  const minFiles = 2;
  const maxFiles = 5;

  const handleSubmit = () => {
    if (prompt && images.length >= minFiles) {
      const fullPrompt = `Tugas Anda adalah sebagai seniman digital ahli. Gabungkan elemen dari gambar-gambar yang disediakan berdasarkan instruksi berikut: "${prompt}". Ciptakan satu gambar tunggal yang sangat realistis, kohesif, dan estetis. Hasil akhir harus terlihat seperti fotografi profesional berkualitas tinggi, bukan gabungan digital. Perhatikan detail-detail berikut untuk mencapai fotorealisme:
- **Pencahayaan:** Pastikan semua elemen memiliki sumber cahaya, arah, dan kelembutan yang konsisten.
- **Bayangan:** Ciptakan bayangan yang lembut dan akurat sesuai dengan bentuk objek dan sumber cahaya.
- **Perspektif & Skala:** Jaga agar perspektif dan skala semua objek konsisten.
- **Gradasi Warna:** Lakukan gradasi warna secara profesional agar seluruh gambar memiliki palet warna yang harmonis.
- **Fokus & Kedalaman:** Terapkan depth of field (bokeh) yang natural untuk menambah realisme.`;
      onSubmit(fullPrompt, images, variationCount);
    }
  };

  return (
    <TabContentContainer
      icon={<ImageIcon className="w-6 h-6" />}
      title="Gabungkan Gambar"
      description="Unggah 2-5 gambar, tulis instruksi, dan biarkan AI menggabungkannya menjadi karya baru."
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">1. Unggah Gambar (min 2, maks 5)</label>
        <MultiImageUploader files={images} onFilesChange={setImages} maxFiles={maxFiles} minFiles={minFiles} />
      </div>
      <div>
        <label htmlFor="prompt-combine" className="block text-sm font-medium text-gray-700 mb-2">2. Instruksi</label>
        <div className="relative">
          <textarea
            id="prompt-combine"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 pr-10"
            placeholder="Contoh: Gabungkan kucing dan astronot menjadi satu gambar lucu di luar angkasa."
          />
          <button className="absolute top-2 right-2 text-gray-500 hover:text-teal-600">
            <ShuffleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
       <VariationSelector selected={variationCount} onSelect={setVariationCount} />
       <button
        onClick={handleSubmit}
        disabled={!prompt || images.length < minFiles || isLoading}
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Memproses...' : `Buat ${variationCount} Variasi Gambar`}
      </button>
    </TabContentContainer>
  );
};

export default CombineImagesTab;
