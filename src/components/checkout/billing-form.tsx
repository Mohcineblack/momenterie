"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { ShippingFormData } from "./shipping-form";

const billingSchema = z.object({
  sameAsShipping: z.boolean(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  company: z.string().optional(),
  street: z.string().min(5).optional(),
  street2: z.string().optional(),
  city: z.string().min(2).optional(),
  state: z.string().optional(),
  postalCode: z.string().min(4).optional(),
  country: z.string().min(2).optional(),
  phone: z.string().optional(),
});

export type BillingFormData = z.infer<typeof billingSchema>;

interface BillingFormProps {
  onComplete: (data: BillingFormData) => void;
  onBack: () => void;
  initialData?: Partial<BillingFormData>;
  shippingAddress?: Omit<ShippingFormData, "email">;
  isLoading?: boolean;
}

export function BillingForm({
  onComplete,
  onBack,
  initialData,
  shippingAddress,
  isLoading = false,
}: BillingFormProps) {
  const [sameAsShipping, setSameAsShipping] = useState(
    initialData?.sameAsShipping ?? true
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: initialData || {
      sameAsShipping: true,
      country: "DE",
    },
  });

  const onSubmit = (data: BillingFormData) => {
    if (data.sameAsShipping && shippingAddress) {
      // Use shipping address for billing
      onComplete({
        ...data,
        ...shippingAddress,
        sameAsShipping: true,
      });
    } else {
      onComplete(data);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Billing Address</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Same as Shipping Checkbox */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("sameAsShipping")}
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="mt-1 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <div>
              <span className="font-medium text-gray-900">
                Same as shipping address
              </span>
              {shippingAddress && sameAsShipping && (
                <p className="text-sm text-gray-600 mt-1">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                  <br />
                  {shippingAddress.street}
                  <br />
                  {shippingAddress.city}, {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.country}
                </p>
              )}
            </div>
          </label>
        </div>

        {/* Billing Address Fields (only shown if not same as shipping) */}
        {!sameAsShipping && (
          <>
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First name *
                </label>
                <input
                  {...register("firstName")}
                  id="firstName"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last name *
                </label>
                <input
                  {...register("lastName")}
                  id="lastName"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company (optional)
              </label>
              <input
                {...register("company")}
                id="company"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Company name"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street address *
              </label>
              <input
                {...register("street")}
                id="street"
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                  errors.street ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="123 Main St"
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.street.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="street2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Apartment, suite, etc. (optional)
              </label>
              <input
                {...register("street2")}
                id="street2"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Apt 4B"
              />
            </div>

            {/* City, Postal */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City *
                </label>
                <input
                  {...register("city")}
                  id="city"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Berlin"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Postal code *
                </label>
                <input
                  {...register("postalCode")}
                  id="postalCode"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.postalCode ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="10115"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>

            {/* State & Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State / Region (optional)
                </label>
                <input
                  {...register("state")}
                  id="state"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Bavaria"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country *
                </label>
                <select
                  {...register("country")}
                  id="country"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="DE">Germany</option>
                  <option value="AT">Austria</option>
                  <option value="CH">Switzerland</option>
                  <option value="FR">France</option>
                  <option value="BE">Belgium</option>
                  <option value="NL">Netherlands</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Initializing payment...
              </>
            ) : (
              <>
                Continue to Payment
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
