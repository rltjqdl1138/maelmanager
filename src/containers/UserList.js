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
    handleChange = (field, value) => this.setState({ [field]: value })
    render(){
        const {searchValue} = this.state
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