import React from 'react'
import RecieptRow from './Checkout/RecieptRow'
import Button from '@/src/components/Button'

import styles from '@/styles/islands/Order/Checkout.module.css'

interface CheckoutProps {
    getCartAsList: () => CartListItem[],
    cart: Cart
}

const Checkout = (props: CheckoutProps) => {

    const getAmountOfVariation = (category: string, article: string, variation: string): number => {
        let amount = 0;
        props.cart[category][article].forEach((item) => {
            if(item == variation) {
                amount++;
            }
        })
        return amount
    }

    const getTotalPrice = (): number => {
        let totalPrice = 0;
        props.getCartAsList().forEach((article) => {
            console.log(article)
            totalPrice += parseFloat(article.menu.price) * article.cart.length;
        })
        return totalPrice;
    }

    return (
        <div>
            <div className={styles.divider} />
            <h1>
                Checkout
            </h1>
            {
                props["getCartAsList"]().length > 0 ?
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
                                props["getCartAsList"]().map((article) => {
                                    if(article.menu.variations.length != 0) {
                                        return article["menu"]["variations"].map((variation) => {
                                            if(getAmountOfVariation(article.category, article.item, variation) == 0) {
                                                return;
                                            }

                                            return (
                                                <RecieptRow
                                                    name={`${article.item} (${variation})`}
                                                    amount={getAmountOfVariation(article.category, article.item, variation)}
                                                    price={getAmountOfVariation(article.category, article.item, variation) * parseFloat(article.menu.price)}

                                                    addToCart={props.addToCart}
                                                    removeFromCart={props.removeFromCart}

                                                    variation={variation}
                                                    article={article}

                                                    key={JSON.stringify(article) + variation}
                                                />
                                            )
                                        })
                                    }

                                    return (
                                        <RecieptRow
                                            name={article.item}
                                            amount={article.cart.length}
                                            price={article.cart.length * parseFloat(article.menu.price)}

                                            addToCart={props.addToCart}
                                            removeFromCart={props.removeFromCart}

                                            variation={undefined}
                                            article={article}

                                            key={JSON.stringify(article) + undefined}
                                        />
                                    )
                                })
                            }
                        </tbody>
                    </table>
                :
                <p>Inga tillagda objekt</p>
            }

            <div className={styles.spacer} />

            <div className={styles.totalPrice}>
                <div>Total Konstnad: </div>
                <b>{getTotalPrice()} kr</b>
            </div>
            <div className={styles.totalPrice}>
                <i>(Priset kan variera lite)</i>
            </div>

            <Button 
                style={{width: 300, marginTop: 20}} 
                disabled={props["getCartAsList"]().length > 0 ? false : true}
                onClick={() => {}}
            >Beställ Mat</Button>

            <div className={styles.spacer} />
            <div className={styles.spacer} />
        </div>
    )
}

export default Checkout