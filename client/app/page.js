"use client";
import React, { useState, useEffect } from "react";

function Page() {
  const [message, setMessage] = useState("Loading");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/api/home");
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error loading data");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>{message}</div>;
    </>
  );
}

export default Page;
