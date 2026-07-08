export const supportedCurrencies = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "CAD",
  "AUD",
  "SGD",
  "JPY",
] as const;

export type SupportedCurrency = (typeof supportedCurrencies)[number];

export const currencySymbols: Record<SupportedCurrency, string> = {
  INR: "\u20B9",
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
  AED: "\u062F.\u0625",
  CAD: "C$",
  AUD: "A$",
  SGD: "S$",
  JPY: "\u00A5",
};

export const currencyOptions = supportedCurrencies.map((code) => ({
  label: `${code} (${currencySymbols[code]})`,
  value: code,
}));

export const expenseCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Education",
  "Entertainment",
  "Rent",
  "Travel",
  "Other",
] as const;

export const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Gift",
  "Investment",
  "Other",
] as const;

export const paymentMethodOptions = [
  "Cash",
  "UPI",
  "Card",
  "Net Banking",
  "Wallet",
  "Other",
] as const;

export function getCategoriesForType(type: "expense" | "income") {
  return type === "expense" ? expenseCategories : incomeCategories;
}
