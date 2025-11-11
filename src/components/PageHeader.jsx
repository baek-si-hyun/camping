import { Link, useNavigate } from 'react-router-dom';


export default function PageHeader({ 
  title, 
  showBack = true, 
  onBack,
  rightContent,
  rightLink,
  rightIcon
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
              onClick={handleBack}
            >
              <i className="ri-arrow-left-s-line text-xl" />
            </button>
          )}
          {title && (
            <h1 className={`text-lg font-medium ${showBack ? 'absolute left-1/2 transform -translate-x-1/2' : ''}`}>
              {title}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-3">
          {rightContent || (rightLink && rightIcon && (
            <Link to={rightLink} className="w-8 h-8 flex items-center justify-center cursor-pointer">
              <i className={`${rightIcon} text-xl`} />
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

