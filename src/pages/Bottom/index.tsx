// @ts-nocheck
import React from 'react'
import styled from 'styled-components'


const Wrapper = styled.div`
  height: 100%;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg9};
  flex-direction: column;
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 3;
  align-items: center;
  margin:0 5px;
`
const NoNetwork = styled.div`
  display: flex;
  flex-direction: column;
  justify-content:center;
  width: 100%;
  height: 305px;
  align-items: center;
`

function Bottom() {

    return (
      <Wrapper>
        <NoNetwork>
          Connect the wallet for Exchange
        </NoNetwork>
            
      </Wrapper>
    )
  }
  
  export default Bottom