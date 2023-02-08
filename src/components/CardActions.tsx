import React from 'react'
import styles from '@/styles/components/CardActions.module.css'

interface CardActionsProps {
    children: any[]
}

const CardActions = (props: CardActionsProps) => {
  return (
    <div className={styles.container}>
        {props.children}
    </div>
  )
}

export default CardActions