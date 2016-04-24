/**
 * Created by tadas on 2016-04-20.
 */
import React from 'react';
import ReactDOM from 'react-dom';


class Alert extends React.Component {
    constructor() {
        super();
        return{
            active: true,
            text: this.props.text,
            type: this.props.type
        };
    }

    componentDidMount() {
        setTimeout(this.handleTimeout, 5000);
    }

    handleTimeout() {
        this.setState({
            active: false
        });
    }

    render() {
        if (this.state.active) {
            return (
                <div className={classNames('alert', 'alert-'+this.state.type)}>
                    <span>{this.state.text}</span>
                </div>
            )
        } else {
            return (null)
        }
    }
}

module.exports = Alert;

console.log("Alert Works.")