"use client"

import {
  CheckCircle2,
  Loader2,
  MapPin,
  MapPinned,
  Pencil,
  Plus,
  Trash2
} from "lucide-react"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import UserHeader from "@/components/custom/UserHeader"
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetUserAddressesQuery,
  useUpdateAddressMutation,
} from "@/components/Redux/RTK/addressApi"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import AddressSelector from "@/components/custom/AddressSelector"
import { Skeleton } from "@/components/ui/skeleton"

type AddressFormValues = {
  customer_name: string
  phone: string
  village_or_area: string
  upazila: string
  district: string
  isDefault: boolean
  label: string
}

export default function AddressesPage() {
  const { data: addressData, isLoading: isAddressesLoading } = useGetUserAddressesQuery({})
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation()
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation()
  const [deleteAddress] = useDeleteAddressMutation()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const addresses = addressData?.data || []

  const form = useForm<AddressFormValues>({
    defaultValues: {
      customer_name: "",
      phone: "",
      village_or_area: "",
      upazila: "",
      district: "",
      isDefault: false,
      label: "Home"
    },
  })

  // Set default values when editing
  useEffect(() => {
    if (!isDialogOpen) return

    if (editingId) {
      const addr = addresses.find((a: any) => a._id === editingId)
      if (addr) {
        form.reset({
          customer_name: addr.customer_name,
          phone: addr.phone,
          village_or_area: addr.village_or_area,
          upazila: addr.upazila,
          district: addr.district,
          isDefault: addr.isDefault,
          label: addr.label,
        })
      }
    } else {
      form.reset({
        customer_name: "",
        phone: "",
        village_or_area: "",
        upazila: "",
        district: "",
        isDefault: false,
        label: "Home"
      })
    }
  }, [editingId, addresses, form, isDialogOpen])

  const onSubmit = async (values: AddressFormValues) => {
    try {
      if (editingId) {
        await updateAddress({ id: editingId, data: values }).unwrap()
        toast.success("Address updated")
      } else {
        await createAddress(values).unwrap()
        toast.success("Address added")
      }
      setIsDialogOpen(false)
      setEditingId(null)
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save address")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    try {
      await deleteAddress(id).unwrap()
      toast.success("Address deleted")
    } catch (error: any) {
      toast.error("Failed to delete address")
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await updateAddress({ id, data: { isDefault: true } }).unwrap()
      toast.success("Default address updated")
    } catch (error: any) {
      toast.error("Failed to update default address")
    }
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20">
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-sm border-x border-gray-100">
        <UserHeader title="My Addresses" backUrl="/user-account" />

        <div className="p-4 md:p-6 space-y-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
            <div>
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <MapPinned className="w-5 h-5 text-primary" />
                Shipping Addresses
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage your delivery locations</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) setEditingId(null)
            }}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/80 text-white rounded-full px-5 h-10 shadow-lg shadow-emerald-200 transition-all active:scale-95">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <DialogHeader className="p-6 bg-gray-50 border-b border-gray-100">
                  <DialogTitle className="text-xl font-bold text-gray-800">
                    {editingId !== null ? "Edit Address" : "Add New Address"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingId !== null ? "Update your existing address details below." : "Enter the details for your new shipping address."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-5">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Address Label</Label>
                      <div className="flex gap-2">
                        {["Home", "Office", "Other"].map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => form.setValue("label", l)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${form.watch("label") === l
                              ? "bg-primary border-primary text-white shadow-md shadow-emerald-100"
                              : "bg-white border-gray-200 text-gray-600 hover:border-primary/80"
                              }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</Label>
                        <Input
                          {...form.register("customer_name", { required: "Name is required" })}
                          placeholder="John Doe"
                          className="rounded-xl border-gray-200 focus:ring-emerald-500/10 focus:border-emerald-500 h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone</Label>
                        <Input
                          {...form.register("phone", { required: "Phone is required" })}
                          placeholder="017XXXXXXXX"
                          className="rounded-xl border-gray-200 focus:ring-emerald-500/10 focus:border-emerald-500 h-11"
                        />
                      </div>
                    </div>
                  </div>

                  <FormProvider {...form}>
                    <AddressSelector />
                  </FormProvider>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      {...form.register("isDefault")}
                      className="w-4 h-4 accent-primary"
                    />
                    <Label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Set as default shipping address
                    </Label>
                  </div>

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="rounded-xl h-11 px-6 border-gray-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-primary hover:bg-primary/80 text-white rounded-xl h-11 px-8 shadow-lg shadow-emerald-200"
                    >
                      {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingId !== null ? "Save Changes" : "Save Address"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Address List */}
          <div className="grid gap-4">
            {isAddressesLoading ? (
              [1, 2].map(i => (
                <div key={i} className="p-5 border border-gray-100 rounded-2xl space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : addresses.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-500 font-medium">No addresses saved yet</h3>
                <p className="text-xs text-gray-400 mt-1 mb-6">Add an address to speed up your checkout process</p>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(true)}
                  className="rounded-full border-emerald-200 text-primary hover:bg-emerald-50 px-6"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Your First Address
                </Button>
              </div>
            ) : (
              addresses.map((addr: any) => (
                <div
                  key={addr._id}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 ${addr.isDefault
                    ? "border-emerald-200 bg-emerald-50/20 shadow-sm"
                    : "border-gray-100 bg-white hover:border-emerald-100 hover:shadow-md hover:shadow-gray-100"
                    }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-800 text-lg uppercase tracking-tight">{addr.customer_name}</span>
                        {addr.isDefault && (
                          <span className="flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            <CheckCircle2 className="w-3 h-3" /> Default
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                          {addr.village_or_area}
                        </p>
                        <p className="ml-6 font-medium text-gray-800">
                          {addr.upazila}, {addr.district}
                        </p>
                        <p className="flex items-center gap-2 text-primary font-bold mt-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {addr.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:flex-col lg:flex-row">
                      {!addr.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(addr._id)}
                          className="h-9 px-3 text-xs font-bold text-primary hover:bg-emerald-50 rounded-lg"
                        >
                          Set Default
                        </Button>
                      )}
                      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingId(addr._id)
                            setIsDialogOpen(true)
                          }}
                          className="w-8 h-8 text-gray-500 hover:text-primary hover:bg-white rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(addr._id)}
                          className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="p-6 border-t border-gray-50 mt-10">
          <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Your address privacy matters</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                We only use your address for delivery purposes. Your physical location information is encrypted and never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

