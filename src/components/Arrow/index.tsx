import React from 'react'
import styled from 'styled-components'



const Arr = styled.div`
  width: 100%;
`

const ArrUp = styled.div`
    width: 0;
    height: 0;
    border: 80px solid transparent;
    border-bottom-color: #9C9CB2;
    cursor: pointer;
`

const ArrDown = styled.div`
    width: 0;
    height: 0;
    border: 80px solid transparent;
    border-top-color: #9C9CB2;
    margin-top: 10px;
    cursor: pointer;
`

interface ArrowProps {
    isOpen: boolean
    onClick: () => void
    initialFocusRef?: React.RefObject<any>
    children?: React.ReactNode
  }

export const Arrow = ({
    isOpen,
    onClick,
    initialFocusRef,
    children
  }: ArrowProps) => {
  return (
    <Arr onClick={onClick}>
        <ArrUp/>
        <ArrDown/>
    </Arr>
  )
}
