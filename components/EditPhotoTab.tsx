import React, { useState, useRef, useEffect, useCallback } from 'react';
import TabContentContainer from './TabContentContainer';
import { EditIcon, UndoIcon, RedoIcon } from './icons';
import ImageUploader from './ImageUploader';
import VariationSelector from './VariationSelector';

interface EditPhotoTabProps {
  onSubmit: (prompt: string, images: File[], count: number) => void;
  isLoading: boolean;
}

const EditPhotoTab: React.FC<EditPhotoTabProps> = ({ onSubmit, isLoading }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [brushSize, setBrushSize] = useState(20);
  const [variationCount, setVariationCount] = useState(4);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null); // Off-screen
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const drawOnCanvas = useCallback(() => {
    if (!imageFile) return;
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    const maskCtx = maskCanvas?.getContext('2d');
    if (!canvas || !ctx || !maskCanvas || !maskCtx) return;

    const img = new Image();
    img.src = URL.createObjectURL(imageFile);
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const canvasWidth = canvas.parentElement?.clientWidth || 300;
      canvas.width = canvasWidth;
      canvas.height = canvasWidth / aspectRatio;
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      maskCtx.fillStyle = 'black';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      
      const initialImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialImageData]);
      setHistoryIndex(0);
    };
  }, [imageFile]);

  useEffect(() => {
    drawOnCanvas();
  }, [drawOnCanvas]);

  const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    const touch = (evt as TouchEvent).touches ? (evt as TouchEvent).touches[0] : null;
    return {
      x: touch ? touch.clientX - rect.left : (evt as MouseEvent).clientX - rect.left,
      y: touch ? touch.clientY - rect.top : (evt as MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    const pos = getMousePos(canvas, e.nativeEvent);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;
    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (!ctx || !maskCtx) return;

    const pos = getMousePos(canvas, e.nativeEvent);

    // Draw on visible canvas for user feedback
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw on mask canvas
    const scaleX = maskCanvas.width / canvas.width;
    const scaleY = maskCanvas.height / canvas.height;
    
    maskCtx.lineTo(pos.x * scaleX, pos.y * scaleY);
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushSize * scaleX;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.closePath();
    setIsDrawing(false);
    
    // Save state for undo/redo
    const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newImageData]);
    setHistoryIndex(newHistory.length);
  };

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  const handleSubmit = () => {
    if (imageFile && maskCanvasRef.current) {
        const maskDataURL = maskCanvasRef.current.toDataURL('image/png');
        const maskFile = dataURLtoFile(maskDataURL, 'mask.png');
        const fullPrompt = `Gunakan gambar kedua sebagai topeng (mask) presisi. Edit gambar pertama hanya di dalam area putih pada topeng, sesuai dengan instruksi berikut: "${prompt}".
Tujuan utamanya adalah **integrasi yang mulus dan tidak terlihat**. Hasil editan harus menyatu sempurna dengan sisa gambar.
- **Pencahayaan & Bayangan:** Sesuaikan pencahayaan dan bayangan pada area yang diedit agar cocok dengan sumber cahaya di seluruh gambar.
- **Tekstur & Detail:** Pertahankan atau ciptakan kembali tekstur yang cocok dengan area sekitarnya.
- **Gradasi Warna:** Lakukan koreksi warna agar tidak ada perbedaan warna yang terlihat antara area yang diedit dan yang tidak.
Hasil akhir harus fotorealistis tingkat tinggi dan terlihat sepenuhnya alami.`;
        onSubmit(fullPrompt, [imageFile, maskFile], variationCount);
    }
  };

  return (
    <TabContentContainer
      icon={<EditIcon className="w-6 h-6" />}
      title="Edit Foto"
      description="Unggah foto, tandai area, dan tulis instruksi untuk mengubahnya dengan AI."
    >
      {!imageFile ? (
        <ImageUploader onFileSelect={handleFileSelect} previewUrl={imagePreview} />
      ) : (
        <div className="space-y-4">
            <div className="relative w-full mx-auto border rounded-lg overflow-hidden">
                <canvas 
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-auto"
                />
                <canvas ref={maskCanvasRef} className="hidden" />
                <div className="absolute top-2 right-2 flex gap-2">
                    <button className="p-2 bg-white/80 rounded-lg shadow"><UndoIcon/></button>
                    <button className="p-2 bg-white/80 rounded-lg shadow"><RedoIcon/></button>
                </div>
            </div>
            <div>
              <label htmlFor="brush-size" className="block text-sm font-medium text-gray-700">Ukuran Kuas</label>
              <input 
                id="brush-size" 
                type="range" 
                min="5" 
                max="50" 
                value={brushSize} 
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>
            <div>
              <label htmlFor="prompt-edit" className="block text-sm font-medium text-gray-700">Instruksi Edit</label>
              <textarea
                id="prompt-edit"
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="Contoh: ganti kemeja menjadi jaket kulit"
              />
            </div>
            <VariationSelector selected={variationCount} onSelect={setVariationCount} />
            <button
                onClick={handleSubmit}
                disabled={!prompt || isLoading}
                className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Memproses...' : `Buat ${variationCount} Variasi Gambar`}
            </button>
        </div>
      )}
    </TabContentContainer>
  );
};

export default EditPhotoTab;
