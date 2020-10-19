import React, { useReducer } from 'react';
import {
  gameReducer,
  dealReducerFn,
  hitReducerFn,
  standReducerFn,
  PLAYING
} from './labriola';

const Controls = props => {
  const {
    dealOnClick,
    hitOnClick,
    standOnClick,
    status
  } = props;

  return (
    <div className="blackjack-controls">
      <button
        className="blackjack-button"
        onClick={dealOnClick}
        disabled={status === PLAYING}>Deal</button>
      <button
        className="blackjack-button"
        onClick={hitOnClick}
        disabled={status !== PLAYING}>Hit</button>
      <button
        className="blackjack-button"
        onClick={standOnClick}
        disabled={status !== PLAYING}>Stand</button>
    </div>
  )
};

const Hand = ({ status, hand=[], isDealer = false }) => {
  return hand.map(({ path }, index) => {
    if (!status && isDealer && index === 0) {
      return <img src={'/cards/back.png'} alt={path} key={path} />;
    }
    return <img src={`/cards/${path}`} alt={path} key={path} />;
  });
};

const MichaelLabriola = () => {

  const [state, dispatch] = useReducer(gameReducer, undefined, gameReducer);
  const {
    playerHand = [],
    dealerHand = [],
    status
  } = state;

  return (
    <>
      <h2>Michael Labriola</h2>
      <section className="blackjack">
        <div className="cards">
          <Hand hand={dealerHand} status={status} isDealer={true} />
        </div>
        <div className="blackjack-status">
          {status}
        </div>
        <Controls
          dealOnClick={() => dispatch(dealReducerFn)}
          hitOnClick={() => dispatch(hitReducerFn)}
          standOnClick={() => dispatch(standReducerFn)}
          status={status}
        />
        <div className="cards">
          <Hand hand={playerHand} />
        </div>
      </section>
    </>
  )
}

export default MichaelLabriola;
