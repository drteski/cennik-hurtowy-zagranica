import { LoadingSpinner } from "@/components/Icones";

const LoadingState = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <LoadingSpinner className="h-[200px] w-[200px]" />
    </div>
  );
};

export default LoadingState;
