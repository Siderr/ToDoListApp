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
                    <input type="checkbox" checked={this.props.completed} onChange={this.complete}></input>
                    <label className={label} onDoubleClick={this.edit}>{this.props.text}</label>
                    <a onClick={this.handleDelete}>
                        <i className={"fa fa-trash"}></i>
                    </a>
                </div>
            )
        } else {
            return (
                <div className="task">
                    <input type="checkbox" checked={this.props.completed} onChange={this.complete}></input>
                    <input className="taskEdit" value={this.state.editText}
                           onChange={this.handleChange} onKeyDown={this.handleKeyDown}
                           onBlur={this.handleSubmit}></input>
                    <a onClick={this.handleDelete}>
                        <i className={"fa fa-trash"}></i>
                    </a>
                </div>
            )
        }
    }
}

module.exports = Task;