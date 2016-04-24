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
    changeFilter(e) {
        e.preventDefault();
        this.props.onChangeFilter(e.target.innerHTML);
    }
    render() {
        var filter = this.props.currentFilter;
        return (
            <div className="taskFilter">
                <button className={classNames('btn', 'btn-default',{ 'btn-primary' : filter == ALL})}
                        onClick={this.changeFilter}>All
                </button>
                <button className={classNames('btn', 'btn-default',{ 'btn-primary' : filter == ACTIVE})}
                        onClick={this.changeFilter}>Active
                </button>
                <button className={classNames('btn', 'btn-default',{ 'btn-primary' : filter == COMPLETED })}
                        onClick={this.changeFilter}>Completed
                </button>
            </div>
        )
    }
}

module.exports = TaskFilter;

// ReactDOM.render(
//     <TaskFilter currentFilter={"All"}/>,
//     document.getElementById('content')
// )
// console.log("Task Filter works.")
