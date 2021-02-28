import fetch from 'unfetch'
import {
	Bar,
	LibrarySymbolInfo,
	ResolutionString,
  } from '../../../charting_library/charting_library.min'
//import {Pair} from '../../../uniswap-sdk'
const history : any = {};
const api_root = '/v1/kline';//'http://dev.mytrader.org/v1/kline'
//pairs_address=0xE0dbAB4DB78c40f6eE9128792b85D56812D629D1&type=2&start=1603191600&end=1603720800
export default {

    getBars:(
		symbolInfo: LibrarySymbolInfo,
		resolution: ResolutionString,
		from: number,
		to: number,
		first: boolean // 标识是否第一次调用此商品/周期的历史记录
		)=>{
			const type = resolution === '60' ? 1 : 2
			
			console.log("type", type)
			//var split_symbol = symbolInfo.name.split("-")
			//const pairs_address = Pair.getAddress(split_symbol[0], split_symbol[1])
		return fetch(`${api_root}?pairs_address=${symbolInfo.ticker}&type=${type}&start=${from}&end=${to}`)
			.then( r => r.json())
            .then(data => {
                
				if (data.error_code && data.error_code === '404') {
					console.log('CryptoCompare API error:',data.error_message)
					return []
				}
				let list: Bar[] = []
				if (data.data) {
					let _list = data.data
					for (let i = 0; i < _list.length; i++) {
						list.push({
						time: _list[i].timestamp * 1000,
						close: Number(_list[i].close),
						high: Number(_list[i].highest),
						low: Number(_list[i].lowest),
						open: Number(_list[i].open),
						volume: 100
						})
					}
					if(first){
                        history[symbolInfo.name] = list[list.length - 1];
                    }
					console.log('hisbars', list)
					console.log('hisbars data', data.data)
					return list
				} else {
					return list
				}
			})
}
}