'use strict';

const boardSize = 8;
const horseJumps = 64;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.timer = null;
    this.startedOn = 0;

    const board = new Array(8).fill([]).map(() => (new Array(8).fill(0)));

    this.state = { board, moves: [], removedMoves: [], solutionWasFound: false, startPosition: [0, 0], elapsed: 0 };

    this.startJourney = this.startJourney.bind(this);
    this.startTime = this.startTime.bind(this);
    this.stopTime = this.stopTime.bind(this);
  }

  setStartPosition(x, y) {
    this.setState({ startPosition: [x, y] })
  }

  bgColor(position) {
    const startPosition = this.state.startPosition;
    return startPosition[0] === position[0] && startPosition[1] === position[1] ? 'green' : '';
  }

  startTime() {
    this.startedOn = new Date().getTime();
    this.timer = window.setInterval(this.updateTime.bind(this), 55);
  }

  updateTime() {
    this.setState({ elapsed: new Date() - this.startedOn });
  }

  stopTime() {
    window.clearInterval(this.timer);
  }

  startJourney() {
    const startPosition = this.state.startPosition;
    const knightTour = new KnightTour(8, startPosition);

    this.startTime();
    const startTime = new Date();
    knightTour.start().then((resultado) => {
      this.stopTime();
      console.log('knightTourResult', resultado);
      this.setState((state) => {
        let newState = { ...state, ...resultado };

        const x = 0, y = 1;
        resultado.moves.forEach((move, index) => {
          newState.board[move[x]][move[y]] = index + 1;
        });

        newState.time = new Date() - startTime;

        return newState;
      })
    });
  }

  render() {
    return (
      <div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='row'>
              <div className='col-md-6'>
                <h2>Passeio do Cavalo:</h2>
              </div>
              <div className='col-md-3'>
                <button onClick={ this.startJourney } className='btn btn-lg btn-primary'>Iniciar Passeio</button>
              </div>

              <div className='col-md-3'>
                <h4>
                  Cronometro: { this.state.elapsed < 1000 && (`${ this.state.elapsed } ms`) }
                  { this.state.elapsed >= 1000 && `${ this.state.elapsed / 1000 } segundos` }
                </h4>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-12'>
                <h4>Tempo total: ({ this.state.time }ms)</h4>
              </div>
              <div className='col-md-12'>
                <h4>Solução encontrada? ({ this.state.solutionWasFound ? 'Sim' : 'Não' })</h4>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-12 text-center'>
                <table className='table table-bordered'>
                  <tbody>
                  { this.state.board.map((row, indexRow) => {
                    return (
                      <tr key={ indexRow }>
                        { row.map((col, indexCol) => {
                          return (
                            <td key={ `${ indexRow }${ indexCol }` }
                                onClick={ this.setStartPosition.bind(this, indexCol, indexRow) }
                                className={ this.bgColor([indexCol, indexRow]) }>
                              { col > 0 ? col : '' }
                            </td>
                          )
                        })
                        }
                      </tr>
                    )
                  }) }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));