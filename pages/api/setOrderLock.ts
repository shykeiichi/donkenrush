// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getConfig, getData, getOrders, setConfig, setOrders } from '@/src/data'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if(req.body.email == undefined) {
        res.status(400).send("")
        return;
    }

    if(req.body.orders == undefined) {
        res.status(400).send("No orders provided (boolean)")
        return;
    }

    let config = await getConfig();
    if(!config.staffemail.includes(req.body.email)) {
        res.status(400).send("No permission")
    }

    config.ordersOpen = req.body.orders;
    setConfig(config);

    res.status(200).send("Set config")
}
