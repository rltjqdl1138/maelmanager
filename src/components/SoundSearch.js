import React, {Component} from 'react'
import axios from 'axios'

export default class SoundSearch extends Component{
    componentDidMount(){
        this.getData()
    }
    getData = async()=>{
        try{
            const response = await axios.get('/api/media/music')
            if(response.data.success)
                this.props.handleInfo(response.data.data)
                //this.props.handleInfo([...response.data.data, ...response.data.data, ...response.data.data,...response.data.data, ...response.data.data, ...response.data.data,...response.data.data, ...response.data.data, ...response.data.data,...response.data.data, ...response.data.data, ...response.data.data, ...response.data.data, ...response.data.data, ...response.data.data,...response.data.data, ...response.data.data, ...response.data.data,...response.data.data, ...response.data.data, ...response.data.data,...response.data.data, ...response.data.data, ...response.data.data,...response.data.data, ...response.data.data, ...response.data.data,...response.data.data, ...response.data.data, ...response.data.data,...response.data.data, ...response.data.data, ...response.data.data])
        }catch(e){
            console.log(e)
        }
    }
    render(){
        return(
            <div className="MainContentContainer">
                <div className="MainSubtitle">
                    사운드검색
                </div>
                <div className="SoundListSearchContainer">
                    <div>
                        <div className="SoundListSearchTitle"> 검색어 </div>
                        <div>
                            <select name="SearchType">
                                <option value="0">사운드명</option>
                                <option value="1">작곡</option>
                                <option value="2">작사</option>
                                <option value="3">작가</option>
                                <option value="4">제작사</option>
                            </select>
                            <input className="SoundListSearchInput" type="text"></input>
                        </div>
                    </div>
                    <div>
                        <div className="SoundListSearchTitle">
                            기간검색
                        </div>
                        <div>
                            <input type="text" className="SoundListSearchTime" />
                            <div>~</div>
                            <input type="text" className="SoundListSearchTime" />
                        </div>
                    </div>
                </div>
                <div className="SoundListSearchButton">
                    <button>
                        검색
                    </button>
                </div>
            </div>
        )
    }
}