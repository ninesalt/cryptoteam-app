import React, { Component } from 'react'
import { Modal, Button, notification, InputNumber } from 'antd';
import config from '../../config'
import { offerPlayer } from '../../firebase/db'
import './PlayerModal.css';
let web3;

export default class PlayerModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        }
    }

    componentDidMount = () => {
        web3 = this.props.web3;
        this.setState({ action: this.props.action });
    }

    setVisible = (visibility) => {
        this.setState({ visible: visibility });
    }

    offerPlayer = () => {
        let playerData = this.props.player;
        let sellerId = "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2";

        if (!isNaN(this.state.price)) {
            offerPlayer(playerData, sellerId, this.state.price, (offerId) => {
                this.setState({ visible: false });
                this.setState({ action: "updateOffer" });
                this.props.onOfferPlayer();
            });
        } else {
            alert("Please enter a valid number");
        }
    }


    purchase = (player) => {

        this.setState({ confirmLoading: true });
        let price = web3.toWei(this.props.price, 'ether');
        //replace with contract instance and ABI
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
                    description: `You have successfully bought ${player.info.name} 
                    for ${ this.props.price} ETH.
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
                console.log(err);
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

    cancelOffer() {

    }

    updateOffer() {

    }

    updatePrice = (newPrice) => {
        this.setState({ price: newPrice });
    }


    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        return (

            <div>

                <Modal
                    className="player-modal"
                    title={this.props.player.name}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.confirmLoading}
                    footer={[

                        <Button key="back" onClick={this.handleCancel}>Cancel</Button>,

                        <Button style={{ display: this.state.action === "buy" ? "inline" : "none" }}
                            key="buy" type="primary"
                            onClick={() => this.purchase(this.props.player)}>
                            Buy for {this.props.price} ETH
                        </Button>,

                        <Button style={{ display: this.state.action === "offer" ? "inline" : "none" }}
                            key="offer" type="primary"
                            onClick={() => this.offerPlayer()}>
                            Offer Player
                        </Button>,

                        <Button style={{ display: this.state.action === "updateOffer" ? "inline" : "none" }}
                            key="update-offer" type="primary"
                            onClick={() => this.updateOffer()}>
                            Update Offer
                        </Button>,

                        <Button style={{ display: this.state.action === "updateOffer" ? "inline" : "none" }}
                            key="cancel-offer"
                            type="danger"
                            className="remove-button"
                            onClick={() => this.cancelOffer()}>
                            Cancel Offer
                        </Button>,

                        <InputNumber min={0} key={1}
                            defaultValue={this.props.player.offer ? this.props.player.offer.price : null}
                            placeholder="ETH" onChange={this.updatePrice}
                            style={{
                                display: this.state.action === "offer" ||
                                    this.state.action === "updateOffer" ? "inline" : "none"
                            }}
                            className="price-input">ETH</InputNumber>
                    ]
                    }>
                    <img className="headshot" src={this.props.player.info.headshot} alt="" />
                    <div className="info">
                        <p><b>First Name: </b> {this.props.player.info.firstname}</p>
                        <p><b>Last Name:  </b>{this.props.player.info.lastname}</p>
                        <p><b>Position:  </b>{this.props.player.info.position}</p>
                        <p><b>Rating: </b>{this.props.player.info.rating}</p>
                    </div>
                    {/* <PlayerCard playerInfo={this.props.player}/> */}

                </Modal >

            </div >
        )
    }
}
