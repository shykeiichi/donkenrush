// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getConfig, getData, getOrders, setOrders } from '@/src/data'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if(req.body.email == undefined) {
        res.status(400).send("No email provided")
        return;
    }

    if(req.body.name == undefined) {
        res.status(400).send("No name provided")
        return;
    }

    if(req.body.order == undefined) {
        res.status(400).send("No order")
        return;
    }

    let config = await getConfig();
    if(!config.ordersOpen) {
        res.status(400).send("Orders aren't open")
        return;
    }

    let orders = await getOrders();

    orders[req.body.email] = {
        email: req.body.email,
        name: req.body.name,
        order: req.body.order,
        cost: req.body.cost,
        hasPaid: false
    }

    setOrders(orders)

    res.status(200).send("Added order")
}
