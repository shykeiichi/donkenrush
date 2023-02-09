import React, { useEffect, useState } from 'react'

const Orders = () => {

    let [orders, setOrders] = useState({})
    let [menu, setMenu] = useState({})

    const fetchData = async () => {
        let response = await fetch("/api/getOrders");
        let json = await response.json();
        setOrders(json);

        response = await fetch("/api/menu");
        json = await response.json();
        setMenu(json);
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <div>
                <b>
                    {Object.keys(orders).length}
                </b> &nbsp;
                person(er) har beställt
            </div>
            <div>
                {
                    Object.keys(orders).map((email) => {
                        return (
                            <div>
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
                                            Object.keys(orders[email]["order"]).map((category) => {
                                                return (
                                                    <tr>
                                                        category
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Orders