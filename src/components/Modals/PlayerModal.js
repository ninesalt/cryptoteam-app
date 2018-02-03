import React, { Component } from 'react'
import { Modal, Button, notification } from 'antd';
import config from '../../config'

let web3;

export default class PlayerModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        }
    }

    componentDidMount = () => {
        web3 = this.props.web3;
    }

    setVisible = (visibility) => {
        this.setState({ visible: visibility });
    }


    purchase = (player) => {

        this.setState({ confirmLoading: true });
        let price = web3.toWei(player.price, 'ether');

        web3.eth.sendTransaction({
            from: web3.eth.accounts[0],
            to: config.contract,
            value: price
        }, (err, txHash) => {

            this.setState({
                visible: false,
                confirmLoading: false
            });

            if (!err) {
                const args = {
                    message: 'Purchase Successful',
                    description: `You have successfully bought ${player.name} 
                    for ${ player.price} ETH.
                    Transaction hash: ${ txHash}`,
                    duration: 3,
                    style: {
                        width: 500,
                        marginLeft: -100,
                    }
                };
                notification['success'](args);
            }

            else {
                const args = {
                    message: 'Error Purchasing Player',
                    description: `An error occurred while trying to 
                purchase this player. Please try again later`,
                    duration: 3.5
                };
                notification['error'](args);
            }


        })

    }


    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        return (

            <div>

                <Modal
                    title={this.props.player.name}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.confirmLoading}
                    footer={[

                        <Button key="back" onClick={this.handleCancel}>Cancel</Button>,

                        <Button key="submit" type="primary"
                            onClick={() => this.purchase(this.props.player)}>
                            Buy for {this.props.player.price} ETH
                        </Button>
                    ]}>

                    <p><b>First Name: </b> {this.props.player.firstName}</p>
                    <p><b>Last Name:  </b>{this.props.player.lastName}</p>
                    <p><b>Position:  </b>{this.props.player.position}</p>
                    <p><b>Rating: </b>{this.props.player.rating}</p>

                </Modal>

            </div >
        )
    }
}