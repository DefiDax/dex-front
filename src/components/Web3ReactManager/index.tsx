import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { network, hpbNetwork } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import { NetworkContextName, EthContextName, HPBContextName } from '../../constants'
import Loader from '../Loader'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { t } = useTranslation()
  const { active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)
  const { active: ethActive, error: ethError, activate: activateEth } = useWeb3React(EthContextName)
  const { active: hpbActive, error: hpbError, activate: activateHpb } = useWeb3React(HPBContextName)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // 激活 NetworkProvider 这个是当前主网的替补
  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network) // NOTE 注意这里是限制的在 Web3Provider 没有连上时使用，但是 Web3ProviderNetwork 并没有使用它！！！
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // NOTE 激活ETH
  useEffect(() => {
    if (!ethActive && !ethError) {
      activateEth(network)
    }
  }, [ethActive, ethError])

  // NOTE 激活 HPB
    useEffect(() => {
        if (!ethActive && !ethError) {
            activateHpb(hpbNetwork)
        }
    }, [hpbActive, hpbError])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <MessageWrapper>
        <Message>{t('unknownError')}</Message>
      </MessageWrapper>
    )
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <MessageWrapper>
        <Loader />
      </MessageWrapper>
    ) : null
  }

  return children
}
