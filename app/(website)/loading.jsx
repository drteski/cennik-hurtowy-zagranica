import { LoadingSpinner } from "@/components/Icones";

const LoadingState = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <LoadingSpinner className="h-[200px] w-[200px]" />
    </div>
  );
};

export default LoadingState;
