var React = require('react/addons');

var Grid = React.createClass({
  render: function () {
    return <table className="table table-striped" style={{tableLayout: 'fixed'}}>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
        </tr>
      </thead>

      <tbody>
        {this.props.rows.map(function (row) {
          return <tr>
            <td>{row.firstName}</td>
            <td>{row.lastName}</td>
          </tr>
        })}
      </tbody>
    </table>
  }

});

module.exports = Grid;
