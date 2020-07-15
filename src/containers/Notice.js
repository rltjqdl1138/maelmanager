import React, {Component} from 'react'
import axios from 'axios'

export default class Notice extends Component{
    constructor(props){
        super(props)
        this.state={list:[], selectedIndex:-1}
    }
    componentDidMount(){
        this.getNoticeList()
    }
    handleChange = (field, value) => this.setState({ [field]: value })
    getNoticeList = async()=>{
        const response = await axios.get('/api/notice')
        if(!response.data.success) return;
        this.setState({list: response.data.data, selectedIndex:-1})
    }
    getMain = (page, id)=>{
        switch(page){
            case 0:
                return (<NoticeItem id={id}/>)
            default:
                return (<div />)
        }
    }
    render(){
        const {page} = this.props
        const {list, selectedIndex} = this.state
        const menu = list.map((item, index)=>(
            <li key={index}
                className={index===selectedIndex?"SelectedItem":""}
                onClick={()=>this.handleChange('selectedIndex', index)}
                >
                {item}
            </li>
        ))
        return (
            <div className="MainContainer">
                <div className="MainTitle">
                    게시판 관리
                </div>
                <ul>{menu}</ul>
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
                            <td>
                                Link
                            </td>
                            <td>
                                {item.link ? item.link : ''}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <textarea style={{width:'100%'}}
                    rows={5}
                    value={item.text}
                    onChange={(e)=>{
                        list[index].text = e.target.value
                        this.handleChange('list', list)
                    }}
                />
            </div>
        )
    }
    render(){
        const {title, list, selectedIndex} = this.state
        const items = list.map((item, index)=>{
            return(
                <div key={index} style={{width:'80%'}}
                    onClick={ ()=>this.handleChange('selectedIndex', index)}>
                    <p className={index===selectedIndex ? "SelectedItem" : ""}
                        style={{
                        color: item.color ? item.color : '#121111',
                        fontSize: item.fontSize ? item.fontSize : 10,
                        fontWeight: item.fontWeight ? item.fontWeight : 'normal'
                    }}>
                        {item.text}
                    </p>
                    {index === selectedIndex ? this.getEditer(index) : null}
                </div>)
        })
        return (
            <div>
                {title}
                {items}
            </div>
        )
    }

}