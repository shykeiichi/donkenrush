import React from 'react'
import styles from '@/styles/components/Button.module.css'

interface ButtonProps {
    value?: string,
    size?: string,
    disabled?: boolean,
    fullWidth?: boolean,
    onClick: () => void,
    children: any,
    style?: any
}

const Button = (props: ButtonProps) => {
  return (
    <button className={[styles.container, 
                        props.fullWidth ? styles.fullWidthModifier : "", 
                        ["medium", undefined].includes(props.size) ? 
                          styles.mediumButton : 
                          styles.smallButton,
                        props.disabled ? styles.disabled : "",
                      ].join(" ")} 
            onClick={() => !props.disabled ? props.onClick ? props.onClick() : {} : {}}
            style={props.style}
    >
        {props.children}
    </button>
  )
}

export default Button