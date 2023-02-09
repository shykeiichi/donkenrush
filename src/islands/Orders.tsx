import React from 'react'

interface OrdersProps {
    orderList: any
}

const Orders = (props: OrdersProps) => {
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
                    Object.keys(props.orderList).map((articleName) => {
                        return ( 
                            <tr>
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
            </tbody>
        </table>
    )
}

export default Orders