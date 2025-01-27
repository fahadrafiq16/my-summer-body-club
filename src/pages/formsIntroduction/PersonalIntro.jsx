import React, { useState } from "react";
import axios from "axios";

const PersonalIntro = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const fetchAddress = async () => {
    const url = "https://adres-api.nl/api/single";
    const apiKey = "8zIkUqYHz7cpfyIrdfxyW7usRn56mXmD4DK2UoNhb2dbc4b7"; // Replace with your actual API key
    const requestBody = {
      postcode: "9712HL",
      house_number: "44",
      house_number_addition: "a",
    };

    try {
      const res = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${apiKey}`, // Add your API key here
          "Content-Type": "application/json",
        },
        
      });

      setResponse(res.data); // Store the response data
    } catch (err) {
      setError(err.message); // Handle and display errors
      console.log(err);
    }
  };

  return (
    <div>
      <button onClick={fetchAddress}>Fetch Address</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PersonalIntro;
