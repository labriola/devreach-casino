const shuffle = require('shuffle-array');

export const PLAYING = 'Playing';
export const RESULT_PUSH = 'Push';
export const RESULT_PLAYER_WIN = 'Player Win';
export const RESULT_DEALER_WIN = 'Dealer Win';
export const RESULT_PLAYER_BUST = 'Player Bust';
export const RESULT_DEALER_BUST = 'Dealer Bust';

const MAX_SUM = 21;

const toPossibleScores = (...values) => {
  return existingScores => existingScores.reduce((acc, score)=>{
    return [...acc, ...values.map(value=>score + value)];
  }, []);
};

const toCard = (name, toValueFn) => suit => {
  return {
    path: `${name}${suit}.png`,
    toValueFn
  };
};

const toDeck = () => {
  const pipCards = Array.from({length: 9}, (v, i)=>i+2);
  const courtCards = ['J', 'Q', 'K'];
  const suits = ['C', 'D', 'H', 'S'];

  return [
    ...pipCards.reduce((acc, value)=>[...acc, ...suits.map(toCard(value, toPossibleScores(value)))], []),
    ...courtCards.reduce((acc, name)=>[...acc, ...suits.map(toCard(name, toPossibleScores(10)))], []),
    ...suits.map(toCard('A', toPossibleScores(1, 11)))
  ];
};

const toInitialState = (decks=1) => {
  return {
    deck : Array.from({length: decks}, ()=>shuffle(toDeck())).reduce((acc, deck)=>[...acc, ...deck], [])
  };
};

export const totalOf = (hand) => {
  const possibleValues = hand.reduce((totals, {toValueFn}) => toValueFn(totals), [0]);

  //find best outcome
  return possibleValues.reduce((best, value)=>{
    return (best > MAX_SUM || (value > best && value <=MAX_SUM)) ? value : best;
  });
};

const toFinalStatus = (playerTotal=0, dealerTotal=0) => {
  if (dealerTotal > MAX_SUM) return RESULT_DEALER_BUST;
  if (playerTotal > MAX_SUM) return RESULT_PLAYER_BUST;
  if (dealerTotal === playerTotal) return RESULT_PUSH;

  return playerTotal > dealerTotal
            ? RESULT_PLAYER_WIN
            : RESULT_DEALER_WIN;
};

export const dealReducerFn = (s0={}) => {
  const {
    deck=[]
  } = s0;

  const [card1, card2, card3, card4, ...remainder] = deck;
  const playerHand = [card1, card3];
  const dealerHand = [card2, card4];

  return {
    ...s0,
    playerHand,
    dealerHand,
    deck: remainder,
    status: PLAYING
  };
};

export const hitReducerFn = (s0={}) => {
  const {
    deck=[],
    playerHand=[],
    status: existingStatus
  } = s0;

  const [card, ...remainder] = deck;
  const newPlayerHand = [...playerHand, card];
  const playerTotal = totalOf(newPlayerHand);

  return {
    ...s0,
    playerHand: newPlayerHand,
    deck: remainder,
    status : playerTotal > MAX_SUM ? toFinalStatus(playerTotal) : existingStatus
  };
};

export const standReducerFn = (s0={}) => {
  const {
    deck=[],
    dealerHand=[],
    playerHand=[]
  } = s0;

  const dealerTotal = totalOf(dealerHand);
  if (dealerTotal < 17) {
    const [card, ...remainder] = deck;
    const newDealerHand = [...dealerHand, card];

    return standReducerFn({
      ...s0,
      dealerHand: newDealerHand,
      deck: remainder
    });
  }

  return {
    ...s0,
    status : toFinalStatus(totalOf(playerHand), dealerTotal)
  };
};

const identity = x => x;
export const gameReducer = (s0=toInitialState(4), reducerFn=identity)=>{
  return reducerFn(s0);
};
