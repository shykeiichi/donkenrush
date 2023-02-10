// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getConfig, getData, getOrders, setOrders } from '@/src/data'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    let config = await getConfig();

    if(!config.staffemail.includes(req.body.email)) {
      res.status(400).send("No permission")
    }

    if(req.body.orders == undefined) {
        res.status(400).send("No orders provided")
        return;
    }

    setOrders(req.body.orders)

    res.status(200).send("Set orders")
}
