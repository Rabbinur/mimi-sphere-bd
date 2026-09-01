"use client"

import { Camera, Mail } from "lucide-react"
import { useEffect, useState } from "react"

import UserHeader from "@/components/custom/UserHeader"
import { useAppDispatch, useAppSelector } from "@/components/Redux/hooks"
import { useUpdateProfileMutation } from "@/components/Redux/RTK/authApi"
import { setUserInfo, useCurrentUserInfo } from "@/components/Redux/Slice/authSlice"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ChangePasswordModal } from "./_components/ChangePasswordModal"

export default function AccountSettingsPage() {
    const [mounted, setMounted] = useState(false)
    const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
    const [openPasswordModal, setOpenPasswordModal] = useState(false)

    const currentUser = useAppSelector(useCurrentUserInfo)
    const [updateProfile, { isLoading }] = useUpdateProfileMutation()
    const dispatch = useAppDispatch()

    useEffect(() => {
        setMounted(true)
    }, [])

    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        photo: "",
    })

    useEffect(() => {
        if (currentUser) {
            setUser({
                name: currentUser.name || "",
                email: currentUser.email || "",
                phone: currentUser.phone || "",
                photo: currentUser.photo || "",
            })
        }
    }, [currentUser])

    if (!mounted) return null

    const handleUserChange = (field: string, value: string) => {
        setUser((prev) => ({ ...prev, [field]: value }))
    }

    const handlePhotoUpload = async (file: File) => {
        try {
            if (file.size > MAX_FILE_SIZE) {
                toast.error("Image size must be less than 2 MB")
                return
            }

            if (!file.type.startsWith("image/")) {
                toast.error("Only image files are allowed")
                return
            }

            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string)

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            const data = await res.json()

            if (!data.secure_url) {
                throw new Error("Upload failed")
            }

            const awsRes = await updateProfile({
                name: user.name,
                phone: user.phone,
                photo: data.secure_url,
            }).unwrap()

            dispatch(setUserInfo(awsRes.data))

            setUser((prev) => ({
                ...prev,
                photo: data.secure_url,
            }))

            toast.success("Photo uploaded successfully 📸")
        } catch (error) {
            toast.error("Failed to upload photo")
        }
    }

    const handleSave = async () => {
        try {
            const res = await updateProfile({
                name: user.name,
                phone: user.phone,
                photo: user.photo,
            }).unwrap()

            dispatch(setUserInfo(res.data))
            toast.success("Profile updated successfully ✅")
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update profile")
        }
    }

    const initials =
        user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U"

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <div className="max-w-4xl mx-auto border-x border-gray-100 min-h-screen">
                <UserHeader title="Account Settings" />

                <main>
                    {/* 1. Profile Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center gap-5">
                        <div className="relative group">
                            <div className="h-20 w-20 rounded-sm bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                                {user.photo ? (
                                    <img src={user.photo} alt="profile" className="h-full w-full object-cover" />
                                ) : (
                                    <Avatar>

                                        <AvatarFallback className="text-2xl text-gray-300 bg-gray-100 uppercase">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                id="profile-photo"
                                hidden
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        handlePhotoUpload(e.target.files[0])
                                    }
                                }}
                            />

                            <button
                                className="absolute -bottom-1 -right-1 bg-white border border-gray-200 p-1 hover:bg-gray-50 transition-colors"
                                onClick={() => document.getElementById("profile-photo")?.click()}
                            >
                                <Camera className="h-3 w-3 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-lg font-bold tracking-tight">{currentUser?.name || "User Name"}</h2>
                            <p className="text-xs text-gray-500 tracking-wider mb-2">{currentUser?.email || "user@example.com"}</p>
                            <button
                                onClick={() => setOpenPasswordModal(true)}
                                className="text-[10px] uppercase font-bold border border-gray-300 px-3 py-1 hover:bg-primary/80 hover:text-white transition-all bg-primary text-white"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* 2. Personal Info Title Area */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/20">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800">
                            Personal Information
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                            Update your personal details and contact info
                        </p>
                    </div>

                    {/* 3. Form Fields */}
                    <div className="p-6 space-y-6">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                                Full Name
                            </Label>
                            <Input
                                value={user.name}
                                onChange={(e) => handleUserChange("name", e.target.value)}
                                className="rounded-sm border-gray-200 focus:border-black focus:ring-0 transition-all text-sm h-11 px-4 placeholder:text-gray-300 shadow-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 stroke-[1.5px]" />
                                <Input
                                    className="pl-11 rounded-sm border-gray-100 bg-gray-50 text-gray-400 text-sm h-11 cursor-not-allowed shadow-none"
                                    value={user.email}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                                Phone Number
                            </Label>
                            <div className="relative">

                                <Input
                                    className="pl-11 rounded-sm border-gray-200 focus:border-black focus:ring-0 transition-all text-sm h-11 px-4 shadow-none"
                                    value={user.phone}
                                    onChange={(e) => handleUserChange("phone", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                className="w-full h-12  bg-primary hover:bg-primary/80 text-white rounded-sm font-bold uppercase text-[11px] tracking-widest transition-all disabled:bg-gray-100 disabled:text-gray-400 shadow-none border-none"
                                disabled={isLoading}
                                onClick={handleSave}
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </main>

                <ChangePasswordModal
                    open={openPasswordModal}
                    onClose={() => setOpenPasswordModal(false)}
                />
            </div>
        </div>
    )
}