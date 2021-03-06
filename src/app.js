import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CreateClass from 'create-react-class';

var headers = [
  "Tytuł", "Autor", "Język", "Rok wydania", "Sprzedaż"
];

var data = [
  ["The Lord of the Rings", "J. R. R. Tolkien", "Angielski", "1954–1955", "150 milionów"],
  ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry", "Francuski", "1943", "140 milionów"],
  ["Harry Potter and the Philosopher's Stone", "J. K. Rowling", "Angielski", "1997", "107 milionów"],
  ["And Then There Were None", "Agatha Christie", "Angielski", "1939", "100 milionów"],
  ["Dream of the Red Chamber", "Cao Xueqin", "Chiński", "1754–1791", "100 milionów"],
  ["The Hobbit", "J. R. R. Tolkien", "Angielski", "1937", "100 milionów"],
  ["She: A History of Adventure", "H. Rider Haggard", "Angielski", "1887", "100 milionów"]
];

var Excel = CreateClass({
  
  _preSearchData: null,

  getInitialState: function () {
    return {
      data: this.props.initialData,
      sortBy: null,
      descending: false,
      edit: null,
      isSearchEnabled: false
    };
  },

  _sort: function (e) {
    let column = e.target.cellIndex;
    let descending = this.state.sortBy === column && !this.state.descending;

    let copiedData = this.state.data.slice();
    copiedData.sort(function (a, b) {
      return descending
        ? (a[column] > b[column] ? 1 : -1)
        : (a[column] < b[column] ? 1 : -1);
    });

    this.setState({
      sortBy: column,
      descending: descending,
      data: copiedData
    });
  },

  _showEditor: function (e) {
    this.setState({
      edit: {
        row: parseInt(e.target.dataset.row, 10),
        cell: e.target.cellIndex
      }
    });
  },

  _save: function (e) {
    e.preventDefault();
    var input = e.target.firstChild;
    console.log(input);
    var data = this.state.data.slice();
    data[this.state.edit.row][this.state.edit.cell] = input.value;

    this.setState({
      data: data,
      edit: null
    });
  },

  _search: function (e) {
    let searchPhrase = e.target.value.toLowerCase();
    if (!searchPhrase) {
      this.setState({
        data: this._preSearchData
      });
      return;
    }

    let index = e.target.dataset.idx;
    let searchDataSet = this._preSearchData.filter(function (row) {
      return row[index].toString().toLowerCase().indexOf(searchPhrase) > -1;
    });
    this.setState({ data: searchDataSet });
  },

  _toggleSearch: function () {
    if (this.state.isSearchEnabled) {
      this.setState({
        data: this._preSearchData,
        isSearchEnabled: false
      });
      this._preSearchData = null;
    } else {
      this._preSearchData = this.state.data;
      this.setState({
        isSearchEnabled: true
      });
    }
  },
  _contentToJson: function(){
      return JSON.stringify(this.state.data);
  },
  _contentToCsv: function(){
      return this.state.data.reduce(function(result, row){
        return result + row.reduce(function(rowresult, cell, idx){
          return rowresult
            + '"'
            + cell.replace(/"/g, '""')
            + '"'
            + (idx < row.length - 1 ? ',' :'')
        }, '')
        + "\n";
      }, '');
  },
  _download: function(format, ev){
    let content = format === 'json'
      ? this._contentToJson()
      : this._contentToCsv();
    let URL = window.URL || window.webkitURL;
    console.log(URL);
    let blob = new Blob([content], {type: 'text/' + format});
    console.log(blob);
    ev.target.href = URL.createObjectURL(blob);
    ev.target.download = 'data.' + format;

  },
  render: function () {
    /*return (
      React.DOM.div(null,
        this._renderToolBar(),
        this._renderTable()
      )
    );
    */
    return React.DOM.render(
    <h1>
      Hello world!
    </h1>,
      document.getElementById('app'));
  },

  _renderToolBar: function () {
    return React.DOM.div({className: 'toolbar'},
      React.DOM.button(
        {
          onClick: this._toggleSearch,
          className: 'toolbar',
        },
        'wyszukaj'
      ),
      React.DOM.a({
        onClick: this._download.bind(this, 'json'),
        href: 'data.json'
      },
      'Exportuj json'),
      React.DOM.a({
        onClick: this._download.bind(this, 'csv'),
        href: 'data.csv'
      },
      'Exportuj csv')
    );
  },

  _renderSearch: function () {
    if (!this.state.isSearchEnabled) {
      return null;
    }
    return React.DOM.tr(
      { onChange: this._search },
      this.props.headers.map(function (_ignore, idx) {
        return React.DOM.td({ key: idx },
          React.DOM.input({
            type: 'text',
            'data-idx': idx
          }))
      })
    );
  },

  _renderTable: function(){
    return React.DOM.table(null,
      React.DOM.thead({ onClick: this._sort },
        React.DOM.tr(null,
          this.props.headers.map(function (title, index) {
            if (this.state.sortBy === index) {
              let arrow = this.state.descending ? ' \u2191' : ' \u2193';
              title += arrow;
            }
            return React.DOM.th({ key: index }, title);
          }, this)
        )
      ),
      React.DOM.tbody({ onDoubleClick: this._showEditor },
        this._renderSearch(),
        this.state.data.map(function (row, rowIndex) {
          return (React.DOM.tr({ key: rowIndex },
            row.map(function (cell, index) {
              let content = cell;
              let edit = this.state.edit;
              if (edit && edit.row === rowIndex && edit.cell === index) {
                content = React.DOM.form({ onSubmit: this._save },
                  React.DOM.input({
                    type: 'text',
                    defaultValue: cell
                  }))
              }
              return React.DOM.td({
                key: index,
                'data-row': rowIndex
              },
                content);
            }, this)
          )
          )
        }, this)
      )
    )
  }
});

ReactDOM.render(
  React.createElement(Excel, {
    headers: headers,
    initialData: data
  }),
  document.getElementById("app")
);