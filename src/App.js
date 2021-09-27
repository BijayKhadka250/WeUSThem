// import './App.css';
import { Button, Row, Col, Form, Card, Table, Modal, NavItem } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import _ from 'lodash'

const App = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactList, setContactList] = useState([]);
  const [show, setShow] = useState(false);
  const [editfirstName, setEditFirstName] = useState("");
  const [editlastName, setEditLastName] = useState("");
  const [editemail, setEditEmail] = useState("");
  const [editphoneNumber, setEditPhoneNumber] = useState("");
  const [editid, setEditId] = useState("");
  // const [searchFirstName, setSearchFirstName] = useState("");
  const [filterOption, setFilterOption] = useState("First Name");
  // const [originalList, setOriginalList] = useState([])
  const [order, setOrder] = useState("asc")
  const [sortField, setSortField] = useState("First Name")
  const [emailError, setEmailError] = useState("")
  const [error, setError] =useState(false)

  useEffect(() => {
    console.log("useeffect");
    Axios.get("http://localhost:3001/contacts").then((response) => {
      console.log("response", response);
      setContactList(response.data);
    });
  }, []);

  const handleDelete = (item) => {
    console.log("item",item);
      Axios.delete(`http://localhost:3001/delete/${item.id}`).then((res) => {
        Axios.get("http://localhost:3001/contacts").then((response) => {
          console.log("response", response);
          setContactList(response.data);
        });
      })
     
  }

  const handleSubmit = () => {
    console.log(
      "firstName , lastName, email, phoneNumber",
      firstName,
      lastName,
      email,
      phoneNumber
    );
    let errorBollean = error
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
    if(email.match(pattern)){
      console.log("if");
      setEmailError("")
      setError(false)
      errorBollean = false
    }else{
      setEmailError("Invalid Email")
      setError(true)
      errorBollean = true
    }
    if(!errorBollean){
         Axios.post("http://localhost:3001/create", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
    }).then(() => {
      console.log("success");
      Axios.get("http://localhost:3001/contacts").then((response) => {
      console.log("response", response);
      setContactList(response.data);
    });
    });
    }
   
  };

  const handleSort = () => {
    if(sortField === "First Name"){
      let sort = _.orderBy(contactList, ['FirstName'], [order])
      console.log("sort",sort);
      setContactList(sort)
   }
   if(sortField === "Last Name"){
     let sort = _.orderBy(contactList, ['LastName'], [order])
     console.log("sort",sort);
     setContactList(sort)
  }
  }

  const handleDropDown = (e) => {
    const index = e.nativeEvent.target.selectedIndex
    const option = e.nativeEvent.target[index].text
    setSortField(option)
    console.log("option",option);
  //   if(option === "First Name"){
  //      let sort = _.orderBy(contactList, ['FirstName'], [order])
  //      console.log("sort",sort);
  //      setContactList(sort)
  //   }
  //   if(option === "Last Name"){
  //     let sort = _.orderBy(contactList, ['LastName'], [order])
  //     console.log("sort",sort);
  //     setContactList(sort)
  //  }
  }
  const handleEdit = (item) => {
    // console.log("item",item);
    setShow(true);
    setEditFirstName(item.FirstName)
    setEditLastName(item.LastName)
    setEditEmail(item.Email)
    setEditPhoneNumber(item.PhoneNumber)
    setEditId(item.id)
  }

  const handleClose = () => setShow(false);

  const handleSaveChanges = (item) => {
    Axios.put("http://localhost:3001/update", {
      id: editid,
      firstName: editfirstName,
      lastName: editlastName,
      email: editemail,
      phoneNumber: editphoneNumber,
    }).then((res) => {

      Axios.get("http://localhost:3001/contacts").then((response) => {
        console.log("response", response);
        setContactList(response.data);
      });
    })

    setShow(false)
  }

  const handleFilterDropDown = (e) => {
    const index = e.nativeEvent.target.selectedIndex
    const option = e.nativeEvent.target[index].text

    console.log("option",option);
    setFilterOption(option)
  }

  const handleOrderDropDown = (e) => {
    const index = e.nativeEvent.target.selectedIndex
    const option = e.nativeEvent.target[index].text

    console.log("option",option);
    setOrder(option)
  }

  const handleFiltersearch = (query) => {
      console.log("query",query);
      let filtered = contactList
      if(query === "") {
        Axios.get("http://localhost:3001/contacts").then((response) => {
          console.log("response", response);
          setContactList(response.data);
        });
      }
      else if (query && filterOption !== 'First Name') {
         filtered = Object.values(filtered).filter((contact) =>
         contact.LastName.toLowerCase().startsWith(query.toLowerCase()),
        );
      }
      else if (query && filterOption === 'First Name') {
        filtered = Object.values(filtered).filter((contact) =>
        contact.FirstName.toLowerCase().startsWith(query.toLowerCase()),
       );
     }

      console.log("filtered",filtered);
      setContactList(filtered)
  }
  return (
    <div className="App">
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter First Name"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter Last Name"
              onChange={(event) => setLastName(event.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter Email "
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>
          {emailError !== "" &&
               <p className="alert alert-danger">
               {emailError}
              </p>
          }
         
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Phone No</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter Phone Number"
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row style={{ marginTop: "20px" }}>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Row>

      <Row style={{ marginTop: "20px" }}>
        <Col>
        <Form.Label>Sort By:</Form.Label>
            <select onChange={handleDropDown}>
            <option>Select Options</option>
              <option>First Name</option>
              <option>Last Name</option>
            </select>

            <select onChange={handleOrderDropDown}>
              <option>asc</option>
              <option>desc</option>
            </select>
        </Col>

      </Row>

      <Row>
        <Button onClick= {handleSort}>Sort</Button>
      </Row>

      <Row style={{ marginTop: "20px" }}>
        <Col>
        <Form.Label>Filter By:</Form.Label>
            <select onChange={handleFilterDropDown}>
            <option>Select Options</option>
              <option>First Name</option>
              <option>Last Name</option>
            </select>
        </Col>
      </Row>

      <Row style={{ marginTop: "20px" }}>
        <Col>
        <Form.Label>Search</Form.Label>
        <Form.Control
              type="text"
              placeholder="enter First Name"
              onChange={(event) => handleFiltersearch(event.target.value)}
            />
            
        </Col>
      </Row>

      {/* <Row>
        <Col>
        <Button>Search</Button>
        </Col>
        
      </Row> */}

      <Card style={{ marginTop: "20px", border:"none" }}>
        <Card.Header>
          <Row>
            <Col>
              <h5>Contacts</h5>
            </Col>
          </Row>
        </Card.Header>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {/* <th>#</th> */}
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contactList.map((item) => (
              <tr>
                {/* <td>{item.id}</td> */}
                <td>{item.FirstName}</td>
                <td>{item.LastName}</td>
                <td>{item.Email}</td>
                <td>{item.PhoneNumber}</td>
                <td>
                  <Row>
                    <Col>
                    <Button onClick = {() => {handleEdit(item)}}>Edit</Button>
                    </Col>
                    <Col>
                    <Button onClick = {() => {handleDelete(item)}}>Delete</Button>
                    </Col>
                  </Row>
                  
                
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <Modal show={show} onHide={handleClose} backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <Row>
        <Col>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter First Name"
              onChange={(event) => setEditFirstName(event.target.value)}
              value = {editfirstName}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter Last Name"
              onChange={(event) => setEditLastName(event.target.value)}
              value = {editlastName}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter Email "
              onChange={(event) => setEditEmail(event.target.value)}
              value = {editemail}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Phone No</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter Phone Number"
              onChange={(event) => setEditPhoneNumber(event.target.value)}
              value = {editphoneNumber}
            />
          </Form.Group>
        </Col>
      </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
