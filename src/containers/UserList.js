import React, {Component} from 'react'
import axios from 'axios'

export default class User extends Component{
    getMain = (page)=>{
        switch(page){
            case 0:
                return (<UserList />)
            case 1:
                return (<StayUserList />)
            case 2:
                return (<DeletedUserList />)
            default:
                return (<div />)
        }
    }
    render(){
        const {page} = this.props
        return this.getMain(page)
    }
}
class UserList extends Component{
    constructor(props){
        super(props)
        this.state={
            list:[],
            searchValue:0
        }
    }
    componentDidMount(){
        this.getUserList()
    }
    getUserList = async( )=>{
        const response = await axios.get('/api/account')
        this.handleChange('list', response.data.data)
    }
    handleChange = (field, value) => this.setState({ [field]: value })
    render(){
        const {list, searchValue} = this.state
        return (
            <div className="MainContainer">
                <div className="MainTitle">
                    회원 리스트
                </div>
                <SearchForm
                    title="회원검색"
                    searchType={[
                        {value:0,title:'아이디'},
                        {value:1,title:'휴대폰번호'},
                        {value:2,title:'이름'}
                    ]}
                    searchValue={searchValue}
                    handleSearchValue={(value)=>this.handleChange('searchValue', value)}
                    searchTitle="검색어"
                    dateTitle="가입일"
                />
                <UserInfo info={list}
                    handleChange={(index)=>console.log(index)}
                />
            </div>
        )
    }
}

class UserInfo extends Component{
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
        const {info} = this.props
        const {page, limit } = this.state
        const total = info.length
        const start = (page-1)*limit
        const pageList = this.getPagelist(page, total, limit)
        const soundinfoList = info.slice( start, start + limit).map((item, index)=>{
            const date = item.createdTime ? new Date(item.createdTime) : null
            return (
                <tr key={index} >
                    <td>
                        <input type="checkbox"
                            onChange={()=>this.props.handleChange(item.id)}
                        />
                    </td>
                    <td>{item.platform}</td>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.birthday}</td>
                    <td>{item.mobile}</td>
                    <td>{item.stateID}</td>
                    <td>0000-00-00</td>
                    <td>{date?date.toLocaleDateString():'-'}</td>
                    <td>{item.stateID}</td>
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
                            <th>선택</th>
                            <th>구분</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>생년월일</th>
                            <th>휴대전화</th>
                            <th>플랜</th>
                            <th>결제기준일</th>
                            <th>회원가입일</th>
                            <th>휴면여부</th>
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


class StayUserList extends Component{
    constructor(props){
        super(props)
        this.state={list:[]}
    }
    handleChange = (field, value) => this.setState({ [field]: value })
    render(){
        return (
            <div className="MainContainer">
                <div className="MainTitle">
                    휴면회원관리
                </div>
            </div>
        )
    }
}

class DeletedUserList extends Component{
    constructor(props){
        super(props)
        this.state={list:[]}
    }
    handleChange = (field, value) => this.setState({ [field]: value })
    render(){
        return (
            <div className="MainContainer">
                <div className="MainTitle">
                    회원탈퇴/삭제관리
                </div>
            </div>
        )
    }
}

class SearchForm extends Component{
    render(){
        const {title, searchType, dateTitle, searchTitle, searchValue, handleSearchValue} = this.props
        const typeList = searchType.map((item, index)=>(
            <option key={index} value={item.value}>{item.title}</option>
        ))
        return(
            <div className="MainContentContainer">
                <div className="MainSubtitle">
                    {title}
                </div>
                <div className="SoundListSearchContainer">
                    <div>
                        <div className="SoundListSearchTitle">
                            {searchTitle}
                        </div>
                        <div>
                            <select name="SearchType" value={searchValue}
                                onChange={(e)=>handleSearchValue(e.target.value)}>
                                {typeList}
                            </select>
                            <input className="SoundListSearchInput" type="text"></input>
                        </div>
                    </div>
                    <div>
                        <div className="SoundListSearchTitle">
                            {dateTitle}
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