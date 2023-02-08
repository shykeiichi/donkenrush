import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/islands/Order.module.css'
import { getData } from '@/src/data';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import CardActions from '../components/CardActions';
import SegmentedButton from '../components/SegmentedButton';

interface Menu {
    [category: string]: Article[]
}
  
interface Article {
    name: string,
    variations: string[],
    image: string,
    url: string,
    price: string
}

interface MenuVariationSelect {
    [category: string]: [article: string] 
}

const Order = () => {

    let menu: Menu;
    let setMenu: any;
  
    [menu, setMenu] = useState({
      "DefaultCategory": [
        {
          "name": "DefaultArticle",
          "variations": [],
          "image": "",
          "url": "",
          "price": "0,0"
        }
      ]
    })

    let menuVariationSelect: MenuVariationSelect;
    let setMenuVariationSelect: any;

    [menuVariationSelect, setMenuVariationSelect] = useState({
        "DefaultCategory": {
            "DefaultArticle": ""
        }
    })

    const populateMenuVariationSelect = (menuJson: Menu) => {
        let temp = {}
        Object.keys(menuJson).forEach((category) => {
            console.log("asd")
            temp[category] = {};
            menuJson[category].forEach((article) => {
                if(article.variations.length == 0) {
                    return;
                }

                temp[category][article.name] = article.variations[0];
            })
        })
        console.log(temp)
        setMenuVariationSelect(temp);
    }

    const populateMenu = async () => {
        let response = await fetch("/api/menu", {
            method: 'GET'
        })
        let jsonResponse = await response.json();
        setMenu(jsonResponse);

        populateMenuVariationSelect(jsonResponse);
    }
  
    useEffect(() => {
        populateMenu();
    }, [])


    const setMenuVariation = (category: string, article: string, variation: string) => {
        let temp: MenuVariationSelect = menuVariationSelect;
        temp[category][article] = variation;
        setMenuVariationSelect(temp);
    }
    
    const getMenuVariation = (category: string, article: string): string => {
        return menuVariationSelect[category][article]
    }


    return (
        <>
            {
                Object.keys(menu).map((category, categoryIdx) => {
                return (
                    <div key={category}>
                        <h1>
                            {category}
                        </h1>
                        <ul className={styles.article_container}>
                            {
                                menu[category].map((article, articleIdx) => {
                                    return (
                                        <Card 
                                            value={article.name} 
                                            imageUrl={article.image} 
                                            subtext={`${article.price} kr`}
                                            key={category + article.name}
                                        >
                                            <CardActions>
                                                {
                                                    article.variations.length != 0 ?
                                                        <SegmentedButton 
                                                            fullWidth 
                                                            buttons={article.variations} 
                                                            value={getMenuVariation(category, article.name)} 
                                                            onChange={(variation) => {setMenuVariation(category, article.name, variation); setMenuVariationSelect({...menuVariationSelect})}} 
                                                        /> : ""
                                                }
                                                <Button fullWidth>
                                                    Add
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    )
                                })
                            }
                        </ul>
                    </div>
                )
                })
            }
        </>
    )
}

export default Order