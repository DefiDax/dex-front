import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import Panel from '../../components/Panel'
import { AutoRow, RowFixed } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
//import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AntdTabs, TabPane } from '../../components/AntdTabs'
import { DarkBlueCard } from '../../components/Card'
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

import { usePair, PairState, usePairAddress } from '../../data/Reserves'
import Swap from './Swap'

const DashborderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
//grid-template-columns: 1fr 2fr 2fr;
const PanelWrapper = styled.div`
  grid-template-columns: repeat(24, 1fr);
  gap: 0;
  display: inline-grid;
  width: 100%;
  min-height: 96px;
  align-items: start;
  padding: 16px 10px;
  background-color: ${({ theme }) => theme.bg6};
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
  border: none;
  border-radius: 0;
  padding: 0;
  justify-content: flex-end;
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
  const pairAddress = usePairAddress(loadedInputCurrency, loadedOutputCurrency)
  const [reserve0, setReserve0] = useState<any>()
  const [reserve1, setReserve1] = useState<any>()
  const [symbol0, setSymbol0] = useState<string>()
  const [symbol1, setSymbol1] = useState<string>()

  //const [priceChangeUSD] = useState<number>(0)

  useEffect(() => {
    if (pairState === PairState.EXISTS && pair) {
      //console.log('pair', pair)
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

  // const token00USD = 1 // inputCurrency ??
  // const token11USD = 2 // outputCurrency ??

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

    const tvSymbol = useMemo(
      () =>{
        let symbol = "";
        if(pairAddress){
           symbol = `${pairAddress}:${loadedInputCurrency?.symbol}-${loadedOutputCurrency?.symbol}`;
        }
          return symbol
      },[loadedInputCurrency, loadedOutputCurrency, pairAddress])

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
          <DarkBluePanel style={{  gridColumnStart: "1", gridColumnEnd: "6" }}>
            <RowFixed>
              {loadedInputCurrency && loadedOutputCurrency && (
                <DoubleCurrencyLogo
                  currency0={loadedInputCurrency}
                  currency1={loadedOutputCurrency}
                  size={16}
                  margin={true}
                />
              )}{' '}
              <TYPE.main fontSize={'16px'}>
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
            </RowFixed>
            <div style={{marginTop:'8px'}}>
            <ButtonCustom
                style={{lineHeight:'20px', textDecoration:'none', border:'none', borderRadius:"12px"}}
                width="fit-content"
                padding="2px 10px"
                border="none"
                as={Link}
                to={`/add/${loadedInputCurrency && currencyId(loadedInputCurrency)}/${loadedOutputCurrency &&
                  currencyId(loadedOutputCurrency)}`}
            >
                      + Add Liquidity
              </ButtonCustom>
            </div>

          </DarkBluePanel>
          <DarkBluePanel style={{  gridColumnStart: "6", gridColumnEnd: "14" }}>
            <DarkBlueCard padding="0" style={{
                fontSize:'14px',
                color: '#9C9CB2',
                letterSpacing: '-0.14px',
                
                }}>
              <div>
                Total Liquidity:
                <span style={{color:'#88A640', marginLeft:'11px', fontSize:'18px'}}>
                  ${totalliquidity}
                </span>
              </div>
              <div style={{marginTop: '9px'}}>
                Pooled token:
                <span style={{color:'#EAEBF4', marginLeft:'12px'}}>
                {reserve0 ?? '-'}{symbol0}
                </span>
                <span style={{color:'#EAEBF4',marginLeft: '14px'}}>
                {reserve1 ?? '-'}{symbol1}
                </span>
              </div>
            </DarkBlueCard>
          </DarkBluePanel>
          <DarkBluePanel style={{flex: 'none', gridColumnStart: "14", gridColumnEnd: "25"}}>
            <AutoRow
              gap="6px"
              style={{
                width: 'fit-content',
                flexWrap: 'wrap',
                fontSize:'14px',
                color: '#9C9CB2',
                letterSpacing: '-0.14px',

              }}
            >
              
                <span>{loadedInputCurrency && loadedOutputCurrency
                    ? `1 ${formattedSymbol0}≈${token00Rate ?? '-'} ${formattedSymbol1} ($${token00USD?.toFixed(2) ??
                        '-'})`
                    : '-'}</span>
                <span style={{marginLeft:'10px'}}>{loadedInputCurrency && loadedOutputCurrency
                    ? `1 ${formattedSymbol1}≈${token11Rate ?? '-'} ${formattedSymbol0} ($${token11USD?.toFixed(2) ??
                        '-'})`
                    : '-'}</span>
              

            </AutoRow>
          </DarkBluePanel>
        </PanelWrapper>
        <AutoColumn style={{ marginTop: '6px', marginBottom: '6px' }} gap="24px">
          <DarkBluePanel style={{ height: '100%', minHeight: '500px' }}>
            {/* <ul
              style={{
                display: 'flex',
                listStyle: 'none',
                fontSize: '14px',
                color: '#61688A',
                margin: 0,
                padding: 0,
                border: '1px solid #171B2B'
              }}
            >
              <li style={{ marginRight: '24px' }}>
                <label>24H涨跌:</label>
                <span style={{ color: '#40B37D' }}>+10.65%</span>
              </li>
              <li style={{ marginRight: '24px' }}>
                <label>24H高:</label> <span style={{ color: '#fff' }}>11532.93</span>
              </li>
              <li style={{ marginRight: '24px' }}>
                <label>24H低</label>: <span style={{ color: '#fff' }}>11305.45</span>
              </li>
              <li>
                <label>24H量:</label> <span style={{ color: '#fff' }}>23,669BTC</span>
              </li>
            </ul> */}
            {
            tvSymbol ? <><ChartActions period={period} setPeriod={setPeriod} />
             <TVChartContainer period={period as ResolutionString} interval={period as ResolutionString} symbol={tvSymbol} theme={isDarkMode ? 'Dark' : 'Light'} /></>:null
             }
          </DarkBluePanel>
        </AutoColumn>
        <div style={{ backgroundColor: theme.bg9, flex: 1}}>
        <TYPE.mediumHeader style={{ backgroundColor: theme.bg8, height:'40px', lineHeight:'40px', paddingLeft:'16px'}}>
            Exchange
          </TYPE.mediumHeader>
          <AutoRow style={{ alignItems: 'stretch', paddingTop: '10px', paddingLeft: '10px'  }}>
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
                <TabPane disabled tab="Limit" key="1" style={{ paddingBottom: '20px' }}></TabPane>
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
                <TabPane disabled tab="Limit" key="1" style={{ paddingBottom: '20px' }}></TabPane>
              </AntdTabs>
            </AutoColumn>
          </AutoRow>
        </div>
      </DashborderWrapper>
    </>
  )
}
export default SwapPage
