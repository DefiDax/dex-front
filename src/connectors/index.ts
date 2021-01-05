import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

const HPB_CHAIN_ID = 269
const HPB_NETWORK_URL = 'https://node.hpb.io'

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

// NOTE 始终连接主网？
export const network = new NetworkConnector({
  urls: {
    [NETWORK_CHAIN_ID]: NETWORK_URL,
  },
})

export const hpbNetwork = new NetworkConnector({
  urls: {
    [HPB_CHAIN_ID]: HPB_NETWORK_URL
  }
})
// 使用这个 getNetworkLibrary 是不是更合适，直接提供给 NetworkContextProvider
let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

let hpbNetworkLibrary: Web3Provider | undefined
export function getHpbNetworkLibrary(): Web3Provider {
  return (hpbNetworkLibrary = hpbNetworkLibrary ?? new Web3Provider(hpbNetwork.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 269]
})

// FIXME https://github.com/NoahZinsmeister/web3-react/issues/73 TODO 等 bug 修复后可以更新 web3-react 的版本
//Patch chainChanged 0xNaN
//@ts-ignore
injected.handleNetworkChanged = (networkId: string | number) => {
  console.debug("Handling 'networkChanged' event with payload", networkId)
  if (networkId === "loading") return; //Ignore loading, networkId as causes errors
  //@ts-ignore
  injected.emitUpdate({ chainId: networkId, provider: window.ethereum })
}

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1]
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'Uniswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
})
