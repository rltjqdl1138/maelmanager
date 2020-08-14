import React, {Component} from 'react'
import axios from 'axios'

export default class Notice extends Component{
    constructor(props){
        super(props)
        this.state={list:[], selectedIndex:-1, text:''}
    }
    componentDidMount(){
        this.getNoticeList()
    }
    handleChange = (field, value) => this.setState({ [field]: value })
    getNoticeList = async()=>{
        const response = await axios.get('/api/notice')
        if(!response.data.success) return;
        this.setState({list: response.data.data, selectedIndex:-1, text:''})
    }
    getMain = (page, id)=>{
        switch(page){
            case 0:
                return (<NoticeItem id={id}/>)
            default:
                return (<div />)
        }
    }
    registerNotice = async ()=>{
        const {text} = this.state
        await axios.post(`/api/notice/${text}`)
        this.getNoticeList()
    }
    deleteNotice = async ()=>{
        if(!window.confirm('삭제하시겠습니까?'))
            return;
        const {list, selectedIndex} = this.state
        await axios.delete(`/api/notice/${list[selectedIndex]}`)
        this.getNoticeList()
    }
    render(){
        const {page} = this.props
        const {list, selectedIndex, text} = this.state
        const menu = list.map((item, index)=>(
            <li key={index}
                className={index===selectedIndex?"SelectedItem":""}
                onClick={()=>this.handleChange('selectedIndex', index)}>
                {item}
            </li>
        ))
        return (
            <div className="MainContainer">
                <div className="MainTitle">
                    게시판 관리
                </div>
                <div>
                    <input type="text" value={text} onChange={(e)=>this.handleChange('text',e.target.value)}/>
                    <button onClick={()=>this.registerNotice()} disabled={!text.length}>추가하기</button>
                    <button onClick={()=>this.deleteNotice()} disabled={!list[selectedIndex]}>삭제하기</button>
                </div>
                <ul className="NoticeListContainer">{menu}</ul>
                <div style={{backgroundColor:'gray', height:1, marginBottom:40}}/>
                {selectedIndex >= 0 ? this.getMain(page, list[selectedIndex]) : null}
            </div>
        )
    }
}
class NoticeItem extends Component{
    constructor(props){
        super(props)
        this.state = {
            id:'',
            title:'',
            list:[],
            selectedIndex:-1
        }
    }
    componentDidMount(){
        this.getList(this.props.id)
    }
    componentDidUpdate(){
        if(this.props.id !== this.state.id) this.getList(this.props.id)
    }
    handleChange = (field, value) => this.setState({ [field]: value })
    getList = async(id)=>{
        const response = await axios.get(`/api/notice/${id}`)
        if(!response.data.success)
            return;
        this.setState({
            id,
            selectedIndex:-1,
            title: response.data.title,
            list:response.data.data
        })
    }
    hexToRGB = (text)=>{
        if(!text || text.length !== 7)
            return {R:18, G:17, B:17}
        const R = '0x'+text.slice(1,3)
        const G = '0x'+text.slice(3,5)
        const B = '0x'+text.slice(5,7)
        const result = {
            R: parseInt(R, 16),
            G: parseInt(G, 16),
            B: parseInt(B, 16)
        }
        return result
    }
    RGBtoHex = (r, g, b) => {
        const toHex = (num)=>{
            switch(true){
                case !num:
                case num <= 0:
                    return '00'
                case num < 15:
                    return '0'+num.toString(16)
                case num >255:
                    return 'ff'
                default:
                    return num.toString(16)
            }
        }
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }
    updateNotice = async()=>{
        const {title, list, id} = this.state
        console.log(title, id)
        const response = await axios.put(`/api/notice/${id}`,{title, main:list})
        console.log(response)
    }
    AddItem = ()=>{
        const {list, selectedIndex} = this.state
        if(selectedIndex < 0)
            return this.handleChange('list', [{text:'new'}, ...list])
        const pre = list.slice(0,selectedIndex+1)
        const back = list.slice(selectedIndex+1, list.length)
        this.handleChange('list', [...pre, {text:'new'}, ...back])
    }
    DeleteItem = ()=>{
        const {list, selectedIndex} = this.state
        if(selectedIndex < 0) return;
        else if(selectedIndex === list.length - 1)
            this.handleChange('selectedIndex', selectedIndex-1)
        const pre = list.slice(0,selectedIndex)
        const back = list.slice(selectedIndex+1, list.length)
        this.handleChange('list', [...pre, ...back])

    }
    getEditer = (index)=>{
        if(index < 0) return null;
        const list = this.state.list
        const item = list[index]
        const color = this.hexToRGB(item.color)
        return (
            <div key={index}>
                <table>
                    <tbody>
                        <tr>
                            <td style={{backgroundColor:item.color?item.color:'#121111', color:'#fff'}}>
                                color
                            </td>
                            <td>
                                R <input type="text" style={{width:'25px'}}
                                        value={color.R}
                                        onChange={(e)=>{
                                            list[index].color = this.RGBtoHex(parseInt(e.target.value), color.G, color.B)
                                            console.log(list)
                                            this.handleChange('list', list)
                                        }}
                                    />
                                G <input type="text" style={{width:'25px'}}
                                        value={color.G}
                                        onChange={(e)=>{
                                            list[index].color = this.RGBtoHex( color.R, parseInt(e.target.value), color.B)
                                            this.handleChange('list', list)
                                        }}
                                    />
                                B <input type="text" style={{width:'25px'}}
                                        value={color.B}
                                        onChange={(e)=>{
                                            list[index].color = this.RGBtoHex( color.R, color.G, parseInt(e.target.value))
                                            this.handleChange('list', list)
                                        }}
                                    />
                            </td>
                            <td>
                                Size
                            </td>
                            <td>
                                <input type="text" style={{width:'25px'}}
                                    onChange={(e)=>{
                                        list[index].fontSize = parseInt(e.target.value)
                                        this.handleChange('list', list)
                                    }}
                                    value={item.fontSize?item.fontSize:0}
                                />
                                pt
                            </td>
                        </tr>
                    </tbody>
                </table>
                <textarea style={{width:'100%'}}
                    rows={20}
                    value={item.text}
                    onChange={(e)=>{
                        list[index].text = e.target.value
                        this.handleChange('list', list)
                    }}
                />
                링크  
                <select value={item.link}
                    onChange={(e)=>{
                        list[index].link = e.target.value
                        this.handleChange('list', list)
                    }}>
                    <option value=''>없음</option>
                    <option value="Loginpage">로그인 페이지</option>
                    <option value="Signuppage">회원가입</option>
                    <option value="Findidpage">아이디 찾기</option>
                    <option value="Findpasswordpage">비밀번호 찾기</option>
                    <option value="Planpage">플랜 선택</option>
                    <option value="Userinfopage">개인정보</option>
                    <option value="Accountinfopage">계정정보</option>
                    <option value="Noticepage">공지사항</option>
                    <option value="HumanModal">휴면계정으로</option>
                </select>
            </div>
        )
    }
    render(){
        const {title, list, selectedIndex} = this.state
        const items = list.map((item, index)=>{
            return(
                <div key={index} style={{width:'95%', cursor:'pointer'}}
                    onClick={ ()=>this.handleChange('selectedIndex', index)}>
                        <span style={{width:'15%', float:'left', textAlign:'center', margin:'auto', fontSize:10}}>
                            <p>{item.link && item.link.length > 0 ? Pagelist[item.link] : ''}</p>
                        </span>
                        <span style={{width:'85%', float:'left'}} className={index===selectedIndex ? "SelectedItem" : ""}>
                            <p style={{
                                color: item.color ? item.color : '#121111',
                                fontSize: item.fontSize ? item.fontSize : 10,
                                fontWeight: item.fontWeight ? item.fontWeight : 'normal' }}>
                                {item.link&&item.link.length>0 ? (<u>{item.text}</u>):item.text}
                            </p>
                        </span>
                </div>)
        })
        return (
            <div>
                제목 <input type="text" value={title} onChange={(e)=>this.handleChange('title', e.target.value)}/>
                <div>
                    <button onClick={this.updateNotice}>저장하기</button>
                    <button onClick={this.AddItem}>추가하기</button>
                    <button onClick={this.DeleteItem}>삭제하기</button>
                </div>
                <div>
                    <span style={{width:'50%', float:'left'}}>
                        {items}
                    </span>
                    <span style={{width:'30%', float:'left'}}>
                        {selectedIndex >=0 ? this.getEditer(selectedIndex) : null}
                    </span>
                </div>

            </div>
        )
    }

}


const Pagelist = {
    'Loginpage':'로그인 페이지',
    'Signuppage':'회원가입',
    "Findidpage":'아이디 찾기',
    "Findpasswordpage":'비밀번호 찾기',
    "Planpage":'플랜 선택',
    "Userinfopage":'개인정보',
    "Accountinfopage":'계정정보',
    "Noticepage":'공지사항',
    "HumanModal":"휴면계정으로"
}