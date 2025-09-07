"use client"

import { BadgeCheck, CreditCard, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export type ReviewDetails = {
  email?: string
  firstName: string
  lastName: string
  address: string
  address2?: string
  city: string
  state: string
  pin: string
  country: string
  phone: string
}

export function ReviewAndPay({
  details,
  subtotal,
  delivery,
  onBack,
  onPlaceOrder,
}: {
  details: ReviewDetails
  subtotal: number
  delivery: number
  onBack: () => void
  onPlaceOrder: () => void
}) {
  const total = subtotal + delivery

  return (
    <div className="rounded-xl border border-teal-100 bg-white/80 shadow-sm backdrop-blur-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Review & Pay</h2>
        <p className="text-sm text-slate-600">Confirm your details and place the order.</p>
      </div>

      <div className="grid gap-6 p-6 md:p-8">
        <Card>
          <CardContent className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-700">Contact</h3>
                <p className="text-sm text-slate-700">
                  {details.firstName} {details.lastName}
                </p>
                {details.email && <p className="text-sm text-slate-600">{details.email}</p>}
                <p className="text-sm text-slate-600">{details.phone}</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-700">Delivery address</h3>
                <p className="text-sm text-slate-700">{details.address}</p>
                {details.address2 && <p className="text-sm text-slate-700">{details.address2}</p>}
                <p className="text-sm text-slate-600">
                  {details.city}, {details.state} {details.pin}
                </p>
                <p className="text-sm text-slate-600">{details.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <CreditCard className="h-4 w-4 text-teal-600" /> Payment method
            </h3>
            <RadioGroup defaultValue="cod" className="grid gap-3">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="cod" value="cod" />
                  <Label htmlFor="cod" className="cursor-pointer">
                    Cash on Delivery
                    <span className="block text-xs font-normal text-slate-500">Pay when your order is delivered</span>
                  </Label>
                </div>
                <BadgeCheck className="h-5 w-5 text-teal-600" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 opacity-60">
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="card" value="card" disabled />
                  <Label htmlFor="card" className="cursor-not-allowed">
                    Card / UPI (coming soon)
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row">
          <Button variant="outline" onClick={onBack}>
            Edit details
          </Button>
          <Button onClick={onPlaceOrder} className="bg-teal-600 text-white hover:bg-teal-700">
            <Truck className="mr-2 h-4 w-4" />
            Place order
          </Button>
        </div>
      </div>
    </div>
  )
}
