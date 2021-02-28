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
`

const Input = styled(NumericalInput)`
  border: 1px solid #383f66;
  background-color: transparent;
  border-radius: 2px;
  font-size: 14px;
  padding: 0 8px 0 60px;
  height: 100%;
`

const Label = styled.label<{ labelCenter?: boolean }>`
  font-size: 12px;
  padding: 0 16px 0 8px;
  white-space: nowrap;
  position: absolute;
  transform: translateZ(0);
  color: #fff;
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
const Unit = styled.span`
  color: #61688a;
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
}

export default function InputNumber({
  value = '',
  onUserInput = () => {},
  disableCurrencySelect = false,
  label,
  unit,
  readOnly,
  placeholder,
  labelCenter,
  style = {}
}: CurrencyInputProps) {
  return (
    <InputRow style={style} selected={disableCurrencySelect}>
      <Label labelCenter={labelCenter}>{label}</Label>
      <Input
        className="token-amount-input"
        value={value}
        onUserInput={val => {
          onUserInput(val)
        }}
        readOnly={readOnly}
        placeholder={placeholder}
      />
      <Unit>{unit}</Unit>
    </InputRow>
  )
}
