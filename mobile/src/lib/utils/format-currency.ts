import {
  currencySymbols,
  type SupportedCurrency,
} from "@/constants/finance";

const numberFormatters = new Map<string, Intl.NumberFormat>();

export function formatCurrency(
  value: number,
  currency: SupportedCurrency | string = "USD"
) {
  const normalizedCurrency = normalizeCurrency(currency);
  const symbol = currencySymbols[normalizedCurrency];
  const absoluteValue = Math.abs(value);
  const hasDecimals = absoluteValue % 1 !== 0;

  const formatterKey = `${normalizedCurrency}-${hasDecimals ? "2" : "0"}`;
  let formatter = numberFormatters.get(formatterKey);

  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    });
    numberFormatters.set(formatterKey, formatter);
  }

  return `${symbol}${formatter.format(absoluteValue)}`;
}

export function normalizeCurrency(
  currency: SupportedCurrency | string | undefined
): SupportedCurrency {
  const normalized = currency?.toUpperCase();

  switch (normalized) {
    case "INR":
    case "USD":
    case "EUR":
    case "GBP":
    case "AED":
    case "CAD":
    case "AUD":
    case "SGD":
    case "JPY":
      return normalized;
    default:
      return "USD";
  }
}
