import { useMemo } from 'react'
import { isAddress } from '../utils'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import ERC20_INTERFACE from '../constants/abis/erc20'

export function useBalances(
    account?: string | null,
    uncheckedAddresses?: (string | undefined)[]
): { [address: string]: any } {
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
    const accountArg = useMemo(() => [account ?? undefined], [account])
    const results = useMultipleContractSingleData(addresses, ERC20_INTERFACE, 'balanceOf', accountArg)
    return useMemo(
        () => addresses.reduce<{ [address: string]: any}>((memo, address, i) => {
            const value = results?.[i]?.result?.[0]
            if (value) {
                memo[address] = value
            }
            return memo
        }, {}),
        [addresses, results]
    )
}
