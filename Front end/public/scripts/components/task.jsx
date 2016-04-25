/**
 * Created by tadas on 2016-04-20.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from '../classnames.js';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {editing: false};
    }

    componentDidUpdate() {
        if( this.refs.taskInput != null)
        ReactDOM.findDOMNode(this.refs.taskInput).focus();
    }

    handleSubmit(e) {
        var text = this.state.editText.trim();
        this.props.onUpdate(this.props.id, text);
        this.editing = false;
        this.forceUpdate();
    }

    handleDelete() {
        this.props.onTaskDelete(this.props.id);
    }

    complete() {
        this.props.onComplete(this.props.id);
    }

    edit(e) {
        e.preventDefault();
        this.editing = true;
        this.setState({editText: this.props.text});
        this.forceUpdate();
    }

    handleChange(e) {
        this.setState({editText: e.target.value});
    }

    handleKeyDown(e) {
        if (e.which === ESCAPE_KEY) {
            this.editing = false;
            this.forceUpdate();
        } else if (e.which === ENTER_KEY) {
            this.handleSubmit(e);
        }
    }

    render() {
        var label = classNames({
            'completed': this.props.completed
        });
        if (!this.editing) {
            return (
                <div className="task">
                    <input type="checkbox" checked={this.props.completed} onChange={this.complete.bind(this)}></input>
                    <label className={label} onDoubleClick={this.edit.bind(this)}>{this.props.text}</label>
                    <a onClick={this.handleDelete.bind(this)}>
                        <i className={"fa fa-trash"}></i>
                    </a>
                </div>
            )
        } else {
            return (
                <div className="task">
                    <input type="checkbox" checked={this.props.completed} onChange={this.complete.bind(this)}></input>
                    <input className="taskEdit" value={this.state.editText}
                           onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}
                           onBlur={this.handleSubmit.bind(this)} ref={"taskInput"}></input>
                    <a onClick={this.handleDelete.bind(this)}>
                        <i className={"fa fa-trash"}></i>
                    </a>
                </div>
            )
        }
    }
}

module.exports = Task;