import React, { useState} from 'react'
import styled from 'styled-components'
//import { Flex } from 'rebass'
import Column from '../../components/Column'
//import FormattedName from '../../components/FormattedName'
// import { TYPE, ExternalLink } from '../../theme'
//import { formattedNum } from '../../utils/formatter'
//import { useActiveWeb3React } from '../../hooks'
//import { formatEther } from '@ethersproject/units'
//import { useBalances } from '../../hooks/Balance'

import { hpbTokenList } from '../../data/assets'
import Orderbooks from '../../components/Orderbooks'
import styles from './ModRight.module.css'

const Wrapper = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.bg9};
  color: ${({ theme }) => theme.text1};
  padding-top: 0.5rem;
  margin-right:5px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const ModHeader = styled.div`
  width: 100%;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
  align-self: flex-start;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 
`

const OrderBooks = styled.div`
  display: flex;
  flex-align: center;
  align-items: center;
  position: relative;
  padding-left:16px;
`
const OrderBookIcon = styled.div`
    border: none;
    position: relative;
    display: inline-block;
    border-radius: 2px;
    width: 24px;
    height: 24px;
    margin-right: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all .15s;
`

const ModBody = styled.div`
  letter-spacing: -0.14px;
  text-align: center;
  line-height: 14px;
`
const BuyWapper = styled.div`
  min-height:462px;
`


const LatestPriceWapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.text7};
  height: 78px;
  padding: 10px 16px;
  margin-bottom: 19px;
  background: #1E1E27;
`

function PriceRight() {
//  const { account } = useActiveWeb3React()

  const [mod] = useState(0)

//   const { library: ethLibrary } = useActiveEthWeb3React()
//   const { library: hpbLibrary } = useActiveHPBWeb3React()

  // const hpbAddresses = useMemo(() => hpbTokenList.map(entry => entry[1]), [hpbTokenList])
  // const allBalances = useBalances(account, hpbAddresses)

  return (
    <>
      <Wrapper>
        <Column style={{ flex: 1 }}>
          <ModHeader>
            <OrderBooks>
              <OrderBookIcon className={mod == 0 ? styles.cur : ''} style={{background:"linear-gradient(#C02464, #C02464) left top no-repeat,linear-gradient(#88A640, #88A640) left bottom no-repeat",
  backgroundSize:"auto 50%"}}>
                <span style={{display:'none'}}>买卖</span>
              </OrderBookIcon>
              <OrderBookIcon style={{background: "#7D2F4F"}}>
                <span style={{display:'none'}}>买</span>
              </OrderBookIcon>
              <OrderBookIcon style={{background: "#596D29"}}>
                <span style={{display:'none'}}>卖</span>
              </OrderBookIcon>
            </OrderBooks>
          </ModHeader>
          <ModBody>
            <BuyWapper>
              <Orderbooks orders={hpbTokenList} hasheader={true} color="#C02464"/>
            </BuyWapper>
            
            <LatestPriceWapper>
                <div className={styles.latestPrice}>
                    <div className={styles.title}>Latest Price </div>
                    <div style={{color:"#C02464", fontSize:"16px", lineHeight:"22px"}}>0.058732 </div>
                    <div>≈,453.45USD</div>
                </div>
                <div className={styles.latestPriceIndex}>
                    <div className={styles.title}>Index </div>
                    <div style={{fontSize:"16px", lineHeight:"22px"}}>0.058732 </div>
                    <div>≈,453.45USD</div>
                </div>
            </LatestPriceWapper>
            <Orderbooks orders={hpbTokenList} hasheader={false} color="#88A640" bgColor="linear-gradient(rgba(136,166,64,0.54),rgba(136,166,64,0.54))"/>
          </ModBody>
        </Column>
        
      </Wrapper>
    </>
  )
}

export default PriceRight
