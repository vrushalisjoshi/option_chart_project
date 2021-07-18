import React from "react";
import { render } from "react-dom";

class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], expiryDates: [], selectedDate: "" };
    this.onSort = this.onSort.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  fetchData(date, order) {
    fetch("/api/data?date=" + date + "&order=" + order)
      .then(function (response) {
        return response.json();
      })
      .then((result) => {
        this.setState({
          data: result.data,
          expiryDates: result.expiryDates,
          selectedDate: result.selectedDate,
        });
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  onSort(event) {
    this.fetchData(this.state.selectedDate, event.target.title);
  }

  changeDate(event) {
    this.fetchData(event.target.value);
  }

  render() {
    const newdata = this.state.data;
    const expiryDates = this.state.expiryDates;
    const selectedDate = this.state.selectedDate;
    return (
      <table>
        <thead>
          <tr>
            <th>
              Expiry Date
              <select onChange={this.changeDate} selected={selectedDate}>
                {expiryDates.map((date) => {
                  return (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  );
                })}
              </select>
            </th>
            <th colSpan="4">CE</th>
            <th colSpan="4">PE</th>
          </tr>
          <tr>
            <th>Strike Price</th>
            <th title="CALL_OI" onClick={this.onSort}>
              OI
            </th>
            <th title="CALL_VOL" onClick={this.onSort}>
              VOL
            </th>
            <th title="CALL_IV" onClick={this.onSort}>
              IV
            </th>
            <th title="CALL_LTP" onClick={this.onSort}>
              LTP
            </th>
            <th title="PUT_OI" onClick={this.onSort}>
              OI
            </th>
            <th title="PUT_VOL" onClick={this.onSort}>
              VOL
            </th>
            <th title="PUT_IV" onClick={this.onSort}>
              IV
            </th>
            <th title="PUT_LTP" onClick={this.onSort}>
              LTP
            </th>
          </tr>
        </thead>
        <tbody>
          {newdata.map(function (unit, index) {
            return (
              <tr key={index} data-item={unit}>
                <td>{unit.Strike_Price}</td>
                <td>{unit.CALL_OI}</td>
                <td>{unit.CALL_VOL}</td>
                <td>{unit.CALL_IV}</td>
                <td>{unit.CALL_LTP}</td>
                <td>{unit.PUT_OI}</td>
                <td>{unit.PUT_VOL}</td>
                <td>{unit.PUT_IV}</td>
                <td>{unit.PUT_LTP}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default TableComponent;
