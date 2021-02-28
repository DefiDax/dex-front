import React, { useEffect, useState, useCallback } from 'react'
import { Text } from 'rebass'
//import { JSBI, Currency, CurrencyAmount, Trade, ChainId } from '../../uniswap-sdk'
import { Currency, CurrencyAmount, Trade } from '../../uniswap-sdk'
//import { TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'
import { useSwapCallback } from '../../hooks/useSwapCallback'
// import { useTrade } from '../../state/swap/hooks'
import CurrencyInput from '../../components/CurrencyInput'
//import { AutoRow, RowBetween } from '../../components/Row'
import Slider from '../../components/Slider'
import {  ButtonSwap } from '../../components/Button'
//import { GreyCard } from '../../components/Card'
//import Loader from '../../components/Loader'
import { TradeSummary } from '../../components/swap/AdvancedSwapDetails'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'

type SwapType = 'In' | 'Out'

interface SwapProps {
  type: SwapType
  from: Currency | undefined
  to: Currency | undefined
  onUserInput: (value: string) => void
  typedValue: string
  amount: CurrencyAmount | undefined
  trade?: Trade
  recipient: string | null
}

export default function Swap({ type, from, to, onUserInput, typedValue, amount, trade, recipient }: SwapProps) {
  //const { account, chainId } = useActiveWeb3React()
  const { account } = useActiveWeb3React()
  const isExactIn = type === 'In'
  let swapError: string | undefined
  if (!account) {
    swapError = 'Connect Wallet'
  }

  if (!amount) {
    swapError = swapError ?? 'Enter an amount'
  }

  const isValid = !swapError

  // 均价交易计算
    // const standardTrade = useTrade(from, to, !isExactIn)
  const [price, setPrice] = useState<string | undefined>()
  useEffect(() => {
    const executionPrice = trade?.executionPrice
    if (Boolean(executionPrice?.baseCurrency && executionPrice?.quoteCurrency)) {
        if (isExactIn) {
            setPrice(executionPrice?.invert()?.toSignificant())
        } else {
            setPrice(executionPrice?.toSignificant())
        }
    }
  }, [trade, isExactIn])

  const percentageChangeCallback = useCallback(
    value => {
      onUserInput(value)
    },
    [onUserInput]
  )
  const [percentage, setPercentage] = useDebouncedChangeHandler(Number.parseInt('0'), percentageChangeCallback)

  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  //const userHasSpecifiedInputOutput = Boolean(from && to && amount?.greaterThan(JSBI.BigInt(0)))

  // TODO ??
  const [allowedSlippage] = useUserSlippageTolerance()

  const [approval] = useApproveCallbackFromTrade(trade ?? undefined, allowedSlippage)
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const { callback: swapCallback } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  // const showApproveFlow =
  //   !swapError &&
  //   (approval === ApprovalState.NOT_APPROVED ||
  //     approval === ApprovalState.PENDING ||
  //     (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
  //   !(priceImpactSeverity > 3)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [tradeToConfirm, account, priceImpactWithoutFee, showConfirm, swapCallback, trade])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput('')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  return (
    <>
      <ConfirmSwapModal
        isOpen={showConfirm}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        onDismiss={handleConfirmDismiss}
      />
      <CurrencyInput
        style={{background: '#2F303E', color:'#D5DAE7', height:'38px', fontSize: '12px', lineHeight:'18px'}}
        unit={to?.symbol ?? ''}
        readOnly={true}
        value={price}
        placeholder="Market Buy"
        color={{label:'#4A4A68', unit:'#4A4A68'}}
        padding='0 8px'
      />
      <CurrencyInput
        style={{background: '#23242D', height:'38px'}}
        // label={isExactIn ? '买入量' : '卖出量'}
        unit={from?.symbol ?? ''}
        value={typedValue}
        placeholder="Amount"
        onUserInput={onUserInput}
        color={{label:'#474764', unit:'#474764'}}
        padding='0 8px'
      />
      <Slider size={14} value={percentage} onChange={setPercentage} />
      <CurrencyInput
        style={{background: '#23242D', height:'38px'}}
        placeholder="Total (Estimated)" 
        unit={to?.symbol ?? ''}  
        value={amount?.toSignificant() ?? ''} 
        padding='0 8px'
      />

      <ButtonSwap
            style={{ marginTop: '10px', padding: '10px 0', background:`${isExactIn ? '#88A640' : '#C02464'}` }}
            onClick={() => {
              setSwapState({
                tradeToConfirm: trade,
                attemptingTxn: false,
                swapErrorMessage: undefined,
                showConfirm: true,
                txHash: undefined
              })
            }}
            
            id="swap-button"
            disabled={!isValid || approval !== ApprovalState.APPROVED || priceImpactSeverity > 3}
          >
            <Text fontSize={16} fontWeight={500}>
              {isExactIn ? 'BUY' : 'SELL'}
            </Text>
          </ButtonSwap>
      {/* {!account ? (
        <GreyCard style={{ textAlign: 'center', marginTop: '10px', padding: '10px 0' }}>请先连接钱包</GreyCard>
      ) : chainId !== ChainId.HPB ? (
        <GreyCard style={{ textAlign: 'center', marginTop: '10px', padding: '10px 0' }}>请先切换至HPB主网</GreyCard>
      ) : !trade?.route && userHasSpecifiedInputOutput ? (
        <GreyCard style={{ textAlign: 'center', marginTop: '10px', padding: '10px 0' }}>
          <TYPE.main mb="4bx">Insufficient liquidity for this trade</TYPE.main>
        </GreyCard>
      ) : showApproveFlow ? (
        <RowBetween>
          <ButtonConfirmed
            style={{ marginTop: '10px', padding: '10px 0' }}
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="48%"
            altDisabledStyle={approval === ApprovalState.PENDING}
            confirmed={approval === ApprovalState.APPROVED}
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                Approving <Loader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
              'Approved'
            ) : (
              'Approve ' + from?.symbol
            )}
          </ButtonConfirmed>
          <ButtonError
            style={{ marginTop: '10px', padding: '10px 0' }}
            onClick={() => {
              setSwapState({
                tradeToConfirm: trade,
                attemptingTxn: false,
                swapErrorMessage: undefined,
                showConfirm: true,
                txHash: undefined
              })
            }}
            width="48%"
            id="swap-button"
            disabled={!isValid || approval !== ApprovalState.APPROVED || priceImpactSeverity > 3}
            error={isValid && priceImpactSeverity > 2}
          >
            <Text fontSize={16} fontWeight={500}>
              {priceImpactSeverity > 3
                ? `Price Impact High`
                : `${priceImpactSeverity > 2 ? '直接' : ''}${isExactIn ? '买入' : '卖出'}`}
            </Text>
          </ButtonError>
        </RowBetween>
      ) : (
        <ButtonError
          style={{ marginTop: '10px', padding: '10px 0' }}
          onClick={() => {
            setSwapState({
              tradeToConfirm: trade,
              attemptingTxn: false,
              swapErrorMessage: undefined,
              showConfirm: true,
              txHash: undefined
            })
          }}
          id="swap-button"
          disabled={!isValid || priceImpactSeverity > 3 || !!swapCallbackError}
          error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
        >
          {swapError
            ? swapError
            : priceImpactSeverity > 3
            ? `Price Impact Too High`
            : `${priceImpactSeverity > 2 ? ' 直接' : ''}${isExactIn ? '买入' : '卖出'}`}
        </ButtonError>
      )} */}
      {trade && <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />}
    </>
  )
}
