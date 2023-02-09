import SegmentedButton from "@/src/components/SegmentedButton"
import OrdersIsland from "@/src/islands/Orders"
import { useEffect, useState } from "react"

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
            <SegmentedButton buttons={["Total", "Individual"]} value={tab} onChange={(value) => setTab(value)} />
            { tab=="Total" ?
                <OrdersIsland orderList={getOrdersAsList()} />
              : ""
            }
        </>
    )
}

export default Orders