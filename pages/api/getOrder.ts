// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getOrders } from '@/src/data'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if(req.query.email == undefined) {
        res.status(400).send("No email provided")
        return;
    }

    let orders = await getOrders();

    if (Object.keys(orders).includes(req.query.email as string)) {
        res.status(200).json(orders[req.query.email as string])
    } else {
        res.status(200).send("No order")
    }
}
