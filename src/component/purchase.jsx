import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Menu } from '@material-ui/icons';
import useDynamicRefs from 'use-dynamic-refs';
import { useSession } from 'next-auth/react';

export default function PurchasePage() {

  const { data: session } = useSession()

  let [menu, setMenu] = useState({})
  
  let [cart, setCart] = useState({})

  let [variationSelector, setVariationSelector] = useState({})

  const [getRef, setRef] =  useDynamicRefs();

  function confirmOrder() {
    let finalCartFull = {...cart};
    let finalCart = {}
    // console.log(finalCart)
    Object.keys(finalCartFull).forEach((category, categoryIdx) => {
      finalCart[category] = {}
      // console.log(finalCart[category])
      Object.keys(finalCartFull[category]).forEach((itemName, itemIdx) => {
        // console.log(JSON.stringify(finalCartFull[category][itemName]) == "[]")
        if(JSON.stringify(finalCartFull[category][itemName]) == "[]") {
          return;
        }
        finalCart[category][itemName] = finalCartFull[category][itemName]
        // console.log(`${category}: ${itemName}`)
      })
    })

    Object.keys(finalCart).forEach((category, idx) => {
      if(JSON.stringify(finalCart[category]) == "{}") {
        delete finalCart[category]
      }
    })
    
    console.log(finalCart)
  }

  async function getMenu() {
    let res = await fetch(`/api/data`, {
      method: 'GET'
    })

    let jsonResponse = await res.json()

    setMenu(JSON.parse(JSON.stringify(jsonResponse)));

    let variation = {}
    let carttemp = {}

    Object.keys(jsonResponse).forEach((category, idx) => {
      variation[category] = {}
      carttemp[category] = {}
      jsonResponse[category].forEach((item, idx2) => {  
        carttemp[category][item["name"]] = []
        if(item["variations"].length > 0) {
          variation[category][item["name"]] = item["variations"][0]
        }      
      })
    })

    setVariationSelector(variation)
    setCart(carttemp)
    // console.log(variation)


  }

  function addToCartItem(item, category) {
    let carttemp = {...cart};
    carttemp[category][item].push(variationSelector[category][item])
    setCart(carttemp)
  }

  function removeCartItem(item, category, index) {
    let carttemp = {...cart};
    carttemp[category][item].splice(index, 1)
    setCart(carttemp)
  }

  function getCartItem(item, category) {
    return cart[category][item]
  }

  function getCategoryWithItem(item) {
    // console.log(Object.keys(cart))
    Object.keys(menu).forEach((category) => {
      menu[category].forEach((val) => {
        // console.log(`${item} ${val["name"]}`)
        if(val["name"] == item) {
          console.log(`${category} || ${item} || ${val["name"]}`)
          return category
        }
      }) 
    })
  }

  function getVariationSelectorValue(item, category) {
    return variationSelector[category][item]
  }

  function setVariationSelectorValue(item, category, value) {
    if(value == undefined) {
      return;
    }

    let variation = {...variationSelector};
    variation[category][item] = value;
    setVariationSelector(variation);
  }

  function getCartAsList() {
    let cartList = []
    Object.keys(cart).forEach((category, idx) => {
        Object.keys(cart[category]).forEach((itemName) => {
          let cartItem = cart[category][itemName]
          if(JSON.stringify(cartItem) == "[]") {
            return;
          }
          cartList.push({
            "menu": menu[category].find((e) => e.name == itemName),
            "cart": cartItem,
            "category": category,
            "item": itemName
          })
        })
    })
    return cartList
  }

  function getTotalPrice() {
    let totalPrice = 0.0
    Object.keys(cart).forEach((category, idx) => {
        Object.keys(cart[category]).forEach((itemName) => {
          let cartItem = cart[category][itemName]
          if(JSON.stringify(cartItem) == "[]") {
            return;
          }
          let menuItem = menu[category].find((e) => e.name == itemName)
          cartItem.forEach(() => {
            totalPrice += parseFloat(menuItem["price"])
          })
        })
    })
    return totalPrice
  }

  useEffect(() => {
    getMenu();
  }, [])

  let [linkMenu, setLinkMenu] = useState(false)

  return (
    <>
      <Head>
        <title>McDonalds</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Button variant="contained" className={styles.menu_icon} onClick={() => setLinkMenu(!linkMenu)}>
        <Menu style={{fontSize: 24}} />
      </Button>
      {
        linkMenu ? 
        <div className={styles.link_menu}>
          {
            Object.keys(menu).map((category, idx) => {
              return (
                <div key={category + idx} onClick={() => getRef(category).current.scrollIntoView({ behavior: 'smooth' } ) }>
                  {category}
                </div>
              )
            })
          }

          <div style={{display: "flex", flexDirection: "row"}}>
            <div onClick={() => getRef("checkout").current.scrollIntoView({ behavior: 'smooth' })}>
              Checkout
            </div>
            <div style={{position: "absolute", transform: "translateX(-50%)", right: 0, textAlign: "right", color: "gray", marginTop: 0}}>
              {session.user.name}
            </div>
          </div>
        </div> : ""

      }
      <main className={styles.main}>
        {
          Object.keys(menu).map((val, idx) => {
            return (
            <div key={val}>
              <h1 ref={setRef(val)} className={styles.h1}>{val}</h1>
              <ul className={styles.card_container}>
                {
                  menu[val].map((val2) => {
                    // console.log(val2)
                    return <div className={styles.card} key={val+val2["name"]} >
                      <Card sx={{minHeight: 420, position: "relative"}}>
                        <CardMedia
                          sx={{ height: 300, marginTop: "-120px"}}
                          image={val2["image"]}
                          title={val2["name"]}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div"> {/*för att få alla cards lika stora >> height={"7ch"}*/}
                            {val2["name"]}
                          </Typography>
                          <Typography gutterBottom variant="h6" component="div" fontSize={18} className={styles.info_container}>
                            <div>{val2["price"]} kr</div>
                            { val2["url"] != "" ?
                              <a className={styles.more_info} href={val2["url"]}>Mer info</a>
                             : "" }
                          </Typography>
                        </CardContent>
                        <div className={styles.card_actions} >
                          {/* {
                            getCartItem(val2["name"], val).map((cartItem, cartItemIdx) => {
                              return (
                                <Button variant="outlined" size="large" fullWidth onClick={() => removeCartItem(val2["name"], val, cartItemIdx)}>{val2["name"] + (cartItem != undefined ? " (" + cartItem + ")" : "")}</Button>
                              )
                            })
                          } */}
                          {
                            <ToggleButtonGroup
                              color="primary"
                              exclusive
                              aria-label="Platform"
                              fullWidth
                              onChange={(e, alignement) => {
                                  setVariationSelectorValue(val2["name"], val, alignement)
                              }}
                              value={getVariationSelectorValue(val2["name"], val)}
                              sx={val2["variations"].length != 0 ? {visibility: "shown"} : {}}
                            >
                              {val2["variations"].map((vari) => {
                                return(
                                    <ToggleButton key={val + val2["name"] + vari} value={vari}>{vari}</ToggleButton>
                                );
                              })}
                            </ToggleButtonGroup>
                          }
                          <Button sx={{marginTop: "auto", width: 225}} variant="contained" size="large" fullWidth onClick={() => addToCartItem(val2["name"], val)}>Add</Button>
                        </div>
                      </Card>
                    </div>
                  })
                }  
              </ul>
            </div>);
          })
        }
        <div className={styles.spacer}></div>
        <h1 ref={setRef("checkout")} className={styles.h1}>Checkout</h1>
        {/* {
          getCartItem(val2["name"], val).map((cartItem, cartItemIdx) => {
            return (
              <Button variant="outlined" size="large" fullWidth onClick={() => removeCartItem(val2["name"], val, cartItemIdx)}>{val2["name"] + (cartItem != undefined ? " (" + cartItem + ")" : "")}</Button>
            )
          })
        }  */}
        <ul className={styles.card_container}>
          {
            getCartAsList().map((item, itemIdx) => {
              let menuItem = item["menu"]
              let cartItem = item["cart"]
              return (
                <Card sx={{position: "relative", width: 240}} key={item["category"] + item["name"] + JSON.stringify(item)}>
                  <CardMedia
                    sx={{ height: 300, marginTop: "-120px"}}
                    image={menuItem["image"]}
                    title={menuItem["name"]}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div"> {/*för att få alla cards lika stora >> height={"7ch"}*/}
                      {menuItem["name"]}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" fontSize={18} className={styles.info_container}>
                      <div>{menuItem["price"]} kr</div>
                      { menuItem["url"] != "" ?
                        <a className={styles.more_info} href={menuItem["url"]}>Mer info</a>
                      : "" }
                    </Typography>
                  </CardContent>
                  {
                    cartItem.map((val, idx) => {
                      return (
                        <CardActions key={val + item["category"] + item["name"] + JSON.stringify(item)}>
                          <Button size="large" variant="contained" fullWidth onClick={() => removeCartItem(menuItem["name"], item["category"], idx)} color="error">{"Remove" + (val != undefined ? " (" + val + ")" : "")}</Button>
                        </CardActions>
                      )
                    })
                  }
                </Card>)
              }
            )}
            {
              JSON.stringify(getCartAsList()) == "[]" ?
              <p>Shopping cart empty</p> : ""
            }
          </ul>
          <div className={styles.h1}>
            <div>
              Total Price: <b>{getTotalPrice()} kr</b>
            </div>
            <div style={{color: "gray`"}}>
              (Priset kan variera lite)
            </div>
            <Button variant="contained" size="large" color="success" className={styles.confirm_button} disabled={JSON.stringify(getCartAsList()) == "[]" ? true : false} onClick={() => confirmOrder()}>Confirm Order</Button>
          </div>
          <div className={styles.footer}></div>
      </main>
    </>
  )
}
