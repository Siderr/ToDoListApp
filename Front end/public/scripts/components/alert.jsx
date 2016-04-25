/**
 * Created by tadas on 2016-04-20.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from '../classnames.js';


class Alert extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleTimeout = this.handleTimeout.bind(this);
        this.state = {
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

    componentWillReceiveProps(newProps) {
        this.setState({
            text: newProps.text,
            type: newProps.type,
            active: true
        });
        this.forceUpdate();
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