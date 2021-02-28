import React from 'react'
import styled from 'styled-components'
// import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'

import { Box, Flex, Text } from 'rebass'
// import TokenLogo from '../TokenLogo'
// import { CustomLink } from '../Link'
// import Row from '../Row'
// import { Divider } from '..'

import { formattedNum, formattedPercent } from '../../utils/formatter'
// import { useMedia } from 'react-use'
// import { OVERVIEW_TOKEN_BLACKLIST } from '../../constants'
import FormattedName from '../FormattedName'
// import { TYPE } from '../../Theme'
// import styles from './index.module.css';

// dayjs.extend(utc)

const Divider = styled(Box)`
  height: 1px;

`
// const PageButtons = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   margin-top: 2em;
//   margin-bottom: 2em;
// `

// const Arrow = styled.div`
//   color: ${({ theme }) => theme.primary1};
//   opacity: ${props => (props.faded ? 0.3 : 1)};
//   padding: 0 20px;
//   user-select: none;
//   :hover {
//     cursor: pointer;
//   }
// `

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 1.125rem;
  
  > * {
    justify-content: flex-end;
    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }
`

const FlexItem = styled(Flex)`
    justify-content: flex-start;
  -webkit-overflow-scrolling: touch;
`

const FlexItemLaste = styled(Flex)`
    justify-content: flex-end;
  -webkit-overflow-scrolling: touch;
`

const ListWrapper = styled.div``

const ClickableText = styled(Text)`
  text-align: left;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: ${({ theme }) => theme.text2};

  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`

const DataText = styled(Flex)`
  text-align: left;
  color: #151531;
  align-items: flex-start;
  justify-content: flex-start;
  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`
const DataTextLatest = styled(Flex)`
  text-align: left;
  color: #151531;
  justify-content: flex-end;
  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

export type ColumnCount = number;

//export type ColumnType = 'gutter' | 'column' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface ListGridType {
  gutter?: number;
  column: ColumnCount;
  xs?: ColumnCount;
  sm?: ColumnCount;
  md?: ColumnCount;
  lg?: ColumnCount;
  xl?: ColumnCount;
  xxl?: ColumnCount;
}



export interface ListProps<T> {

    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    dataSource?: T[];
    grid?: ListGridType;
}
  


// @TODO rework into virtualized list
function FullList<T>({
    dataSource=[], 
    grid
}:ListProps<T>) {
  // page state
//   const [page, setPage] = useState(1)
  // eslint-disable-next-line
//   const [maxPage, setMaxPage] = useState(1)

  // sorting
//   const [sortDirection, setSortDirection] = useState(true)
//   const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.LIQ)

  // const below1080 = useMedia('(max-width: 1080px)')
  // const below680 = useMedia('(max-width: 680px)')
  // const below600 = useMedia('(max-width: 600px)')

  const colStyle = React.useMemo(() => {
    if (!grid) {
      return undefined;
    }
    const columnCount = grid.column;
    if (columnCount) {
      return {
        width: `${100 / columnCount}%`,
        maxWidth: `${100 / columnCount}%`,
      };
    }
    return undefined;
  }, [grid]);

  const ListItem = ({ item, styles}:{item:any, styles?:React.CSSProperties}) => {
    return (
      <DashGrid >
        <DataText style={styles}>
          <FormattedName text={item.symbol} maxCharacters={5} />
        </DataText>
        <DataText style={styles}>
          {formattedNum(item.price, true)}
        </DataText>
        <DataText style={styles}>{formattedPercent(item.percent_change_24h)}</DataText>
        <DataTextLatest style={styles}>
          <button>Transfer</button>
        </DataTextLatest>
      </DashGrid>
    )
  }

  return (
    <ListWrapper>
      <DashGrid style={{ height: 'fit-content', padding: '0 1.125rem 1rem 1.125rem' }}>
        <FlexItem alignItems="center" style={colStyle}>
          <ClickableText>
          Token 
          </ClickableText>
        </FlexItem>
        <FlexItem style={colStyle}>
          
          ETH Network Assets 
          
        </FlexItem>
        <FlexItem style={colStyle}>
          <ClickableText>
          HPB Network Assets
          </ClickableText>
        </FlexItem>
        <FlexItemLaste style={colStyle}>
          <ClickableText>
          Operation
          </ClickableText>
        </FlexItemLaste>
      </DashGrid>
      <Divider />
      <List p={0}>
        {dataSource &&
          dataSource.map((item, index) => {
            return (
              <div key={index}>
                <ListItem key={index}  item={item} styles={colStyle} />
              </div>
            )
          })}
      </List>
    </ListWrapper>
  )
}

export default FullList
