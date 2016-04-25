/**
 * Created by tadas on 2016-04-21.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from '../classnames.js';


var ALL = "All";
var ACTIVE = "Active";
var COMPLETED = "Completed";

class TaskFilter extends React.Component {
    constructor(props){
        super(props);
        this.changeFilter = this.changeFilter.bind(this);
    }
    changeFilter(e) {
        e.preventDefault();
        this.props.onChangeFilter(e.target.innerHTML);
    }
    render() {
        var filter = this.props.currentFilter;
        return (
            <ul className="nav nav-pills">
                <li role="presentation" className={classNames({ 'active' : filter == ALL})}><a href="#" onClick={this.changeFilter}>All</a></li>
                <li role="presentation" className={classNames({ 'active' : filter == ACTIVE})}><a href="#" onClick={this.changeFilter}>Active</a></li>
                <li role="presentation" className={classNames({ 'active' : filter == COMPLETED})}><a href="#" onClick={this.changeFilter}>Completed</a></li>
            </ul>
        )
    }
}

module.exports = TaskFilter;
