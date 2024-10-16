import { cn } from "@/lib/utils";

export const HeaderMedium = ({ text, className }) => {
  return (
    <h2
      className={cn(
        `text-4xl text-center uppercase font-black text-slate-700 ${className}`,
      )}
    >
      {text}
    </h2>
  );
};
