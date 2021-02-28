import Tabs, { TabPane } from 'rc-tabs'
import styled from 'styled-components';

export const AntdTabs = styled(Tabs)`
  display: flex;
  overflow: hidden;
  line-height: 1.5715;
  flex-direction: column;
  width: 100%;
  .rc-tabs {
    &-nav {
      position: relative;
      display: flex;
      flex: none;
      align-items: center;
      margin: 0 0 16px;
      ::before {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        border-bottom: 1px solid #252a44;
        content: '';
      }
      &-wrap {
        position: relative;
        display: inline-block;
        display: flex;
        flex: auto;
        align-left: stretch;
        overflow: hidden;
        white-space: nowrap;
        transform: translate(0);
        ::before,
        ::after {
          position: absolute;
          z-index: 1;
          opacity: 0;
          content: '';
          pointer-events: none;
        }
      }
      &-list {
        position: relative;
        display: flex;
      }
    }
    &-tab {
      position: relative;
      display: inline-flex;
      align-items: center;
      margin: 0 32px 0 0;
      padding: 12px 0;
      font-size: 14px;
      background: 0 0;
      border: 0;
      outline: none;
      cursor: pointer;
      &-btn {
        outline: none;
        :focus,
        :active {
          color: #1890ff;
        }
      }
    }
    &-tab-active {
      .rc-tabs-tab-btn {
        color: #1890ff;
      }
    }
    &-tab-disabled {
       color: #565A69;
       cursor: not-allowed;
    }
    &-ink-bar {
      position: absolute;
      background: #1890ff;
      pointer-events: none;
      height: 2px;
      bottom: 0;
    }
    &-content {
      &-holder {
        flex: auto;
        min-width: 0;
        min-height: 0;
      }
      display: flex;
      width: 100%;
    }
    &-tabpane {
      flex: none;
      width: 100%;
      outline: none;
    }
  }
`
export {
    TabPane
}
