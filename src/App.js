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
      task: undefined,
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
        currentTasks: toDoArr,
      });
    } catch (error) {
      console.log(error);
    }

  }


  convertToHex = (blob) => {
    const buffer = blob.split(',').map(e => Number(e))
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

  handleFinishtask = async (e) => {
    const operationInfo = await sdk.operation.contractInvokeByBUOperation({
      contractAddress: 'buQswKLuqPUSDQjsfqh4CZ9i3NPWevTNuvnk',
      input: JSON.stringify({
        method: 'done',
        params: {
          "desc": this.state.task,
        }
      }),
    })

    if (operationInfo.errorCode !== 0) {
      console.log(operationInfo);
      return;
    }


    const operationItem = operationInfo.result.operation;

    console.log(operationItem);

    const accountInfo = await sdk.account.getNonce('buQgvdDfUjmK56K73ba8kqnE1d8azzCRYM9G');
    if (accountInfo.errorCode !== 0) {
      console.log(accountInfo);
      return;
    }
    let non = accountInfo.result.nonce;
    let nonc = parseInt(non.substring(0)) + 1;
    let nonce = String(nonc);

    console.log(nonce);




    console.log(operationItem);


    const blobInfo = sdk.transaction.buildBlob({
      sourceAddress: 'buQgvdDfUjmK56K73ba8kqnE1d8azzCRYM9G',
      gasPrice: '1000',
      feeLimit: '3100409000',
      nonce,
      operations: [operationItem],

    })

    console.log(blobInfo.errorCode);

    if (blobInfo.errorCode !== 0) {
      console.log(blobInfo);
      return;
    }


    const blob = blobInfo.result.transactionBlob;
    console.log(blob);
    const blobHexFormat = await this.convertToHex(blob);


    let signatureInfo = sdk.transaction.sign({
      privateKeys: ['privbtEELf99kKzMAPJU17ceYzz5d6y8Y5gbEKc7WySG9NRAEmGibkiG'],
      blob: blobHexFormat,
    });


    if (signatureInfo.errorCode !== 0) {
      console.log(signatureInfo);
      return;
    }

    const signature = signatureInfo.result.signatures;

    console.log(signature);

    const transactionInfo = sdk.transaction.submit({
      blob: blobHexFormat,
      signature: signature,
    }).then(info => {
      console.log(info);
    }).catch(err => {
      console.log(err.message);
    });


    if (transactionInfo.errorCode !== 0) {
      console.log(transactionInfo);
    }
    console.log(transactionInfo);

  }
SetStateOfTask = (desc) => {
  this.setState({ 
    task: desc
  })
  console.log(desc);
  this.handleFinishtask();
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
          <button
            className="button is-primary"
            styles={{align: "right", width: "48", height: "48"}}
            onClick={() => this.SetStateOfTask(task.desc)}>
            Mark As Done
            </button>
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
          Click To Update List

          </button>
          <div align="left" >
            {this.renderList()}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
