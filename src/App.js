import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.css';
import BumoSDK from 'bumo-sdk';
import TaskInput from './TaskInput'

const sdk = new BumoSDK({
  host: '192.168.33.10:36002',
  //host: 'seed1.bumotest.io:26002',
})



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTasks: [],
    }
  }

  handleReadBlockcahin = async (e) => {
    try {
      const data = await sdk.contract.call({
        optType: 2,
        contractAddress: 'buQswKLuqPUSDQjsfqh4CZ9i3NPWevTNuvnk',
      });

      // Fetch Data
      const result = JSON.parse(data.result.query_rets[0].result.value);
      const toDoArr = JSON.parse(result.toDo);


      this.setState({
        currentTasks: toDoArr
      });
    } catch (error) {
      console.log(error);
    }

  }


  convertToHex = (blob) => {
    const buffer = blob.split(',').map(e => Number(e))
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

  renderList = () => {
    // Declare Variable
    const { currentTasks } = this.state;

    console.log(currentTasks);

    // Loop through list and return task if completed
    const toDoListElements = currentTasks.map((task, index) => {

      return (
        <li key={`${index} ${task.dec || 'ok'}`}>
          {task.desc || <em>Task description not set</em>}{' '}{task.completed ? <b>✓</b> : <b>✗</b>}
        </li>
      )

    });

    return toDoListElements;
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <TaskInput />

          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >

          </a>
          <div>

          </div>
          <button
            className="button is-primary"
            onClick={this.handleReadBlockcahin}
          >
            read tasks
          </button>
          {this.renderList()}
        </header>
      </div>
    );
  }
}

export default App;
