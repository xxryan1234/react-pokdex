/**
 *
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';

import Pokedex from 'components/Pokedex';
import TrainerInfo from 'components/TrainerInfo';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import reducer from './reducer';
import saga from './saga';

import {
  makeSelectPokeList,
  makeSelectPokeRoster,
  makeSelectFocusedPokemon,
  makeSelectPokeNatures,
} from './selectors';
import {
  getPokeResources as getPokeResourcesAction,
  selectPokemon as selectPokemonAction,
  updatePokemonInfo,
} from './actions';

const Wrapper = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {
  state = {
    filter: '',
  };

  componentDidMount() {
    this.props.getPokeResources();
  }

  updateFilter = filter => {
    this.setState({ filter });
  };

  filterPokemon = filter => {
    const { pokeList } = this.props;
    let filteredPokemon = pokeList;

    if (filter) {
      filteredPokemon = filteredPokemon.filter(pokemon =>
        pokemon.name.includes(filter),
      );
    }

    return filteredPokemon;
  };

  render() {
    const {
      selectPokemon,
      pokeRoster,
      pokeNatures,
      focusedPokemon,
      updatePokemon,
    } = this.props;
    const { filter } = this.state;
    const filteredPokeList = this.filterPokemon(filter);

    return (
      <Wrapper>
        <TrainerInfo
          selectPokemon={selectPokemon}
          pokeRoster={pokeRoster}
          focusedPokemon={focusedPokemon}
          updatePokemon={updatePokemon}
          pokeNatures={pokeNatures}
        />
        <Pokedex
          pokeList={filteredPokeList}
          selectPokemon={selectPokemon}
          filter={filter}
          updateFilter={this.updateFilter}
        />
      </Wrapper>
    );
  }
}

HomePage.propTypes = {
  getPokeResources: PropTypes.func.isRequired,
  selectPokemon: PropTypes.func.isRequired,
  updatePokemon: PropTypes.func.isRequired,
  pokeList: PropTypes.array.isRequired,
  pokeRoster: PropTypes.array.isRequired,
  pokeNatures: PropTypes.array.isRequired,
  focusedPokemon: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  pokeList: makeSelectPokeList(),
  pokeRoster: makeSelectPokeRoster(),
  pokeNatures: makeSelectPokeNatures(),
  focusedPokemon: makeSelectFocusedPokemon(),
});

function mapDispatchToProps(dispatch) {
  return {
    getPokeResources: () => dispatch(getPokeResourcesAction()),
    selectPokemon: pokemon => dispatch(selectPokemonAction(pokemon)),
    updatePokemon: pokemon => dispatch(updatePokemonInfo(pokemon)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'homePage', reducer });
const withSaga = injectSaga({ key: 'homePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
