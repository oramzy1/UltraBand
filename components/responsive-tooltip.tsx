"use client";

import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ResponsiveTooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <Tooltip open={isMobile ? open : undefined} onOpenChange={setOpen}>
      <TooltipTrigger
        asChild
        onClick={() => {
          if (isMobile) setOpen((prev) => !prev);
        }}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
