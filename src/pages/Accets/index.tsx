import React, {useEffect, useContext, useState, useCallback} from 'react'
import styled, {ThemeContext} from 'styled-components'
import Tabs, { TabPane } from 'rc-tabs'
import Table from 'rc-table'
import { useActiveWeb3React } from '../../hooks'
import { shortenAddress } from '../../utils'
import Copy from '../../components/AccountDetails/Copy'
import {ButtonLight} from '../../components/Button'
import TokenLogo from '../../components/TokenLogo'
//import TokenList from '../../components/TokenList'
//import List from '../../components/List'

import { useFetchSymbolsCallback } from '../../hooks/useFetchSymbolsCallback'

const Wrapper = styled.div`
  width: 1200px;
  height: 100%;
  color: #9c9cb2;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
`
const CopyWrapper = styled.div`
  height: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  flex-flow: row nowrap;
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
      margin: 0 0 16px;
      ::before {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        border-bottom: 1px solid #D5DAE7;
        content: '';
      }
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
      position: relative;
      display: inline-flex;
      align-items: center;
      margin: 0 32px 0 0;
      padding: 12px 0;
      font-size: 14px;
      background: 0 0;
      border: 0;
      outline: none;
      cursor: pointer;
      color: #9C9CB2;
      &-btn {
        outline: none;
        :focus,
        :active {
          color: #9C9CB2;
        }
      }
    }
    &-tab-active {
      .rc-tabs-tab-btn {
        color: #161632;
      }
    }
    &-ink-bar {
      position: absolute;
      background: #1890ff;
      pointer-events: none;
      height: 2px;
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

const AntdTable = styled(Table)`
  .rc-table {
    color: #000;
    &-container{

    }
    &-content{

    }
    &-thead{
      .rc-table-cell{
        text-align:left;
        font-size: 12px;
        color: #9C9CB2;
      }
      .operation{
        text-align:right;
      }
    }
    &-tbody{
      .rc-table-cell{
        text-align:left;
        color: #151531;
        font-size:14px;
        padding:20px 0;
      }
      .rc-table-cell.operation{
        display: flex;
        text-align:right;
        justify-content:flex-end;
      }
    }

    &-row{
      .tokenItem{
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .tokenText{
          flex-direction:column;
          margin-left:8px;
        }
      }
    }

  }
`

const MyWalletColumns = [
  {
    title: 'Token',
    dataIndex: 'token',
    key: 'token',
    className:'first',
    width: 300,
    render: (text:any) => 
      <><div className="tokenItem">
        <TokenLogo address={text} size="14px"/>
        <div className="tokenText">{text}</div>
        </div></>,
  },
  {
    title: 'ETH Network Assets',
    dataIndex: 'eth',
    key: 'eth',
    width: 300,
  },
  {
    title: 'HPB Network Assets',
    dataIndex: 'hpb',
    key: 'hpb',
    width: 300,
  },
  {
    title: 'Operation',
    dataIndex: 'operation',
    className:'operation',
    key: 'x',
    render() {
      return <ButtonLight style={{background: "#347CF3", borderRadius: "2px", color: "#FFFFFF", width:"fit-content", fontSize:'14px', padding:'6px 12px'}}>Operations</ButtonLight>;
    },
    width: 300,
  },
];

const TransferRecordColumns = [
  {
    title: 'Token',
    dataIndex: 'token',
    key: 'token',
    className:'first',
    width: 100,
    render: (text:any) => 
      <><div className="tokenItem">
        <TokenLogo address={text} size="14px"/>
        <div className="tokenText">{text}</div>
        </div></>,
  },
  {
    title: 'From - To',
    dataIndex: 'to',
    key: 'to',
    width: 450,
    render: (text:any,record:any) => 
    <><div className="tokenItem">
      <div>{record.from}</div>
      <div>-&gt;</div>
      <div className="tokenText">{text}</div>
      </div></>,
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    width: 150,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: 100,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render(text:any) {
      return (
        <>
        {
          text == 'Processing' ? <div style={{color:'#2C7AF9'}}>{text}</div>:
          <div style={{color:'#9C9CB2'}}>{text}</div>
        }
        </>
      );
    },
  },
  {
    title: 'ETH TXID / HPB TXID',
    dataIndex: 'eth_txid',
    className:'operation',
    key: 'x',
    render(text:any,record:any) {
      return (
        <div style={{color:'#2C7AF9'}}>
        {
          text ? "X06666…9786":<span style={{color:'#9C9CB2'}}>Not Available</span>
        }
        <span style={{padding:"0 2px"}}>/</span>
        {
          record.hpb_txid ? "X06666…9786": <span style={{color:'#9C9CB2'}}>Not Available</span>
        }
        </div>
      );
    },
    width: 300,
  },
];

function Accets(){
    const theme = useContext(ThemeContext)

    const { account } = useActiveWeb3React()
    const defaultActiveKey = 'TransferRecord'
    const [activeKey, setActiveKey] = useState<any>(defaultActiveKey)
    const fetchSymbols = useFetchSymbolsCallback()

    useEffect(() => {
        fetchSymbols()
        console.log(theme)
          // .then(data => console.log('symbol', data))
      }, [fetchSymbols])
      //const symbolObj = useSymbolObj(activeKey)


    const handleTabChange = useCallback(key => {
        setActiveKey(key)
      }, [])

      const data = {
        "MyWallet":[{
          token: 'ETH',
          eth: '435,364.56',
          hpb:'435,364.56'
        }],
        "TransferRecord":[
          {
          token: 'ETH',
          from: 'ETH Network Assets',
          to:'HPB Network Assets',
          time:'2020/10/21 10:32:42',
          amount:'435,364.56',
          status:'Completed',
          eth_txid:'X06666…9786',
          hpb_txid:'X06666…9786'
        },
        {
          token: 'HPB',
          from: 'ETH Network Assets',
          to:'HPB Network Assets',
          time:'2020/10/21 10:32:42',
          amount:'435,364.56',
          status:'Processing',
          eth_txid:'X06666…9786',
          hpb_txid:''
        }
      ],
      }


    return <Wrapper>
    {/* <AdPlaceholder></AdPlaceholder> */}
    <div>
      <h1 style={{color:'#151531'}}>My Wallet Account </h1>
      <CopyWrapper>
      
      {account && (
        <>
          <div style={{display:"flex"}}>{shortenAddress(account)}</div>
          <Copy toCopy={account} />
        </>
      )}
      </CopyWrapper>
    </div>
    <AntdTabs activeKey={activeKey} defaultActiveKey={defaultActiveKey} onChange={handleTabChange}>
      
        <TabPane key="MyWallet" tab="My Wallet">
          <div></div>
          {/* <TokenList tokens={symbolObj} tabKey={activeKey} quote={quote}></TokenList> */}
          
          <AntdTable columns={MyWalletColumns} data={data.MyWallet} />
        </TabPane>
        <TabPane key="TransferRecord" tab="Transfer Record">
          {/* <TokenList tokens={symbolObj} tabKey={activeKey} quote={quote}></TokenList> */}
          <AntdTable columns={TransferRecordColumns} data={data.TransferRecord} />
        </TabPane>
      
    </AntdTabs>
  </Wrapper>

}


export default Accets