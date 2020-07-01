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
            registeredIndex:0,
            registeredIndex:0,
            registered:result.data.result,
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
    registerItem = ()=>{
        const right = this.state.unregistered[this.state.unregisteredIndex].ID
        console.log(right)
    }
    unregisterItem = ()=>{

        const left = this.state.registered[this.state.registeredIndex].ID
        console.log(left)

    }
    render(){
        
        return (
            <div className="MainContentContainer">
                <div className="ThemeContainer">
                    <div>저장된거
                        <button onClick={this.unregisterItem}>삭제</button>
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