"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type CopyTemplateButtonProps = {
  text: string;
};

export function CopyTemplateButton({ text }: CopyTemplateButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyTemplate() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copyTemplate}>
      {copied ? (
        <>
          <Check className="size-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-4" />
          Copy template
        </>
      )}
    </Button>
  );
}
