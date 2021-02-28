// @ts-nocheck
import React,{useState, useEffect, useCallback, useMemo} from 'react'
import styled from 'styled-components'
import { Currency} from '../../uniswap-sdk'
import NewModal from '../../components/Modal/NewModal'
import CurrencyLogo from '../../components/CurrencyLogo'
import {ButtonSubmit } from '../../components/Button'
import { useCurrency } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useActiveEthWeb3React} from '../../hooks/useEthContract'
import { Input as NumericalInput } from '../../components/NumericalInput'
import AddLiquidity from './AddLiquidity'

import Web3 from 'web3'
import { Repeat, X} from 'react-feather'

import styles from './SwapModal.module.css'

const RepeatIcon = styled(Repeat)`
  height: 16px;
  width: 16px;
  color: ${({ theme }) => theme.text3};
  :hover {
    cursor: pointer;
  }
`
const CloseIcon = styled(X)`
  height: 15px;
  width: 15px;
  position: absolute;
  right: 17px;
  top:17px;
  color: ${({ theme }) => theme.text3};
  :hover {
    cursor: pointer;
  }
`
const Input = styled(NumericalInput)`
  border: 0;
  background-color: transparent;
  font-size: 14px;
  color: ${({ theme }) => theme.text6};
  padding: 0;
`

export default function SwapModal({ isOpen, onDismiss = () => {} }: { isOpen: boolean; onDismiss?: () => void }) {

  return (
    <NewModal isOpen={isOpen} onDismiss={onDismiss}>
      <AddLiquidity />
    </NewModal>
  )
}
