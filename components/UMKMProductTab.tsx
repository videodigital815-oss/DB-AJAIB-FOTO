import React, { useState } from 'react';
import TabContentContainer from './TabContentContainer';
import { UMKMIcon } from './icons';
import ImageUploader from './ImageUploader';
import VariationSelector from './VariationSelector';

interface UMKMProductTabProps {
  onSubmit: (prompt: string, images: File[], count: number) => void;
  isLoading: boolean;
}

const OptionButton = ({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full text-center py-2 px-3 rounded-lg border text-sm transition-colors ${
            isSelected ? 'bg-teal-600 text-white border-teal-600 font-semibold' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
    >
        {label}
    </button>
);

const UMKMProductTab: React.FC<UMKMProductTabProps> = ({ onSubmit, isLoading }) => {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [lighting, setLighting] = useState<string>('Dramatis');
    const [mood, setMood] = useState<string>('Modern');
    const [location, setLocation] = useState<string>('Alam Terbuka');
    const [style, setStyle] = useState<string>('Aesthetic');
    const [variationCount, setVariationCount] = useState(4);

    const lightingOptions = ['Natural', 'Studio', 'Dramatis', 'Cerah'];
    const moodOptions = ['Elegan', 'Ceria', 'Tenang', 'Modern'];
    const locationOptions = ['Meja Kayu', 'Dapur', 'Alam Terbuka', 'Minimalis Putih'];
    const styleOptions = ['Aesthetic', 'Modern', 'Vintage', 'Futuristik'];

    const handleImageSelect = (file: File) => {
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleImageRemove = () => {
        setImage(null);
        setPreview(null);
    }

    const handleSubmit = () => {
        if (image) {
            const prompt = `Ciptakan foto produk yang sangat realistis dan profesional dari item yang diunggah, cocok untuk e-commerce premium atau iklan.
Suasana foto harus:
- **Pencahayaan:** ${lighting}.
- **Suasana (Mood):** ${mood}.
- **Lokasi/Latar Belakang:** ${location}.
- **Gaya Estetika:** ${style}.
Fokus pada detail untuk mencapai hasil yang luar biasa: Ciptakan bayangan yang lembut dan alami, pantulan cahaya yang akurat pada permukaan produk, dan tekstur yang tajam. Komposisi harus menarik, menjadikan produk sebagai pusat perhatian. Hasil akhir harus terlihat seperti diambil dengan kamera DSLR profesional dengan color grading yang ahli.`;
            onSubmit(prompt, [image], variationCount);
        }
    };

    return (
        <TabContentContainer
            icon={<UMKMIcon className="w-6 h-6" />}
            title="Gambar Produk UMKM"
            description="Ubah foto produk biasa menjadi gambar profesional dengan kontrol penuh atas gaya."
        >
            <div className="space-y-4">
                <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-2">1. Unggah Foto</h3>
                    <ImageUploader onFileSelect={handleImageSelect} previewUrl={preview} onRemove={handleImageRemove} text="Unggah Foto Produk" />
                </div>

                <OptionGroup title="2. Pilih Pencahayaan" options={lightingOptions} selected={lighting} setSelected={setLighting} />
                <OptionGroup title="3. Pilih Suasana" options={moodOptions} selected={mood} setSelected={setMood} />
                <OptionGroup title="4. Pilih Lokasi" options={locationOptions} selected={location} setSelected={setLocation} />
                <OptionGroup title="5. Pilih Gaya Aesthetic" options={styleOptions} selected={style} setSelected={setStyle} />
                
                <VariationSelector selected={variationCount} onSelect={setVariationCount} />

                <button
                    onClick={handleSubmit}
                    disabled={!image || isLoading}
                    className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Memproses...' : `Buat ${variationCount} Variasi Gambar`}
                </button>
            </div>
        </TabContentContainer>
    );
};

const OptionGroup = ({ title, options, selected, setSelected }: { title: string, options: string[], selected: string, setSelected: (opt: string) => void }) => (
    <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {options.map(option => (
                <OptionButton
                    key={option}
                    label={option}
                    isSelected={selected === option}
                    onClick={() => setSelected(option)}
                />
            ))}
        </div>
    </div>
);

export default UMKMProductTab;
