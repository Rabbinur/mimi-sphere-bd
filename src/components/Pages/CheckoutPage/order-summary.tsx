import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const cartItems = [
  { name: "Product 1", price: 19.99, quantity: 2 },
  { name: "Product 2", price: 29.99, quantity: 1 },
]

interface OrderSummaryProps {
  onPlaceOrder: () => void
  isPaymentStep: boolean
}

export function OrderSummary({ onPlaceOrder, isPaymentStep }: OrderSummaryProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = 5.99
  const total = subtotal + shipping

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>৳{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>৳{shipping.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>৳{total.toFixed(2)}</span>
          </div>
          {isPaymentStep && (
            <Button onClick={onPlaceOrder} className="w-full mt-4">
              Place Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

