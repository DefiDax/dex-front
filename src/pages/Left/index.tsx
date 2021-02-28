// @ts-nocheck
import React, { useCallback, useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import Tabs, { TabPane } from 'rc-tabs'
import { transparentize } from 'polished'
import { useQueue, useCustomCompareEffect } from 'react-use'
import { Star, File} from 'react-feather'
import Column, { ColumnCenter, AutoColumn } from '../../components/Column'
import { ButtonText, ButtonCustom, ButtonLight} from '../../components/Button'
import Search from '../../components/Search'
import TokenList from '../../components/TokenList'
import { useCurrency } from '../../hooks/Tokens'
import { 
  useDefaultsFromURLSearch
} from '../../state/swap/hooks'
import { useFetchSymbolsCallback } from '../../hooks/useFetchSymbolsCallback'
import { useQuoteList, useSymbolObj } from '../../state/symbols/hooks'
import { useActiveWeb3React } from '../../hooks'
import Copy from '../../components/AccountDetails/Copy'
import Wallet from './Wallet'
import { shortenAddress } from '../../utils'
import Modal from '../../components/Modal'
import SwapModal from '../Swap/SwapModal'
import { AutoRow } from '../../components/Row'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TYPE, ExternalLink } from '../../theme'

const Wrapper = styled.div`
  height: 100%;
  color: ${({ theme }) => theme.text1};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left:5px;
`

const AdPlaceholder = styled.div`
  width: 100%;
  height: 154px;
  background: #4a4ae2;
  margin-bottom: 10px;
`

const SearchWrapper = styled.div`
  width: 100%;
  height: 520px;
  font-size: 14px;
  padding-top:20px;
  background-color: ${({ theme }) => theme.bg9};
  border-radius: 2px;
  margin-bottom: 10px;
`

const WalletWrapper = styled.div`
  width: 100%;
  height:382px;
  background-color: ${({ theme }) => theme.bg9};
  border-radius: 2px;
`

const WalletInfo = styled.div`
  width: 100%;
  height:63px;
  padding:0 16px;
  background-color: ${({ theme }) => theme.bg6};
  border-radius: 2px;
`


const WalletList = styled.div`
  width: 100%;
  height: 319px;
  padding:14px 16px 0 16px;
  border-radius: 2px;
  overflow:scroll;
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #40444f;
  }
  ::-webkit-scrollbar-button{
    display:none;
  }
  ::-webkit-scrollbar-corner{
    display:none;
  }

`

const NoNetwork = styled.div`
  display: flex;
  flex-direction: column;
  justify-content:center;
  width: 100%;
  height: 319px;
  align-items: center;
`

const Title = styled.div`
  width: 100%;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
  align-self: flex-start;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const SubTitle = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
  align-self: flex-start;
  display: flex;
`

const TabWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top:20px;
  position: relative;
`

const StarIcon = styled(Star)`
  display: flex;
  position: absolute;
  left:16px;
  top:10px;
  height: 15px;
  width: 15px;
  color: ${({ theme }) => theme.star};
  margin-right:28px;
  :hover {
    cursor: pointer;
  }
`

const FileIcon = styled(File)`
  display: flex;
  height: 15px;
  width: 15px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.bg6};
`

const AntdTabs = styled(Tabs)`
  display: flex;
  overflow: hidden;
  line-height: 1.5715;
  flex-direction: column;
  width: 100%;
  .rc-tabs {
    &-nav {
      position: relative;
      display: flex;
      flex: none;
      align-items: center;
      margin: 0 0 16px 42px;
      &-wrap {
        position: relative;
        display: inline-block;
        display: flex;
        flex: auto;
        align-left: stretch;
        overflow: hidden;
        white-space: nowrap;
        transform: translate(0);
        ::before,
        ::after {
          position: absolute;
          z-index: 1;
          opacity: 0;
          content: '';
          pointer-events: none;
        }
      }
      &-list {
        position: relative;
        display: flex;
      }
    }
    &-tab {
      width:47px;
      position: relative;
      display: inline-flex;
      align-items: center;
      margin: 0 16px 0 0;
      padding: 5px 0;
      font-size: 14px;
      border: 1px solid #2C7AF9;
      border-radius: 2px;
      justify-content:center;
      outline: none;
      cursor: pointer;
      &-btn {
        outline: none;
        :focus,
        :active {
          color: #BDC3F0;
        }
      }
    }
    &-tab-active {
      background-image: linear-gradient(150deg, #547DF0 0%, #2A3FC5 100%);
      border:none;
      .rc-tabs-tab-btn {
        color: #EAEBF4;
      }
    }
    &-ink-bar {
      position: absolute;
      pointer-events: none;
      height: 0;
      bottom: 0;
    }
    &-content {
      &-holder {
        flex: auto;
        min-width: 0;
        min-height: 0;
      }
      display: flex;
      width: 100%;
    }
    &-tabpane {
      flex: none;
      width: 100%;
      outline: none;
    }
  }
`


const ConfirmContainer = styled.div`
  max-width: 420px;
  width: 100%;
  padding: 2rem;
  border-radius: 20px;
  overflow: auto;
`

function Left({history}) {
  const { account } = useActiveWeb3React()

  const loadedUrlParams = useDefaultsFromURLSearch()

  const [loadedOutputCurrency] = [ useCurrency(loadedUrlParams?.outputCurrencyId ?? '0xdAC17F958D2ee523a2206206994597C13D831ec7')! ]
  
  const defaultActiveKey = useMemo(()=> (
    !!loadedOutputCurrency ? loadedOutputCurrency.symbol : 'ETH'
    ),[loadedOutputCurrency])
  const [activeKey, setActiveKey] = useState(defaultActiveKey)
  const [openModal, setOpenModal] = useState(false)

  const fetchSymbols = useFetchSymbolsCallback()


  console.log("defaultActiveKey", defaultActiveKey)
  console.log("activeKey", activeKey)
  useEffect(() => {
    fetchSymbols()
      // .then(data => console.log('symbol', data))
  }, [fetchSymbols])

  useEffect(() => {
    setActiveKey(defaultActiveKey)
  }, [defaultActiveKey])

  const symbolObj = useSymbolObj(activeKey)

  const quoteList = useQuoteList()
  
  const handleTabChange = useCallback(key => {
    history.push(`/swap/HPB_${key}`)
    setActiveKey(key)
  }, [])

  const toggleConfirmModal = useCallback(() => {
    setOpenModal(!openModal)
  }, [])

  function onDismiss() {
    setOpenModal(false)
  }

  const toggleWalletModal = useWalletModalToggle()
  const openWalletModal = useCallback(() => {
    setOpenModal(false)
    toggleWalletModal()
  }, [])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Wrapper>
      <SwapModal isOpen={isOpen} onDismiss={() => setIsOpen(false)} />
      <Modal isOpen={openModal} onDismiss={onDismiss}>
        <ConfirmContainer>
          <AutoColumn gap="lg">
            <AutoRow gap="6px">
              {!(window.web3 || window.ethereum) ? (
                <>
                  <TYPE.body>请先安装MetaMask插件，创建或导入帐户后，再点击MetaMask Connect</TYPE.body>
                  <ButtonLight>
                    <ExternalLink style={{ color: 'white' }} href="https://metamask.io/" target="_blank">
                      <TYPE.white fontSize={14}>进入MetaMask官网</TYPE.white>
                    </ExternalLink>
                  </ButtonLight>
                </>
              ) : (
                <>
                  <TYPE.body>
                    如果您持有HPB主网资产，并想使用该资产所在账户，请查看{' '}
                    <ExternalLink
                      href="https:/www.baidu.com"
                      target="_blank"
                      style={{ color: 'white', textDecoration: 'underline' }}
                    >
                      教程
                    </ExternalLink>
                  </TYPE.body>
                  <TYPE.body>
                    如果您没有HPB主网资产或账户，请点击下发MetaMask
                    Connect，将会在您已有账户中生成HPB主网账户，两个账户共用相同地址和私钥
                  </TYPE.body>
                  <ButtonLight onClick={openWalletModal}>
                    <TYPE.white fontSize={14}>MetaMask Connect</TYPE.white>
                  </ButtonLight>
                </>
              )}
            </AutoRow>
          </AutoColumn>
        </ConfirmContainer>
      </Modal>
      <AdPlaceholder></AdPlaceholder>
      <SearchWrapper>
      <Search></Search>
      <TabWrapper>
        <StarIcon/>
        <AntdTabs activeKey={activeKey} defaultActiveKey={defaultActiveKey} onChange={handleTabChange}>
          {quoteList.map(quote => (
            <TabPane key={quote} tab={quote}>
            <TokenList tokens={symbolObj} tabKey={activeKey} quote={quote}></TokenList>
            </TabPane>
          ))}
        </AntdTabs>
      </TabWrapper>
      </SearchWrapper>
      <WalletWrapper>
        <WalletInfo>
          <Title>
            My Balance <ButtonText onClick={() => setIsOpen(true)}>Transfer</ButtonText>
          </Title>
          <SubTitle>
            {account && shortenAddress(account)}
            {account && (
                          <Copy toCopy={account}>
                            
                          </Copy>
                        )}
          </SubTitle>
        </WalletInfo>
        {
          (window.web3 || window.ethereum) && account ? 
          <WalletList>
          <Wallet/>
        </WalletList> :<NoNetwork>
              <FileIcon/>
              <ButtonCustom
              width="auto"
              padding="10px 16px"
              borderRadius="20px"
              border="none"
              onClick={toggleConfirmModal}>
                    {!(window.web3 || window.ethereum) ? 'Install MetaMask' : !account ? 'Connect to MetaMask' : ''}
              </ButtonCustom>
            </NoNetwork>
        }
        
        
      </WalletWrapper>
    </Wrapper>
  )
}

export default withRouter(Left)
