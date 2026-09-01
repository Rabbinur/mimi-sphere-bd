"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

/* ---------------- Types ---------------- */
interface District {
    id: string;
    name: string;
}

interface Upazila {
    id: string;
    district_id: string;
    name: string;
}

interface TDhaka {
    division_id: string;
    district_id: string;
    city_corporation: "Dhaka North" | "Dhaka South" | "North";
    name: string;
    bn_name: string;
}

export default function AddressSelector() {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const selectedDistrict = watch("district");

    const [districts, setDistricts] = useState<District[]>([]);
    const [upazilas, setUpazilas] = useState<Upazila[]>([]);
    const [dhakaAreas, setDhakaAreas] = useState<TDhaka[]>([]);
    const [loading, setLoading] = useState(true);

    /* ---------------- Load JSON ---------------- */
    useEffect(() => {
        Promise.all([
            fetch("/bd-districts.json").then((r) => r.json()),
            fetch("/bd-upazilas.json").then((r) => r.json()),
            fetch("/dhaka-city.json").then((r) => r.json()),
        ])
            .then(([districtRes, upazilaRes, dhakaRes]) => {
                const filteredDistricts = districtRes.districts.filter(
                    (d: District) => d.name !== "Dhaka"
                );

                setDistricts([
                    { id: "dhaka-north", name: "Dhaka North" },
                    { id: "dhaka-south", name: "Dhaka South" },
                    ...filteredDistricts,
                ]);

                setUpazilas(upazilaRes.upazilas);
                setDhakaAreas(dhakaRes);
            })
            .finally(() => setLoading(false));
    }, []);

    /* ---------------- Auto delivery zone ---------------- */
    useEffect(() => {
        if (!selectedDistrict) return;

        if (
            selectedDistrict === "Dhaka North" ||
            selectedDistrict === "Dhaka South"
        ) {
            setValue("delivery_zone", "inside", { shouldValidate: true });
        } else {
            setValue("delivery_zone", "outside", { shouldValidate: true });
        }
    }, [selectedDistrict, setValue]);

    /* ---------------- Normal district object ---------------- */
    const selectedDistrictObj = districts.find(
        (d) => d.name === selectedDistrict
    );

    /* ---------------- Upazila / Area logic ---------------- */
    const filteredUpazilas =
        selectedDistrict === "Dhaka North" || selectedDistrict === "Dhaka South"
            ? dhakaAreas
                .filter((a) => a.city_corporation === selectedDistrict)
                .map((a, i) => ({
                    id: String(i),
                    name: a.name,
                }))
            : upazilas.filter(
                (u) => u.district_id === selectedDistrictObj?.id
            );

    if (loading) {
        return (
            <p className="text-sm text-gray-500">Loading address options…</p>
        );
    }

    return (
        <div className=" space-y-2 md:space-y-4">
            <div className="grid grid-cols-2 gap-2 md:gap-4">
                {/* ---------------- District ---------------- */}
                <div className="space-y-1">
                    <Label>District *</Label>

                    <select
                        className={`w-full border rounded-lg px-4 py-2 mt-1.5 text-sm bg-white transition shadow-sm
            focus:outline-none focus:ring-2
            ${errors.district
                                ? "border-red-500 bg-red-50/30 focus:ring-red-500/10 focus:border-red-500"
                                : "border-gray-200 focus:ring-primary/5 focus:border-primary"
                            }`}
                        {...register("district", { required: "District is required" })}
                    >
                        <option value="">Select district</option>
                        {districts.map((d) => (
                            <option key={d.id} value={d.name}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    {errors.district && (
                        <p className="text-[11px] text-red-500 font-medium mt-1 ml-0.5">
                            {errors.district.message as string}
                        </p>
                    )}
                </div>

                {/* ---------------- Upazila / Area ---------------- */}
                <div className="space-y-1">
                    <Label className="text-xs md:text-sm font-medium text-gray-700">
                        {selectedDistrict === "Dhaka North" ||
                            selectedDistrict === "Dhaka South"
                            ? "Area (Dhaka City) *"
                            : "Upazila *"}
                    </Label>

                    <select
                        className={`w-full border rounded-lg px-4 py-2 mt-1.5 text-sm bg-white transition shadow-sm
            focus:outline-none focus:ring-2
            ${errors.upazila
                                ? "border-red-500 bg-red-50/30 focus:ring-red-500/10 focus:border-red-500"
                                : "border-gray-200 focus:ring-primary/5 focus:border-primary"
                            }`}
                        {...register("upazila", { required: "This field is required" })}
                        disabled={!selectedDistrict}
                    >
                        <option value="">
                            {selectedDistrict
                                ? "Select option"
                                : "Select district first"}
                        </option>

                        {filteredUpazilas.map((u) => (
                            <option key={u.id} value={u.name}>
                                {u.name}
                            </option>
                        ))}
                    </select>

                    {errors.upazila && (
                        <p className="text-[11px] text-red-500 font-medium mt-1 ml-0.5">
                            {errors.upazila.message as string}
                        </p>
                    )}
                </div>

                {/* ---------------- Detailed Address ---------------- */}
                <div className="space-y-1 col-span-2">
                    <Label className="text-xs md:text-sm font-medium text-gray-700">Detailed Address(House/Road/Area/Village) *</Label>

                    <Textarea
                        rows={2}
                        placeholder="House, Road, Area"
                        className={`w-full px-4 py-2 mt-1.5 text-sm rounded-lg bg-white resize-none transition shadow-sm
            focus:outline-none focus:ring-2
            ${errors.village_or_area
                                ? "border-red-500 bg-red-50/30 focus:ring-red-500/10 focus:border-red-500"
                                : "border border-gray-200 focus:ring-primary/5 focus:border-primary"
                            }`}
                        {...register("village_or_area", {
                            required: "Detailed address is required",
                            minLength: {
                                value: 5,
                                message: "Address must be at least 5 characters",
                            },
                        })}
                    />

                    {errors.village_or_area && (
                        <p className="text-[11px] text-red-500 font-medium mt-1 ml-0.5">
                            {errors.village_or_area.message as string}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
