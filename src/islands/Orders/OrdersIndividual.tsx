import { Menu } from '@/src/interfaces';
import React from 'react'
import styles from '@/styles/islands/Orders.module.css'
import Button from '@/src/components/Button';
import ToggleButton from '@/src/components/ToggleButton';
import { setOrders } from '@/src/data';

interface OrdersIndividualProps {
    orders: any,
    menu: Menu,
    setPaid: any,
}

const OrdersIndividual = (props: OrdersIndividualProps) => {

    const getAmountOfVariation = (email: string, category: string, article: string, variation: string): number => {
        let amount = 0;
        props.orders[email].order[category][article].forEach((item: string) => {
            if(item == variation) {
                amount++;
            }
        })
        return amount
    }

    const getAmountInCart = (email: string): number => {
        let amount = 0;
        Object.keys(props.orders[email].order).forEach((category: string) => {
            Object.keys(props.orders[email].order[category]).forEach((item: string) => {
                amount += props.orders[email].order[category][item].length
            })
        })
        return amount
    }
        
    return (
        <div className={styles.individualContainer}>
            {
                Object.keys(props.orders).map((email) => {
                    let item = props.orders[email];
                    return (
                        <div key={email} className={styles.individual}>
                            <h3>
                                {props.orders[email].name} <ToggleButton size="small" value={props.orders[email].hasPaid} onClick={(value) => { props.setPaid(email, value); props.setOrders(props.orders) }}>Has Paid</ToggleButton>
                            </h3>
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
                                        Object.keys(props.orders[email].order).map((category) => {
                                            return Object.keys(props.orders[email].order[category]).map((article) => {
                                                let item = props.orders[email].order[category][article];
                                                let menu = props.menu[category].find((e) => e.name == article);
                                                if(menu.variations.length > 0) {
                                                    return menu.variations.map((variation) => {
                                                        if(getAmountOfVariation(email, category, article, variation) == 0) {
                                                            return;
                                                        }

                                                        return (
                                                            <tr key={email+category+article+variation}>
                                                                <td>
                                                                    {article} ({variation})
                                                                </td>
                                                                <td>
                                                                    {getAmountOfVariation(email, category, article, variation)}
                                                                </td>
                                                                <td>
                                                                    {getAmountOfVariation(email, category, article, variation) * parseFloat(menu.price)} kr
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }

                                                return (
                                                    <tr key={email + category + article}>
                                                        <td>{article}</td>
                                                        <td>{getAmountOfVariation(email, category, article, undefined)}</td>
                                                        <td>{getAmountOfVariation(email, category, article, undefined) * parseFloat(menu.price)} kr</td>
                                                    </tr>
                                                )
                                            })
                                        })
                                    }
                                    <tr>
                                        <td></td>
                                        <td><b>{getAmountInCart(email)}</b></td>
                                        <td><b>{parseFloat(props.orders[email].cost)} kr</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                })
            }
        </div>
  )
}

export default OrdersIndividual