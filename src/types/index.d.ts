type Countries = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CHF" | "CAD" | "CNY";

type ExchangeRates = { [key in Countries]: number };

export { Countries, ExchangeRates };
