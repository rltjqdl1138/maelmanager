import React, {Component} from 'react'
import axios from 'axios'
const GROUP = ['high', 'middle', 'low']

export default class MenuCategory extends Component {
    constructor(props){
        super(props)

        this.state = {
            isloaded: false,
            isSelectedUp:false,

            registered:[],
            high:[],
            middle:[],
            low:[],
            
            selectedIndex:[],
            selectedID:[],
            downComponent: {}
        }
    }
    componentDidMount(){
        (async()=>{
            await this.getRegisteredList()
            await this.getCategory('high', 0)
            this.handleChange('isLoaded', true)
        })()
    }

    handleChange = (field, value) => this.setState({ [field]: value })
    getRegisteredList = async() =>{
        const {data} = await axios('/api/media/sidebar')
        return data.success ? this.handleChange('registered', data.data) : null
    }
    getCategory = async(group, id)=>{
        if( group !== 'high' && group !== 'middle' && group !== 'low' ) return;
        const {data} = await axios(`/api/media/category?type=${group}`+ (id?`&id=${id}`:''))
        return data.success ? this.handleChange(group, data.data) : null
    }
    updateRegisteredList = async()=>{
        const {data} = await axios.put('/api/media/sidebar',{
            list: this.state.registered
        })
    }
    handleActive = (group)=>{
        let newList, item, highIndex, middleIndex, wholeList
        const {downComponent, isSelectedUp, registered, selectedID, high, middle, low} = this.state
        if(downComponent.group !== group || isSelectedUp) return;
        switch(group){
            case 0:
                item = high.find(e => e.ID === downComponent.ID)
                wholeList = [...registered, {ID:item.ID, title:item.title, list:[]}]
                break;
            case 1:
                highIndex = registered.findIndex(e => e.ID === selectedID[0])
                item = middle.find(e => e.ID === downComponent.ID)
                newList = [...registered[highIndex].list, {ID:item.ID, title:item.title, list:[]}]
                registered[highIndex].list = newList
                wholeList = registered
                break;
            case 2:
                highIndex = registered.findIndex(e => e.ID === selectedID[0])
                middleIndex = registered[highIndex].list.findIndex(e => e.ID === selectedID[0])
                item = low.find(e => e.ID === downComponent.ID)
                newList = [...registered[highIndex].list[middleIndex].list, {ID:item.ID, title:item.title, list:[]}]
                registered[highIndex].list[middleIndex].list = newList
                wholeList = registered
        }
        this.handleChange('registered', wholeList)
    }
    handleDeactive = (group)=>{
        let oldList, newList, highIndex, middleIndex, lowIndex, wholeList
        const {isSelectedUp, registered, selectedID, high, middle, low} = this.state
        if( !isSelectedUp || !selectedID[group] ) return;

        switch(group){
            case 0:
                highIndex = registered.findIndex(e => e.ID === selectedID[0])
                wholeList = [...registered.slice(0,highIndex), ...registered.slice(highIndex+1,registered.length)]
                break;
            case 1:
                highIndex = registered.findIndex(e => e.ID === selectedID[0])
                middleIndex = registered[highIndex].list.findIndex(e => e.ID === selectedID[1])
                
                oldList = registered[highIndex].list
                newList = [...oldList.slice(0,middleIndex), ...oldList.slice(middleIndex+1, oldList.length)]
                
                registered[highIndex].list = newList
                wholeList = registered
                break;
            case 2:
                highIndex = high.findIndex(e => e.ID === selectedID[0])
                middleIndex = middle.findIndex(e => e.ID === selectedID[1])
                lowIndex = low.findIndex(e => e.ID === selectedID[2])

                oldList = registered[highIndex].list[middleIndex].list
                newList = [...oldList.slice(0,lowIndex), ...oldList.slice(lowIndex+1, oldList.length)]
                
                registered[highIndex].list[middleIndex].list = newList
                wholeList = registered
                break;
        }
        this.handleChange('registered', wholeList)
    }
    handleUpperClick = (group, ID, index)=>{
        const {selectedIndex, selectedID} = this.state
        if(selectedIndex.length < group) return;

        const indexList = group ?  [...selectedIndex.slice(0,group), index] : [index]
        const idList = group ? [...selectedID.slice(0,group), ID] : [ID]
        
        this.setState(state=>({
            ...state,
            isSelectedUp:true,
            selectedIndex: indexList,
            selectedID: idList,
            downComponent:{},
            low: group ? state.low : []
        }), ()=>this.getCategory(GROUP[group+1], ID))
    }
    handleLowerClick = (group, ID, index)=>{
        const {selectedIndex, selectedID} = this.state
        if(selectedIndex.length < group) return;

        const indexList = group ?  [...selectedIndex.slice(0,group)] : []
        const idList = group ? [...selectedID.slice(0,group)] : []

        this.setState(state=>({
            ...state,
            isSelectedUp: false,
            selectedIndex: indexList,
            selectedID: idList,
            downComponent:{ID, index, group},
            high: group ? state.high : [],
            middle: group ? state.middle : [],
            low: group === 2 ? state.low : []
        }),()=>this.getCategory(GROUP[group], selectedID[group-1]))
    }
    getSeperatedList= () =>{
        let ind, item, list
        const {high, middle, low, registered, selectedID} = this.state
        let regHigh = []
        let unregHigh = []
        let regMiddle = []
        let unregMiddle = []
        let regLow = []
        let unregLow = []

        list = registered
        high.map(item => {
            ind = list.findIndex(e => e.ID === item.ID)
            ind < 0 ? unregHigh = [...unregHigh, {ID:item.ID, title:item.title}]:
                regHigh[ind] = {ID:item.ID, title:item.title}
        })

        item = list.find(e => e.ID === selectedID[0])
        list = selectedID[0] && item ? item.list : []
        middle.map(item => {
            ind = list.findIndex(e => e.ID === item.ID)
            ind < 0 ? unregMiddle = [...unregMiddle, {ID:item.ID, title:item.title}]:
                regMiddle[ind] = {ID:item.ID, title:item.title}
        })

        item = list ? list.find(e => e.ID === selectedID[1]) : null
        list = selectedID[1] && item ? item.list : []
        low.map(item => {
            ind = list.findIndex(e => e.ID === item.ID)
            ind < 0 ? unregLow = [...unregLow, {ID:item.ID, title:item.title}]:
                regLow[ind] = {ID:item.ID, title:item.title}
        })

        return { regHigh, unregHigh, regMiddle, unregMiddle, regLow, unregLow }
    }

    render(){
        const {isLoaded, selectedIndex, downComponent, isSelectedUp} = this.state
        if(!isLoaded) return null
        const seperatedList = this.getSeperatedList()
        return (
            <div>
                <div>
                    <button onClick={this.updateRegisteredList}>저장하기</button>
                </div>
                <div className="SidebarContainer">
                    <div>
                        <button>위로</button>
                        <button>아래로</button>
                        <button onClick={()=>this.handleDeactive(0)}>비활성화</button>
                    </div>
                    <ItemList
                        list={seperatedList.regHigh}
                        selectedIndex={isSelectedUp||downComponent.group? selectedIndex[0] : null}
                        handleClick={(ID, index)=>this.handleUpperClick(0, ID, index)}
                    />
                    <div>
                        <button onClick={()=>this.handleActive(0)}>활성화</button>
                    </div>
                    <ItemList
                        list={seperatedList.unregHigh}
                        selectedIndex={downComponent.group===0 ? downComponent.index : null}
                        handleClick={(ID, index)=>this.handleLowerClick(0, ID, index)}
                    />
                </div>

                <div className="SidebarContainer">
                    <div>
                        <button>위로</button>
                        <button>아래로</button>
                        <button onClick={()=>this.handleDeactive(1)}>비활성화</button>
                    </div>
                    <ItemList
                        list={seperatedList.regMiddle}
                        selectedIndex={isSelectedUp||downComponent.group === 2 ? selectedIndex[1] : null}
                        handleClick={(ID, index)=>this.handleUpperClick(1, ID, index)}
                    />
                    <div>
                        <button onClick={()=>this.handleActive(1)}>활성화</button>
                    </div>
                    <ItemList
                        list={seperatedList.unregMiddle}
                        selectedIndex={downComponent.group=== 1 ? downComponent.index : null}
                        handleClick={(ID, index)=>this.handleLowerClick(1, ID, index)}
                    />
                </div>

                <div className="SidebarContainer">
                    <div>
                        <button>위로</button>
                        <button>아래로</button>
                        <button onClick={()=>this.handleDeactive(2)}>비활성화</button>
                    </div>
                    <ItemList
                        list={seperatedList.regLow}
                        selectedIndex={downComponent.group!==2 ? selectedIndex[2] : null}
                        handleClick={(ID, index)=>this.handleUpperClick(2, ID, index)}
                    />
                    <div>
                        <button onClick={()=>this.handleActive(2)}>활성화</button>
                    </div>
                    <ItemList
                        list={seperatedList.unregLow}
                        selectedIndex={downComponent.group===2 ? downComponent.index : null}
                        handleClick={(ID, index)=>this.handleLowerClick(2, ID, index)}
                    />
                </div>
            </div>
        )
    }
}

class ItemList extends Component{
    render(){
        const {list, handleClick, selectedIndex } = this.props
        const LIlist = list.map((item, index)=>(
            <li key={index}
                className={index === selectedIndex ? "SelectedItem": ""}
                onClick={()=>handleClick(item.ID, index)}>
                {`${item.ID} ${index} ${item.title}`}
            </li>
        ))
        return (
            <div>
                <ul>{LIlist}</ul>
            </div>
        )
    }
}