
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Github } from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const Navbar = () => {
  const { token, user } = useAppSelector((state) => state?.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/github";
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className=" py-4 flex items-center justify-between lg:mx-[20vw]">
      <div><Link to={"/"}>Coderbro</Link></div>
      {isAuthenticated ? (<div className=" flex items-center">
        <Button>Github <GitHubLogoIcon/> </Button>
        <Button variant={"link"} onClick={()=>{navigate("/dashboard")}}>Dashboard</Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user?.avatarUrl} alt={user?.userName} />
              <AvatarFallback>{user?.userName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user?.fullName || user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate("/account-settings")}>
              Account Settings
            </DropdownMenuItem>
           
          
           
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu></div>
      ) : (
        <div className="flex space-x-2">
           <Button variant={"outline"}>Star on Github 🌟 </Button>
          <Dialog>
            <DialogTrigger>
              <Button variant="secondary">Login</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex flex-col items-center space-y-2">
                  <h1 className="font-medium">Hey There!</h1>
                  <img className="h-16 w-16" src="/icon.png" alt="Logo" />
                </DialogTitle>
                <DialogDescription>
                  <Button className="w-full mt-10" onClick={handleGithubLogin}>
                    <Github className="mr-2" /> Login with Github
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default Navbar;