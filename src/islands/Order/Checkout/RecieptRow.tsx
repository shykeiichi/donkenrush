import Button from '@/src/components/Button'
import React from 'react'

import { Article } from '@/src/interfaces'

interface RecieptRowProps {
    name: string,
    amount: number,
    price: number,

    article: any,
    variation: string,

    removeFromCart: (category: string, article: string, variation: string) => void,
    addToCart: (category: string, article: string, variation: string) => void,
}

const RecieptRow = (props: RecieptRowProps) => {
    return (
        <tr>
            <td>
                {props.name}
            </td>
            <td>
                <div>
                    <Button size="small" onClick={() => props.removeFromCart(props.article.category, props.article.item, props.variation)}>
                        -
                    </Button>
                    {props.amount}
                    <Button size="small" onClick={() => props.addToCart(props.article.category, props.article.item, props.variation)}>
                        +
                    </Button>
                </div>
            </td>
            <td>
                {props.price} kr
            </td>
        </tr>
    )
}

export default RecieptRow