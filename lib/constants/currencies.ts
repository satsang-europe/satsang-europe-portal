export const EU_CURRENCIES = [
  { code: "EUR", label: "Euro (€)",              zeroDecimal: false },
  { code: "GBP", label: "British Pound (£)",      zeroDecimal: false },
  { code: "CHF", label: "Swiss Franc (CHF)",      zeroDecimal: false },
  { code: "SEK", label: "Swedish Krona (SEK)",    zeroDecimal: false },
  { code: "NOK", label: "Norwegian Krone (NOK)",  zeroDecimal: false },
  { code: "DKK", label: "Danish Krone (DKK)",     zeroDecimal: false },
  { code: "PLN", label: "Polish Zloty (PLN)",     zeroDecimal: false },
  { code: "CZK", label: "Czech Koruna (CZK)",     zeroDecimal: false },
  { code: "HUF", label: "Hungarian Forint (HUF)", zeroDecimal: true  },
  { code: "RON", label: "Romanian Leu (RON)",     zeroDecimal: false },
  { code: "BGN", label: "Bulgarian Lev (BGN)",    zeroDecimal: false },
  { code: "ISK", label: "Icelandic Krona (ISK)",  zeroDecimal: true  },
  { code: "TRY", label: "Turkish Lira (TRY)",     zeroDecimal: false },
  { code: "RSD", label: "Serbian Dinar (RSD)",    zeroDecimal: false },
] as const;

export type CurrencyCode = (typeof EU_CURRENCIES)[number]["code"];

export function toStripeAmount(amount: number, currencyCode: string): number {
  const currency = EU_CURRENCIES.find((c) => c.code === currencyCode);
  if (!currency) throw new Error("Unsupported currency: " + currencyCode);
  return currency.zeroDecimal ? Math.round(amount) : Math.round(amount * 100);
}
