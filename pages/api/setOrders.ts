// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getData, getOrders, setOrders } from '@/src/data'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if(req.body.orders == undefined) {
        res.status(400).send("No orders provided")
        return;
    }

    setOrders(req.body.orders)

    res.status(200).send("Set orders")
}
