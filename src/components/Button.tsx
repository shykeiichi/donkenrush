import React from 'react'
import styles from '@/styles/components/Button.module.css'

interface ButtonProps {
    value: string,
    fullWidth?: boolean,
    children: any[]
}

const Button = (props: ButtonProps) => {
  return (
    <button className={[styles.container, props.fullWidth ? styles.fullWidthModifier : ""].join(" ")}>
        {props.children}
    </button>
  )
}

export default Button