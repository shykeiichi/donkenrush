import Button from '@/src/components/Button';
import Card from '@/src/components/Card';
import CardActions from '@/src/components/CardActions';
import SegmentedButton from '@/src/components/SegmentedButton';
import styles from '@/styles/islands/Order.module.css'
import React from 'react'

interface ArticleCardProps {
    article: Article,
    category: string,
    menuVariationSelect: MenuVariationSelect,
    setMenuVariation: (category: string, article: string, variation: string) => void,
    addToCart: (category: string, article: string, variation: string) => void
    cart: Cart
}

const ArticleCard = (props: ArticleCardProps) => {
    return (
        <Card 
            value={props.article.name} 
            imageUrl={props.article.image} 
            subtext={`${props.article.price} kr`}
            key={props.category + props.article.name}
        >
            <CardActions>
                {
                    props.article.variations.length != 0 ?
                        <SegmentedButton 
                            fullWidth 
                            buttons={props.article.variations} 
                            value={props.menuVariationSelect[props.category][props.article.name]} 
                            onChange={(variation) => {props.setMenuVariation(props.category, props.article.name, variation); props.setMenuVariationSelect({...props.menuVariationSelect})}} 
                        /> : ""
                }
                <div className={styles.row}>
                    <Button 
                        fullWidth
                        onClick={() => {
                            props.addToCart(props.category, props.article.name, props.menuVariationSelect[props.category][props.article.name])
                        }}
                    >
                        Add
                    </Button>
                    { props.cart[props.category][props.article.name].length > 0 ?
                        <div>
                            {props.cart[props.category][props.article.name].length}
                        </div> : ""
                    }
                </div>
            </CardActions>
        </Card>
    )
}

export default ArticleCard