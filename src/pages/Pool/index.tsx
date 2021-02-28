import React, { useState, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'
// import { Pair } from '@uniswap/sdk'
import { Link } from 'react-router-dom'
// import { SwapPoolTabs } from '../../components/NavigationTabs'
import AddLiquidityModal from './AddLiquidityModal';

import FullPositionCard from '../../components/PositionCard'
// import { useUserHasLiquidityInAllTokens } from '../../data/V1'
// import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import {
  // StyledInternalLink,
  ExternalLink,
  TYPE
  // , HideSmall
} from '../../theme'
// import { Text } from 'rebass'
import Card from '../../components/Card'
import {
  RowBetween // , RowFixed
} from '../../components/Row'
import { ButtonPrimary } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { useAllPairs } from '../../hooks/Pairs'
// import { usePairs } from '../../data/Reserves'
import { Dots } from '../../components/swap/styleds'
import {
  CardSection,
  DataCard,
  CardNoise // , CardBGImage
} from '../../components/earn/styled'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
  margin: 10px auto 0;
  height: 100%;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

// const ButtonRow = styled(RowFixed)`
//   gap: 8px;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     width: 100%;
//     flex-direction: row-reverse;
//     justify-content: space-between;
//   `};
// `

// const ResponsiveButtonPrimary = styled(ButtonPrimary)`
//   width: fit-content;
// `

// const ResponsiveButtonSecondary = styled(ButtonSecondary)`
//   width: fit-content;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     width: 48%;
//   `};
// `

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const [addresses, isLoading] = useAllPairs()
  // console.log('addresses', addresses)
  // const pairs = usePairs(addresses)
  // console.log('pairs--------', pairs)
  // const tokenPairsWithLiquidityTokens = useMemo(
  //     () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
  //     [trackedTokenPairs]
  // )
  // const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
  //     tokenPairsWithLiquidityTokens
  // ])
  // const [v2PairsBalances] = useTokenBalancesWithLoadingIndicator(
  //     account ?? undefined,
  //     liquidityTokens
  // )

  // fetch the reserves for all V2 pools in which the user has a balance
  // const liquidityTokensWithBalances = useMemo(
  //   () =>
  //     tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
  //       v2PairsBalances[liquidityToken.address]?.greaterThan('0')
  //     ),
  //   [tokenPairsWithLiquidityTokens, v2PairsBalances]
  // )

  // const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  // const v2IsLoading =
  //   fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  // const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  // const hasV1Liquidity = useUserHasLiquidityInAllTokens()
  const [isOpen, setIsOpen] = useState(true)
  return (
    <>
      <AddLiquidityModal isOpen={isOpen} onDismiss={() => setIsOpen(true)}></AddLiquidityModal>
      <PageWrapper>
        {/* <SwapPoolTabs active={'pool'} /> */}

        <VoteCard style={{ height: '151px', marginBottom: '20px' }}>
          {/* <CardBGImage /> */}
          <CardNoise />
          <CardSection>
            <ColumnCenter>
              <RowBetween style={{ height: '30px', marginBottom: '10px' }}>
                <TYPE.white fontWeight={600}>
                  流动性提供者奖励
                  {/* Liquidity provider rewards */}
                </TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  {`流动性提供者将分得该交易产生的所有手续费，手续费为交易额的0.3%。流动性提供者按照其在流动性池所占比例来瓜分交易手续费。所有奖励实时计算，并在您退出流动性池时进入您的账户。`}
                  {/* {`Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.`} */}
                </TYPE.white>
              </RowBetween>
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline', alignSelf: 'flex-start', marginTop: '20px' }}
                target="_blank"
                href="https:uniswap.org/docs/v2/core-concepts/pools/"
              >
                {/* <TYPE.white fontSize={14}>您抵押在流动性池中的资金</TYPE.white> */}
                {/* <TYPE.white fontSize={14}>Read more about providing liquidity</TYPE.white> */}
              </ExternalLink>
            </ColumnCenter>
          </CardSection>
          {/* <CardBGImage /> */}
          <CardNoise />
        </VoteCard>
        {!account ? (
          <Card padding="40px">
            <TYPE.body color={theme.text3} textAlign="center">
              Connect to a wallet to view your liquidity.
            </TYPE.body>
          </Card>
        ) : isLoading ? (
          <EmptyProposals>
            <TYPE.body color={theme.text3} textAlign="center">
              <Dots>Loading</Dots>
            </TYPE.body>
          </EmptyProposals>
        ) : addresses?.length > 0 ? (
          <PerfectScrollbar>
            {addresses
              .filter(address => address !== '0xa796E97F80045017a6C359D6Cd9b951c3AFfdd3B')
              .map(address => (
                <FullPositionCard key={address} pairAddress={address} />
              ))}
          </PerfectScrollbar>
        ) : (
          <AutoColumn gap="lg" justify="center">
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                您抵押在流动性池中的资产
              </TYPE.mediumHeader>
            </TitleRow>
            <ButtonPrimary as={Link} to="/add/ETH">
              加入一个资金池
            </ButtonPrimary>
            <ExternalLink
              style={{ color: 'white', marginTop: '10px' }}
              target="_blank"
              href="https:uniswap.org/docs/v2/core-concepts/pools/"
            >
              <TYPE.white fontSize={14}>找不到您的抵押</TYPE.white>
              {/* <TYPE.white fontSize={14}>Read more about providing liquidity</TYPE.white> */}
            </ExternalLink>
          </AutoColumn>
        )}

        {/* <AutoColumn gap="lg" justify="center"> */}
        {/*   <AutoColumn gap="lg" style={{ width: '100%' }}> */}
        {/*     <TitleRow style={{ marginTop: '1rem' }} padding={'0'}> */}
        {/*       <HideSmall> */}
        {/*         <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}> */}
        {/*           Your liquidity */}
        {/*         </TYPE.mediumHeader> */}
        {/*       </HideSmall> */}
        {/*       <ButtonRow> */}
        {/*         <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/create/ETH"> */}
        {/*           Create a pair */}
        {/*         </ResponsiveButtonSecondary> */}
        {/*         <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="6px 8px" to="/add/ETH"> */}
        {/*           <Text fontWeight={500} fontSize={16}> */}
        {/*             Add Liquidity */}
        {/*           </Text> */}
        {/*         </ResponsiveButtonPrimary> */}
        {/*       </ButtonRow> */}
        {/*     </TitleRow> */}

        {/*     {!account ? ( */}
        {/*       <Card padding="40px"> */}
        {/*         <TYPE.body color={theme.text3} textAlign="center"> */}
        {/*           Connect to a wallet to view your liquidity. */}
        {/*         </TYPE.body> */}
        {/*       </Card> */}
        {/*     ) : v2IsLoading ? ( */}
        {/*       <EmptyProposals> */}
        {/*         <TYPE.body color={theme.text3} textAlign="center"> */}
        {/*           <Dots>Loading</Dots> */}
        {/*         </TYPE.body> */}
        {/*       </EmptyProposals> */}
        {/*     ) : allV2PairsWithLiquidity?.length > 0 ? ( */}
        {/*       <> */}
        {/*         <ButtonSecondary> */}
        {/*           <RowBetween> */}
        {/*             <ExternalLink href={'https://uniswap.info/account/' + account}> */}
        {/*               Account analytics and accrued fees */}
        {/*             </ExternalLink> */}
        {/*             <span> ↗</span> */}
        {/*           </RowBetween> */}
        {/*         </ButtonSecondary> */}

        {/*         {allV2PairsWithLiquidity.map(v2Pair => ( */}
        {/*           <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} /> */}
        {/*         ))} */}
        {/*       </> */}
        {/*     ) : ( */}
        {/*       <EmptyProposals> */}
        {/*         <TYPE.body color={theme.text3} textAlign="center"> */}
        {/*           No liquidity found. */}
        {/*         </TYPE.body> */}
        {/*       </EmptyProposals> */}
        {/*     )} */}

        {/*     <AutoColumn justify={'center'} gap="md"> */}
        {/*       <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}> */}
        {/*         {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : "Don't see a pool you joined?"}{' '} */}
        {/*         <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}> */}
        {/*           {hasV1Liquidity ? 'Migrate now.' : 'Import it.'} */}
        {/*         </StyledInternalLink> */}
        {/*       </Text> */}
        {/*     </AutoColumn> */}
        {/*   </AutoColumn> */}
        {/* </AutoColumn> */}
      </PageWrapper>
    </>
  )
}