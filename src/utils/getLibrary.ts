import { Web3Provider, EtherscanProvider } from '@ethersproject/providers'

export default function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 15000
  return library
}

export function getEthLibrary(): EtherscanProvider {
  const library = new EtherscanProvider();
  library.pollingInterval = 15000
  return library
}
