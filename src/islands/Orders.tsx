import React from 'react'

interface OrdersProps {
    orderList: any
}

const Orders = (props: OrdersProps) => {

    // Get amount of items ordered of a specific variation for a specific article
    const getAmountOfVariation = (article: string, variation: string): number => {
        let amount = 0;
        props.orderList[article].cart.forEach((item: string) => {
            if(item == variation) {
                amount++;
            }
        })
        return amount
    }

    // Get total price of orders
    const getTotalPrice = (): number => {
        let price = 0;
        Object.keys(props.orderList).forEach((articleName: string) => {
            let item = props.orderList[articleName];
            price += item.cart.length * parseFloat(item.menu.price)
        })
        return price
    }

    const getTotalAmount = (): number => {
        let amount = 0;
        Object.keys(props.orderList).forEach((articleName: string) => {
            let item = props.orderList[articleName];
            amount += item.cart.length
        })
        return amount
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>
                        Artikel
                    </th>
                    <th>
                        Mängd
                    </th>
                    <th>
                        Pris
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    Object.keys(props.orderList).map((articleName: any) => {
                        let item = props.orderList[articleName];

                        if(item.menu.variations.length > 0) {
                            return item.menu.variations.map((variation: any) => {
                                if(getAmountOfVariation(articleName, variation) == 0) {
                                    return;
                                }

                                return (
                                    <tr key={articleName + variation}>
                                        <td>
                                            {articleName} ({variation})
                                        </td>
                                        <td>
                                            {getAmountOfVariation(articleName, variation)}
                                        </td>
                                        <td>
                                            {getAmountOfVariation(articleName, variation) * parseFloat(item.menu.price)} kr
                                        </td>
                                    </tr>
                                )
                            })
                        }

                        return ( 
                            <tr key={articleName}>
                                <td>
                                    {articleName}
                                </td>
                                <td>
                                    {props.orderList[articleName].cart.length}
                                </td>
                                <td>
                                    {props.orderList[articleName].cart.length * parseFloat(props.orderList[articleName].menu.price)} kr
                                </td>
                            </tr>
                        )
                    })
                }
                <tr>
                    <td></td>
                    <td><b>{getTotalAmount()}</b></td>
                    <td><b>{getTotalPrice()} kr</b></td>
                </tr>
            </tbody>
        </table>
    )
}

export default Orders