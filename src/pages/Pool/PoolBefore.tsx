import React, {  } from 'react'
import styled, {  } from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {ButtonLight} from '../../components/Button'
import PoolBg from '../../assets/images/pool-background.png'
import PoolTitle from '../../assets/images/pool-title-bg.png'
import PoolDot from '../../assets/images/pool-dot.png'
import PoolLeft from '../../assets/images/pool-left.png'
import PoolRight from '../../assets/images/pool-right.png'
import Fire from '../../assets/images/fire.png'
import Table from 'rc-table'

const PageWrapper = styled.div`
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
`

const Wrapper = styled.div`
  text-align: center;
  padding-top: 86px;
  position: relative;
  .imgStyle {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  h3 {
    font-family: PingFangSC-Semibold;
    font-size: 32px;
    color: #FFFFFF;
    letter-spacing: -0.37px;
    margin-top: 0;
  }
  p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #EAEBF4;
    letter-spacing: -0.21px;
    line-height: 32px;
  }
  .poolTitle {
    display: flex;
    align-items: center;
    justify-content: center;
    .tTxt {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #FFFFFF;
      letter-spacing: 0;
    }
  }
`

const AntdTable = styled(Table)`
  border: 1px solid #3E3F4E;
  border-radius: 2px;
  padding: 31px 18px;
  .rc-table {
    
    &-container{

    }
    &-content{

    }
    &-thead{
      .rc-table-cell{
        text-align:right;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9C9CB2;
        letter-spacing: 0;
      }
      .firstClm {
        text-align:left;
      }
    }
    &-tbody{
      .rc-table-cell{
        text-align:right;
        padding:20px 0;
        font-family: Avenir-Book;
        font-size: 14px;
        color: #EAEBF4;
        letter-spacing: 0;
        border-top: 1px solid #2D2E3C;
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
      const color = index <3 ? '' : '#4A4A68'
      return (
        <div>
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
      return <ButtonLight style={{background: "#6096EF", borderRadius: "2px", width:'80px', color: "#FFFFFF", fontSize:'14px', padding:'6px 20px'}}>+Add</ButtonLight>;
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
  ]
}

export default function PoolBefore() {

  return (
    <>
      <PerfectScrollbar>
        <PageWrapper>
          <Wrapper>
            <div className="imgStyle" ><img width="100%" src={PoolBg}/></div>
            <h3>Liquidity Provider Rewards</h3>
            <p>Liquidity providers earn a <span style={{ fontSize: 18, color: '#6096EF' }}>0.25%</span> fee on all trades proportional to their share of the pool. Fees are added to the pool, </p>
            <p>accrue in real time and can be claimed by withdrawing your liquidity.</p>
            <div className="poolTitle" style={{ width: '100%', height: '120px',background: `url(${PoolTitle})`, backgroundSize: '100% 100%' }}>
              <span><img width="208px" src={PoolLeft} /></span>
              <span style={{ margin: '0 20px' }}><img width="8.5px" height='8.5px' src={PoolDot} /></span>
              <span className="tTxt">Top Pairs</span>
              <span style={{ margin: '0 20px' }}><img width="8.5px" height='8.5px' src={PoolDot} /></span>
              <span><img width="208px" src={PoolRight} /></span>
            </div>
          </Wrapper>
          <AntdTable 
            rowKey='id'
            columns={poolColumns} 
            data={data.poolData} 
          />
        </PageWrapper>
      </PerfectScrollbar>
    </>
  )
}
