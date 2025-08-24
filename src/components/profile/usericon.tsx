import { IconUserCircle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../utils/hooks";

export default function UserIcon() {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const handleProfileClick = () => {
        if (user) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    return (
        <div 
            className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleProfileClick}
            title={user ? "My Profile" : "Login"}
        >
            <IconUserCircle className="h-6 w-6 text-gray-700" />
        </div>
    );
}
