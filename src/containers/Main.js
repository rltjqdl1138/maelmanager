import React, {Component} from 'react'
import Sound from './SoundList'
import Analysis from './Analysis'
import UserList from './UserList'
import Sidebar from './Sidebar'
import Notice from './Notice'

export default class MainContainer extends Component{
    getMain = (page, subPage)=>{
        switch(page){
            case 0:
                return (<Sound page={subPage} />)
            case 1:
                return null
            case 2:
                return (<UserList page={subPage} />)
            case 3:
                return (<Notice page={subPage} />)
            case 4:
                return null
            case 5:
                return (<Analysis page={subPage} />)
            case 6:
                return null
            default:
                return null

        }
    }
    render(){
        const {page, subPage, menu} = this.props
        return(
            <div className="Main">
                <Sidebar
                    menu={menu[page]}
                    page={subPage}
                    onClick={(sub)=>this.props.onClick(page,sub)}
                />
                {this.getMain(page, subPage)}
            </div>
        )
    }

}