"use client"

// Currency mapping based on country codes
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  // North America
  US: "USD",
  CA: "CAD",
  MX: "MXN",

  // Europe
  GB: "GBP",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
  LU: "EUR",
  MT: "EUR",
  CY: "EUR",
  EE: "EUR",
  LV: "EUR",
  LT: "EUR",
  SI: "EUR",
  SK: "EUR",
  CH: "CHF",
  NO: "NOK",
  SE: "SEK",
  DK: "DKK",
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  RO: "RON",
  BG: "BGN",
  HR: "HRK",

  // Africa
  KE: "KES", // Kenya
  NG: "NGN", // Nigeria
  ZA: "ZAR", // South Africa
  GH: "GHS", // Ghana
  UG: "UGX", // Uganda
  TZ: "TZS", // Tanzania
  RW: "RWF", // Rwanda
  ET: "ETB", // Ethiopia
  EG: "EGP", // Egypt
  MA: "MAD", // Morocco
  TN: "TND", // Tunisia
  DZ: "DZD", // Algeria

  // Asia
  IN: "INR",
  CN: "CNY",
  JP: "JPY",
  KR: "KRW",
  SG: "SGD",
  HK: "HKD",
  TH: "THB",
  MY: "MYR",
  ID: "IDR",
  PH: "PHP",
  VN: "VND",

  // Middle East
  AE: "AED",
  SA: "SAR",
  QA: "QAR",
  KW: "KWD",
  BH: "BHD",
  OM: "OMR",
  JO: "JOD",
  LB: "LBP",
  IL: "ILS",
  TR: "TRY",

  // Oceania
  AU: "AUD",
  NZ: "NZD",

  // South America
  BR: "BRL",
  AR: "ARS",
  CL: "CLP",
  CO: "COP",
  PE: "PEN",
  UY: "UYU",
  PY: "PYG",
  BO: "BOB",
  EC: "USD", // Ecuador uses USD
  VE: "VES",
}

export interface LocationData {
  country: string
  countryCode: string
  city: string
  region: string
  currency: string
  timezone: string
  latitude?: number
  longitude?: number
}

// Get location using browser geolocation API
export const getBrowserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}

// Get location data using IP-based geolocation
export const getLocationFromIP = async (): Promise<LocationData> => {
  try {
    // Using ipapi.co for IP-based location (free tier available)
    const response = await fetch("https://ipapi.co/json/")

    if (!response.ok) {
      throw new Error("Failed to fetch location data")
    }

    const data = await response.json()

    const currency = COUNTRY_CURRENCY_MAP[data.country_code] || "USD"

    return {
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "US",
      city: data.city || "Unknown",
      region: data.region || "Unknown",
      currency,
      timezone: data.timezone || "UTC",
      latitude: data.latitude,
      longitude: data.longitude,
    }
  } catch (error) {
    console.error("Error fetching location from IP:", error)
    // Fallback to default US location
    return {
      country: "United States",
      countryCode: "US",
      city: "Unknown",
      region: "Unknown",
      currency: "USD",
      timezone: "America/New_York",
    }
  }
}

// Reverse geocoding using browser coordinates
export const reverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
  try {
    // Using a free geocoding service (you might want to use Google Maps API in production)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
    )

    if (!response.ok) {
      throw new Error("Failed to reverse geocode")
    }

    const data = await response.json()

    const countryCode = data.countryCode || "US"
    const currency = COUNTRY_CURRENCY_MAP[countryCode] || "USD"

    return {
      country: data.countryName || "Unknown",
      countryCode,
      city: data.city || data.locality || "Unknown",
      region: data.principalSubdivision || "Unknown",
      currency,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      latitude: lat,
      longitude: lng,
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error)
    // Fallback to IP-based location
    return getLocationFromIP()
  }
}

// Main function to detect user location and currency
export const detectLocationAndCurrency = async (): Promise<LocationData> => {
  try {
    // First try browser geolocation for more accuracy
    const position = await getBrowserLocation()
    const locationData = await reverseGeocode(position.coords.latitude, position.coords.longitude)
    return locationData
  } catch (error) {
    console.log("Browser geolocation failed, falling back to IP-based location")
    // Fallback to IP-based location
    return getLocationFromIP()
  }
}

// Get currency symbol from currency code
export const getCurrencySymbol = (currencyCode: string): string => {
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    KES: "KSh",
    NGN: "₦",
    ZAR: "R",
    GHS: "₵",
    UGX: "USh",
    CAD: "C$",
    AUD: "A$",
    CHF: "CHF",
    INR: "₹",
    BRL: "R$",
    // Add more as needed
  }

  return currencySymbols[currencyCode] || currencyCode
}

// Format currency amount
export const formatCurrency = (amount: number, currencyCode: string): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount)
  } catch (error) {
    // Fallback formatting
    const symbol = getCurrencySymbol(currencyCode)
    return `${symbol}${amount.toLocaleString()}`
  }
}
