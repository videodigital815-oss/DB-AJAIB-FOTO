import React from 'react';

interface VariationSelectorProps {
  selected: number;
  onSelect: (count: number) => void;
}

const VariationSelector: React.FC<VariationSelectorProps> = ({ selected, onSelect }) => {
  const options = [1, 4];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Variasi</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`w-full text-center py-2 px-3 rounded-lg border text-sm transition-colors ${
              selected === option
                ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {option} Variasi
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariationSelector;
