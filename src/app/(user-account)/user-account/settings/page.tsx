"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label"; // Import Label component
import { toast } from "sonner";

interface AddressFormValues {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentFormValues {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PaymentAndAddressPage() {
  const [activeTab, setActiveTab] = useState("address");

  const addressForm = useForm<AddressFormValues>({
    defaultValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const paymentForm = useForm<PaymentFormValues>({
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    // Add resolver for validation if needed (e.g., yupResolver)
  });

  function onAddressSubmit(data: AddressFormValues) {
    toast("Address saved", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function onPaymentSubmit(data: PaymentFormValues) {
    toast("Payment method saved", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function onPasswordSubmit(data: PasswordFormValues) {
    // **Important:** In a real application, you would send this data to your server
    // to handle the password change securely. DO NOT store passwords on the client-side.

    // Validate that the new password and confirm password match. This is a client-side check.
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return; // Stop further processing
    }

    // Simulate server-side password change success/failure (replace with your actual API call)
    setTimeout(() => {
      toast.success("Password changed successfully!");
      passwordForm.reset(); // Clear the form after successful submission
    }, 500);

    // Display the data (for demonstration purposes only!)
    toast("Password change request submitted (simulated)", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Payment & Address</h2>
      </div>
      <Tabs defaultValue="address" className="w-full">
        <TabsList>
          <TabsTrigger value="address" onClick={() => setActiveTab("address")}>
            Addresses
          </TabsTrigger>
          <TabsTrigger value="payment" onClick={() => setActiveTab("payment")}>
            Payment Methods
          </TabsTrigger>
          <TabsTrigger
            value="password"
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="address" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Addresses</CardTitle>
              <CardDescription>Manage your saved addresses</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <RadioGroup defaultValue="home">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="flex-1">
                    {" "}
                    {/* Label component used here */}
                    <p className="font-semibold">Home</p>
                    <p className="text-sm text-gray-500">
                      123 Main St, Anytown, ST 12345
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <RadioGroupItem value="work" id="work" />
                  <Label htmlFor="work" className="flex-1">
                    {" "}
                    {/* Label component used here */}
                    <p className="font-semibold">Work</p>
                    <p className="text-sm text-gray-500">
                      456 Office Blvd, Worktown, ST 67890
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Add  Address</CardTitle>
              <CardDescription>Enter your address details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...addressForm}>
                <form
                  onSubmit={addressForm.handleSubmit(onAddressSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={addressForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input placeholder="Apt 4B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addressForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Anytown" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addressForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="ST" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={addressForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Address</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Payment Methods</CardTitle>
              <CardDescription>
                Manage your saved payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <RadioGroup defaultValue="visa">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <RadioGroupItem value="visa" id="visa" />
                  <Label htmlFor="visa" className="flex-1">
                    {" "}
                    {/* Label component used here */}
                    <p className="font-semibold">Visa ending in 1234</p>
                    <p className="text-sm text-gray-500">Expires 12/2024</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <RadioGroupItem value="mastercard" id="mastercard" />
                  <Label htmlFor="mastercard" className="flex-1">
                    {" "}
                    {/* Label component used here */}
                    <p className="font-semibold">Mastercard ending in 5678</p>
                    <p className="text-sm text-gray-500">Expires 06/2025</p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add New Payment Method
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Add New Payment Method</CardTitle>
              <CardDescription>Enter your payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form
                  onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={paymentForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={paymentForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={paymentForm.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">Save Payment Method</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter current password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Change Password</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
