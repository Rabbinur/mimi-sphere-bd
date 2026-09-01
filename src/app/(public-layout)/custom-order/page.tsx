"use client";

import { useAppSelector } from "@/components/Redux/hooks";
import { useCreateCustomOrderMutation } from "@/components/Redux/RTK/customOrderApi";
import { useCurrentUserInfo } from "@/components/Redux/Slice/authSlice";
import {
    CheckCircle,
    ExternalLink,
    Globe,
    Link as LinkIcon,
    Loader2,
    Mail,
    Package,
    Phone,
    ShieldCheck,
    Sparkles,
    UploadCloud,
    User
} from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CustomOrderFormData {
    productName: string;
    productImageUrl: string;
    productDescription: string;
    purchaseUrl: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}

export default function CustomOrderPage() {
    const [createCustomOrder, { isLoading: isSubmitting }] = useCreateCustomOrderMutation();
    const user = useAppSelector(useCurrentUserInfo);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CustomOrderFormData>({
        defaultValues: {
            customerName: user?.name || "",
            customerEmail: user?.email || "",
            customerPhone: user?.phone || "",
        },
    });

    const imageUrl = watch("productImageUrl");

    const onSubmit: SubmitHandler<CustomOrderFormData> = async (data) => {
        try {
            const res = await createCustomOrder(data).unwrap();
            toast.success(res.message || "Request sent successfully");
            setIsSuccess(true);
            reset();
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setIsUploading(true);
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                { method: "POST", body: formData }
            );
            const result = await response.json();
            if (result.success) {
                setValue("productImageUrl", result.data.url);
                toast.success("Image uploaded!");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h2>
                    <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                        We've received your custom order details. A sourcing agent will contact you shortly via email or phone.
                    </p>
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition-all"
                    >
                        Place Another Request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-8 md:py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
                        <div className="space-y-3 text-center lg:text-left animate-in fade-in slide-in-from-left-4 duration-500">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase tracking-wider">
                                <Sparkles size={12} /> Global Sourcing
                            </span>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Anything you want, <br />
                                <span className="text-indigo-600 font-black">from anywhere.</span>
                            </h1>
                            <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
                                Can't find it in our shop? Use this form to request specialized items from international markets.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            <FeatureItem icon={Globe} title="Global Reach" desc="Imports from US, UK, EU, and China." />
                            <FeatureItem icon={ShieldCheck} title="Safe Delivery" desc="Insured shipping to your doorstep." />
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-4 duration-500">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            <div className="p-6 md:p-8 space-y-8">

                                {/* Section 1: Product */}
                                <section className="space-y-5">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                        <div className="p-2 bg-indigo-600 text-white rounded-lg">
                                            <Package size={18} />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800">Item Information</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <CustomInput
                                            label="Product Name"
                                            register={register("productName", { required: "Required" })}
                                            error={errors.productName?.message}
                                            icon={Package}
                                            placeholder="e.g. Dyson V15 Detect"
                                        />
                                        <CustomInput
                                            label="Target Website Link"
                                            register={register("purchaseUrl", { required: "Required" })}
                                            error={errors.purchaseUrl?.message}
                                            icon={LinkIcon}
                                            placeholder="Amazon/eBay URL..."
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 items-end">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Upload Photo</label>
                                            <div className="relative group h-[46px] border border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer overflow-hidden">
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                                <div className="flex items-center gap-2 px-4">
                                                    {isUploading ? <Loader2 className="animate-spin text-indigo-600" size={16} /> : <UploadCloud className="text-slate-400" size={16} />}
                                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Click to upload</span>
                                                </div>
                                            </div>
                                        </div>
                                        <CustomInput
                                            label="Or Image URL"
                                            register={register("productImageUrl", { required: "Image link is required" })}
                                            error={errors.productImageUrl?.message}
                                            icon={LinkIcon}
                                            placeholder="https://..."
                                        />
                                    </div>

                                    {imageUrl && (
                                        <div className="flex items-center gap-3 p-2 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-in fade-in zoom-in-95 duration-300">
                                            <img src={imageUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-white" />
                                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Image attached</span>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 ml-1">Specific Requirements</label>
                                        <textarea
                                            {...register("productDescription", { required: "Required" })}
                                            rows={3}
                                            placeholder="Color, size, storage, or quantity details..."
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-sm"
                                        />
                                    </div>
                                </section>

                                {/* Section 2: Contact */}
                                <section className="space-y-5">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                        <div className="p-2 bg-slate-800 text-white rounded-lg">
                                            <User size={18} />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800">Your Identity</h2>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <CustomInput label="Full Name" register={register("customerName")} icon={User} placeholder="Name" />
                                        <CustomInput label="Email Address" register={register("customerEmail")} icon={Mail} placeholder="Email" type="email" />
                                        <CustomInput label="Phone" register={register("customerPhone")} icon={Phone} placeholder="Phone" />
                                    </div>
                                </section>

                                {/* Footer */}
                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto px-10 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Submit Request <ExternalLink size={16} /></>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CustomInput({ label, register, error, icon: Icon, placeholder, type = "text" }: any) {
    return (
        <div className="space-y-1.5 w-full">
            <label className="text-xs font-bold text-slate-700 ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Icon size={16} />
                </div>
                <input
                    type={type}
                    {...register}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all outline-none text-sm
                        ${error ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"}`}
                />
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{error}</p>}
        </div>
    );
}

function FeatureItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="text-indigo-500 shrink-0"><Icon size={20} /></div>
            <div>
                <h4 className="font-bold text-slate-800 text-xs">{title}</h4>
                <p className="text-[11px] text-slate-500 leading-tight">{desc}</p>
            </div>
        </div>
    );
}