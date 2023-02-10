import React, { useReducer, useState } from 'react'
import styles from '@/styles/components/SegmentedButton.module.css'

interface SegmentedButtonProps {
    buttons: string[],
    value: string,
    style: any,
    onChange?: (value: string) => void,
    fullWidth?: boolean
}

const SegmentedButton = (props: SegmentedButtonProps) => {
    let containerStyles = [styles.container, props.fullWidth ? styles.fullWidthModifier : ""].join(" ");

    if(!props.buttons) {
        return (
            <div className={containerStyles} style={props.style}>
                Buttons not defined
            </div>
        )
    }
        
    return (
        <div className={containerStyles} style={props.style}>
            {
                props.buttons.map((item, idx) => {
                    return (
                        <button 
                            key={item} 
                            className={[styles.button, props.value == item ? styles.buttonActive : ""].join(" ")}
                            onClick={() => props.onChange ? props.onChange(item) : {}}
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