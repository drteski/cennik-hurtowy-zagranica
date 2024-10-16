import { cn } from "@/lib/utils";

export const HeaderMain = ({ text, className }) => {
  return (
    <h1
      className={cn(
        `text-6xl text-center uppercase font-black text-slate-700 ${className}`,
      )}
    >
      {text}
    </h1>
  );
};
