import { LoadingSpinner } from "@/components/Layout/Icones";

const LoadingState = ({ size }) => {
  const widthHeight = {
    sm: { width: 50, height: 50 },
    md: { width: 100, height: 100 },
    lg: { width: 200, height: 200 },
    xl: { width: 250, height: 250 },
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <LoadingSpinner
        width={size ? widthHeight[`${size}`].width : 150}
        height={size ? widthHeight[`${size}`].height : 150}
      />
    </div>
  );
};

export default LoadingState;
