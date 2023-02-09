import { useEffect, useState } from "react"

const Orders = () => {
    let [orders, setOrders] = useState({})

    const fetchData = async () => {
        let ordersResponse = await fetch("/api/getOrders");
        let ordersJson = await ordersResponse.json();
        setOrders(ordersJson);
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <>
            {JSON.stringify(orders)}
        </>
    )
}

export default Orders