import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/islands/Order.module.css'
import { getData } from '@/src/data';
import { LegacyRef, useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import CardActions from '../components/CardActions';
import SegmentedButton from '../components/SegmentedButton';
import Checkout from './Order/Checkout';
import ArticleCard from './Order/ArticleCard';
import Index from './Order/Index';
import useDynamicRefs from 'use-dynamic-refs';
import { Menu, Article, MenuVariationSelect, Cart, CartListItem } from '@/src/interfaces'
import { useSession } from 'next-auth/react';

const Order = () => {

    const { data: session } = useSession()

    const [getRef, setRef] =  useDynamicRefs();

    let menu: Menu;
    let setMenu: any;
  
    [menu, setMenu] = useState({})

    let menuVariationSelect: MenuVariationSelect;
    let setMenuVariationSelect: any;

    [menuVariationSelect, setMenuVariationSelect] = useState({})

    let cart: Cart;
    let setCart: any;

    [cart, setCart] = useState({})

    const populateMenu = async () => {
        // Populate menu object

        let response = await fetch("/api/menu", {
            method: 'GET'
        })
        let jsonResponse = await response.json();
        setMenu(jsonResponse);

        // Populate Menu Variation Select and Cart

        let menuVariationTemp: MenuVariationSelect = {}
        let cartTemp: Cart = {}
        Object.keys(jsonResponse).forEach((category) => {
            menuVariationTemp[category] = {} as [article: string];
            cartTemp[category] = {} as [article: string[]];
            jsonResponse[category].forEach((article: any, idx: number) => {
                cartTemp[category][article.name] = []

                if(article.variations.length == 0) {
                    return;
                }

                menuVariationTemp[category][article.name] = article.variations[0];
            })
        })
        setMenuVariationSelect(menuVariationTemp);
        setCart(cartTemp);
    }

    let [ordered, setOrdered] = useState(false)

    const checkLogin = async () => {
        let response = await fetch(`/api/getOrder?email=${session.user.email}`)
        if(response.status == 400) {
            return;
        }

        let json = await response.json()
        if(response.status == 200) {
            setOrdered(true)
        }
    }
  
    useEffect(() => {
        checkLogin();

        populateMenu();
    }, [])


    const setMenuVariation = (category: string, article: string, variation: string) => {
        let temp: MenuVariationSelect = menuVariationSelect;
        temp[category][article as keyof MenuVariationSelect] = variation;
        setMenuVariationSelect(temp);
    }


    const addToCart = (category: string, article: string, variation:string=undefined) => {
        let temp: Cart = {...cart}
        temp[category][article].push(variation)
        setCart(temp)
    }

    const removeFromCart = (category: string, article: string, variation:string=undefined) => {
        let removeIdx = -1;
        cart[category][article].forEach((item: string, idx: number) => {
            if(item == variation) {
                removeIdx = idx;
            }
        })
        let temp: Cart = {...cart}
        if(removeIdx != -1) {
            temp[category][article].splice(removeIdx, 1);
        }
        setCart(temp)
    }

    const getTotalPrice = (): number => {
        let totalPrice = 0;
        getCartAsList().forEach((article) => {
            totalPrice += parseFloat(article.menu.price) * article.cart.length;
        })
        return totalPrice;
    }

    const getCartAsList = (): CartListItem[] => {
        let cartList: CartListItem[] = []
        Object.keys(cart).forEach((category) => {
            Object.keys(cart[category]).forEach((articleName) => {
              let cartItem = cart[category][articleName]
              if(JSON.stringify(cartItem) == "[]") {
                return;
              }
              cartList.push({
                "menu": menu[category].find((e) => e.name == articleName),
                "cart": cartItem,
                "category": category,
                "item": articleName
              })
            })
        })
        return cartList
    }

    const getPurgedCart = () => {
        let newCart = {...cart}
        Object.keys(cart).forEach((category) => {
            newCart[category] = {}
            Object.keys(cart[category]).forEach((article) => {
                if(cart[category][article].length == 0) {
                    return;
                }
                newCart[category][article] = cart[category][article]
            })
        })

        Object.keys(newCart).forEach((category) => {
            if(Object.keys(newCart[category]).length == 0) {
                delete newCart[category]
            }
        })
        return newCart
    }

    let [confirmOrderPopup, setConfirmOrderPopup] = useState(false)

    const sendOrder = async () => {
        setOrdered(true)
        setConfirmOrderPopup(false)

        let response = await fetch("/api/confirmOrder", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                email: session.user.email,
                name: session.user.name,
                cost: getTotalPrice(),
                order: getPurgedCart()
            })  
        })
    }

    return (
        <>
            {   
                !ordered ?
                    <>
                        {
                            confirmOrderPopup ? 
                            <div className={styles.popUpBackground}>
                                <div className={styles.popUpBox}>
                                    <span>
                                        Bekräfta beställning på <b>{getTotalPrice()} kr</b>
                                    </span>
                                    <div className={styles.spacer} />
                                    <div className={styles.spacer} />
                                    <Button onClick={() => sendOrder()}>Ja</Button>
                                    <Button onClick={() => setConfirmOrderPopup(false)} >Nej</Button>
                                </div>
                            </div> : ""
                        }

                        <Index menu={menu} getRef={getRef} />
                        {
                            Object.keys(menu).map((category, categoryIdx) => {
                                return (
                                    <div key={"Order" + category}>
                                        <h1 ref={setRef(category) as LegacyRef<HTMLHeadingElement>}>
                                            {category}
                                        </h1>
                                        <ul className={styles.articleContainer}>
                                            {
                                                menu[category].map((article) => {
                                                    return (
                                                        <ArticleCard 
                                                            article={article}
                                                            category={category}
                                                            menuVariationSelect={menuVariationSelect}
                                                            setMenuVariation={setMenuVariation}
                                                            setMenuVariationSelect={setMenuVariationSelect}
                                                            addToCart={addToCart}
                                                            cart={cart}

                                                            key={"ac" + JSON.stringify(article)}
                                                        />
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        <Checkout 
                            getCartAsList={getCartAsList} 
                            cart={cart}  
                            addToCart={addToCart}  
                            removeFromCart={removeFromCart}
                            setConfirmOrderPopup={setConfirmOrderPopup}
                            getTotalPrice={getTotalPrice}
                        />
                        <div ref={setRef("checkout") as LegacyRef<HTMLDivElement>} />
                    </>
                :
                    <div>
                        Mat beställd!
                    </div>
            }
        </>
    )
}

export default Order