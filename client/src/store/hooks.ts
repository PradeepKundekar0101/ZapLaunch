
import type { AppDispatch,RootState } from "./store";
import { TypedUseSelectorHook,useSelector,useDispatch } from "react-redux";

 
export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch  = ()=> useDispatch<AppDispatch>()