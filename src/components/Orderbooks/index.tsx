import React, { useState } from 'react'
import styled from 'styled-components'
// import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'

import { Box, Flex, Text } from 'rebass'
// import TokenLogo from '../TokenLogo'
// import { CustomLink } from '../Link'
// import Row from '../Row'
// import { Divider } from '..'

import { formattedNum, formattedPercent } from '../../utils/formatter'

//import FormattedName from '../FormattedName'
// import { TYPE } from '../../Theme'
//import styles from './index.module.css';

// dayjs.extend(utc)



const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';
  height:28px;
  padding: 0 16px;
  margin:1px 0;
  background-repeat:no-repeat;
  background-size:0 0;
  background-position: 100%
  > * {
    justify-content: flex-end;
    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }
`

const ListWrapper = styled.div``

const ClickableText = styled(Text)`
  text-align: end;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: ${({ theme }) => theme.text2};

  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};
  font-size: 12px;
  letter-spacing: -0.14px;
  & > * {
    font-size: 12px;
    letter-spacing: -0.14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`


const SORT_FIELD = {
  LIQ: 'totalLiquidityUSD',
  VOL: 'oneDayVolumeUSD',
  SYMBOL: 'symbol',
  NAME: 'name',
  PRICE: 'priceUSD',
  CHANGE: 'priceChangeUSD'
}

// @TODO rework into virtualized list
function OrderBooks({ orders, itemMax = 10, hasheader , color, bgColor}: {
    orders: Array<any>
    itemMax?: number
    hasheader?: boolean
    color?: string
    bgColor?: string
  }) {
  // page state
  //const [page, setPage] = useState(1)
  // eslint-disable-next-line
  //const [maxPage, setMaxPage] = useState(1)

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.LIQ)

  // const below1080 = useMedia('(max-width: 1080px)')
  // const below680 = useMedia('(max-width: 680px)')
  // const below600 = useMedia('(max-width: 600px)')

  // useEffect(() => {
  //  // setMaxPage(1) // edit this to do modular
  //   setPage(1)
  // }, [orders])



//   useEffect(() => {
//     if (tokens && formattedTokens) {
//       let extraPages = 1
//       if (formattedTokens.length % itemMax === 0) {
//         extraPages = 0
//       }
//       setMaxPage(Math.floor(formattedTokens.length / itemMax) + extraPages)
//     }
//   }, [tokens, itemMax])

  

//   const filteredList = useMemo(() => {
//     return (
//       formattedTokens &&
//       formattedTokens
//         .sort((a, b) => {
//           if (sortedColumn === SORT_FIELD.SYMBOL || sortedColumn === SORT_FIELD.NAME) {
//             return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
//           }
//           return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
//             ? (sortDirection ? -1 : 1) * 1
//             : (sortDirection ? -1 : 1) * -1
//         })
//         .slice(itemMax * (page - 1), page * itemMax)
//     )
//   }, [formattedTokens, itemMax, page, sortDirection, sortedColumn])

  const ListItem = ({ item, tcolor="#C02464", bgColor="linear-gradient(rgba(192,36,100,0.31), rgba(192,36,100,0.31))"}:{item: any, tcolor?:string, bgColor?:string}) => {
    return (
      <DashGrid style={{backgroundImage: `${bgColor}`, backgroundSize: `${Math.floor((Math.random()*30))}% 100%`}}>
        <DataText style={{color:tcolor}}>
        11659.48
        </DataText>
        <DataText>
          {formattedNum(item.price, true) + "8"}
        </DataText>
        <DataText>
            {formattedPercent(item.percent_change_24h)}
        </DataText>
    </DashGrid>
    )
  }

  return (
    <ListWrapper>
        {
            hasheader ? <DashGrid  style={{ height: 'fit-content', padding: '0 16px 1rem 16px' }}>
            <Flex alignItems="center">
              <ClickableText
                onClick={e => {
                  setSortedColumn(SORT_FIELD.SYMBOL)
                  setSortDirection(sortedColumn !== SORT_FIELD.SYMBOL ? true : !sortDirection)
                }}
              >
                Price(USD) {sortedColumn === SORT_FIELD.SYMBOL ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
            <Flex alignItems="center">
              <ClickableText>
                Quantity
              </ClickableText>
            </Flex>
            <Flex alignItems="center">
              <ClickableText>
                Sum
              </ClickableText>
            </Flex>
          </DashGrid> : null
        }
      
      <List>
        {orders && orders.map((item:any, index:number) => {
            return (
              <div key={index}>
                <ListItem key={index} tcolor={color} bgColor={bgColor} item={item} />
              </div>
            )
          })}
      </List>
    </ListWrapper>
  )
}

export default OrderBooks
