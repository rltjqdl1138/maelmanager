import React, {Component} from 'react'
import axios from 'axios'
import SoundInfo from '../components/SoundInfo'
import SoundSearch from '../components/SoundSearch'
import SoundLinkInfo from '../components/SoundLinkInfo'
import SoundAppendInfo from '../components/SoundAppendInfo'
import SoundAppendCategory from '../components/SoundAppendCategory'
import SoundAppendCategoryList from '../components/SoundAppendCategoryList'
import SoundCategory from '../components/SoundCategory'
import Theme from '../components/Theme'
import MenuCategory from '../components/MenuCategory'

export default class Sound extends Component{
    getMain = (page)=>{
        switch(page){
            case 0:
                return (<SoundList />)
            case 1:
                return (<SoundAppend />)
            case 2:
                return (<ThemeAlign />)
            case 3:
                return (<Menu />)
            case 4:
                return (<CategoryAlign />)
            default:
                return (<div />)
        }
    }
    render(){
        const {page} = this.props
        return this.getMain(page)
    }
}

class SoundList extends Component{
    constructor(props){
        super(props)
        this.state={ info:[], MID:0, updateID:0 }
    }
    handleChange = (field, value) => this.setState({ [field]: value })
    
    
    render(){
        return this.state.updateID ?
        (<SoundAppend id={this.state.updateID}
            handleClear={()=>this.handleChange('updateID',0)}
            />
        ):(
            <div className="MainContainer">
                <div className="MainTitle"> 사운드 리스트 </div>
                <SoundSearch
                    handleInfo={(info)=>this.handleChange('info',info)}
                />
                <SoundInfo
                    info={this.state.info}
                    handleMID={(MID)=>this.handleChange('MID',MID)}
                    handleUpdateID={(updateID)=>this.handleChange('updateID',updateID)}
                />
                <SoundLinkInfo
                    MID={this.state.MID}
                />
            </div>
        )
    }
}

class SoundAppend extends Component{
    constructor(props){
        super(props)
        this.state={savedCategory:[]}
    }
    componentDidMount(){
        return this.props.id ? this.getCategory(this.props.id) : null
    }
    getCategory = async (id)=>{
        const response = await axios.get(`/api/media/album?mid=${id}`)
        if(!response || !response.data.success || !response.data.data || !response.data.data.length)
            return;
        const list = response.data.data.map(item=> [{title:'...'},{title:'...'},{title:'...'},item])
        this.handleChange('savedCategory', list)
    }
    deleteMusic = async(id)=>{
        const response = await axios.delete(`/api/media/music?id=${id}`)
        console.log(response.data)
    }
    handleChange = (field, value) => this.setState({ [field]: value })
    handleSavedCategory=(list)=>
        this.handleChange('savedCategory', [...this.state.savedCategory, list])
    handleDeleteCategory=(index)=>{
        const {savedCategory} = this.state
        const length = savedCategory.length
        let newList = []
        if(index < 0 || index >= length)
            return;
        else if(index === 0)
            newList = savedCategory.slice(1, length)
        else
            newList = [...savedCategory.slice(0,index), ...savedCategory.slice(index+1,length)]
        this.handleChange('savedCategory', newList)
    }
    render(){
        const {handleClear} = this.props
        return (
            <div className="MainContainer">
                <form action={this.props.id? "api/media/music/update" :"/api/media/music"} method={'POST'} encType="multipart/form-data">
                    <div className="MainTitle">
                        사운드 등록
                        <input type="submit" value="저장" style={{color:'red'}}/>
                        {handleClear?(<button onClick={handleClear}>뒤로</button>):null}
                        {this.props.id ? (<button onClick={()=>this.deleteMusic(this.props.id)}>삭제</button>) : null}
                    </div>
                    <input name="MID" type="text" value={this.props.id?this.props.id:0} readOnly={true} hidden={true}/>
                    <SoundAppendInfo id={this.props.id}/>
                    <SoundAppendCategory
                        handleSavedCategory={this.handleSavedCategory}/>
                    <SoundAppendCategoryList
                        list={this.state.savedCategory}
                        handleDeleteCategory={this.handleDeleteCategory}
                    />
                </form>
            </div>
        )
    }
}

class ThemeAlign extends Component{
    render(){
        return(
            <div className="MainContainer">
                메인진열관리
                <Theme />
            </div>
        )
    }
}

class Menu extends Component{
    render(){
        return (
            <div className="MainContainer">
                <div className="MainTitle">
                    메뉴 진열 관리
                </div>
                <MenuCategory />
            </div>)
    }
}

class CategoryAlign extends Component{
    handleChange = (field, value) => this.setState({ [field]: value })
    handleSavedCategory=(list)=>
        this.handleChange('savedCategory', [...this.state.savedCategory, list])
    handleDeleteCategory=(index)=>{
        const {savedCategory} = this.state
        const length = savedCategory.length
        let newList = []
        if(index < 0 || index >= length)
            return;
        else if(index === 0)
            newList = savedCategory.slice(1, length)
        else
            newList = [...savedCategory.slice(0,index), ...savedCategory.slice(index+1,length)]
        this.handleChange('savedCategory', newList)
    }
    render(){
        return(
            <div className="MainContainer">
                카테고리 관리
                <SoundCategory handleSavedCategory={this.handleSavedCategory}/>
            </div>
        )
    }
}