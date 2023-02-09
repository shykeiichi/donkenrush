import Button from '@/src/components/Button';
import RecieptRow from '@/src/islands/Order/Checkout/RecieptRow';
import React, { useEffect, useState } from 'react'
import styles from '@/styles/islands/Orders.module.css'
import { TextField } from '@mui/material';
import { CartListItem } from '@/src/interfaces';

const Orders = () => {

    let [orders, setOrders] = useState({})
    let [menu, setMenu] = useState({})

    let [search, setSearch] = useState("")

    const markAsPaid = async (email: string) => {
        let tempOrders = {...orders};
        tempOrders[email]["hasPaid"] = true;
        setOrders(tempOrders);

        let response = await fetch("/api/setOrders", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                orders: {...orders}
            })  
        })
    }

    const fetchData = async () => {
        let response2 = await fetch("/api/menu");
        let json2 = await response2.json();
        setMenu(json2);

        let response = await fetch("/api/getOrders");
        let json = await response.json();
        setOrders(json);
    };

    const getOrderAsList = (email: string) => {
        let cartList: CartListItem[] = []
        Object.keys(orders[email]["order"]).forEach((category) => {
            Object.keys(orders[email]["order"][category]).forEach((articleName) => {
              let cartItem = orders[email]["order"][category][articleName]
              console.log("menu")
              console.log(menu)
              if(!menu[category]) {
                return;
              }

              cartList.push({
                "menu": menu[category].find((e: any) => e.name == articleName),
                "cart": cartItem,
                "category": category,
                "item": articleName
              })
            })
        })
        return cartList
    } 

    const getAmountOfVariation = (email: string, category: string, article: string, variation: string): number => {
        let amount = 0;

        if(!orders[email]) {
            return;
        }

        orders[email]["order"][category][article].forEach((item: string) => {
            if(item == variation) {
                amount++;
            }
        })
        return amount
    }

    const getTotalAmountForOrder = (email: string) => {
        let amount = 0;

        Object.keys(orders[email]["order"]).forEach((category) => {
            Object.keys(orders[email]["order"][category]).forEach((item) => {
                amount += orders[email]["order"][category][item].length
            })
        })

        return amount
    }

    useEffect(() => {
        fetch("/api/menu")
            .then(response => response.json())
            .then(data => setMenu(data))

        fetch("/api/getOrders")
            .then(response => response.json())
            .then(data => setOrders(data))
    }, [])

    return (
        <>
            <div>
                <b>
                    {Object.keys(orders).length}
                </b> &nbsp;
                person(er) har beställt
            </div>
            <TextField placeholder="Filtrera namn" value={search} onChange={(e) => setSearch(e.target.value)}/>
            <div className={styles.container}>
                {
                    Object.keys(orders).map((email) => {
                        if(!orders[email]["name"].toLowerCase().includes(search.toLowerCase())) {
                            return;
                        }

                        return (
                            <div className={styles.orderContainer} key={JSON.stringify(orders[email])}>
                                <h1>
                                    {orders[email]["name"]}
                                </h1>
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
                                            getOrderAsList(email).map((article) => {
                                                if(article.menu.variations.length != 0) {
                                                    return article["menu"]["variations"].map((variation) => {
                                                        if(getAmountOfVariation(email, article.category, article.item, variation) == 0) {
                                                            return;
                                                        }

                                                        return <RecieptRow
                                                            name={`${article.item} (${variation})`}
                                                            amount={getAmountOfVariation(email, article.category, article.item, variation)}
                                                            price={getAmountOfVariation(email, article.category, article.item, variation) * parseFloat(article.menu.price)}

                                                            variation={variation}
                                                            article={article}

                                                            key={JSON.stringify(article) + variation}
                                                        />
                                                    })
                                                }

                                                return (
                                                    <RecieptRow
                                                        name={article.item}
                                                        amount={article.cart.length}
                                                        price={article.cart.length * parseFloat(article.menu.price)}

                                                        variation={undefined}
                                                        article={article}

                                                        key={JSON.stringify(article) + undefined}
                                                    />
                                                )
                                            })
                                        }
                                        <tr>
                                            <td>
                                            </td>                                          
                                            <td>
                                            </td>                                           
                                            <td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            </td>
                                            <td>
                                                {getTotalAmountForOrder(email)}
                                            </td>
                                            <td>
                                                {parseFloat(orders[email]["cost"])} kr
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {
                                    !orders[email]["hasPaid"] ?
                                        <Button onClick={() => markAsPaid(email)}>
                                            Markera som betalad
                                        </Button> 
                                    :
                                        <div>
                                            Betalad
                                        </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Orders