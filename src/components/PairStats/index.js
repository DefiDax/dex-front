import React from 'react';
import { GreyCard } from '../Card';
import { TYPE } from '../../theme';
import { ButtonLight } from '../Button';

function PairStats() {
  // const theme = useContext(ThemeContext)

    return (
        <GreyCard padding="40px">
          <TYPE.body textAlign="center">
            <p> Total liquidity </p>
            <p>$ 10,225,484 -5.96%</p>
            <p> Pooled token </p>
            <p>10,225,448ETH</p>
            <p>10,225,448ETH</p>
            <ButtonLight>+ 增加流动性</ButtonLight>
          </TYPE.body>
        </GreyCard>
    );
}

export default PairStats;
