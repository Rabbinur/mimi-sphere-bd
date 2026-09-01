"use client"

import { useCreateAddressMutation, useGetUserAddressesQuery } from "@/components/Redux/RTK/addressApi";
import { useCurrentUserInfo } from "@/components/Redux/Slice/authSlice";
import { useAppSelector } from "@/components/Redux/hooks";
import AddressSelector from "@/components/custom/AddressSelector";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TAddress } from "@/types";
import { Briefcase, CheckCircle2, ChevronRight, Home, Info, Loader2, MapPlus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";

const inputClass =
    "w-full px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white \
   placeholder:text-gray-400 focus:outline-none focus:ring-2 \
   focus:ring-primary/5 focus:border-primary transition-all duration-200 h-10 md:h-11 shadow-sm"

const errorClass =
    "border-red-500 bg-red-50/30 focus:ring-red-500/10 focus:border-red-500"

const CustomerInfoSection = () => {
    const {
        register,
        setValue,
        formState: { errors },
    } = useFormContext()
    const user = useAppSelector(useCurrentUserInfo)
    const { data: addressData } = useGetUserAddressesQuery({}, { skip: !user })
    const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation()
    const userInfo = useAppSelector((state) => state.auth.userInfo)
    const savedAddresses: TAddress[] = addressData?.data || []

    const [isChanging, setIsChanging] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)

    // Modal Form
    const modalForm = useForm<TAddress>({
        defaultValues: {
            label: "Home",
            customer_name: userInfo?.name || "",
            phone: userInfo?.phone || "",
            district: "",
            upazila: "",
            village_or_area: "",
            isDefault: false
        }
    })

    // Select default address if available on mount
    useEffect(() => {
        if (savedAddresses.length > 0 && selectedAddressIndex === null) {
            const defaultIndex = savedAddresses.findIndex((addr: TAddress) => addr.isDefault)
            const initialIndex = defaultIndex !== -1 ? defaultIndex : 0
            handleAddressSelect(initialIndex)
        }
    }, [savedAddresses.length])

    const handleAddressSelect = (index: number, manualAddr?: TAddress) => {
        const addr = manualAddr || savedAddresses[index]
        if (!addr) return

        setSelectedAddressIndex(index)
        setIsChanging(false)

        setValue("customer_name", addr.customer_name, { shouldValidate: true })
        setValue("phone", addr.phone, { shouldValidate: true })
        setValue("district", addr.district, { shouldValidate: true })
        setValue("upazila", addr.upazila, { shouldValidate: true })
        setValue("village_or_area", addr.village_or_area, { shouldValidate: true })
    }

    const onAddAddressSubmit = async (values: TAddress) => {
        try {
            const res = await createAddress(values).unwrap()
            toast.success("Address added and selected")
            setIsAddModalOpen(false)
            modalForm.reset()

            // Auto select the newly created address
            if (res?.data) {
                const newAddresses = [...savedAddresses, res.data]
                handleAddressSelect(newAddresses.length - 1, res.data)
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add address")
        }
    }

    const selectedAddr = selectedAddressIndex !== null ? savedAddresses[selectedAddressIndex] : null

    return (
        <section className="bg-white rounded-lg md:rounded-xl p-2 md:p-4 shadow-sm border border-gray-100 space-y-2 md:space-y-4">

            {/* HEADER DESIGN FROM IMAGE */}
            {user &&
                <>

                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <h2 className="text-sm md:text-lg font-bold text-gray-800 flex items-center gap-2">
                                Select a Delivery Address ({savedAddresses.length}/10)
                            </h2>
                        </div>
                        {savedAddresses.length < 10 && (
                            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="text-primary font-bold text-sm flex items-center hover:opacity-80 transition-opacity"
                                    >
                                        <MapPlus className="w-4 h-4 mr-1" /> New Address
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                                    <DialogHeader className="p-6 bg-gray-50 border-b border-gray-100">
                                        <DialogTitle className="text-xl font-bold text-gray-800">Add New Address</DialogTitle>
                                        <DialogDescription>
                                            Enter your shipping details below to save this address.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Address Label</Label>
                                            <div className="flex gap-2">
                                                {["Home", "Office", "Other"].map((l) => (
                                                    <button
                                                        key={l}
                                                        type="button"
                                                        onClick={() => modalForm.setValue("label", l)}
                                                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${modalForm.watch("label") === l
                                                            ? "bg-primary border-primary text-white shadow-sm"
                                                            : "bg-white border-gray-200 text-gray-600 hover:border-primary/50"
                                                            }`}
                                                    >
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:gap-4 gap-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</Label>
                                                <Input
                                                    {...modalForm.register("customer_name", { required: true })}
                                                    className="rounded-xl border-gray-200 h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</Label>
                                                <Input
                                                    type="tel"
                                                    {...modalForm.register("phone", {
                                                        required: true,
                                                        pattern: /^[0-9]+$/,
                                                        minLength: 11,
                                                        maxLength: 11
                                                    })}
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                    }}
                                                    className="rounded-xl border-gray-200 h-11"
                                                />
                                            </div>
                                        </div>
                                        <FormProvider {...modalForm}>
                                            <AddressSelector />
                                        </FormProvider>
                                        <DialogFooter className="pt-2">
                                            <Button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    modalForm.handleSubmit(onAddAddressSubmit)(e);
                                                }}
                                                disabled={isCreating}
                                                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 font-bold shadow-lg shadow-primary/20"
                                            >
                                                {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                Save & Use Address
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="pt-2">
                        {!isChanging && selectedAddr ? (
                            /* SELECTED ADDRESS PREVIEW (FOLLOWING IMAGE) */
                            <div className="group relative p-2 md:p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/30 transition-all duration-300">
                                <div className="flex flex-col gap-1 md:gap-2">
                                    <div className="flex items-center gap-3">
                                        {/* Label Badge */}
                                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100">
                                            {selectedAddr.label === "Office" ? <Briefcase className="w-2.5 h-2.5" /> : <Home className="w-2.5 h-2.5" />}
                                            {selectedAddr.label || "Home"}
                                        </span>
                                        <span className="font-bold text-gray-900 text-sm">
                                            {selectedAddr.customer_name}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-[13px] font-medium pl-0.5">
                                        {selectedAddr.phone}
                                    </p>

                                    <div className="flex items-center justify-between gap-4 mt-1">
                                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-1">
                                            {selectedAddr.village_or_area}, {selectedAddr.upazila}, {selectedAddr.district}, Bangladesh
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setIsChanging(true)}
                                            className="text-primary font-bold text-[13px] whitespace-nowrap flex items-center hover:underline"
                                        >
                                            Change Address <ChevronRight className="w-3 h-3 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* LIST VIEW / SELECTION GRID */
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {savedAddresses.map((addr, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleAddressSelect(index)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 group relative
                                        ${selectedAddressIndex === index
                                                    ? "border-primary bg-primary/5 ring-4 ring-primary/5 shadow-sm"
                                                    : "border-gray-50 bg-gray-50/30 hover:border-gray-200 hover:bg-white"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs font-bold ${selectedAddressIndex === index ? "text-primary" : "text-gray-800"}`}>
                                                    {addr.customer_name}
                                                </span>
                                                {selectedAddressIndex === index && (
                                                    <CheckCircle2 className="w-3 h-3 text-primary animate-in zoom-in" />
                                                )}
                                                {addr.label && (
                                                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase ml-auto">
                                                        {addr.label}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                                                {addr.phone} <br />
                                                {addr.village_or_area}, {addr.upazila}, {addr.district}
                                            </p>
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedAddressIndex(null)
                                            setIsChanging(false)
                                            // Reset manual form fields
                                            setValue("customer_name", userInfo?.name || "")
                                            setValue("phone", userInfo?.phone || "")
                                            setValue("district", "")
                                            setValue("upazila", "")
                                            setValue("village_or_area", "")
                                        }}
                                        className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-200
                                    ${selectedAddressIndex === null && !isChanging
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500"
                                            }`}
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Manual Entry</span>
                                    </button>
                                </div>

                                {isChanging && (
                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsChanging(false)}
                                            className="text-xs font-bold text-gray-500 hover:text-gray-700"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>}
            {/* MANUAL ENTRY REVEALED IF NO ADDRESS SELECTED OR MANUAL PICKED */}
            {(selectedAddressIndex === null && !isChanging) && (
                <div className="space-y-2 md:space-y-4 pt-2 md:pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-primary">
                        <Info className="w-4 h-4" />
                        <p className="text-[11px] font-bold uppercase tracking-wider">Entering  Address</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 md:gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs md:text-sm font-medium text-gray-700">Full Name *</Label>
                            <Input
                                placeholder="e.g. Rahul Ahmed"
                                className={`${inputClass} ${errors.customer_name ? errorClass : ""}`}
                                {...register("customer_name", { required: "Full name is required" })}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs md:text-sm font-medium text-gray-700">Phone Number *</Label>
                            <Input
                                type="tel"
                                placeholder="e.g. 01712345678"
                                className={`${inputClass} ${errors.phone ? errorClass : ""}`}
                                {...register("phone", {
                                    required: "Phone is required",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Please enter valid numbers only"
                                    },
                                    minLength: {
                                        value: 11,
                                        message: "Phone number must be exactly 11 digits"
                                    },
                                    maxLength: {
                                        value: 11,
                                        message: "Phone number must be exactly 11 digits"
                                    }
                                })}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                }}
                            />
                            {errors.phone && (
                                <p className="text-xs text-red-500 mt-1">{errors.phone.message as string}</p>
                            )}
                        </div>
                    </div>
                    <AddressSelector />
                </div>
            )}

            {/* NOTES Always visible */}
            <div className="space-y-1 md:pt-2">
                <Label className="text-xs md:text-sm font-medium text-gray-700">
                    Order Notes (Optional)
                </Label>
                <Textarea
                    placeholder="Any special instructions for delivery..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50/30 
                     placeholder:text-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-primary/5 focus:border-primary transition-all 
                     duration-200 resize-none"
                    {...register("notes")}
                />
            </div>

        </section>
    )
}

export default CustomerInfoSection
