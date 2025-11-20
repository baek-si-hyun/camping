export default function Accordion({ 
  items, 
  openItems, 
  onToggle,
  className = ''
}) {
  return (
    <div className={`space-y-0.5 ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        
        return (
          <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
            <button
              className="w-full flex justify-between items-center p-4 cursor-pointer"
              onClick={() => onToggle(item.id)}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <i className={`${item.icon} text-primary`} />
                  </div>
                )}
                <span className="font-medium">{item.title}</span>
              </div>
              <i
                className={`${
                  isOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
                } text-gray-400`}
              />
            </button>
            <div
              className={`accordion-content px-4 pb-4 ${isOpen ? 'active' : ''}`}
              style={{
                maxHeight: isOpen ? '1000px' : '0'
              }}
            >
              {typeof item.content === 'string' ? (
                <div className="pl-3 text-sm text-gray-600 space-y-2 mb-4">
                  {item.content}
                </div>
              ) : Array.isArray(item.content) ? (
                <div className="pl-3 text-sm text-gray-600 space-y-2 mb-4">
                  {item.content.map((line, lineIdx) => (
                    <p key={lineIdx}>{line}</p>
                  ))}
                </div>
              ) : (
                item.content
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

