'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var headers = ["Tytuł", "Autor", "Język", "Rok wydania", "Sprzedaż"];

var data = [["The Lord of the Rings", "J. R. R. Tolkien", "Angielski", "1954–1955", "150 milionów"], ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry", "Francuski", "1943", "140 milionów"], ["Harry Potter and the Philosopher's Stone", "J. K. Rowling", "Angielski", "1997", "107 milionów"], ["And Then There Were None", "Agatha Christie", "Angielski", "1939", "100 milionów"], ["Dream of the Red Chamber", "Cao Xueqin", "Chiński", "1754–1791", "100 milionów"], ["The Hobbit", "J. R. R. Tolkien", "Angielski", "1937", "100 milionów"], ["She: A History of Adventure", "H. Rider Haggard", "Angielski", "1887", "100 milionów"]];

var Excel = (0, _createReactClass2.default)({

  _preSearchData: null,

  getInitialState: function getInitialState() {
    return {
      data: this.props.initialData,
      sortBy: null,
      descending: false,
      edit: null,
      isSearchEnabled: false
    };
  },

  _sort: function _sort(e) {
    var column = e.target.cellIndex;
    var descending = this.state.sortBy === column && !this.state.descending;

    var copiedData = this.state.data.slice();
    copiedData.sort(function (a, b) {
      return descending ? a[column] > b[column] ? 1 : -1 : a[column] < b[column] ? 1 : -1;
    });

    this.setState({
      sortBy: column,
      descending: descending,
      data: copiedData
    });
  },

  _showEditor: function _showEditor(e) {
    this.setState({
      edit: {
        row: parseInt(e.target.dataset.row, 10),
        cell: e.target.cellIndex
      }
    });
  },

  _save: function _save(e) {
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

  _search: function _search(e) {
    var searchPhrase = e.target.value.toLowerCase();
    if (!searchPhrase) {
      this.setState({
        data: this._preSearchData
      });
      return;
    }

    var index = e.target.dataset.idx;
    var searchDataSet = this._preSearchData.filter(function (row) {
      return row[index].toString().toLowerCase().indexOf(searchPhrase) > -1;
    });
    this.setState({ data: searchDataSet });
  },

  _toggleSearch: function _toggleSearch() {
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
  _contentToJson: function _contentToJson() {
    return JSON.stringify(this.state.data);
  },
  _contentToCsv: function _contentToCsv() {
    return this.state.data.reduce(function (result, row) {
      return result + row.reduce(function (rowresult, cell, idx) {
        return rowresult + '"' + cell.replace(/"/g, '""') + '"' + (idx < row.length - 1 ? ',' : '');
      }, '') + "\n";
    }, '');
  },
  _download: function _download(format, ev) {
    var content = format === 'json' ? this._contentToJson() : this._contentToCsv();
    var URL = window.URL || window.webkitURL;
    console.log(URL);
    var blob = new Blob([content], { type: 'text/' + format });
    console.log(blob);
    ev.target.href = URL.createObjectURL(blob);
    ev.target.download = 'data.' + format;
  },
  render: function render() {
    /*return (
      React.DOM.div(null,
        this._renderToolBar(),
        this._renderTable()
      )
    );
    */
    return _react2.default.DOM.render(_react2.default.createElement(
      'h1',
      null,
      'Hello world!'
    ), document.getElementById('app'));
  },

  _renderToolBar: function _renderToolBar() {
    return _react2.default.DOM.div({ className: 'toolbar' }, _react2.default.DOM.button({
      onClick: this._toggleSearch,
      className: 'toolbar'
    }, 'wyszukaj'), _react2.default.DOM.a({
      onClick: this._download.bind(this, 'json'),
      href: 'data.json'
    }, 'Exportuj json'), _react2.default.DOM.a({
      onClick: this._download.bind(this, 'csv'),
      href: 'data.csv'
    }, 'Exportuj csv'));
  },

  _renderSearch: function _renderSearch() {
    if (!this.state.isSearchEnabled) {
      return null;
    }
    return _react2.default.DOM.tr({ onChange: this._search }, this.props.headers.map(function (_ignore, idx) {
      return _react2.default.DOM.td({ key: idx }, _react2.default.DOM.input({
        type: 'text',
        'data-idx': idx
      }));
    }));
  },

  _renderTable: function _renderTable() {
    return _react2.default.DOM.table(null, _react2.default.DOM.thead({ onClick: this._sort }, _react2.default.DOM.tr(null, this.props.headers.map(function (title, index) {
      if (this.state.sortBy === index) {
        var arrow = this.state.descending ? ' \u2191' : ' \u2193';
        title += arrow;
      }
      return _react2.default.DOM.th({ key: index }, title);
    }, this))), _react2.default.DOM.tbody({ onDoubleClick: this._showEditor }, this._renderSearch(), this.state.data.map(function (row, rowIndex) {
      return _react2.default.DOM.tr({ key: rowIndex }, row.map(function (cell, index) {
        var content = cell;
        var edit = this.state.edit;
        if (edit && edit.row === rowIndex && edit.cell === index) {
          content = _react2.default.DOM.form({ onSubmit: this._save }, _react2.default.DOM.input({
            type: 'text',
            defaultValue: cell
          }));
        }
        return _react2.default.DOM.td({
          key: index,
          'data-row': rowIndex
        }, content);
      }, this));
    }, this)));
  }
});

_reactDom2.default.render(_react2.default.createElement(Excel, {
  headers: headers,
  initialData: data
}), document.getElementById("app"));