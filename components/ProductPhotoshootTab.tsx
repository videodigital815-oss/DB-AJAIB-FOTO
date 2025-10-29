import React, { useState } from 'react';
import TabContentContainer from './TabContentContainer';
import { ProductIcon } from './icons';
import ImageUploader from './ImageUploader';
import VariationSelector from './VariationSelector';

interface ProductPhotoshootTabProps {
  onSubmit: (prompt: string, images: File[], count: number) => void;
  isLoading: boolean;
}

const ProductPhotoshootTab: React.FC<ProductPhotoshootTabProps> = ({ onSubmit, isLoading }) => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [variationCount, setVariationCount] = useState(4);
  
  const [productPreview, setProductPreview] = useState<string | null>(null);
  const [modelPreview, setModelPreview] = useState<string | null>(null);

  const handleProductImage = (file: File) => {
    setProductImage(file);
    setProductPreview(URL.createObjectURL(file));
  }

  const handleModelImage = (file: File) => {
    setModelImage(file);
    setModelPreview(URL.createObjectURL(file));
  }

  const handleSubmit = () => {
    if (productImage && modelImage) {
      const fullPrompt = `Ciptakan sebuah foto produk yang sangat realistis dan estetis untuk iklan mewah. Gabungkan produk dari gambar pertama dengan model dari gambar kedua secara mulus. Model harus berinteraksi secara alami dengan produk.
- **Gaya:** Fotografi gaya hidup (lifestyle) kelas atas, cocok untuk majalah atau kampanye iklan premium.
- **Pencahayaan:** Gunakan pencahayaan yang lembut, menyebar, dan alami yang menonjolkan produk dan model.
- **Komposisi:** Buat komposisi yang menarik secara visual dengan fokus yang tajam pada produk. Latar belakang harus sedikit kabur (bokeh) untuk menciptakan kedalaman.
- **Realisme:** Perhatikan bayangan yang realistis, pantulan pada produk, dan tekstur kulit model. Lakukan gradasi warna profesional untuk menciptakan suasana yang hangat dan mengundang. Hasil akhir harus terlihat seperti foto asli yang diambil dengan kamera DSLR profesional.`;
      onSubmit(
        fullPrompt,
        [productImage, modelImage],
        variationCount
      );
    }
  };

  return (
    <TabContentContainer
      icon={<ProductIcon className="w-6 h-6" />}
      title="Photoshoot Produk"
      description="Unggah foto produk dan foto model, dan biarkan AI menggabungkannya menjadi foto profesional."
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">1. Unggah Foto Produk</label>
        <ImageUploader onFileSelect={handleProductImage} previewUrl={productPreview} text="Seret & lepas atau klik" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">2. Unggah Foto Model</label>
        <ImageUploader onFileSelect={handleModelImage} previewUrl={modelPreview} text="Seret & lepas atau klik" />
      </div>
      <VariationSelector selected={variationCount} onSelect={setVariationCount} />
      <button
        onClick={handleSubmit}
        disabled={!productImage || !modelImage || isLoading}
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Memproses...' : `Buat ${variationCount} Variasi Gambar`}
      </button>
    </TabContentContainer>
  );
};

export default ProductPhotoshootTab;
