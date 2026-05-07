"use client";
import React from "react";
import { useSelector } from "react-redux";

const AlertList = () => {
	const authInfo = useSelector((state) => state.auth);
	const { userInfo } = authInfo || {};
	console.log("authInfo", userInfo);
	return <div></div>;
};

export default AlertList;
