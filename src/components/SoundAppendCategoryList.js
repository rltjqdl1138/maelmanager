import React, {Component} from 'react'

export default class SoundAppendCategoryList extends Component{
    getList = ()=>{
        const {handleDeleteCategory, list} = this.props
        const newlist = list.map((item,index)=>{
            const info = `${item[0].title} > ${item[1].title} > ${item[2].title} > ${item[3].title}`
            return(
                <li key={index} onClick={()=>{handleDeleteCategory(index)}}>
                    {info}
                </li>
        )})
        return ( <ul>{newlist}</ul>)
    }
    render(){
        const list = this.props.list.map(item=>item[3].ID)
        return (
            <div className="MainContentContainer">
                <div className="MainSubtitle">
                    카테고리 리스트
                </div>
                {this.getList()}
                <input name="albumList" type="text" readOnly={true} value={JSON.stringify({data:list})} hidden={true}/>
            </div>
        )
    }
}