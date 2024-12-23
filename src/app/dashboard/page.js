"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [dropdownData, setDropdownData] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch("/api/getDashboardData");
        const data = await response.json();

        if (response.status === 302 && data.redirect) {
          // Redirect to login page if instructed by the API
          router.push(data.redirect);
          return;
        }

        if (response.ok) {
          setDropdownData(data.data);
          setMessage(data.message);
        } else {
          setMessage(data.message || "Failed to fetch dropdown data.");
        }
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
        setMessage("An error occurred while fetching the dropdown data.");
      }
    };

    fetchDropdownData();
  }, [router]);

  return (
    <div>
      {dropdownData ? (
        <div>
          <img src={dropdownData.userImage} alt="User" />
          <p>Location: {dropdownData.location}</p>
          <p>Role: {dropdownData.role}</p>
          <p>WN: {dropdownData.walletNumbers.WN}</p>
          <p>WI: {dropdownData.walletNumbers.WI}</p>
          <p>VC: {dropdownData.walletNumbers.VC}</p>
          <a href={dropdownData.actions.logout}>Logout</a>
          <a href={dropdownData.actions.changePassword}>Change Password</a>
          <a href={dropdownData.actions.profile}>Profile</a>
        </div>
      ) : (
        <p>{message || "Loading dropdown data..."}</p>
      )}
    </div>
  );
};

export default Dashboard;
