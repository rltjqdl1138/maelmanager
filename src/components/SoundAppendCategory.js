import React, {Component} from 'react'
import axios from 'axios'

export default class SoundAppendCategory extends Component{
    constructor(props){
        super(props)
        this.state = {
            high:[],
            middle:[],
            low:[],
            album:[],
            selectedIndex:[],
            selectedID:[]
        }
    }
    componentDidMount(){
        this.getList(0, undefined)
    }
    setList = async(type, id, index, list)=>{
        const {high, middle, low, selectedIndex, album, selectedID} = this.state
        let newState = {
            high: type > 0 ? high : [],
            middle: type > 1 ? middle : [],
            low: type > 2 ? low : [],
            album: type > 3 ? album : [],
            selectedIndex: selectedIndex,
            selectedID: selectedID
        }
        switch(type){
            case 4:
                newState.selectedID = [selectedID[0], selectedID[1], selectedID[2], id];
                newState.selectedIndex = [selectedIndex[0], selectedIndex[1], selectedIndex[2], index]; break
            case 3:
                newState.selectedID = [selectedID[0], selectedID[1], id];
                newState.selectedIndex = [selectedIndex[0], selectedIndex[1], index]
                newState.album = list; break
            case 2:
                newState.selectedID = [selectedID[0], id];
                newState.selectedIndex = [selectedIndex[0], index]
                newState.low = list; break
            case 1:
                newState.selectedID = [id]
                newState.selectedIndex = [index]
                newState.middle = list; break
            case 0:
                newState.selectedID = []
                newState.selectedIndex = []
                newState.high = list; break
            default:
                return;
        }
        return this.setState(newState)
    }
    getList = async(type, id, index)=>{
        if(type>3)
            return this.setList(type, id, index)
        const types = ['high', 'middle', 'low', 'album']
        const url = '/api/media/category?type='+types[type] + (id?`&id=${id}`:'')
        const response = await axios.get(url)
        this.setList(type, id, index, response.data.data)
        //this.setList(type, id, [...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data])
    }
    highCategory = ()=>{
        const list = this.state.high.map((item,index)=>(
            <li key={index}
                className={this.state.selectedID[0]===item.ID ? "SelectedItem":""}
                onClick={()=>this.getList(1, item.ID, index)}>
                {item.title}
            </li>
        ))
        return (
            <div>
                <div>대분류</div>
                <ul> {list} </ul>
            </div>  )
    }
    middleCategory = ()=>{
        const list = this.state.middle.map((item,index)=>(
            <li key={index}
                className={this.state.selectedID[1]===item.ID ? "SelectedItem":""}
                onClick={()=>this.getList(2, item.ID, index)}>
                {item.title}
            </li>
        ))
        return (
            <div>
                <div>중분류</div>
                <ul> {list} </ul>
            </div>  )
    }

    lowCategory = ()=>{
        const list = this.state.low.map((item,index)=>(
            <li key={index}
                className={this.state.selectedID[2]===item.ID ? "SelectedItem":""}
                onClick={()=>this.getList(3, item.ID, index)}>
                {item.title}
            </li>
        ))
        return (
            <div>
                <div>소분류</div>
                <ul> {list} </ul>
            </div>  )
    }
    albumCategory = ()=>{
        const list = this.state.album.map((item,index)=>(
            <li
                key={index}
                className={this.state.selectedID[3]===item.ID ? "SelectedItem":""}
                onClick={()=>this.getList(4, item.ID, index)}>
                {item.title}
            </li>
        ))
        return (
            <div>
                <div>앨범</div>
                <ul> {list} </ul>
            </div>  )
    }
    appendCategory = ()=>{
        const {selectedIndex, high, middle, low, album} = this.state
        const {handleSavedCategory} = this.props
        if( selectedIndex.length < 4)
            return;

        const list = [
            high[selectedIndex[0]],
            middle[selectedIndex[1]],
            low[selectedIndex[2]],
            album[selectedIndex[3]]
        ]
        
        handleSavedCategory(list)
        
    }
    render(){
        return (
            <div className="MainContentContainer">
                <div className="MainSubtitle">
                    카테고리 연결
                </div>
                <div className="ConnectCategoryContainer">
                    {this.highCategory()}
                    {this.middleCategory()}
                    {this.lowCategory()}
                    {this.albumCategory()}
                    <div>
                        <span onClick={this.appendCategory}>선택</span>
                    </div>
                </div>
            </div>
        )
    }
}