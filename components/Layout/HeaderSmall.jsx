import { cn } from "@/lib/utils";

export const HeaderSmall = ({ text, className }) => {
  return (
    <h3
      className={cn(
        `text-3xl text-center uppercase font-black text-slate-700 ${className}`,
      )}
    >
      {text}
    </h3>
  );
};
