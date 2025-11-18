import { ArrowLeft, Save, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface EditorHeaderProps {
  title: string;
  onSave?: () => void;
  onAddToCart: () => void;
  isSaving?: boolean;
  backUrl?: string;
}

export function EditorHeader({
  title,
  onSave,
  onAddToCart,
  isSaving = false,
  backUrl = '/collections/all',
}: EditorHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left - Back button */}
          <Link
            href={backUrl}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          {/* Center - Title */}
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h1>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {onSave && (
              <button
                onClick={onSave}
                disabled={isSaving}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Draft
                  </>
                )}
              </button>
            )}

            <button
              onClick={onAddToCart}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>

            {/* Mobile version - Icon only */}
            <button
              onClick={onAddToCart}
              className="sm:hidden p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
