"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface VariantSelectorProps {
  options: any[];
  selectedOptions: Record<string, string>;
  onOptionChange: (name: string, value: string) => void;
}

export function VariantSelector({
  options,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!options || options.length === 0) return null;

  const totalOptions = options.reduce((acc, opt) => acc + opt.option_values.length, 0);
  const showExpandButton = totalOptions > 20;

  return (
    <div className="relative">
      <div
        className={`space-y-3 pb-3 transition-all duration-500 ease-in-out scrollbar-hide ${!isExpanded && showExpandButton ? "max-h-[200px] overflow-hidden" : "max-h-[500px] overflow-y-auto"
          }`}
      >
        {options.map((option) => (
          <div key={option.option_name}>
            <Label
              htmlFor={option.option_name}
              className="text-gray-700 font-semibold mb-1 block text-[13px]"
            >
              {option.option_name}:{" "}
              <span className="text-primary ml-1">
                {selectedOptions[option.option_name]}
              </span>
            </Label>
            <RadioGroup
              id={option.option_name}
              value={selectedOptions[option.option_name] || ""}
              onValueChange={(value) => onOptionChange(option.option_name, value)}
              className="flex flex-wrap gap-1.5"
            >
              {option.option_values.map((value: string) => {
                const isActive = selectedOptions[option.option_name] === value;
                return (
                  <Label
                    key={value}
                    htmlFor={`${option.option_name}-${value}`}
                    className={`border cursor-pointer rounded-md px-2.5 py-1 text-xs md:text-[13px] font-medium transition-all duration-150
                      ${isActive
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <RadioGroupItem
                      id={`${option.option_name}-${value}`}
                      value={value}
                      className="sr-only"
                    />
                    {value}
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
