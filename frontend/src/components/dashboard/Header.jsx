import { Button } from "antd";
import { FiMenu } from "react-icons/fi";
import Logo from "../Logo";
import { useSelector } from "react-redux";
import { nameShortner } from "@/helper";
const Header = ({ onOpenMobileMenu }) => {
	const authInfo = useSelector((state) => state.auth);
	const { userInfo } = authInfo || {};
	return (
		<header className="flex items-center justify-between md:justify-end px-6 py-4 bg-white border-b border-gray-100 shadow-sm z-10 shrink-0">
			<div className="flex md:hidden items-center space-x-2">
				<Button
					type="text"
					icon={<FiMenu size={24} />}
					onClick={onOpenMobileMenu}
					className="text-gray-600 px-0 hover:bg-transparent"
				/>
				<Logo />
			</div>

			<div className="flex items-center space-x-4 text-sm font-medium text-gray-700">
				<div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
					{nameShortner(userInfo?.name||"")}
				</div>
			</div>
		</header>
	);
};
export default Header;
