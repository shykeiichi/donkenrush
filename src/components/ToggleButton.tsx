import React from 'react'
import styles from '@/styles/components/ToggleButton.module.css'

interface ToggleButtonProps {
    value: boolean,
    size?: string,
    disabled?: boolean,
    fullWidth?: boolean,
    onClick: (value: boolean) => void,
    children: any,
    style?: any
}

const ToggleButton = (props: ToggleButtonProps) => {
  return (
    <button className={[styles.container, 
                        props.fullWidth ? styles.fullWidthModifier : "", 
                        ["medium", undefined].includes(props.size) ? 
                          styles.mediumButton : 
                          styles.smallButton,
                        props.disabled ? styles.disabled : "",
                        props.value ? styles.on : styles.off
                      ].join(" ")} 
            onClick={() => !props.disabled ? props.onClick ? props.onClick(!props.value) : {} : {}}
            style={props.style}
    >
        {props.children}
    </button>
  )
}

export default ToggleButton