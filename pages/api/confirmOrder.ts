// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getData } from '@/src/data'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    if(req.body.email == undefined) {
        res.status(400).send("No email provided")
        return;
    }

    if(req.body.order == undefined) {
        res.status(400).send("No order")
        return;
    }

    res.json(req.body)
}
