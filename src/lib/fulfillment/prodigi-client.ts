import { getProdigiApiBase, getProdigiApiKey } from "./prodigi-config";

// --- Request types ---

export interface ProdigiRecipientAddress {
  line1: string;
  line2?: string;
  postalOrZipCode: string;
  countryCode: string;
  townOrCity: string;
  stateOrCounty?: string;
}

export interface ProdigiRecipient {
  name: string;
  address: ProdigiRecipientAddress;
}

export interface ProdigiAsset {
  printArea: string;
  url: string;
}

export interface ProdigiItem {
  merchantReference: string;
  sku: string;
  copies: number;
  sizing: string;
  assets: ProdigiAsset[];
}

export interface ProdigiOrderPayload {
  merchantReference: string;
  shippingMethod: string;
  recipient: ProdigiRecipient;
  items: ProdigiItem[];
}

// --- Response types ---

export interface ProdigiCost {
  amount: string;
  currency: string;
}

export interface ProdigiCharge {
  totalCost: ProdigiCost;
}

export interface ProdigiTracking {
  url: string;
}

export interface ProdigiCarrier {
  name: string;
}

export interface ProdigiShipment {
  carrier: ProdigiCarrier;
  tracking: ProdigiTracking;
}

export interface ProdigiOrderStatus {
  stage: string;
}

export interface ProdigiOrderData {
  id: string;
  status: ProdigiOrderStatus;
  charges: ProdigiCharge[];
  shipments: ProdigiShipment[];
}

export interface ProdigiOrderResponse {
  order: ProdigiOrderData;
}

export interface ProdigiOrderStatusResponse {
  order: ProdigiOrderData;
}

export interface ProdigiErrorDetail {
  description: string;
}

export interface ProdigiErrorResponse {
  statusCode: number;
  errors: ProdigiErrorDetail[];
}

export class ProdigiApiError extends Error {
  public statusCode: number;
  public errors: ProdigiErrorDetail[];

  constructor(statusCode: number, errors: ProdigiErrorDetail[]) {
    const message =
      errors.map((e) => e.description).join("; ") ||
      `Prodigi API error (${statusCode})`;
    super(message);
    this.name = "ProdigiApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Submit an order to the Prodigi API.
 * POST /v4.0/Orders
 */
export async function submitOrder(
  payload: ProdigiOrderPayload
): Promise<ProdigiOrderResponse> {
  const base = getProdigiApiBase();
  const apiKey = getProdigiApiKey();

  const response = await fetch(`${base}/v4.0/Orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as ProdigiErrorResponse;
    throw new ProdigiApiError(
      response.status,
      errorBody.errors || [{ description: `HTTP ${response.status}` }]
    );
  }

  return (await response.json()) as ProdigiOrderResponse;
}

/**
 * Get the status of an existing Prodigi order.
 * GET /v4.0/Orders/{id}
 */
export async function getOrder(
  prodigiOrderId: string
): Promise<ProdigiOrderStatusResponse> {
  const base = getProdigiApiBase();
  const apiKey = getProdigiApiKey();

  const response = await fetch(`${base}/v4.0/Orders/${prodigiOrderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as ProdigiErrorResponse;
    throw new ProdigiApiError(
      response.status,
      errorBody.errors || [{ description: `HTTP ${response.status}` }]
    );
  }

  return (await response.json()) as ProdigiOrderStatusResponse;
}
