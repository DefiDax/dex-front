// import { MaxUint256 } from '@ethersproject/constants'
//import { TransactionResponse } from '@ethersproject/providers'
// import Web3 from "web3";
import {CurrencyAmount, TokenAmount} from '../uniswap-sdk'
import { useCallback, useMemo} from 'react'
import { useTokenContract } from './useContract'
import { useActiveEthWeb3React} from './useEthContract'
import { useActiveWeb3React } from './index'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// // returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useTransactionCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const { library: ethLibrary } = useActiveEthWeb3React()
  
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const tokenContract = useTokenContract("0xB8d22D1A950CD52897b8687F6bc13898F6f0F6Cc")

// //   const pendingApproval = useHasPendingApproval(token?.address, spender)

//   // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {

    return ApprovalState.PENDING
  }, [])

  const sendTransaction = useCallback(async (): Promise<void> => {
    if (!tokenContract) {
        console.error('tokenContract is null')
        return
    }
    if (!ethLibrary) {
      console.error('no ethLibrary')
      return
    }

      const fromMe = tokenContract.filters.Transfer(account, null)
      console.log(fromMe)
      console.log(token)
      //ethLibrary.sendTransaction()
  }, [approvalState])

   return [approvalState, sendTransaction]
}
