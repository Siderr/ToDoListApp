import React from 'react';
import ReactDOM from 'react-dom';

class TaskForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: ''};
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        var text = this.state.text.trim();
        if (!text) {
            return;
        }
        this.props.onTaskSubmit(text);
        this.setState({text: ''});
    }

    render() {
        return (
            <div className="taskForm">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <input type="text" placeholder="New TODO here"
                           value={this.state.text}
                           onChange={this.handleTextChange.bind(this)}/>
                    <input className={"btn btn-primary"} type="submit" value="Add"/>
                </form>
            </div>
        )
    }
}

module.exports = TaskForm;

// ReactDOM.render(
//     <TaskForm/>,
//     document.getElementById('formTest')
// )
// console.log("Task Form works.")