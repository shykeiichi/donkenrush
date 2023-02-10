// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getConfig, getOrders } from '@/src/data'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    let config = await getConfig();
    res.status(200).json(config)
}
