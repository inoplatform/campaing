"use client"

import { useEffect, useState } from "react"
import { Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Country } from "@/types/country"
import { getActiveCountries } from "@/lib/countries"

interface CountrySelectorProps {
  selectedCountry: Country | null
  onCountryChange: (country: Country) => void
}

export function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  const [open, setOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    const data = await getActiveCountries()
    setCountries(data)
    setIsLoading(false)

    // Auto-select first country if none selected
    if (data.length > 0 && !selectedCountry) {
      onCountryChange(data[0])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedCountry ? (
            <span className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Select country...</span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>{isLoading ? "Loading countries..." : "No country found."}</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.id}
                  value={country.name}
                  onSelect={() => {
                    onCountryChange(country)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedCountry?.id === country.id ? "opacity-100" : "opacity-0")}
                  />
                  <span className="text-lg mr-2">{country.flag}</span>
                  <span>{country.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
