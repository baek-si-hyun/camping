export default function FilterTag({ tag, onRemove }) {
  const iconMap = {
    date: 'ri-calendar-line',
    people: 'ri-user-line',
    price: 'ri-price-tag-line',
    search: 'ri-search-line'
  };

  return (
    <button
      className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1"
      onClick={() => onRemove(tag)}
    >
      {iconMap[tag.type] && <i className={`${iconMap[tag.type]} ri-sm`} />}
      {tag.text}
      <i className="ri-close-line ri-sm" />
    </button>
  );
}

