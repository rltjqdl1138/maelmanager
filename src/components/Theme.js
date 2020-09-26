import React, {Component} from 'react'
import axios from 'axios'
export default class Theme extends Component{
    constructor(props){
        super(props)
        this.state = {
            registered:[],
            unregistered:[],
            registeredIndex:0,
            unregisteredIndex:0
        }
    }
    componentDidMount(){
        this.getTheme()
    }
    handleChange = (field, value) => this.setState({ [field]: value })
    getTheme = async () =>{
        const result = await axios.get('/api/media/theme?type=1')
        const result2 = await axios.get('/api/media/theme?type=2')
        this.setState({
            ...this.state,
            registered:result.data.result.sort((a,b)=>a.theme-b.theme),
            unregistered:result2.data.result
        })
    }
    getList = (list, a)=>{
        const l = list.map( (item, index)=>{
            const isSelected= (a===1&&index===this.state.registeredIndex)||(a===2&&index===this.state.unregisteredIndex)
            const ll = item.list.map(it=>( <li key={it.ID}> {it.title} </li> ))
            return (
                <div className={isSelected?"ThemeItem SelectedItem":"ThemeItem"}
                    key={item.ID}
                    onClick={()=>{this.handleChange(a===1?'registeredIndex':'unregisteredIndex',index)}}>
                    <p>{item.title}</p>
                    <ul>{ll}</ul>
                </div>
            )
        })
        return ( <div>{l}</div> )
    }
    moveDownItem = async ()=>{
        const left = this.state.registered[this.state.registeredIndex].ID
        const response = await axios.put('/api/media/theme', {id:left, method:'down'})
        if(response.data.success)
            this.handleChange('registeredIndex', this.state.registeredIndex+1)
        this.getTheme()
    }
    moveUpItem = async ()=>{
        const left = this.state.registered[this.state.registeredIndex].ID
        const response = await axios.put('/api/media/theme', {id:left, method:'up'})
        if(response.data.success)
            this.handleChange('registeredIndex', this.state.registeredIndex-1)
        this.getTheme()
    }
    registerItem = async ()=>{
        const right = this.state.unregistered[this.state.unregisteredIndex].ID
        const response = await axios.put('/api/media/theme', {id:right, method:'append'})
        console.log(response)
        this.getTheme()
    }
    unregisterItem = async ()=>{
        const left = this.state.registered[this.state.registeredIndex].ID
        const response = await axios.put('/api/media/theme', {id:left, method:'remove'})
        console.log(response)
        this.getTheme()
    }
    render(){
        return (
            <div className="MainContentContainer">
                <div className="ThemeContainer">
                    <div>저장된거
                        <button onClick={this.unregisterItem}>삭제</button>
                        <button onClick={this.moveUpItem}>위로</button>
                        <button onClick={this.moveDownItem}>아래로</button>
                        {this.getList(this.state.registered, 1)}
                    </div>
                    <div>안 저장된거
                        <button onClick={this.registerItem}>등록</button>
                        {this.getList(this.state.unregistered, 2)}
                    </div>
                </div>
                <div>

                </div>
            </div>
        )
    }
}