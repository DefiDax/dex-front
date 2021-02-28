import React from 'react'
import { Currency } from '@uniswap/sdk'
import styled from 'styled-components'
import { Input as NumericalInput } from '../NumericalInput'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  height: 32px;
  margin-top: 8px;
  position: relative;
  border: 1px solid #4A4A68;
  border-radius: 2px;
`

const Input = styled(NumericalInput)`
  background-color: transparent;
  font-size: 14px;
  padding: 0 8px 0 60px;
  height: 100%;
`

const Label = styled.label<{ labelCenter?: boolean, color?:string }>`
  font-size: 12px;
  padding: 0 16px 0 8px;
  white-space: nowrap;
  position: absolute;
  transform: translateZ(0);
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  cursor: default;
  ${({ labelCenter }) =>
    labelCenter &&
    `
      left: 50%;
      transform: translateX(-50%);
    `}
`
const Unit = styled.span<{ color?:string }>`
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 8px;
  position: absolute;
  right: 0;
  font-size: 12px;
`

interface CurrencyInputProps {
  value?: string
  onUserInput?: (value: string) => void
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  otherCurrency?: Currency | null
  showCommonBases?: boolean
  customBalanceText?: string
  unit: string
  readOnly?: boolean
  placeholder?: string
  labelCenter?: boolean
  style?: any
  color?: any
  padding?: string
}

export default function CurrencyInput({
  value = '',
  onUserInput = () => {},
  disableCurrencySelect = false,
  label,
  unit,
  readOnly,
  placeholder,
  labelCenter,
  style = {},
  color={label:'#fff', unit:'#61688a'},
  padding,
}: CurrencyInputProps) {
  return (
    <InputRow style={style} selected={disableCurrencySelect}>
      <Label labelCenter={labelCenter} color={color.label}>{label}</Label>
      <Input
        style={{padding:padding}}
        className="token-amount-input"
        value={value}
        onUserInput={val => {
          onUserInput(val)
        }}
        readOnly={readOnly}
        placeholder={placeholder}
      />
      <Unit color={color.unit}>{unit}</Unit>
    </InputRow>
  )
}
