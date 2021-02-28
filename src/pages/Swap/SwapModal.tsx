// @ts-nocheck
import React,{useState, useEffect, useCallback, useMemo} from 'react'
import styled from 'styled-components'
import { Currency} from '../../uniswap-sdk'
import NewModal from '../../components/Modal/NewModal'
import CurrencyLogo from '../../components/CurrencyLogo'
import {ButtonSubmit } from '../../components/Button'
import { useCurrency } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useActiveEthWeb3React} from '../../hooks/useEthContract'
import { Input as NumericalInput } from '../../components/NumericalInput'

import Web3 from 'web3'
import { Repeat, X} from 'react-feather'

import styles from './SwapModal.module.css'

const RepeatIcon = styled(Repeat)`
  height: 16px;
  width: 16px;
  color: ${({ theme }) => theme.text3};
  :hover {
    cursor: pointer;
  }
`
const CloseIcon = styled(X)`
  height: 15px;
  width: 15px;
  position: absolute;
  right: 17px;
  top:17px;
  color: ${({ theme }) => theme.text3};
  :hover {
    cursor: pointer;
  }
`
const Input = styled(NumericalInput)`
  border: 0;
  background-color: transparent;
  font-size: 14px;
  color: ${({ theme }) => theme.text6};
  padding: 0;
`

export default function SwapModal({ isOpen, onDismiss = () => {} }: { isOpen: boolean; onDismiss?: () => void }) {

  const [ETH, USDT] = [
    useCurrency("0xa2e01Daf42DDE593f6829b69e48C3002Bdb71f1a")!,
    useCurrency("0x34f9Ab9bF3C12e62259cf84117B8343F6a3C6707")!
  ]
  
  const { account, connector} = useActiveWeb3React()

  const { library: ethLibrary } = useActiveEthWeb3React()
  // const { library: hpbLibrary } = useActiveHPBWeb3React()

  // const [approval, approveCallback] = useTransactionCallback(undefined, "")
  const [ coin, setCoin ] = useState<Currency|null|undefined>(null)
  const [ from, setFrom ] = useState<Array<any>>(["ETH", "ETH Network"])
  const [ to, setTo ] = useState<Array<any>>(["HPB", "HPB Network"])
  const [ amount, setAmount ] = useState<any>()
  const [ web3jsInstance, setWeb3jsInstance ] = useState<Web3|null>(null)
  useEffect(() => {
    connector?.getProvider().then(provider => {
      // Instantiate web3.js
      console.log(provider)
      const instance = new Web3(provider)
      setWeb3jsInstance(instance)
    })
    console.log('connector",', connector)
    
  }, [account, connector])

  useEffect(() => {
    if(ETH && !coin){
      setCoin(ETH)
    }
    
  }, [ETH, coin])

  const handleChangeCoin = useCallback(() => {
    
    let newCoin = ETH
    if (coin?.symbol == newCoin?.symbol) {
      newCoin = USDT
    }
    setCoin(newCoin)
  }, [coin, ETH, USDT])

  const handleChange = useCallback(() => {
  })

  const onUserInput = useCallback((val) => {
    setAmount(val)
  },[amount])

  const gasfee = useMemo(()=>{
    if(!amount){
      return "---"
    }
  }, [amount])

  const balance = useMemo(()=>{
    if(!amount){
      return "---"
    }
  }, [amount])

  // const percentageChangeCallback = useCallback(
  //   value => {
  //     onUserInput(value)
  //   },
  //   [onUserInput]
  // )
  // const [percentage, setPercentage] = useDebouncedChangeHandler(Number.parseInt('0'), percentageChangeCallback)


  const handleRepeat = useCallback(() => {
    
    setFrom(to)
    setTo(from)
  }, [from, to])

  const onWithdraw = useCallback(async (): Promise<void> => {
    if(!ethLibrary){
      console.error('tokenContract is null')
      return
    }

    if(!account){
      console.error('tokenContract is null')
      return
    }

    //ethLibrary.sendTransaction()
      
    //   (web3jsInstance as Web3).eth.sendTransaction({
    //     to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
    //     value: '1000000000000000'
    // }, function(error, hash){
    //     console.log("error",error)
    //     console.log("hash",hash)
    //   })

  if(from[0]== "ETH"){
    window.web3.eth.sendTransaction({
      to: '0xE8f9111BA03CFFF83D95073c03F82196feE4a630',
      value: Web3.utils.toWei(amount, "ether")
  }, function(error, hash){
    console.log("error",error)
    console.log("hash",hash)
  })
}else{

  var ERC20ABI = [{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];
var ETHAddr = '0x06546132e85212c0A8581895070ae29ca5cC5236';
var webHPB = new Web3('https://node.hpb.io');
var ETHToken = new webHPB.eth.Contract(ERC20ABI, ETHAddr);



var txParameters = {
  //nonce: 139, // ignored by MetaMask
  //gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
  //gas: '0x2710', // customizable by user during MetaMask confirmation.
  to:ETHAddr, // Required except during contract publications.
  from: ethereum.selectedAddress, // must match user's active address.
  value: '0x00', // Only required to send ether to the recipient from the initiating external account.
  data:
  ETHToken.methods.transfer('0xE8f9111BA03CFFF83D95073c03F82196feE4a630', webHPB.utils.toBN(Web3.utils.toWei(amount, "ether"))).encodeABI(), // Optional, but used for defining smart contract creation and interaction.
};
var txHash = await ethereum.request({
  method: 'eth_sendTransaction',
  params: [txParameters]
});
}
  },[amount, web3jsInstance, from])
  

  return (
    <NewModal isOpen={isOpen} onDismiss={onDismiss}>
      <div className={styles.modal}>
        <CloseIcon onClick={onDismiss}/>
        <h3 className={styles.title}>Funds transfer</h3>
        <div className={styles.itemlabel}>
          coin
        </div>
        <div style={{ display: 'flex'}}>
          <span className={styles.inputAffixWrapper}>
            <span className={styles.inputPrefix}>
              <CurrencyLogo currency={coin} size={'14px'} />
            </span>
            <input type="text" className={styles.coin} value={coin?.symbol} readOnly={true} onClick={handleChangeCoin}/>
            <span className={styles.inputsuffix} onClick={handleChangeCoin}>
              <CurrencyLogo currency={coin} size={'14px'} />
            </span>
          </span>
        </div>
        
        <div className={styles.networkWrapper}>
          <div className={styles.networkLeft}>
            <div className={styles.network}>
              <span className={styles.prefix}>From</span><span className={styles.item}>{from[1]}</span>
              </div>
            <div className={styles.network}>
              <span className={styles.prefix}>To</span><span className={styles.item}>{to[1]}</span>
              </div>
          </div>
          <div className={styles.networkRight} >
            <RepeatIcon onClick={handleRepeat}/>
          </div>
        </div>
        <div className="">
        <div className={styles.itemlabel}>Amount</div>
        <div>
          <span className={styles.inputAffixWrapper}>
            <Input
              className={styles.coin}
              value={amount}
              onUserInput={val => {
                onUserInput(val)
              }}
            />
            <span className={styles.inputsuffix}>
              <div className={styles.unit}>ETH</div>
              <button className={styles.allin}>All in</button>
            </span>
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px'}}>
          <span>gas费: {gasfee}</span>
            <span>最多可转: {balance}ETH</span>
        </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px'}}>
          <ButtonSubmit onClick={()=>onWithdraw(account)} >确定</ButtonSubmit>
        </div>
      </div>
    </NewModal>
  )
}
