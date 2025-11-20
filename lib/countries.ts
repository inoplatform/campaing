"use server"

import { createClient } from "@/lib/supabase/server"
import type { Country } from "@/types/country"

export async function getActiveCountries(): Promise<Country[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("countries").select("*").eq("is_active", true).order("name")

  if (error) {
    console.error("Error fetching countries:", error)
    return []
  }

  return data as Country[]
}

export async function getCountryByCode(code: string): Promise<Country | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("countries").select("*").eq("code", code).eq("is_active", true).single()

  if (error) {
    console.error("Error fetching country:", error)
    return null
  }

  return data as Country
}
