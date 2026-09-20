"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface VariantSelectorProps {
  options: any[];
  selectedOptions: Record<string, string>;
  onOptionChange: (name: string, value: string) => void;
  variants?: any[];
  selectedVariant?: any;
}

const normalizeValues = (val: any): Record<string, string> => {
  if (!val) return {};
  const raw = val instanceof Map ? Object.fromEntries(val as Map<string, string>) : (typeof val === "object" ? val : {});
  const normalized: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k && v !== undefined && v !== null) {
      normalized[String(k).trim().toLowerCase()] = String(v).trim().toLowerCase();
    }
  }
  return normalized;
};

export function VariantSelector({
  options,
  selectedOptions,
  onOptionChange,
  variants,
  selectedVariant,
}: VariantSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!options || options.length === 0) return null;

  const totalOptions = options.reduce((acc, opt) => acc + opt.option_values.length, 0);
  const showExpandButton = totalOptions > 20;

  const getOptionValueStock = (optName: string, val: string) => {
    if (!variants || variants.length === 0) return undefined;
    const candidate = { ...selectedOptions, [optName]: val };
    const matched = variants.find((v) => {
      const vObj = normalizeValues(v.variant_option_values);
      return Object.entries(candidate).every(([k, v]) => {
        const targetVal = String(v).trim().toLowerCase();
        return vObj[k.toLowerCase()] === targetVal;
      });
    });
    return matched ? matched.variant_quantity : undefined;
  };

  return (
    <div className="relative">
      <div
        className={`space-y-3 pb-3 transition-all duration-500 ease-in-out scrollbar-hide ${!isExpanded && showExpandButton ? "max-h-[200px] overflow-hidden" : "max-h-[500px] overflow-y-auto"
          }`}
      >
        {options.map((option) => (
          <div key={option.option_name}>
            <div className="flex items-center justify-between mb-1.5">
              <Label
                htmlFor={option.option_name}
                className="text-gray-800 font-semibold block text-[13px]"
              >
                {option.option_name}:{" "}
                <span className="text-primary font-bold ml-1">
                  {selectedOptions[option.option_name]}
                </span>
              </Label>

              {selectedVariant && typeof selectedVariant.variant_quantity === "number" && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  {selectedVariant.variant_quantity > 0
                    ? `${selectedVariant.variant_quantity} units available`
                    : "Out of Stock"}
                </span>
              )}
            </div>

            <RadioGroup
              id={option.option_name}
              value={selectedOptions[option.option_name] || ""}
              onValueChange={(value) => onOptionChange(option.option_name, value)}
              className="flex flex-wrap gap-1.5"
            >
              {option.option_values.map((value: string) => {
                const isActive = selectedOptions[option.option_name] === value;
                const stock = getOptionValueStock(option.option_name, value);
                const isOutOfStock = stock !== undefined && stock <= 0;

                return (
                  <Label
                    key={value}
                    htmlFor={`${option.option_name}-${value}`}
                    className={`border cursor-pointer rounded-md px-3 py-1.5 text-xs md:text-[13px] font-medium transition-all duration-150 inline-flex items-center gap-1.5 select-none
                      ${isActive
                        ? "bg-primary border-primary text-white shadow-xs"
                        : isOutOfStock
                          ? "bg-slate-50 border-dashed border-gray-300 text-gray-400 hover:bg-gray-100"
                          : "bg-white border-gray-200 text-gray-800 hover:border-gray-400 hover:bg-gray-50"
                      }
                    `}
                  >
                    <RadioGroupItem
                      id={`${option.option_name}-${value}`}
                      value={value}
                      className="sr-only"
                    />
                    <span>{value}</span>
                    {typeof stock === "number" && (
                      <span
                        className={`text-[10px] font-semibold px-1 py-0.2 rounded ${
                          isActive
                            ? "bg-white/20 text-white"
                            : isOutOfStock
                              ? "text-red-500 bg-red-50"
                              : "text-slate-500 bg-slate-100"
                        }`}
                      >
                        {isOutOfStock ? "0" : stock}
                      </span>
                    )}
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
        ))}

        {isExpanded && showExpandButton && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs font-bold text-slate-400 hover:text-primary mt-2"
            onClick={() => setIsExpanded(false)}
          >
            Show Less
          </Button>
        )}
      </div>

      {!isExpanded && showExpandButton && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-2 z-10 pointer-events-none">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-lg bg-white border-primary/20 hover:border-primary text-primary font-black px-8 py-5 pointer-events-auto active:scale-95 transition-all uppercase tracking-widest text-[10px]"
            onClick={() => setIsExpanded(true)}
          >
            Show All {totalOptions} Options
          </Button>
        </div>
      )}
    </div>
  );
}
