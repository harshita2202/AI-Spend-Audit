import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Twitter, Check } from "lucide-react";

interface ShareButtonsProps {
  savings: number;
  auditId?: string;
}

export function ShareButtons({ savings, auditId }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = auditId
    ? `${window.location.origin}/audit/${auditId}`
    : `${window.location.origin}/audit/demo`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const tweetText = encodeURIComponent(
    `Just audited our AI tool spend with SpendSense AI — found $${savings}/month in potential savings. Takes 2 minutes, free. Check it out:`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div data-testid="share-buttons">
      <h3 className="text-lg font-semibold text-foreground mb-4">Share your audit</h3>
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <Button
          variant="outline"
          onClick={handleCopy}
          className="flex items-center gap-2"
          data-testid="button-copy-link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              Copy link
            </>
          )}
        </Button>
        <Button
          variant="outline"
          asChild
          className="flex items-center gap-2"
          data-testid="button-twitter-share"
        >
          <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
            <Twitter className="w-4 h-4" />
            Share on X
          </a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Shared links show savings numbers only — your email and company name are never public.
      </p>
    </div>
  );
}
