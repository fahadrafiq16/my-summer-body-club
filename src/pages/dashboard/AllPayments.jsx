import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from "rc-table";
import { useNavigate } from "react-router-dom";
import editIcon from '../../images/edit-2.png';
import trashIcon from '../../images/trash.png';
import SearchHeader from '../../components/dashboard/SearchHeader';

const AllPayments = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/get-userinfos/")
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      })
  }, [refreshTrigger]);

  const handleEditClick = (key) => {
    navigate(`/dashboard/payments/${key}`);
  };

  const handleDeleteClick = async (key) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/delete-userinfo/${key}`);
      console.log(response.data);
      setRefreshTrigger((prev) => !prev);
      alert('User deleted successfully');
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const columns = [
    { title: "Serial No", dataIndex: "serial", key: "serial" },
    { title: "Voornaam", dataIndex: "voornaam", key: "voornaam" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Training Title", dataIndex: "trainingTitle", key: "trainingTitle" },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="flex gap-4">
          <button
            onClick={() => handleEditClick(record.key)}
            className="p-2 transition-all transform hover:scale-110 active:scale-90"
          >
            <img src={editIcon} className="w-6 h-6" alt="Edit" />
          </button>
          <button
            onClick={() => handleDeleteClick(record.key)}
            className="p-2 transition-all transform hover:scale-110 active:scale-90"
          >
            <img src={trashIcon} className="w-6 h-6" alt="Delete" />
          </button>
        </div>
      ),
    },
  ];

  const dataSource = userData.map((user, index) => ({
    key: user._id,
    serial: index + 1,
    voornaam: user.voornaam,
    email: user.email,
    trainingTitle: user.selectedOption.trainingTitle,
  }));

  if (loading) return <p className="text-center text-lg text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <SearchHeader />
      <div className="p-10 w-full animate-fadeIn ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">View Payments</h2>
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
          <Table
            columns={columns}
            data={dataSource}
            className="w-full"
            rowClassName="border-b border-[#ef4d16] hover:bg-gray-50 transition-all"
            components={{
              table: (props) => <table {...props} className="w-full text-left border-collapse" />,
              header: {
                wrapper: (props) => (
                  <thead {...props} className="bg-[#ef4d16] text-white p-4 border-b border-gray-200" />
                ),
              },
              body: {
                row: (props) => <tr {...props} className="hover:bg-gray-50 transition-all" />,
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default AllPayments;
