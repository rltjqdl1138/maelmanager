import React, {Component} from 'react'
import Sound from './SoundList'
import Sidebar from './Sidebar'

export default class MainContainer extends Component{
    getMain = (page, subPage)=>{
        switch(page){
            case 0:
                return (<Sound page={subPage} />)
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