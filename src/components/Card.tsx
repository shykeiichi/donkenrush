import React from 'react'
import styles from '@/styles/components/Card.module.css'
import Button from './Button'

interface CardProps {
    imageUrl: string,
    value: string,
    subtext?: string,
    children: any
}

const Card = (props: CardProps) => {
  return (
    <div className={styles.container}>
        <img src={props.imageUrl} />
        <h2>
            {props.value}
        </h2>
        {
                props.subtext ? 
                <h3>
                    {props.subtext}
                </h3> : ""
        }
        {props.children}
    </div>
  )
}

export default Card