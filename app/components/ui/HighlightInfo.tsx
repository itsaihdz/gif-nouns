import { Icon } from "../icons";

interface HighlightInfoProps {
  className?: string;
}

export function HighlightInfo({ className = "" }: HighlightInfoProps) {
  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon name="sparkles" className="text-blue-600 mt-0.5" size="sm" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Mint in GIF Nouns Collective
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Your GIF will be minted as an NFT in the official GIF Nouns Collective on Highlight.xyz - join the community collection!
          </p>
          <div className="space-y-2 text-xs text-blue-600 dark:text-blue-400">
            <div className="flex items-center gap-2">
              <Icon name="check" size="sm" />
              <span>Part of the official GIF Nouns Collective</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="check" size="sm" />
              <span>Built-in marketplace on Highlight</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="check" size="sm" />
              <span>Automatic royalties for creators</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="check" size="sm" />
              <span>Community-driven collection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 