import { JSBI, Pair, Percent, Currency } from '../../uniswap-sdk'
import { darken } from 'polished'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonPrimary } from '../Button'
import { transparentize } from 'polished'
import { CardNoise } from '../earn/styled'

import { useColor } from '../../hooks/useColor'
import { useToken } from '../../hooks/Tokens'
import { usePairContract } from '../../hooks/useContract'
import { usePair, PairState } from '../../data/Reserves'

import Card, { GreyCard, LightCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`
const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: none;
  background: ${({ theme, bgColor }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, bgColor)} 0%, ${theme.bg3} 100%) `};
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
`

interface PositionCardProps {
  pairAddress?: string
  showUnwrapped?: boolean
  border?: string
  pair: Pair
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(true)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Your pool share:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency0.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency1.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      ) : (
        <LightCard>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{' '}
            By adding liquidity you&apos;ll earn 0.3% of all trades on this pair proportional to your share of the pool.
            Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  )
}

interface PositionCardProps2 {
  pairAddress?: string
  showUnwrapped?: boolean
  border?: string
  pair?: Pair
}

export default function FullPositionCard({ pairAddress, border, pair }: PositionCardProps2) {
  const { account } = useActiveWeb3React()
  const contract = usePairContract(pairAddress)
  const [token0, setToken0] = useState<string>()
  const [token1, setToken1] = useState<string>()
  const [totalSupply, setTotallySupply] = useState<any>()

  useEffect(() => {
    if (!contract) return
    ;(async () => {
      const [token0, token1, totalSupply] = await Promise.all([
        contract.token0(),
        contract.token1(),
        contract.totalSupply()
      ])
      // console.log('totalSupply', totalSupply)
      setToken0(token0)
      setToken1(token1)
      setTotallySupply(totalSupply)
    })()
  }, [setToken0, setToken1, contract, setTotallySupply])
    console.log(totalSupply)
  const tokenA = useToken(token0)
  const tokenB = useToken(token1)
  const [currency0, setCurrency0] = useState<Currency>()
  const [currency1, setCurrency1] = useState<Currency>()
  useEffect(() => {
    if (tokenA) {
      setCurrency0(unwrappedToken(tokenA))
    }
    if (tokenB) {
      setCurrency1(unwrappedToken(tokenB))
    }
  }, [tokenA, tokenB])
  const [reserve0, setReserve0] = useState<any>()
  const [reserve1, setReserve1] = useState<any>()
  const [symbol0, setSymbol0] = useState<string>()
  const [symbol1, setSymbol1] = useState<string>()
  const [pairState, myPair] = usePair(currency0, currency1)
  useEffect(() => {
    if (pairState === PairState.EXISTS && myPair) {
      console.log('myPair', myPair)
      setReserve0(myPair.reserve0.toSignificant())
      setReserve1(myPair.reserve1.toSignificant())
      setSymbol0(myPair.token0.symbol)
      setSymbol1(myPair.token1.symbol)
    }
  }, [pairState, myPair, setReserve0, setReserve1, setSymbol0, setSymbol1])
  // const currency1 = unwrappedToken(tokenB)

  const userPoolBalance = useTokenBalance(account ?? undefined, myPair?.liquidityToken)
  const totalPoolTokens = useTotalSupply(myPair?.liquidityToken)
  console.log('total', totalPoolTokens?.toSignificant(), userPoolBalance?.raw, totalPoolTokens?.raw)
  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined
  console.log('poolTokenPercentage', poolTokenPercentage)

  // const [token0Deposited, token1Deposited] =
  //   !!pair &&
  //   !!totalPoolTokens &&
  //   !!userPoolBalance &&
  //   // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
  //   JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
  //     ? [
  //         pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
  //         pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
  //       ]
  //     : [undefined, undefined]

  const backgroundColor = useColor(pair?.token0)

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor}>
      <CardNoise />
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <RowFixed>
            {currency0 && currency1 && (
              <>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                <Text fontWeight={500} fontSize={20}>
                  {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
                </Text>
              </>
            )}
          </RowFixed>
        </FixedHeightRow>
        <AutoColumn gap="8px">
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              Your pool tokens:
            </Text>
            <Text fontSize={16} fontWeight={500}>
              {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
            </Text>
          </FixedHeightRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              Total pooled token:
            </Text>
            <Text fontSize={16} fontWeight={500}>
              {totalPoolTokens ? totalPoolTokens.toSignificant(4) : '-'}
            </Text>
          </FixedHeightRow>
          <FixedHeightRow>
            <RowFixed>
              {symbol0 && (
                <Text fontSize={16} fontWeight={500}>
                  Your pooled {symbol0}:
                </Text>
              )}
            </RowFixed>
            {reserve0 && poolTokenPercentage ? (
              <RowFixed>
                <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                  {reserve0 * (+poolTokenPercentage.toSignificant() / 100)}
                </Text>
                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <RowFixed>
              {symbol1 && (
                <Text fontSize={16} fontWeight={500}>
                  Your pooled {symbol1}:
                </Text>
              )}
            </RowFixed>
            {reserve1 && poolTokenPercentage ? (
              <RowFixed>
                <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                  {reserve1 * (+poolTokenPercentage.toSignificant() /100)}
                </Text>
                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              Your pool share:
            </Text>
            <Text fontSize={16} fontWeight={500}>
              {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
            </Text>
          </FixedHeightRow>
          <RowBetween marginTop="10px">
            {currency0 && currency1 && (
              <>
                <ButtonPrimary
                  padding="8px"
                  as={Link}
                  to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                  width="48%"
                >
                  Add
                </ButtonPrimary>
                <ButtonPrimary
                  padding="8px"
                  as={Link}
                  width="48%"
                  to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}/${pairAddress}`}
                >
                  Remove
                </ButtonPrimary>
              </>
            )}
          </RowBetween>
        </AutoColumn>
      </AutoColumn>
    </StyledPositionCard>
  )
}
