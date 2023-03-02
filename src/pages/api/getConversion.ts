import type { NextApiRequest, NextApiResponse } from "next";
import type { Countries } from "@/types";

import { z } from "zod";
import axios from "axios";

interface ApiRequest extends NextApiRequest {
  body: {
    from: {
      code: Countries;
      amount: number;
    };
    to: {
      code: Countries;
    };
  };
}

type ApiResponse = NextApiResponse<{
  errors?: Array<String>;
  from?: {
    code: Countries;
    amount: number;
  };
  to?: {
    code: Countries;
    amount: number;
  };
}>;

const handler = async (req: ApiRequest, res: ApiResponse) => {
  try {
    const { from, to } = req.body;

    const fromSchema = z.object({
      code: z.enum(["USD", "EUR", "GBP", "JPY", "AUD", "CHF", "CAD", "CNY"], {
        errorMap: (issue, ctx) => ({
          message: `Invalid currency code ${from.code} provided. Please provide a valid currency code: USD, EUR, GBP, JPY, AUD, CHF, CAD, CNY`,
        }),
      }),
      amount: z.number({
        errorMap: (issue, ctx) => ({
          message: `Invalid amount ${from.amount} provided. Please provide an number ≥ 0`,
        }),
      }),
    });

    const toSchema = z.object({
      code: z.enum(["USD", "EUR", "GBP", "JPY", "AUD", "CHF", "CAD", "CNY"], {
        errorMap: (issue, ctx) => ({
          message: `Invalid currency code ${to.code} provided. Please provide a valid currency code: USD, EUR, GBP, JPY, AUD, CHF, CAD, CNY`,
        }),
      }),
    });

    try {
      fromSchema.parse(from);
      toSchema.parse(to);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ errors: error.issues.map((issue) => issue.message) });
      }
    }

    const {
      data: { exchangeRate },
    } = await axios.get(
      `http://localhost:3000/api/getConversionRate?code=${to.code}`
    );

    const convertedAmount = from.amount * exchangeRate;

    res
      .status(200)
      .json({ from, to: { code: to.code, amount: convertedAmount } });
  } catch (error) {
    res.status(500).json({ errors: ["Internal Server Error"] });
  }
};

export default handler;
