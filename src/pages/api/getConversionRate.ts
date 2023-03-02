import type { NextApiRequest, NextApiResponse } from "next";
import type { Countries, ExchangeRates } from "@/types";

import { z } from "zod";

interface ApiRequest extends NextApiRequest {
  query: {
    code: Countries;
  };
}

export type ApiResponse = NextApiResponse<{
  error?: string;
  exchangeRate?: number;
}>;

export default function handler(req: ApiRequest, res: ApiResponse) {
  const { code } = req.query;

  const toSchema = z.object({
    code: z.enum(["USD", "EUR", "GBP", "JPY", "AUD", "CHF", "CAD", "CNY"], {
      errorMap: (issue, ctx) => ({
        message: `Invalid currency code ${code} provided. Please provide a valid currency code: USD, EUR, GBP, JPY, AUD, CHF, CAD, CNY`,
      }),
    }),
  });

  // Exchange rates determined on 3/2/23
  // These values can be changed as needed utilized to simulate getting exchange rates from an API route
  const exchangeRates: ExchangeRates = {
    USD: 1,
    EUR: 0.94,
    GBP: 0.84,
    JPY: 136.78,
  };

  res.status(200).json({ exchangeRate: exchangeRates[code] });
}
