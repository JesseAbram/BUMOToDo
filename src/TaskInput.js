import React, { Component } from 'react';
import BumoSDK from 'bumo-sdk';



const sdk = new BumoSDK({
  host: '192.168.33.10:36002',
  //host: 'seed1.bumotest.io:26002',
})
class TaskInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      taskLength: 0,
    }
    this.handleWriteBlockcahin = this.handleWrieBlockchain.bind(this);
    this.convertToHex = this.convertToHex.bind(this);
    this.handleFinishtask = this.handleFinishtask.bind(this);

  }



  handleWrieBlockchain = async (e) => {


    const operationInfo = await sdk.operation.contractInvokeByBUOperation({
      contractAddress: 'buQswKLuqPUSDQjsfqh4CZ9i3NPWevTNuvnk',
      input: JSON.stringify({
        method: 'add',
        params: {
          "completed": false,
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
    const blobHexFormat = await this.convertToHex(blob)

    let signatureInfo = sdk.transaction.sign({
      privateKeys: ['privbtEELf99kKzMAPJU17ceYzz5d6y8Y5gbEKc7WySG9NRAEmGibkiG'],
      blob: blobHexFormat
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
  handleFormSubmit = (e) => {
    e.preventDefault();
  }


  handleMessageChange = (e) => {
    if (e.target.value.length <= 50) {
      this.setState({
        task: e.target.value,
        taskLength: e.target.value.length,
      });
    }
  }


  convertToHex = (blob) => {
    const buffer = blob.split(',').map(e => Number(e))
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

  render() {

    return (
      <form className="field"
        onSubmit={this.handleFormSubmit}>

        <div className="columns">
          <div className='column'>
            <div className="control has-icons-left">
              <span className="icon is-small is-left">
                <i className="fa fa-user"></i>
              </span>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label level">
            Message:
         <p className="help is-info">{50 - this.state.taskLength} Char Left</p>
          </label>
          <div className="control has-icons-left">
            <textarea className="textarea"
              type="text"
              placeholder="add a task"
              maxLength="50"
              onChange={this.handleMessageChange} />
          </div>
        </div>
        <div>

        </div>
        {/* <div className='columns level'>
          {this.state.notFilledOut &&
            <p className="help is-danger">
              Please complete sections
            </p>
          }
        </div> */}

  

        <div>
          <button
            className="button is-primary"
            onClick={() => this.handleWrieBlockchain()}>
            send
     </button>
          <button
            className="button is-primary"
            onClick={() => this.handleFinishtask()}>
            mark done
     </button>
        </div>

      </form>



    );
  }
}

export default TaskInputs;
