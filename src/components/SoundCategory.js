import React, {Component} from 'react'
import axios from 'axios'


export default class SoundCategory extends Component{
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

    handleChange = (field, value) => this.setState({ [field]: value })
    registerCategory = async (group)=>{
        const {selectedID, selectedIndex} = this.state
        let upperID;
        switch(group){
            case 0: break;
            case 1:
                upperID = selectedID[0]
                break;
            case 2:
                upperID = selectedID[1]
                break;
            case 3:
                upperID = selectedID[2]
                break;
            default:
                return;
        }
        const result = await axios.post('/api/media/category',{upperID, group})
        if(!result.data.success)
            return;
        group===0 ? await this.getList(0, undefined) : await this.getList(group, selectedID[group-1], selectedIndex[group-1]) 
    }
    handleDeleteCategory = (group) =>
        window.confirm('삭제하시겠습니까?') ? this.deleteCategory(group) : null
    
    deleteCategory = async (group)=>{
        const {selectedID, selectedIndex} = this.state
        switch(group){
            case 3:
                if(!selectedID[3]) break;
            case 2:
                if(!selectedID[2]) break;
            case 1:
                if(!selectedID[1]) break;
            case 0:
                if(!selectedID[0]) break;
                const result = await axios.delete(`/api/media/category?group=${group}&id=${selectedID[group]}`)
                if(!result.data.success) return;
                group===0 ? await this.getList(0, undefined) : await this.getList(group, selectedID[group-1], selectedIndex[group-1]) 
            default:
                return
        }
        return

    }
    updateCategory = async (group, payload) => {
        const {selectedID, selectedIndex} = this.state
        switch(group){
            case 3:
                if(!selectedID[3]) break;
            case 2:
                if(!selectedID[2]) break;
            case 1:
                if(!selectedID[1]) break;
            case 0:
                if(!selectedID[0]) break;
                const result = await axios.put(`/api/media/category`,{
                    ...payload,
                    ID:selectedID[group],
                    group
                })
                if(!result.data.success) return;
                return this.reLoad(group)
            default:
                return
        }
        return
    }
    setList = async(type, id, _index, list)=>{
        //              2 1 null data
        const {high, middle, low, selectedIndex, album, selectedID} = this.state
        const index = _index===undefined || _index===null? list.length-1 : _index  
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
        // 2 1 null
        if(type>3)
            return this.setList(type, id, index)
        const types = ['high', 'middle', 'low', 'album']
        const url = '/api/media/category?type='+types[type] + (id?`&id=${id}`:'')
        const response = await axios.get(url)
        this.setList(type, id, index, response.data.data)
        //this.setList(type, id, [...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data,...response.data.data])
    }
    reLoad = async(group)=>{
        const types = ['high', 'middle', 'low', 'album']
        const {selectedID} = this.state
        const id = group > 0 ? selectedID[group-1] : 0
        const url = '/api/media/category?type='+types[group] + (id?`&id=${id}`:'')
        const response = await axios.get(url)

        return response.data.success ? this.handleChange(types[group], response.data.data) : null
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
                <div>
                    <button onClick={()=>this.registerCategory(0)}>추가</button>
                    <button onClick={()=>this.handleDeleteCategory(0)}>삭제</button>
                    <button>비활성</button>
                </div>
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
                <div>
                    <button onClick={()=>this.registerCategory(1)}>추가</button>
                    <button  onClick={()=>this.handleDeleteCategory(1)}>삭제</button>
                    <button>비활성화</button>
                </div>
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
                <div>
                    <button onClick={()=>this.registerCategory(2)}>추가</button>
                    <button onClick={()=>this.handleDeleteCategory(2)}>삭제</button>
                    <button>비활성화</button>
                </div>
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
                <div>
                    <button onClick={()=>this.registerCategory(3)}>추가</button>
                    <button onClick={()=>this.handleDeleteCategory(3)}>삭제</button>
                    <button>비활성화</button>
                </div>
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
        const {high, middle, low, album, selectedIndex} = this.state
        return (
            <div className="MainContentContainer">
                <div className="MainSubtitle">
                    카테고리 관리
                </div>
                <div className="CategoryContainer">
                    {this.highCategory()}
                    {this.middleCategory()}
                    {this.lowCategory()}
                    {this.albumCategory()}
                </div>
                <CategoryInfo
                    updateCategory={this.updateCategory}
                    high={high[selectedIndex[0]]}
                    middle={middle[selectedIndex[1]]}
                    low={low[selectedIndex[2]]}
                    album={album[selectedIndex[3]]}
                />
            </div>
        )
    }
}





class CategoryInfo extends Component{
    constructor(props){
        super(props)
        this.state = {
            high:{ID:0, title:'',info:''},
            middle:{ID:0, title:'', info:''},
            low:{ID:0, title:'', subTitle:''},
            album:{ID:0, title:''}
        }
    }
    handleChange = (field, value) => this.setState({[field]:value})

    highCategory = ()=>{
        const high = !this.state.high.ID||this.state.high.ID!==this.props.high.ID ? this.props.high : this.state.high    
        return (
            <div>
                대카테고리 정보
                <button onClick={()=>{this.props.updateCategory(0,high)}}>저장</button>
                <table>
                    <tbody>
                        <tr>
                            <th>현재 카테고리</th>
                            <td>
                                <input type="text"
                                    value={high.title}
                                    onChange={(e)=>this.handleChange('high',{...high, title:e.target.value})} />
                                <button>삭제</button>
                                <button>비활성화</button>
                            </td>
                        </tr>
                        <tr>
                            <th>카테고리 설명</th>
                            <td>
                                <textarea
                                    onChange={(e)=>this.handleChange('high',{...high, info:e.target.value})}
                                    value={high.info ? high.info : ''} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
    middleCategory = ()=>{
        const middle = !this.state.middle.ID||this.state.middle.ID !==this.props.middle.ID ? this.props.middle : this.state.middle    
        return (
            <div>
                중카테고리 정보
                <button onClick={()=>{this.props.updateCategory(1,middle)}}>저장</button>
                <table>
                    <tbody>
                        <tr>
                            <th>현재 카테고리</th>
                            <td>
                                <input type="text"
                                    value={middle.title}
                                    onChange={(e)=>this.handleChange('middle',{...middle, title:e.target.value})}/>
                                <button>삭제</button>
                                <button>비활성화</button>
                            </td>
                        </tr>
                        <tr>
                            <th>카테고리 설명</th>
                            <td>
                                <textarea
                                    onChange={(e)=>this.handleChange('middle',{...middle, info:e.target.value})}
                                    value={middle.info ? middle.info : ''} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )

    }
    lowCategory = ()=>{
        const low = !this.state.low.ID||this.state.low.ID !==this.props.low.ID ? this.props.low : this.state.low 
        return (
            <div>
                소카테고리 정보
                <button onClick={()=>{this.props.updateCategory(2,low)}}>저장</button>
                <table>
                    <tbody>
                        <tr>
                            <th>현재 카테고리</th>
                            <td colSpan="4">
                                <input type="text"
                                    value={low.title}
                                    onChange={(e)=>this.handleChange('low',{...low, title:e.target.value})}/>
                                <button>삭제</button>
                                <button>비활성화</button>
                            </td>
                        </tr>
                        <tr>
                            <th>카테고리 부재</th>
                            <td colSpan="4">
                                <input type="text"
                                    value={low.subTitle ? low.subTitle:''}
                                    onChange={(e)=>this.handleChange('low',{...low, subTitle:e.target.value})}/>
                            </td>
                        </tr>
                        <tr>
                            <th>디자인 유형</th>
                            <td>
                                <input
                                    type="radio"
                                    name="design"
                                    value='0'
                                    checked={low.designType===0}
                                    onChange={(e)=>this.handleChange('low',{...low, designType:0})}/>
                                    사각형 + 윤곽선 X
                            </td>
                            <td>
                                <input
                                    type="radio"
                                    name="design"
                                    value='1'
                                    checked={low.designType===1}
                                    onChange={(e)=>this.handleChange('low',{...low, designType:1})}/>
                                사각형 + 윤곽선 O
                            </td>

                            <td>

                                
                                <input
                                    type="radio"
                                    name="design"
                                    value='2'
                                    checked={low.designType===2}
                                    onChange={(e)=>this.handleChange('low',{...low, designType:2})}/>
                                원형 + 윤곽선 X
                            </td>
                            <td>
                                <input
                                    type="radio"
                                    name="design"
                                    value='3'
                                    checked={low.designType===3}
                                    onChange={(e)=>this.handleChange('low',{...low, designType:3})}/>
                                원형 + 윤곽선 O
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )

    }
    fileupload = (file)=> {
        const album = !this.state.album.ID||this.state.album.ID !==this.props.album.ID ? this.props.album : this.state.album 
        const data = new FormData()
        data.append('albumart', file[0])
        axios.post("/image", data).then(response=>{
            response.status === 200 ?
                this.handleChange('album',{...album, uri:response.data}) :
                this.handleChange('album',{...album, uri:''})
        }).catch(e=>console.log(e))
    }
    handleAlbumCategorySubmit = (e)=>{
        e.preventDefault()

    }
    albumCategory = ()=>{
        const album = !this.state.album.ID||this.state.album.ID !==this.props.album.ID ? this.props.album : this.state.album 
        return (
            <div>
                앨범카테고리 정보
                <button onClick={()=>{this.props.updateCategory(3,album)}}>저장</button>
                <table>
                    <tbody>
                        <tr>
                            <th>현재 카테고리</th>
                            <td>
                                <input type="text"
                                    value={album.title}
                                    onChange={(e)=>this.handleChange('album',{...album, title:e.target.value})}/>
                                <button>삭제</button>
                                <button>비활성화</button>
                            </td>
                        </tr>
                        <tr>
                            <th>아티스트</th>
                            <td>
                                <input type="text"
                                    value={album.artist}
                                    onChange={(e)=>this.handleChange('album',{...album, artist:e.target.value})}/>
                            </td>
                        </tr>
                        <tr>
                            <th>앨범정보</th>
                            <td>
                                <textarea type="text"
                                    value={album.info ? album.info : ''}
                                    onChange={(e)=>this.handleChange('album',{...album, info:e.target.value})}/>
                            </td>
                        </tr>
                        <tr>
                            <th>이미지</th>
                            <td>
                                <input name="albumart" type="file" onChange={ (e) => this.fileupload(e.target.files) }/>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <img height="200" src={`/image/${album.uri?album.uri :''}`}/>

                
            </div>
        )

    }
    render(){
        const {high, middle, low, album} = this.props
        return (
            <div className="CategoryInfo">
                {album?this.albumCategory():null}
                {low?this.lowCategory():null}
                {middle?this.middleCategory():null}
                {high?this.highCategory():null}
            </div>
        )
    }
}