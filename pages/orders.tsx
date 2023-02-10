import SegmentedButton from "@/src/components/SegmentedButton"
import OrdersIsland from "@/src/islands/Orders"
import OrdersIndividual from "@/src/islands/Orders/OrdersIndividual"
import { useEffect, useState } from "react"
import styles from "@/styles/islands/Orders.module.css"

const Orders = () => {
    let [orders, setOrders] = useState({})
    let [menu, setMenu] = useState({})

    let [tab, setTab] = useState("Total")

    const fetchData = async () => {
        let menuResponse = await fetch("/api/menu");
        let menuJson = await menuResponse.json();
        setMenu(menuJson);

        let ordersResponse = await fetch("/api/getOrders");
        let ordersJson = await ordersResponse.json();
        setOrders(ordersJson);
    }

    const setServerOrders = async (value: any) => {
        let ordersResponse = await fetch("/api/setOrders", {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "orders": value,
            })
        });
    }

    const setPaid = (email: string, value: boolean) => {
        let temp = {...orders}
        temp[email].hasPaid = value;
        setOrders(temp)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const getOrdersAsList = () => {
        let ordersList = {}

        Object.keys(orders).forEach((email) => {
            Object.keys(orders[email]["order"]).forEach((category) => {
                Object.keys(orders[email]["order"][category]).forEach((articleName) => {
                    let article = orders[email]["order"][category][articleName]
                    if(!Object.keys(ordersList).includes(articleName)) {
                        ordersList[articleName] = {
                            cart: [...article],
                            menu: menu[category].find((e) => e.name == articleName)
                        } 
                    } else {
                        ordersList[articleName].cart = ordersList[articleName].cart.concat(article)
                        // console.log(ordersList[articleName])
                    }
                })
            })
        })

        return ordersList
    }

    return (
        <>
            <div className={styles.container}>
                <SegmentedButton buttons={["Total", "Individual"]} value={tab} onChange={(value) => setTab(value)} style={{width: 400}}/>
                { tab=="Total" ?
                    <OrdersIsland orderList={getOrdersAsList()} />
                : 
                    <OrdersIndividual orders={orders} menu={menu} setPaid={setPaid} setOrders={setServerOrders} />
                }
            </div>
        </>
    )
}

export default Orders