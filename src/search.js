import React, { Component } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Container, Row, Col, Button } from "reactstrap";

class SearchList extends Component {
  state = {
    instructionsOne: "",
    isDisplay: false,
    isStart: true,
    isDisplayInstructionsSecond: false,
    isDisplaySearchableFiles: false,
    userFields: [],
    selectedUserField: "",
    isDisplayUsersOrganizationTickets: false,
    isDisplaySearchValue: false,
    organization_name: {},
    userList: [],
    ticketsList: [],
    dataAll: [],
  };

  render() {
    const userObj = Object.keys(this.state.userList).map(
      (keyName, keyIndex) => {
        this.state.userList.active =
          this.state.userList.active == true ? "true" : "false";
        this.state.userList.verified =
          this.state.userList.verified == true ? "true" : "false";
        this.state.userList.shared =
          this.state.userList.shared == true ? "true" : "false";
        this.state.userList.suspended =
          this.state.userList.suspended == true ? "true" : "false";
        return (
          <div key={keyIndex}>
            <Row>
              <Col xs="6">{keyName}:</Col>
              <Col xs="6">{this.state.userList[keyName]}</Col>
            </Row>
          </div>
        );
      }
    );

    const orgnizationName = Object.keys(this.state.organization_name).map(
      (d, key) => {
        return (
          <div key={key}>
            <Row>
              <Col xs="6">{d}:</Col>
              <Col xs="6">{this.state.organization_name.organization_name}</Col>
            </Row>
          </div>
        );
      }
    );

    const tiketsObj = Object.values(this.state.ticketsList).map((tickets) =>
      tickets.map((ticketName, index) => (
        <div key={index}>
          <Row>
            <Col xs="6">tickets_{index}:</Col>
            <Col xs="6">{ticketName}</Col>
          </Row>
        </div>
      ))
    );

    return (
      <div className="searchListMain" >
        <div className="header">
          
              <Button
                color="danger"
                type="submit"
                className={this.state.isStart ? "displayDiv" : "hideDiv"}
                onClick={this.start}
              >
                Start
              </Button>
           
          <div className={this.state.isDisplay ? "displayDiv" : "hideDiv"}>
            <p>{this.state.instructionsOne}</p>
            <Button type="submit" color="warning" onClick={this.exit}>
              Quit
            </Button>
            <Button type="submit" color="primary" onClick={this.enter}>
              Enter
            </Button>
          </div>
          <div
            className={
              this.state.isDisplayInstructionsSecond ? "displayDiv" : "hideDiv"
            }
          >
            Select search options:
            <ul>
              <li>Press One to search</li>
              <li>Press Two to view a list of searchable fields</li>
              <li>Press Quit to exit</li>
            </ul>
            <Button type="submit" color="success" onClick={this.one}>
              One
            </Button>
            <Button type="submit" color="info" onClick={this.exit} disabled>
              Two
            </Button>
            <Button type="submit" color="warning" onClick={this.exit} disabled>
              Quit
            </Button>
          </div>
          <div
            className={
              this.state.isDisplaySearchableFiles ? "displayDiv" : "hideDiv"
            }
          >
            <p>Press Users or Tickets or Organizations</p>
            <Button type="submit" color="primary" onClick={this.users}>
              Users
            </Button>
            <Button type="submit" color="secondary" onClick={this.exit} disabled>
              Tickets
            </Button>
            <Button type="submit" color="success" onClick={this.exit} disabled>
              Organizations
            </Button>
          </div>
          <div
            className={
              this.state.isDisplayUsersOrganizationTickets
                ? "displayDiv"
                : "hideDiv"
            }
          >
            <p>Select Search Term</p>
            <DropdownButton className="moveRight"
              onSelect={this.handleSelect}
              alignRight
              title={this.state.selectedUserField}
              id="dropdown-menu-align-right"
            >
              {this.state.userFields.map((userCol) => (
                <Dropdown.Item
                  eventKey={userCol}
                  className="dropdown-item"
                  key={userCol}
                >
                  {userCol}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <div
            className={
              this.state.isDisplaySearchValue ? "displayDiv" : "hideDiv"
            }
          >
            <p>Enter Search Value</p>
            <input type="text" id="searchValue"></input>
            <Button type="submit" color="secondary" onClick={this.onSubmit}>
              Submit
            </Button>
          </div>
          <div>
            <Container className="themed-container" fluid={true}>
              {userObj}
              {orgnizationName}
              {tiketsObj}
            </Container>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.loadInstructionsOne();
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.filteredUsers(
      document.getElementById("searchValue").value,
      this.state.selectedUserField
    );
  };

  handleSelect = (e) => {
    console.log(e);
    this.setState({
      selectedUserField: e,
      isStart: false,
      isDisplayUsersOrganizationTickets: false,
      isDisplaySearchValue: true,
    });
  };

  start = () => {
    this.setState({
      isStart: false,
      isDisplay: true,
    });
  };

  exit = () => {
    this.setState({
      isDisplay: false,
      isStart: true,
    });
  };

  enter = () => {
    this.setState({
      isDisplay: false,
      isStart: false,
      isDisplayInstructionsSecond: true,
    });
  };

  one = () => {
    this.setState({
      isDisplayInstructionsSecond: false,
      isDisplaySearchableFiles: true,
    });
  };

  users = () => {
    this.setState({
      isDisplayInstructionsSecond: false,
      isDisplaySearchableFiles: false,
      isDisplayUsersOrganizationTickets: true,
    });
    this.loadUserFields();
  };

  filteredUsers = (searchValue, searchTerm) => {
    fetch("http://localhost:8000/api/search/filteredUsers", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
      },
      body: JSON.stringify({
        searchTerm: searchTerm,
        searchValue: searchValue,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        this.setState({
          dataAll: data.data,
          userList: data.data.users,
          organization_name: data.data.organization_name,
          ticketsList: data.data.tickets,
        });
        if(this.state.userList.length == 0) {
          //popup
        }
      });
  };

  loadUserFields = () => {
    fetch("http://localhost:8000/api/search/userFields", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        this.setState({
          userFields: data.data,
          selectedUserField: data.data[0],
        });
      });
  };

  loadInstructionsOne = () => {
    fetch("http://localhost:8000/api/search", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        this.setState({
          instructionsOne: data.data,
        });
      });
  };
}

export default SearchList;
