export default function SortButtons({ options, selected, onSelect, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="flex py-2 px-4">
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const label = typeof option === 'string' ? option : option.label;
          
          return (
            <button
              key={value}
              className={`px-3 py-2 text-sm whitespace-nowrap ${
                selected === value
                  ? 'text-primary font-medium border-b-2 border-primary'
                  : 'text-gray-500'
              }`}
              onClick={() => onSelect(value)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

