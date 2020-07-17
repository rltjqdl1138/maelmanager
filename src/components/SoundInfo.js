import React, {Component} from 'react'

export default class SoundInfo extends Component{
    constructor(props){
        super(props)
        this.state={
            page:1,
            limit:10
        }
    }
    handleChange = (field, value) =>
        this.setState({ [field]: value })
    
    getPagelist = (page, total, limit)=>{
        const totalPage = Math.ceil(total / limit)
        const start = Math.max(page-5,1)
        const end = Math.min(totalPage, start+9)
        let result = []
        for(let i = start; i <= end; i++){
            result = [...result, i]
        }
        const component = result.map(item=>{
            return (
                <td key={item} >
                    <button className={item===page ? "SelectedPage":"UnselectedPage"}
                        onClick={()=>this.handleChange('page',item)}>{item}</button>
                </td>
            ) })
        return (
            <table>
                <tbody>
                    <tr>{component}</tr>
                </tbody>
            </table>
        )
    }
    render(){
        const {info, handleMID, handleUpdateID} = this.props
        const {page, limit } = this.state
        const total = info.length
        const start = (page-1)*limit
        const pageList = this.getPagelist(page, total, limit)
        const soundinfoList = info.slice( start, start + limit).map((item, index)=>{
            const date = item.createdTime ? new Date(item.createdTime) : null
            return (
                <tr key={index} >
                    <th 
                        style={{cursor:'pointer'}}
                        onClick={()=>handleUpdateID(item.MID)}>{item.title}
                    </th>
                    <td>{item.category}</td>
                    <td>{item.songCreator}</td>
                    <td>{item.lyricCreator}</td>
                    <td>{item.author}</td>
                    <td>{item.publisher}</td>
                    <td>{item.info}</td>
                    <td>{date?date.toLocaleDateString():'-'}</td>
                    <td onClick={()=>handleMID(item.MID)}>
                        보기
                    </td>
                    <td>{item.uri}.mp3</td>
                </tr>
            )
        })
        return(
            <div className="MainContentContainer">
                <div className="SoundInfoText">
                    <div>전체</div>
                    <div style={{color:'red'}}>{total}</div>
                    <div>개 / 검색</div>
                    <div style={{color:'red'}}>{limit}</div>
                    <div>개</div>
                </div>
                <div className="MainSubtitle">
                    사운드정보
                </div>
                <table className="SoundInfoTable">
                    <thead className="TableTitle">
                        <tr >
                            <th>사운드명</th>
                            <th>구분</th>
                            <th>작곡</th>
                            <th>작사</th>
                            <th>작가</th>
                            <th>제작사</th>
                            <th>사운드정보</th>
                            <th>등록일</th>
                            <th>수록정보</th>
                            <th>음원</th>
                        </tr>
                    </thead>
                    <tbody className="TableItem">
                        {soundinfoList}
                    </tbody>
                </table>
                {pageList}
            </div>
        )
    }
    
}