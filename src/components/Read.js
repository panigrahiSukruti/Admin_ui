import React, { useState, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Read = () => {
  const [data, setData] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedRole, setUpdatedRole] = useState('');

  const getData = useCallback(() => {
    axios
      .get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleCheckboxChange = (id) => {
    setSelectedUserIds((prevSelectedUserIds) => {
      if (prevSelectedUserIds.includes(id)) {
        return prevSelectedUserIds.filter((userId) => userId !== id);
      } else {
        return [...prevSelectedUserIds, id];
      }
    });
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setData((prevData) => prevData.filter((user) => user.id !== id));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (user) => {
    setShowModal(true);
    setUserToEdit(user);
    setUpdatedName(user.name); // Initialize the form fields with existing data
    setUpdatedEmail(user.email); // Initialize the form fields with existing data
    setUpdatedRole(user.role); // Initialize the form fields with existing data
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserToEdit(null);
  };

  const handleUpdate = () => {
    const updatedUserData = {
      id: userToEdit.id,
      name: updatedName !== '' ? updatedName : userToEdit.name,
      email: updatedEmail !== '' ? updatedEmail : userToEdit.email,
      role: updatedRole !== '' ? updatedRole : userToEdit.role
    };

    // Update user data in the state
    setData(data.map(user => (user.id === updatedUserData.id ? updatedUserData : user)));

    // Close modal
    handleCloseModal();
  };


  const filteredData = data.filter((eachData) =>
    eachData.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteSelected = () => {
    setData((prevData) => prevData.filter((user) => !selectedUserIds.includes(user.id)));
    setSelectedUserIds([]);
  };

  return (
    <>
      <h2>Admin-UI</h2>
      <div className="d-flex justify-content-between m-2">
        <div>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Select</th>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((eachData) => (
            <tr key={eachData.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(eachData.id)}
                  onChange={() => handleCheckboxChange(eachData.id)}
                />
              </td>
              <th scope="row">{eachData.id}</th>
              <td>{eachData.name}</td>
              <td>{eachData.email}</td>
              <td>{eachData.role}</td>
              <td>
                <button className="btn btn-success" onClick={() => handleEdit(eachData)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={(e) => handleDelete(eachData.id, e)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container d-flex justify-content-end m-2">
        <nav>
          <ul className="pagination">
            {Array(Math.ceil(filteredData.length / itemsPerPage))
              .fill()
              .map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                  <button onClick={() => paginate(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
          </ul>
        </nav>
      </div>
      <div className="delete-selected-container">
        <Button className="btn btn-danger" onClick={handleDeleteSelected}>
          Delete Selected
        </Button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal body content for editing user data */}
          {userToEdit && (
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={updatedName || userToEdit.name}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={updatedEmail || userToEdit.email}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  className="form-control"
                  value={updatedRole || userToEdit.role}
                  onChange={(e) => setUpdatedRole(e.target.value)}
                />
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Read;
