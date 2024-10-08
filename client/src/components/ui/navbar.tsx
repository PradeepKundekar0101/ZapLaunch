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
import { Github, RocketIcon } from "lucide-react";
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
    console.log(import.meta.env.VITE_BASE_URL)
    
    window.location.href = import.meta.env.VITE_BASE_URL+"/api/v1/auth/github";
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className=" py-4 flex items-center justify-between lg:mx-[20vw]">
      <div>
        <Link to={"/"}>Coderbro</Link>
      </div>
      {isAuthenticated ? (
        <div className=" flex items-center">
          <Button
            onClick={() => {
              window.location.href =
                "https://github.com/PradeepKundekar0101/LaunchPilot-prod/";
            }}
            variant={"outline"}
          >
            Star on Github 🌟{" "}
          </Button>
          <Button
            variant={"link"}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.avatarUrl} alt={user?.userName} />
                <AvatarFallback>{user?.userName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {user?.fullName || user?.userName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate("/account-settings")}>
                Account Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              window.location.href =
                "https://github.com/PradeepKundekar0101/LaunchPilot-prod/";
            }}
            variant={"outline"}
          >
            Star on Github 🌟{" "}
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button variant="secondary">Login</Button>
            </DialogTrigger>
            <DialogContent
              className=" overflow-hidden
            "
            >
              <DialogHeader className="relative">
                <DialogTitle className="flex flex-col items-center space-y-2 mb-7 relative">
                  <h1 className="font-normal mb-7 relative z-10 text-3xl">
                    Welcome to LaunchPilot
                  </h1>
                  <RocketIcon className="mb-7 z-10" size={80} />
                </DialogTitle>
                <DialogDescription className="relative">
                  <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-90 bottom-10 left-10"></div>
                  <Button
                    className="w-full relative"
                    onClick={handleGithubLogin}
                  >
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
