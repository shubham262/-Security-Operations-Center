/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
"use client";
import { fetchAlertInformation } from "@/service/alerts";
import { message } from "antd";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const AlertDetails = () => {
	const params = useParams();
	const { id } = params;

	const [info, setInfo] = useState({
		loading: true,
		data: null,
	});

	useEffect(() => {
		fetchAlertInfo();
	}, []);

	const fetchAlertInfo = useCallback(async () => {
		try {
			const { data } = await fetchAlertInformation(id);
			setInfo((prev) => ({ ...prev, data }));
			console.log("response", data);
		} catch (error) {
			message.error(error.message || "Something went wrong");
			console.log("error==>fetchAlertInfo", error);
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, [id]);
	return <div></div>;
};

export default AlertDetails;
