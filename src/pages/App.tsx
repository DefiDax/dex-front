// @ts-nocheck
import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Web3ReactManager from '../components/Web3ReactManager'
import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import Earn from './Earn'
import Manage from './Earn/Manage'
import MigrateV1 from './MigrateV1'
import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap/backup'
import SwapPage from './Swap/index'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap, RedirectToSwapPage } from './Swap/redirects'
import Left from './Left'
//import Right from './Right'
import ModRight from './Right/ModRight'
import Bottom from './Bottom'

import Vote from './Vote'
import VotePage from './Vote/VotePage'
import Accets from './Accets'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding-bottom: 6px;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  background-color: ${({ theme }) => theme.bg6}
  margin-bottom: 6px;
`

const BodyWrapper = styled.div`
  width: 100%;
  flex: 1;
  z-index: 10;
  padding-top: 77px;
  min-height: calc(100vh - 77px);

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`
const Marginer = styled.div`
  margin-top: 5rem;
`

const LayoutBodyWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 6px;
    width: 100%;
    height: 100%;
    overflow: auto;
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #40444f;
    }
`;

const LayoutOtherBodyWrapper = styled.div`
    display: grid;
    justify-content: center;
    background-color: ${({ theme }) => theme.white};
    width: 100%;
    height: 100%;
`;

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <PerfectScrollbar>
      <LayoutBodyWrapper>
        <Left></Left>
        {children}
      {/* <Right></Right> */}
      <ModRight/>
	<Bottom/>
      </LayoutBodyWrapper>
    </PerfectScrollbar>
  )
}

const LayoutOtherWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
      <LayoutOtherBodyWrapper>
        {children}
      </LayoutOtherBodyWrapper>
  )
}

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <URLWarning />
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Polling />
          <TopLevelModals />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/test" component={Swap} />
              <Route exact strict path="/swap" component={RedirectToSwapPage} />
              <Route
                exact
                strict
                path="/swappage"
                render={() => (
                  <LayoutWrapper>
                    <SwapPage />
                  </LayoutWrapper>
                )}
              />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/swap/:pair" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/uni" component={Earn} />
              <Route exact strict path="/vote" component={Vote} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact strict path="/accets"
                render={() => (
                  <LayoutOtherWrapper>
                    <Accets />
                  </LayoutOtherWrapper>
                )} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB/:pairAddress" component={RemoveLiquidity} />
              <Route exact strict path="/migrate/v1" component={MigrateV1} />
              <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} />
              <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} />
              <Route exact strict path="/vote/:id" component={VotePage} />
              <Route component={RedirectPathToSwapOnly} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
