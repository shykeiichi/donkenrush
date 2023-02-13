import SegmentedButton from "@/src/components/SegmentedButton"
import OrdersIsland from "@/src/islands/Orders"
import OrdersIndividual from "@/src/islands/Orders/OrdersIndividual"
import { useEffect, useState } from "react"
import styles from "@/styles/islands/Orders.module.css"
import { useSession } from "next-auth/react"
import { Config } from "@/src/interfaces"
import Button from "@/src/components/Button"

const Orders = () => {
    const { data: session } = useSession()

    let [orders, setOrders] = useState({})
    let [menu, setMenu] = useState({})

    let [tab, setTab] = useState("Total")

    let config: Config;
    let setConfig: any;
    [config, setConfig] = useState({
        "ordersOpen": false,
        "staffemail": []
    })

    const fetchData = async () => {
        let responseOrdersOpen = await fetch(`/api/getConfig`)
        let jsonOrders = await responseOrdersOpen.json()
        if(responseOrdersOpen.status == 200) {
            setConfig(jsonOrders as Config);
        }        

        let menuResponse = await fetch("/api/menu");
        let menuJson = await menuResponse.json();
        setMenu(menuJson);

        let ordersResponse = await fetch(`/api/getOrders`);

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
                "email": session.user.email
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
                            menu: menu[category].find((e: any) => e.name == articleName)
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

    const setOrdersLock = async (lock: boolean) => {        
        let response = await fetch("/api/setOrderLock", {
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "orders": lock,
                "email": session.user.email
            })
        });

        window.location.reload()
    }

    return (
        <>
            <div className={styles.container}>
                {   
                    session != undefined ?
                        config.staffemail ? config.staffemail.includes(session.user.email) ?
                            <>
                                {
                                    !config.ordersOpen ?
                                        <>
                                            <SegmentedButton buttons={["Total", "Individual"]} value={tab} onChange={(value) => setTab(value)} style={{width: 400}}/>
                                            { tab=="Total" ?
                                                <OrdersIsland orderList={getOrdersAsList()} />
                                            : 
                                                <OrdersIndividual orders={orders} menu={menu} setPaid={setPaid} setOrders={setServerOrders} />
                                            }
                                            <Button onClick={() => setOrdersLock(true)} style={{position: "fixed", bottom: 10, left: 10}}>Öppna beställningar</Button>
                                        </>
                                    :
                                        <div className={styles.ordersLockedContainer}>
                                            Beställningar är öppna och därför är beställnings panelen stängd för att undvika problem<br/>
                                            <div><b>{Object.keys(orders).length}</b> personer har beställt</div>
                                            <Button onClick={() => setOrdersLock(false)}>Lås beställningar</Button>
                                        </div>
                                }
                            </>
                        :
                            <div>
                                Du har inte tillåtelse att se beställningarna
                            </div>
                        : <div></div>  
                    : <div>Couldnt find session</div>
                }
            </div>
        </>
    )
}

export default Orders