import { useEbm } from "@/context/EbmContext";
import { Monitor } from "lucide-react";

const EbmHeader = () => {
  const { user } = useEbm();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between text-xs font-mono">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <Monitor className="h-3 w-3" />
          TIN: 100509911
        </span>
        <span>R#: 5</span>
      </div>
      <div className="flex items-center gap-3">
        {user && <span>{user.name}</span>}
        <span>📅 {dateStr} {timeStr}</span>
      </div>
    </div>
  );
};

export default EbmHeader;
