import React, { Component } from 'react'
import './Bench.css'
import PlayerModal from '../../Modals/PlayerModal'

let saleRibbon = require('../../../assets/saleRibbon.png');

export default class BenchItem extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    if (this.props.player.offer == null) {
      this.setState({ playerOffered: false });
    } else {
      this.setState({ playerOffered: true });
    }
    this.setState({ player: this.props.player });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.player.offer == null) {
      this.setState({ playerOffered: false });
    } else {
      this.setState({ playerOffered: true });
    }
    this.setState({ player: nextProps.player });
  }

  openModal = () => {
    this.refs.playerModal.setVisible(true);
  }


  onOfferPlayer = () => {
    this.setState({ playerOffered: true });
  }

  onRemoveOffer = () => {
    this.setState({ playerOffered: false });
  }

  render() {

    return (
      // style={{opacity: this.props.player.offer == null ? 1 : 0.4}}
      <div>
        <a>
          <div onClick={() => this.openModal()} className="benchItem">
            <img draggable="false" style={{ display: !this.state.playerOffered ? "none" : "block" }}
              src={saleRibbon} className="ribbon" alt="" />
            <img draggable="false" className="benchItemPic" alt=""
              src={this.state.player.info.headshot} />
            <p className="benchItemName" >{this.state.player.info.name.substr(0, 13)}</p>
            <p className="benchItemRating">{this.props.player.info.rating}</p>
            <img draggable="false" className="benchItemclub" alt=""
              src={this.state.player.club.logo} />
          </div>
        </a>

        <PlayerModal web3={this.props.web3}
          action={!this.state.playerOffered ? "offer" : "updateOffer"}
          player={this.state.player}
          onOfferPlayer={this.onOfferPlayer}
          onRemoveOffer={this.onRemoveOffer}
          ref='playerModal' />
      </div>
    )
  }
}
