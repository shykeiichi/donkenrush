import React, { RefObject, useState } from 'react'
import styles from "@/styles/islands/Order/Index.module.css"
import Button from '@/src/components/Button'
import MenuIcon from '@mui/icons-material/Menu';
import useWindowDimensions from '@/src/windowDimensions';

import { Menu } from '@/src/interfaces';

interface IndexProps {
    menu: Menu,
    getRef: any,
}

const Index = (props: IndexProps) => {

    let [visible, setVisible] = useState(true)
        
    const { height, width }= useWindowDimensions();

    return (
        <>
            { visible || width > 1600 ?
                <ul className={styles.container}>
                    {
                        Object.keys(props.menu).map((category) => {
                            return (
                                <li className={styles.item} onClick={() => props.getRef(category).current.scrollIntoView({ behavior: 'smooth' } )} key={"li" + category}>
                                    {category}
                                </li>
                            )
                        })
                    }
                    <li className={[styles.item, styles.checkout].join(" ")} onClick={() => props.getRef("checkout").current.scrollIntoView({ behavior: 'smooth' } )}>
                        Checkout
                    </li>
                </ul> : ""
            }
            { width < 1600 ?
                <Button style={{position: "fixed", right: 20, top: 20, zIndex: 2}} onClick={() => setVisible(!visible)}>
                    <MenuIcon />
                </Button> : ""
            }
        </>
    )
}

export default Index