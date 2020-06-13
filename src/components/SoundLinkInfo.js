import React, {Component} from 'react'
import axios from 'axios'


export default class SoundLinkInfo extends Component{
    constructor(props){
        super(props)
        this.state = {MID:0, list:[]}
    }
    handleChange = (field, value) => this.setState({ [field]: value })

    getCategory = async (id)=>{
        const response = await axios.get(`/api/media/album?mid=${id}`)
        if(!response || !response.data.success || !response.data.data || !response.data.data.length)
            return;
        const list = response.data.data.map(item=> [{title:'...'},{title:'...'},{title:'...'},item])
        this.setState({MID:id, list})
    }
    listing = () => {
        if(this.state.MID !== this.props.MID)
            this.getCategory(this.props.MID)

        const newlist = this.state.list.map((item,index)=>{
            const info = `${item[0].title} > ${item[1].title} > ${item[2].title} > ${item[3].title}`
            return(
                <li key={index} >
                    {info}
                </li>
            )})
            return ( <ul>{newlist}</ul>)
    }

    render(){
        return(
            <div className="MainContentContainer">
                <div className="MainSubtitle">
                    사운드 수록정보
                </div>
                <div>
                    {this.listing()}
                </div>
            </div>
        )
    }

}