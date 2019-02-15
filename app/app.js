'use strict';

const boardSize = 8;
const horseJumps = 64;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.timer = null;
    this.startedOn = 0;
    this.y = 0;
    this.x = 1;

    const board = new Array(8).fill([]).map(() => (new Array(8).fill(0)));

    this.state = {
      board, moves: [], solutionWasFound: false, knightPosition: { x: 0, y: 0, index: 0 }, elapsed: 0, playing: false
    };

    this.startJourney = this.startJourney.bind(this);
    this.startTime = this.startTime.bind(this);
    this.stopTime = this.stopTime.bind(this);

    this.rewindMove = this.rewindMove.bind(this);
    this.backMove = this.backMove.bind(this);
    this.playMove = this.playMove.bind(this);
    this.stopMove = this.stopMove.bind(this);
    this.forwardMove = this.forwardMove.bind(this);
    this.fastForwardMove = this.fastForwardMove.bind(this);
  }

  setKnightPosition(y, x, index = 0) {
    this.setState({ knightPosition: { y, x, index } })
  }

  bgKnight(testPosition) {
    const { y, x } = this.state.knightPosition;
    return y === testPosition[this.y] && x === testPosition[this.x]  ? 'knight' : '';
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
    const { y, x } = this.state.knightPosition;
    const knightTour = new KnightTour(8, [y, x]);

    this.startTime();
    const startTime = new Date();
    knightTour.start().then((resultado) => {
      this.stopTime();
      console.log('knightTourResult', resultado);
      this.setState((state) => {
        let newState = { ...state, ...resultado };

        resultado.moves.forEach((move, index) => {
          newState.board[move[this.y]][move[this.x]] = index + 1;
        });

        newState.time = new Date() - startTime;
        return newState;
      })
    });
  }

  rewindMove() {
    const firstMove = {
      y: this.state.moves[0][this.y],
      x: this.state.moves[0][this.x],
      index: 0
    };
    this.setState({ knightPosition: firstMove })
  }

  backMove() {
    const nextIndex = this.state.knightPosition.index - 1;

    if(nextIndex >= 0) {
      const nextPosition = {
        y: this.state.moves[nextIndex][this.y],
        x: this.state.moves[nextIndex][this.x],
        index: nextIndex
      };

      this.setState({knightPosition: nextPosition})
    }
  }

  playMove() {
    this.setState({ playing: true });

    const nextMove = () => {
      setTimeout(() => {
        if (this.state.playing) {
          const nextIndex = this.state.knightPosition.index + 1;

          if(nextIndex <= 63) {
            const nextPosition = {
              y: this.state.moves[nextIndex][this.y],
              x: this.state.moves[nextIndex][this.x],
              index: nextIndex
            };
            this.setState({ knightPosition: nextPosition });
            nextMove();
          }
        }
      }, 1000);
    }
  }

  stopMove() {
    this.setState({ playing: false });
  }

  forwardMove() {
    const nextIndex = this.state.knightPosition.index + 1;

    if(nextIndex < 64) {
      const nextMove = this.state.moves[nextIndex];
      this.setState({ knightPosition: { y: nextMove[this.y], x: nextMove[this.x], index: nextIndex} });
    }
  }

  fastForwardMove() {
    console.log(this.state.moves[63]);
    const nextPosition = {
      y: this.state.moves[63][this.y],
      x: this.state.moves[63][this.x],
      index: 63
    };
    this.setState({ knightPosition: nextPosition })
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
                                onClick={ this.setKnightPosition.bind(this, indexRow, indexCol, 0) }
                                className={ this.bgKnight([indexRow, indexCol]) }>
                              <span>{ col > 0 ? col : '' }</span>
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

              { this.state.solutionWasFound &&
              <div className='player text-center'>
                <button type='button' className='btn' onClick={ this.rewindMove }>
                  <i className='fa fa-fast-backward' />
                </button>

                <button type='button' className='btn' onClick={ this.backMove }>
                  <i className='fa fa-backward' />
                </button>

                <button type='button' className='btn' onClick={ this.playMove }>
                  <i className='fa fa-play' />
                </button>

                <button type='button' className='btn' onClick={ this.stopMove }>
                  <i className='fa fa-stop' />
                </button>

                <button type='button' className='btn' onClick={ this.forwardMove }>
                  <i className='fa fa-forward' />
                </button>

                <button type='button' className='btn' onClick={ this.fastForwardMove }>
                  <i className='fa fa-fast-forward' />
                </button>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
