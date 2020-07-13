import React, {Component} from 'react'
import axios from 'axios'

export default class Analysis extends Component{
    getMain = (page)=>{
        switch(page){
            case 0:
                return (<SignupAnalysis />)
            case 1:
                return (<SoundAnalysis />)
            case 2:
                return (<SaleAnalysis />)
            default:
                return (<div />)
        }
    }
    render(){
        const {page} = this.props
        return this.getMain(page)
    }
}
class SignupAnalysis extends Component{
    render(){
        return (
            <div>

            </div>
        )
    }
}


class SoundAnalysis extends Component{
    render(){
        return (
            <div>

            </div>
        )
    }
}

class SaleAnalysis extends Component{
    render(){
        return (
            <div>

            </div>
        )
    }
}
