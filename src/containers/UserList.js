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
                return (<div />)
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
    render(){
        return (
            <div>

            </div>
        )
    }
}


class StayUserList extends Component{
    render(){
        return (
            <div>

            </div>
        )
    }
}

