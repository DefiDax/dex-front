import { Web3Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { ChainId, CurrencyAmount, JSBI } from '@uniswap/sdk'
import { EthContextName, HPBContextName } from '../constants'
import { getContract, isAddress } from '../utils'
import { useWeb3React } from '@web3-react/core'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useSingleContractMultipleData } from '../state/multicall/hooks'
import ERC20_ABI from '../constants/abis/erc20.json'
// import { formatEther } from '@ethersproject/units'

export function useActiveEthWeb3React(
  key?: string | undefined
): Web3ReactContextInterface<Web3Provider> & { chainId?: ChainId } {
  const context = useWeb3React<Web3Provider>(key ?? EthContextName)
  return context
}

export function useActiveHPBWeb3React(): Web3ReactContextInterface<Web3Provider> & { chainId?: ChainId } {
  const context = useWeb3React<Web3Provider>(HPBContextName)
  return context
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useEthContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useHPBContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { account } = useWeb3React()
  const { library } = useActiveHPBWeb3React()
  return useMemo(() => {
    if (!address || !ABI || !library) return null

    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.log('Failed to get eth contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useEthContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { account } = useWeb3React()
  const { library } = useActiveEthWeb3React()
  return useMemo(() => {
    if (!address || !ABI || !library) return null

    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.log('Failed to get eth contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useEthMulticallContract(): Contract | null {
  const { chainId } = useActiveEthWeb3React(EthContextName)
  // console.log('useEthMulticallContract', chainId, library)
  // library?.getBalance('0x81102E60aF7A8C72E0219AA71762C297dCa6FEE8')
  // .then((balance: any) => {
  //   console.log('=================== balance', formatEther(balance))
  // })
  return useEthContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useEthBalances(
  uncheckedAddresses?: (string | undefined)[]
): { [address: string]: CurrencyAmount | undefined } {
  const multicallContract = useEthMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) {
          memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()))
        }
        return memo
      }, {}),
    [addresses, results]
  )
}
