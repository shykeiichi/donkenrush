import React, { useReducer, useState } from 'react'
import styles from '@/styles/components/SegmentedButton.module.css'

interface SegmentedButtonProps {
    buttons: string[],
    value: string,
    onChange?: (value: string) => void,
    fullWidth?: boolean,
    value: string,
    children: any[]
}

const SegmentedButton = (props: SegmentedButtonProps) => {
    let containerStyles = [styles.container, props.fullWidth ? styles.fullWidthModifier : ""].join(" ");

    if(!props.buttons) {
        return (
            <div className={containerStyles}>
                Buttons not defined
            </div>
        )
    }
        
    return (
        <div className={containerStyles}>
            {
                props.buttons.map((item, idx) => {
                    return (
                        <button 
                            key={item} 
                            className={[styles.button, props.value == item ? styles.buttonActive : ""].join(" ")}
                            onClick={() => props.onChange(item)}
                        >
                            {item}
                        </button>
                    )
                })
            }
        </div>
    )
}

export default SegmentedButton