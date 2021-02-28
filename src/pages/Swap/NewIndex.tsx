import React, { useState, useCallback, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import Panel from '../../components/Panel'
import { AutoRow, RowFixed } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
//import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AntdTabs, TabPane } from '../../components/AntdTabs'
//import { DarkBlueCard } from '../../components/Card'
import { ButtonCustom } from '../../components/Button'
import TVChartContainer from '../../components/TVChartContainer'
import { currencyId } from '../../utils/currencyId'
import ChartActions from './ChartActions'
import { 
  // useDefaultsFromURLSearch,
  // useDerivedSwapInfo,
  useAnotherDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
  useDefaultsFromURLSearch,
  useTrades
} from '../../state/swap/hooks'
import {
  ResolutionString
} from '../../charting_library/charting_library.min'
import { Field } from '../../state/swap/actions'
import { useIsDarkMode } from '../../state/user/hooks'
import { useTotalliquidity } from '../../hooks/useTotalliquidity'
import { useCurrency } from '../../hooks/Tokens'

import { usePair, PairState } from '../../data/Reserves'
import Swap from './NewSwap'

const DashborderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const PanelWrapper = styled.div`
  display: inline-grid;
  width: 100%;
  align-items: start;
`
// const FixedPanel = styled(Panel)`
//   width: fit-content;
//   padding: 0 10px;
//   border-radius: 10px;
//   display: flex;
//   flex-direction: row;
//   align-items: center;

//   :hover {
//     cursor: pointer;
//     background-color: ${({ theme }) => theme.bg2};
//   }
// `

const DarkBluePanel = styled(Panel)`
  background-color: ${({ theme }) => theme.bg8};
  padding: 10px;
  border: none;
  border-radius: 0;
`

function SwapPage() {
  const theme = useContext(ThemeContext)
  const isDarkMode = useIsDarkMode()

  const { onUserInput: _onUserInput, setDefaultCurrencies } = useSwapActionHandlers()
  // ================= 根据 URL 参数获取交易双方身份 ==============
  const loadedUrlParams = useDefaultsFromURLSearch()
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId)!,
    useCurrency(loadedUrlParams?.outputCurrencyId ?? '0xdAC17F958D2ee523a2206206994597C13D831ec7')!
  ]

  // 根据 url 参数设置交易双方信息，如果没有，则设置默认的 USDT
  useEffect(() => {
    if (loadedInputCurrency && loadedOutputCurrency) {
      setDefaultCurrencies(Field.OUTPUT, loadedOutputCurrency)
      setDefaultCurrencies(Field.INPUT, loadedInputCurrency)
    }
  }, [setDefaultCurrencies, loadedInputCurrency, loadedOutputCurrency])

  const [pairState, pair] = usePair(loadedInputCurrency, loadedOutputCurrency)
  const [reserve0, setReserve0] = useState<any>()
  const [reserve1, setReserve1] = useState<any>()
  const [symbol0, setSymbol0] = useState<string>()
  const [symbol1, setSymbol1] = useState<string>()
  //const [priceChangeUSD] = useState<number>(0)

  useEffect(() => {
    if (pairState === PairState.EXISTS && pair) {
      console.log('pair', pair)
      setReserve0(pair.reserve0.toSignificant())
      setReserve1(pair.reserve1.toSignificant())
      setSymbol0(pair.token0.symbol)
      setSymbol1(pair.token1.symbol)
    }
  }, [pairState, pair, setReserve0, setReserve1, setSymbol0, setSymbol1])

  // ================= ChartActions ===================
  const p = localStorage.getItem('HBG-period')
  const [period, _setPeriod] = useState(p || '60')
  const setPeriod = useCallback(
    period => {
      localStorage.setItem('HBG-period', period)
      _setPeriod(period)
    },
    [_setPeriod]
  )
  // ================= ChartActions END ===================
  //

  // ====================== 交易 ========================
  // const { parsedAmount, v2Trade } = useDerivedSwapInfo()
  // NOTE 用于交易时关联输入量和交易价格
  const { trades } = useAnotherDerivedSwapInfo()

  const swapState = useSwapState() // reducer 交易数据对象
  const { typedValue, anotherTypedValue, recipient } = swapState

  // 顶部兑换比例
  const [token00Rate, setToken00Rate] = useState<string | undefined>()
  const [token11Rate, setToken11Rate] = useState<string | undefined>()

  const [totalliquidity, token00USD, token11USD] = useTotalliquidity(loadedInputCurrency, loadedOutputCurrency, reserve0, reserve1, token00Rate, token11Rate)

  // NOTE 这个只用来计算当前的成交价格
  const { bestTradeExactIn } = useTrades(loadedInputCurrency ?? undefined, loadedOutputCurrency ?? undefined)

  // TODO 价值的美元价格？ 顶部兑换比例
  // const token00USD = useUSDCPrice(undefined) // inputCurrency ??
  // const token11USD = useUSDCPrice(undefined) // outputCurrency ??

  //const token00USD = 1 // inputCurrency ??
  //const token11USD = 2 // outputCurrency ??

  useEffect(() => {
    const price = bestTradeExactIn?.executionPrice
    const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
    if (show) {
      const token00Rate = price?.toSignificant(6)
      const token11Rate = price?.invert()?.toSignificant(6)
      setToken00Rate(token00Rate)
      setToken11Rate(token11Rate)
    }
  }, [bestTradeExactIn])

  // formatted symbols for overflow
  const formattedSymbol0 =
    loadedInputCurrency?.symbol?.length! > 6
      ? loadedInputCurrency?.symbol?.slice(0, 5) + '...'
      : loadedInputCurrency?.symbol
  const formattedSymbol1 =
    loadedOutputCurrency?.symbol?.length! > 6
      ? loadedOutputCurrency?.symbol?.slice(0, 5) + '...'
      : loadedOutputCurrency?.symbol

  const handleTypeInput = useCallback(
    value => {
      _onUserInput(Field.INPUT, value)
    },
    [_onUserInput]
  )
  const handleTypeOutput = useCallback(
    value => {
      _onUserInput(Field.OUTPUT, value)
    },
    [_onUserInput]
  )

  return (
    <>
      <DashborderWrapper>
        <PanelWrapper>
          <DarkBluePanel>
            <RowFixed style={{padding:'10px 0'}}>
              {loadedInputCurrency && loadedOutputCurrency && (
                <DoubleCurrencyLogo
                  currency0={loadedInputCurrency}
                  currency1={loadedOutputCurrency}
                  size={16}
                  margin={true}
                />
              )}{' '}
              <TYPE.main fontSize={'16px'} style={{ margin: '0 12px' }}>
                {loadedInputCurrency && loadedOutputCurrency ? (
                  <>
                    <span>{loadedInputCurrency.symbol}</span>
                    <span>-</span>
                    <span>{loadedOutputCurrency.symbol}</span>
                  </>
                ) : (
                  ''
                )}
              </TYPE.main>
              <ButtonCustom
                      style={{lineHeight:'20px', textDecoration:'none', padding:'2px 11px'}}
                      as={Link}
                      to={`/add/${loadedInputCurrency && currencyId(loadedInputCurrency)}/${loadedOutputCurrency &&
                        currencyId(loadedOutputCurrency)}`}
                    >
                      + Add Liquidity
                </ButtonCustom>
            </RowFixed>
            <AutoRow
              gap="6px"
              style={{
                width: 'fit-content',
                flexWrap: 'wrap',
                fontSize: '12px',
                color:'#9c9cb2',
                padding:'6px 0'
              }}
            >
              {/* <FixedPanel>
                <CurrencyLogo currency={loadedInputCurrency} size={'16px'} />
                <TYPE.main fontSize={'16px'} lineHeight={1} fontWeight={500} ml={'4px'}>
                  {loadedInputCurrency && loadedOutputCurrency
                    ? `1 ${formattedSymbol0} = ${token00Rate ?? '-'} ${formattedSymbol1} ($${token00USD?.toFixed(2) ??
                        '-'})`
                    : '-'}
                </TYPE.main>
              </FixedPanel>
              <FixedPanel>
                <CurrencyLogo currency={loadedOutputCurrency} size={'16px'} />
                <TYPE.main fontSize={'16px'} lineHeight={1} fontWeight={500} ml={'4px'}>
                  {loadedInputCurrency && loadedOutputCurrency
                    ? `1 ${formattedSymbol1} = ${token11Rate ?? '-'} ${formattedSymbol0} ($${token11USD?.toFixed(2) ??
                        '-'})`
                    : '-'}
                </TYPE.main>
              </FixedPanel> */}
              <div>
              Total Liquidity:
              <span style={{color:'#88A640', marginLeft:'11px', fontSize:'16px'}}>
                ${totalliquidity}
              </span>
              </div>
              <div>
              Pooled token:
              <span style={{color:'#EAEBF4', marginLeft:'12px'}}>
              {reserve0 ?? '-'}{symbol0}
              </span>
              <span style={{color:'#EAEBF4',margin: '0 10px'}}>
              {reserve1 ?? '-'}{symbol1}
              </span>
              </div>
              <div>
                <span>{loadedInputCurrency && loadedOutputCurrency
                    ? `1 ${formattedSymbol0}=${token00Rate ?? '-'} ${formattedSymbol1} ($${token00USD?.toFixed(2) ??
                        '-'})`
                    : '-'}</span>
                <span style={{marginLeft:'10px'}}>{loadedInputCurrency && loadedOutputCurrency
                    ? `1 ${formattedSymbol1}=${token11Rate ?? '-'} ${formattedSymbol0} ($${token11USD?.toFixed(2) ??
                        '-'})`
                    : '-'}</span>
              </div>
            </AutoRow>
            <AutoRow
                gap="6px"
                style={{
                width: 'fit-content',
                flexWrap: 'wrap',
                fontSize: '12px',
                color:'#9c9cb2',
                padding:'6px 0'
                }}
            >
            <div>
                Price change:
              <span style={{color:'#88A640', marginLeft:'11px'}}>
              +2.7%
              </span>
              </div>
              <div>
                24H High:
                <span style={{color:'#EAEBF4', marginLeft:'12px'}}>
                12012.45
                </span>
              </div>
              <div>
                24H Low:
                <span style={{color:'#EAEBF4', marginLeft:'12px'}}>
                12012.45
                </span>
              </div>
              <div>
                24H Volume:
                <span style={{color:'#EAEBF4', marginLeft:'12px'}}>
                12012.45
                </span>
              </div>

            </AutoRow>
          </DarkBluePanel>
          {/* <DarkBluePanel>
            <DarkBlueCard padding="0">
              <TYPE.main style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 0, margin: '0 0 10px 0', fontSize: '12px' }}>
                  <h3
                    style={{
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '14px'
                    }}
                  >
                    Total liquidity
                  </h3>
                  <p style={{ margin: 0, padding: 0 }}>
                    $ {totalliquidity} {priceChangeUSD}%
                  </p>
                </div>
                <div style={{ fontSize: '12px' }}>
                  <h3 style={{ padding: 0, margin: '0 0 10px 0', fontSize: '14px' }}> Pooled token </h3>
                  <span>
                    {reserve0 ?? '-'}
                    {symbol0}
                  </span>
                  <span style={{ marginLeft: '14px' }}>
                    {reserve1 ?? '-'}
                    {symbol1}
                  </span>
                </div>
              </TYPE.main>
            </DarkBlueCard>
          </DarkBluePanel> */}
        </PanelWrapper>
        <AutoColumn style={{ marginTop: '6px', marginBottom: '6px' }} gap="24px">
          <DarkBluePanel style={{ height: '100%', minHeight: '500px' }}>
            
            <ChartActions period={period} setPeriod={setPeriod} />
            <TVChartContainer period={period as ResolutionString} theme={isDarkMode ? 'Dark' : 'Light'} />
          </DarkBluePanel>
        </AutoColumn>
        <div style={{ backgroundColor: theme.bg9, flex: 1,}}>
          <TYPE.mediumHeader style={{ backgroundColor: theme.bg8, height:'40px', lineHeight:'40px', paddingLeft:'16px'}}>
            Exchange
          </TYPE.mediumHeader>
          <AutoRow style={{ alignItems: 'stretch', paddingTop: '10px', paddingLeft: '10px' }}>
            <AutoColumn style={{ flex: 1 }}>
              <AntdTabs defaultActiveKey="2">
                <TabPane tab="Market" key="2" style={{color:'407FFF'}}>
                  <Swap
                    type="In"
                    from={loadedInputCurrency}
                    to={loadedOutputCurrency}
                    trade={trades?.bestTradeExactOut ?? undefined}
                    onUserInput={handleTypeInput}
                    typedValue={typedValue}
                    recipient={recipient}
                    amount={trades?.bestTradeExactOut?.inputAmount}
                  />
                </TabPane>
                <TabPane disabled tab="限价" key="1" style={{ paddingBottom: '20px' }}></TabPane>
              </AntdTabs>
            </AutoColumn>
            <AutoColumn style={{ flex: 1, padding: '0 10px' }}>
              <AntdTabs defaultActiveKey="2">
                <TabPane tab="Market" key="2" style={{color:'407FFF'}}>
                  <Swap
                    type="Out"
                    from={loadedInputCurrency}
                    to={loadedOutputCurrency}
                    trade={trades?.bestTradeExactIn ?? undefined}
                    onUserInput={handleTypeOutput}
                    typedValue={anotherTypedValue}
                    recipient={recipient}
                    amount={trades?.bestTradeExactIn?.outputAmount}
                  />
                </TabPane>
                <TabPane disabled tab="限价" key="1" style={{ paddingBottom: '20px' }}></TabPane>
              </AntdTabs>
            </AutoColumn>
          </AutoRow>
        </div>
      </DashborderWrapper>
    </>
  )
}
export default SwapPage
