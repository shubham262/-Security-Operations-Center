import { Button } from "antd";
import { FiShield, FiMenu } from "react-icons/fi";
const Header = ({ onOpenMobileMenu }) => {
	return (
		<header className="flex items-center justify-between md:justify-end px-6 py-4 bg-white border-b border-gray-100 shadow-sm z-10 shrink-0">
			{/* Mobile Left: Hamburger + Logo */}
			<div className="flex md:hidden items-center space-x-2">
				<Button
					type="text"
					icon={<FiMenu size={24} />}
					onClick={onOpenMobileMenu}
					className="text-gray-600 px-0 hover:bg-transparent"
				/>
				<FiShield size={24} className="text-blue-600 ml-2" />
			</div>

			{/* Right Side: User Profile */}
			<div className="flex items-center space-x-4 text-sm font-medium text-gray-700">
				<div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
					A
				</div>
				<span className="hidden sm:inline">Analyst Workspace</span>
			</div>
		</header>
	);
};
export default Header;
