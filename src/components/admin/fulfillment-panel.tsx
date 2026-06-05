'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Truck, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface FulfillmentPanelProps {
  order: {
    id: string;
    status: string;
    prodigiOrderId: string | null;
    supplierCostCents: number | null;
    carrier: string | null;
    trackingUrl: string | null;
    shippedAt: string | null;
    fulfillmentError: string | null;
  };
}

export function FulfillmentPanel({ order }: FulfillmentPanelProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canResubmit = !!order.fulfillmentError || !order.prodigiOrderId;

  const handleResubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/resubmit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to re-submit order');
      }

      toast.success('Order re-submitted to Prodigi');
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to re-submit order';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5" />
        Fulfillment
      </h2>

      <div className="space-y-3 text-sm">
        {/* Prodigi Order ID */}
        {order.prodigiOrderId && (
          <div>
            <p className="text-gray-600">Prodigi Order ID</p>
            <p className="font-medium text-gray-900">{order.prodigiOrderId}</p>
          </div>
        )}

        {/* Supplier Cost */}
        {order.supplierCostCents != null && (
          <div>
            <p className="text-gray-600">Supplier Cost</p>
            <p className="font-medium text-gray-900">
              {formatPrice(order.supplierCostCents)}
            </p>
          </div>
        )}

        {/* Fulfillment State */}
        <div>
          <p className="text-gray-600">Fulfillment State</p>
          <p className="font-medium text-gray-900">
            {order.fulfillmentError
              ? 'Failed'
              : order.prodigiOrderId
              ? order.status === 'SHIPPED' || order.status === 'DELIVERED'
                ? order.status.charAt(0) + order.status.slice(1).toLowerCase()
                : 'Submitted'
              : 'Pending'}
          </p>
        </div>

        {/* Carrier */}
        {order.carrier && (
          <div>
            <p className="text-gray-600">Carrier</p>
            <p className="font-medium text-gray-900">{order.carrier}</p>
          </div>
        )}

        {/* Tracking URL */}
        {order.trackingUrl && (
          <div>
            <p className="text-gray-600">Tracking</p>
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              Track shipment
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Shipped At */}
        {order.shippedAt && (
          <div>
            <p className="text-gray-600">Shipped At</p>
            <p className="font-medium text-gray-900">
              {new Date(order.shippedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}

        {/* Fulfillment Error */}
        {order.fulfillmentError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Fulfillment Error</p>
                <p className="text-red-700 mt-1">{order.fulfillmentError}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Re-submit button */}
      {canResubmit && (
        <button
          onClick={handleResubmit}
          disabled={isSubmitting}
          className="mt-4 w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Re-submitting...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Re-submit to Prodigi
            </>
          )}
        </button>
      )}
    </div>
  );
}
