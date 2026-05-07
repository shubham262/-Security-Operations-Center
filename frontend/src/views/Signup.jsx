/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";
import { authClient } from "@/config/auth";
import { Button, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useCallback, useState } from "react";

const Signup = () => {
	const router = useRouter();
	const [info, setInfo] = useState({
		email: "",
		password: "",
		name: "",
	});

	const handleOnChange = useCallback((key, value) => {
		setInfo((prev) => ({ ...prev, [key]: value }));
	}, []);

	const handlSubmit = useCallback(async () => {
		try {
			if (!info?.email || !info?.name || !info?.password) {
				return message.error("Please enter email and password");
			}
			const payload = {
				email: info?.email,
				password: info?.password,
				name: info?.name,
			};
			const { data } = await authClient.signUp.email(payload);
			const { user } = data;
			localStorage.setItem("user", JSON.stringify(user));
			return router.push("/");
		} catch (error) {
			console.log("error==>handlSubmit", error);
			message.error("Something went wrong");
		}
	}, [info?.email, info?.password, info?.name, router]);

	return (
		<div className="min-h-screen min-w-screen w-full flex items-center justify-center bg-blue-100 px-6 py-12">
			<div className="max-w-5xl bg-white w-full rounded-3xl  border border-blue-100 p-6 lg:p-12 flex flex-col lg:flex-row gap-10 justify-between lg:items-center">
				<div className="flex flex-col gap-6 flex-1 self-stretch ">
					<span
						className="flex w-fit rounded-full border border-blue-600 text-sm text-blue-700 font-medium px-4 py-1 
                     "
					>
						Sign Up
					</span>

					<div className="flex flex-col gap-4">
						<h1 className="text-4xl lg:text-5xl font-semibold text-slate-900">
							Start converting your PDF into simplified quizzes in minutes
						</h1>
						<p className="text-slate-600 text-lg ">
							Create your account in minutes,just using your email and password.
						</p>
					</div>
				</div>
				<div className=" flex flex-1 self-stretch w-full rounded-[28px] border border-blue-100 bg-slate-50 p-6">
					<div className="flex flex-1 flex-col rounded-[24px] border border-blue-100 bg-white p-8 shadow-sm">
						<div className="flex flex-col gap-3">
							<h2 className="text-2xl font-semibold text-slate-900">Sign Up</h2>
							<p className="text-sm text-slate-500">
								Create an account with your email and password.
							</p>
						</div>

						<div className="mt-8 flex flex-col gap-5">
							<div className="flex flex-col gap-2">
								<label
									htmlFor="signup-name"
									className="text-sm font-medium text-slate-700"
								>
									Name
								</label>
								<Input
									id="signup-name"
									size="large"
									type="text"
									placeholder="User"
									value={info?.name}
									onChange={(e) => handleOnChange("name", e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label
									htmlFor="signup-email"
									className="text-sm font-medium text-slate-700"
								>
									Email
								</label>
								<Input
									id="signup-email"
									size="large"
									type="email"
									placeholder="you@example.com"
									value={info?.email}
									onChange={(e) => handleOnChange("email", e.target.value)}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label
									htmlFor="signup-password"
									className="text-sm font-medium text-slate-700"
								>
									Password
								</label>
								<Input.Password
									id="signup-password"
									size="large"
									placeholder="Create a password"
									value={info?.password}
									onChange={(e) => handleOnChange("password", e.target.value)}
								/>
							</div>

							<Button
								onClick={handlSubmit}
								type="primary"
								size="large"
								block
								className="mt-2"
							>
								Create Account
							</Button>
						</div>

						<div className="mt-auto flex items-center justify-center pt-6 text-sm text-slate-500">
							<span>Already have an account?</span>
							<Link
								href="/signin"
								className="ml-2 font-semibold text-blue-600 transition hover:text-blue-700"
							>
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup;
