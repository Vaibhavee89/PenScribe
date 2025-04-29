type SpinnerSize = 'small' | 'medium' | 'large';

type LoadingSpinnerProps = {
  size?: SpinnerSize;
  className?: string;
};

const sizeMap: Record<SpinnerSize, string> = {
  small: 'w-4 h-4 border-2',
  medium: 'w-8 h-8 border-3',
  large: 'w-12 h-12 border-4',
};

const LoadingSpinner = ({ size = 'medium', className = '' }: LoadingSpinnerProps) => {
  return (
    <div
      className={`${sizeMap[size]} rounded-full border-gray-300 border-t-primary-600 animate-spin ${className}`}
    ></div>
  );
};

export default LoadingSpinner;