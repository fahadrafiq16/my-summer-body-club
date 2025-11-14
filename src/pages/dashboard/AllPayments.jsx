import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Table from "rc-table";
import { useNavigate } from "react-router-dom";
import editIcon from '../../images/edit-2.png';
import trashIcon from '../../images/trash.png';
import SearchHeader from '../../components/dashboard/SearchHeader';
import { getBackendBaseUrl } from '../../utils/backend';
import { useAuth } from '../../context/AuthContext';

const AllPayments = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { token } = useAuth();
  const backendBaseUrl = useMemo(() => getBackendBaseUrl(), []);

  useEffect(() => {
    if (!token) return;
    axios.get(`${backendBaseUrl}/api/get-userinfos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      })
  }, [backendBaseUrl, refreshTrigger, token]);

  const handleEditClick = (key) => {
    navigate(`/dashboard/payments/${key}`);
  };

  const handleDeleteClick = async (key) => {
    try {
      if (!token) {
        alert("Geen geldige sessie. Log opnieuw in.");
        return;
      }
      const response = await axios.delete(`${backendBaseUrl}/api/delete-userinfo/${key}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    trainingTitle: user.selectedOption?.trainingTitle || "",
  }));

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredDataSource = normalizedSearch
    ? dataSource.filter((item) => {
        return ["voornaam", "email", "trainingTitle"].some((field) => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(normalizedSearch);
        });
      })
    : dataSource;

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="relative flex">
        <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-[#ef4d16]/30"></span>
        <span className="relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-white border-2 border-[#ef4d16]">
          <span className="h-12 w-12 border-4 border-[#ef4d16]/60 border-t-transparent rounded-full animate-spin"></span>
        </span>
      </div>
    </div>
  );
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <SearchHeader
        placeholder="Zoek op voornaam, e-mail of trainingstitel"
        value={searchTerm}
        onChange={setSearchTerm}
        helperText="Gebruik het zoekveld om snel deelnemers te vinden."
      />
      <div className="p-10 w-full animate-fadeIn ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">View Payments</h2>
        {filteredDataSource.length === 0 ? (
          <div className="border border-dashed border-[#ef4d16] rounded-lg p-10 text-center text-gray-500">
            Geen resultaten gevonden voor "{searchTerm}". Probeer een andere zoekopdracht.
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
            <Table
              columns={columns}
              data={filteredDataSource}
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
        )}
      </div>
    </>
  );
};

export default AllPayments;
