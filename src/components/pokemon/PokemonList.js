// ------------------------------------------------- //
// Evan MacHale - N00150552
// 12.01.19
// List of Pokemon
// ------------------------------------------------- //

import React, { Component } from 'react';
import axios from 'axios';
// Material Design Components
import { Grid, Row } from '@material/react-layout-grid';

// ------------------------------------------------- //

// My components
import PokemonCard from './PokemonCard';
import Search from './../Search'

// ------------------------------------------------- //

class PokemonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemon: [],
      types: [],
      searchText: '',
    }
    this.handleChange = this.handleChange.bind(this);
  }

  /*
    https://pokeapi.co/api/v2/pokedex/1/ holds a specific list of pokemon
    Each pokemon we want to use is stored at a seperate address
    So we pass response 'entry_number' to the pokemon URL
    `https://pokeapi.co/api/v2/pokemon/${pokedex.entry_number}/`

    Why not just use `https://pokeapi.co/api/v2/pokemon/` to get all ???
    That URL is the same as https://pokeapi.co/api/v2/pokedex/1/
    It only holds Id's and not the pokemon details we want to List

    The difference is that 'pokedex' holds a specific number (no duplicates)
    but 'pokemon' holds every single version and alternative appearences of all pokemon
  */

  componentDidMount() {
    axios.get('https://pokeapi.co/api/v2/pokedex/2/')
    .then(response => {

      // Loop through each entry and request each pokemon by entry
      response.data.pokemon_entries.forEach(pokedex => {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokedex.entry_number}/`)
        .then(response => {
          /*
            I was mutating data -> use .concat instead of .push
            https://reactjs.org/docs/optimizing-performance.html#the-power-of-not-mutating-data
            https://stackoverflow.com/questions/41052598/reactjs-array-push-function-not-working-in-setstate/41052635
          */
          const pokemon_types = response.data.types.map(t => {return t.type.name}); // Can be more than one
          this.setState(prevState => {
            /*
              Is this messy? -> should I have logic in setState?
              Take previous list + add new types, then sort
              Replace old list with new sorted list for dropdown menu
            */
            const types_deduped = [...new Set(prevState.types.concat(pokemon_types))];
            types_deduped.sort();
            return {
              pokemon: prevState.pokemon.concat(response.data),
              types: types_deduped
            }
          });
        });
      });

    })
    .catch(error => console.log(error));
  }

  handleChange(event) {
    this.setState({
      searchText: event.target.value
    });
  }

  render() {

    let pokemon = this.state.pokemon.map(p => {
      const nameMatch = p.name.startsWith(this.state.searchText);
      return (nameMatch) ? (
        <PokemonCard
          key={p.id}
          name={p.name}
          sprite={p.sprites.front_default}
          types={p.types}
        />
      ) : null;
    });

    return (
      <Grid>
        <Row>
          <Search value={this.state.searchText} handleChange={this.handleChange}/>
        </Row>
        <Row>{pokemon}</Row>
      </Grid>
    );
  }
}

// ------------------------------------------------- //

export default PokemonList;

// ------------------------------------------------- //
