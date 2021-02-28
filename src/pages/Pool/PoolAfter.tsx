import React, {  } from 'react'
import styled, {  } from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {ButtonLight} from '../../components/Button'
import Fire from '../../assets/images/fire.png'
import Table from 'rc-table'


const PageWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding-bottom: 40px;
`

const Wrapper = styled.div`
  text-align: left;
  h3 {
    font-family: PingFangSC-Medium;
    font-size: 36px;
    color: #151531;
    letter-spacing: -0.42px;
    margin-bottom: 0;
  }
  p {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #9C9CB2;
    line-height: 17px;
  }
`

const CardWrapper = styled.div`

`

const CardItem = styled.div`

`

const TableWrapper = styled.div`
  padding: 26px 0;
  background: #fff;
  h3 {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #151531;
    letter-spacing: -0.19px;
    border-bottom: 1px solid #D5DAE7;
    padding: 0 0 11px 37px;
  }
`

const AntdTable = styled(Table)`
  padding: 0 12px;
  .rc-table {
    
    &-container{

    }
    &-content{

    }
    &-thead{
      .rc-table-cell{
        text-align:right;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #9C9CB2;
        letter-spacing: -0.15px;
      }
      .firstClm {
        text-align:left;
      }
    }
    &-tbody{
      .rc-table-cell{
        text-align:right;
        padding:20px 0;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #151531;
        letter-spacing: 0;
        line-height: 14px;
      }
      .firstClm {
        text-align:left;
      }
      .rc-table-cell.operation{
        display: flex;
        text-align:right;
        justify-content:flex-end;
      }
    }

    &-row{
      .addButton{
        
      }
    }

  }
`

const poolColumns = [
  {
    title: 'Pairs',
    dataIndex: 'pairs',
    key: 'pairs',
    width: 200,
    className:'firstClm',
    render: (text:any, record:any, index:any) => {
      const color = index <=2 ? '' : '#4A4A68'
      return (
        <div >
          {index<3 ? (
            <span style={{display: 'inline-block', width: '35px' }}><img width="21px" height="21px" src={Fire} alt=""/></span>
          ) : (
            <span style={{display: 'inline-block', width: '35px' }}></span>
          )}
          <span style={{ color }}>{index+1}.</span>
          <span>{text}</span>
        </div>
      )
    }
  },
  {
    title: 'Liquidity',
    dataIndex: 'liquidity',
    key: 'liquidity',
    width: 300
  },
  {
    title: 'Volume(24H)',
    dataIndex: 'volume1',
    key: 'volume1',
    width: 300
  },
  {
    title: 'Fee(24H)',
    dataIndex: 'fee',
    key: 'fee',
    width: 300
  },
  {
    title: 'My Fee/Liquidity',
    dataIndex: 'percent',
    key: 'percent',
    width: 300,
    render: (text:any) => {
      const color = text>=0 ? '#88A640' : '#C02464';
      const perTxt = text>=0 ? `+${text}%` : `${text}%`;
      return ( <span style={{ color }}>{perTxt}</span> )
    }
  },
  {
    title: 'Add Pool',
    dataIndex: 'action',
    key: 'action',
    className:'operation',
    width: 300,
    render() {
      return <ButtonLight style={{background: "#347CF3", borderRadius: "2px", color: "#FFFFFF", width:"fit-content", fontSize:'14px', padding:'6px 12px'}}>+Add</ButtonLight>;
    },
  }
]

const data = {
  poolData: [
    {
      id: 1,
      pairs: 'WBTC/ETH',
      liquidity: '$727.11m',
      volume1:'$5,274,495',
      fee: '$5,274,495',
      percent: 0.79
    },
    {
      id: 2,
      pairs: 'WBTC/ETH',
      liquidity: '$727.11m',
      volume1:'$5,274,495',
      fee: '$5,274,495',
      percent: 0.79
    },
    {
      id: 3,
      pairs: 'WBTC/ETH',
      liquidity: '$727.11m',
      volume1:'$5,274,495',
      fee: '$5,274,495',
      percent: 0.79
    },
    {
      id: 4,
      pairs: 'WBTC/ETH',
      liquidity: '$727.11m',
      volume1:'$5,274,495',
      fee: '$5,274,495',
      percent: -0.79
    }
  ],
  cardData: [

  ]
}

export default function PoolAfter() {

  return (
    <>
      <PerfectScrollbar>
        <PageWrapper>
          <Wrapper>
            <h3>Your Liquidity </h3>
            <p>Liquidity providers earn a <span style={{ fontSize: 12, color: '#347CF3' }}>0.25%</span> fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.</p>
          </Wrapper>
          <CardWrapper>
            {data.cardData.map( item => <CardItem>

            </CardItem> )}
          </CardWrapper>
          <TableWrapper>
            <h3 >Top Pairs</h3>
            <AntdTable 
              rowKey='id'
              columns={poolColumns} 
              data={data.poolData} 
            />
          </TableWrapper>
        </PageWrapper>
      </PerfectScrollbar>
    </>
  )
}
