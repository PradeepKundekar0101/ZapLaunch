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
import { login, logout } from "@/store/slices/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const { token, user } = useAppSelector((state) => state?.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const api = useAxios();
  const {
    data: guestLoginData,
    isLoading: guestLoading,
    isError: guestLoginIsError,
    error: guestError,
    refetch: guestLoginRefetch,
  } = useQuery({
    queryKey: ["guestLogin"],
    queryFn: async () => {
      return (await api.get("/auth/guestLogin")).data;
    },
    enabled: false,
  });
  const {
    refetch: signOutRefetch,
  } = useQuery({
    queryKey: ["signout"],
    queryFn: async () => {
      console.log("first")
      return (await api.get("/auth/signout")).data;
    },
    enabled: false,
  });
  useEffect(() => {
    if(guestLoginIsError && guestError.message){
      alert(guestError.message)
      toast({title:guestError.message,variant:"destructive"})
      return
    }
    if (guestLoginData?.guestUser && guestLoginData?.token) {
      dispatch(
        login({ user: guestLoginData.guestUser, token: guestLoginData.token })
      );
    }
  }, [guestLoginData,guestError]);
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const handleGithubLogin = () => {
    window.location.href =
      import.meta.env.VITE_BASE_URL + "/api/v1/auth/github";
  };
  const handleGuestLogin = () => {
    guestLoginRefetch();
  };

  const handleLogout = () => {
    signOutRefetch()
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className=" flex items-center justify-between flex-grow px-8 max-md:px-8 lg:px-[5vw] xl:px-[10vw] 2xl:px-[20vw] py-4 mb-4">
      <div className="" >
        <Link to={"/"} className="relative w-10 z-50"><img src="/logo.png" className=" "/></Link>
      </div>
      {isAuthenticated ? (
        <div className=" flex items-center">
          <Button
            onClick={() => {
              window.location.href =
                "https://github.com/PradeepKundekar0101/ZapLaunch";
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
              {/* <DropdownMenuItem onSelect={() => navigate("/account-settings")}>
                Account Settings
              </DropdownMenuItem> */}

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
                "https://github.com/PradeepKundekar0101/ZapLaunch";
            }}
            variant={"outline"}
          >
            Star on Github 🌟{" "}
          </Button>

          <Dialog>
            <DialogTrigger>
              <Button disabled={guestLoading} variant="secondary">Login</Button>
            </DialogTrigger>
            <DialogContent
              className=" overflow-hidden
            "
            >
              <DialogHeader className="relative">
                <DialogTitle className="flex flex-col items-center space-y-2 mb-7 relative">
                  <h1 className="font-normal mb-7 relative z-10 text-3xl">
                    ZapLaunch
                  </h1>
                  <RocketIcon className="mb-7 z-10" size={80} />
                </DialogTitle>
                <DialogDescription className="relative">
                  <div className="blob absolute h-96 w-96 bg-blue-900 blur-3xl opacity-90 bottom-10 left-10"></div>
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

          <Button
            disabled={guestLoading}
            variant={"ghost"}
            className="w-full relative"
            onClick={handleGuestLogin}
          >
            {guestLoading ? "Loading..." : "Login as Guest"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
