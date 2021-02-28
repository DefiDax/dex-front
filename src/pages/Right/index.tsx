import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'
import Column, { ColumnCenter, AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ButtonLight, ButtonText } from '../../components/Button'
import FormattedName from '../../components/FormattedName'
import Modal from '../../components/Modal'
import TokenLogo from '../../components/TokenLogo'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TYPE, ExternalLink } from '../../theme'
import { formattedNum } from '../../utils/formatter'
import { useActiveHPBWeb3React, useActiveWeb3React } from '../../hooks'
import { formatEther } from '@ethersproject/units'
import { useActiveEthWeb3React, useEthContract} from '../../hooks/useEthContract'
import SwapModal from '../Swap/SwapModal'
import ERC20_ABI from '../../constants/abis/erc20.json'
import { useBalances } from '../../hooks/Balance'

import { hpbTokenList } from '../../data/assets'
import { USDT, NEST, HPB} from '../../data/EthAssts'

const Wrapper = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.bg6};
  color: ${({ theme }) => theme.text1};
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 10px;
`

const Title = styled.div`
  width: 100%;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
  align-self: flex-start;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SubTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
  margin: 12px 0;
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'name val';
  padding: 0 1.125rem;
  > * {
    justify-content: flex-start;
    &:first-child {
      justify-contnet: flex-start;
      text-align: left;
      width: 20px;
    }
  }
`

const DataText = styled(Flex)<{ area: string }>`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const ConfirmContainer = styled.div`
  max-width: 420px;
  width: 100%;
  padding: 2rem;
  border-radius: 20px;
  overflow: auto;
`

const ListItem = ({ item }: any) => {
  return (
    <DashGrid style={{ height: '48px' }}>
      <DataText area="name">
        <TokenLogo address={item.name} />
        <FormattedName text={item.name} maxCharacters={5} style={{ marginLeft: '16px' }} />
      </DataText>
      <DataText area="val">{formattedNum(item.value)}</DataText>
    </DashGrid>
  )
}
// ETH 合约币
//const JFC = '0x44D87E360352a8A706b1F79907450C789a5E6991'

function Right() {
  const { account } = useActiveWeb3React()

  const { library: ethLibrary } = useActiveEthWeb3React()
  const { library: hpbLibrary } = useActiveHPBWeb3React()

  const [ethBalance, setEthBalance] = useState<any>()
  const [openModal, setOpenModal] = useState(false)

  // 查询我的资产，那么就需要我的账户，当前 connect 的网络是谁的？
  // ETH 主网资产
  useEffect((): any => {
    if (!!account && !!ethLibrary) {
      let stale = false
      // 读取主网资产
      ethLibrary
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setEthBalance(balance)
          }
        })
        .catch(() => {
          if (!stale) {
            setEthBalance(null)
          }
        })
      return () => {
        stale = true
        setEthBalance(undefined)
      }
    }
  }, [account, ethLibrary])
  // ETH 主网合约币资产

  const [ethUsdtBalance, setEthUsdtBalance] = useState<any>()
  const [ethHpbBalance, setEthHpbBalance] = useState<any>()
  const [ethNestBalance, setEthNestBalance] = useState<any>()

  //const jfcContract = useEthContract(JFC, ERC20_ABI)
  const usdtContract = useEthContract(USDT, ERC20_ABI)
  const hpbContract = useEthContract(HPB, ERC20_ABI)
  const nestContract = useEthContract(NEST, ERC20_ABI)

  // useEffect(() => {
  //   if (jfcContract) {
  //     console.log('jfc', jfcContract)
  //     jfcContract.balanceOf(account).then((a: any) => { setjfcBalance(a) }).catch((error: any) => console.log(error));
  //   }
  // }, [jfcContract, account])

  useEffect(() => {
    if (usdtContract) {
      usdtContract.balanceOf(account).then((a: any) => {setEthUsdtBalance(a)}).catch((error: any) => console.log(error));
    }
  }, [usdtContract, account])

  useEffect(() => {
    if (hpbContract) {
      hpbContract.balanceOf(account).then((a: any) => {setEthHpbBalance(a)}).catch((error: any) => console.log(error));
    }
  }, [hpbContract, account])

  useEffect(() => {
    if (nestContract) {
      nestContract.balanceOf(account).then((a: any) => {setEthNestBalance(a)}).catch((error: any) => console.log(error));
    }
  }, [nestContract, account])


  //const ethAddresses = useMemo(() => ethTokenList.map(entry => entry[1]), [ethTokenList])
  //const allEthBalances = useBalances(account, ethAddresses)


  // HPB 主网资产
  const [hpbBalance, setHpbBalance] = useState<any>()
  useEffect((): any => {
    if (!!account && !!hpbLibrary) {
      let stale = false
      // 读取主网资产
      hpbLibrary
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setHpbBalance(balance)
          }
        })
        .catch(() => {
          if (!stale) {
            setHpbBalance(null)
          }
        })
      return () => {
        stale = true
        setHpbBalance(undefined)
      }
    }
  }, [account, hpbLibrary])
  const hpbAddresses = useMemo(() => hpbTokenList.map(entry => entry[1]), [hpbTokenList])
  const allBalances = useBalances(account, hpbAddresses)

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
    <>
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
      <Wrapper>
        <Column style={{ flex: 1 }}>
          <Title>委托订单</Title>
          <ColumnCenter style={{ color: '#fff' }}>开发中</ColumnCenter>
        </Column>
        <Column>
          <Title>
            My Balance <ButtonText onClick={() => setIsOpen(true)}>划转</ButtonText>
          </Title>
          <AutoColumn>
            {account ? (
              <>
                <div>
                  <SubTitle>ETH主网资产</SubTitle>
                  <List>
                    <ListItem
                      item={{
                        name: 'ETH',
                        value: ethBalance === null ? 'Error' : ethBalance ? `${formatEther(ethBalance!)}` : '',
                        id: "0xa2e01Daf42DDE593f6829b69e48C3002Bdb71f1a"
                      }}
                    ></ListItem>
                    <ListItem
                      item={{
                        name: 'HPB',
                        value: ethHpbBalance === null ? 'Error' : ethHpbBalance ? `${formatEther(ethHpbBalance!)}` : ''
                      }}
                    ></ListItem>
                    <ListItem
                      item={{
                        name: 'USDT',
                        value: ethUsdtBalance === null ? 'Error' : ethUsdtBalance ? `${formatEther(ethUsdtBalance!)}` : ''
                      }}
                    ></ListItem>
                    <ListItem
                      item={{
                        name: 'NEST',
                        value: ethNestBalance === null ? 'Error' : ethNestBalance ? `${formatEther(ethNestBalance!)}` : ''
                      }}
                    ></ListItem>
                    {/* {(ethTokenList || []).map(entry => (
                        <ListItem key={entry[0]} item={{ name: entry[0], value: allEthBalances[entry[1]] ? `${formatEther(allEthBalances[entry[1]])}` : '' }} />
                    ))} */}
                  </List>
                </div>
                <div>
                  <SubTitle>HPB主网资产</SubTitle>
                  <List>
                    <ListItem item={{ name: 'HPB', value: hpbBalance ? `${formatEther(hpbBalance)}` : '' }} />
                    {(hpbTokenList || []).map(entry => (
                        <ListItem key={entry[0]} item={{ name: entry[0], value: allBalances[entry[1]] ? `${formatEther(allBalances[entry[1]])}` : '' }} />
                    ))}
                  </List>
                </div>
              </>
            ) : (
                <ButtonLight onClick={toggleConfirmModal}>
                    {!(window.web3 || window.ethereum) ? 'Install MetaMask' : !account ? 'Connect to MetaMask' : ''}
                </ButtonLight>
            )}
          </AutoColumn>
        </Column>
      </Wrapper>
    </>
  )
}

export default Right
