import { createContext, Dispatch, SetStateAction } from "react";

export type LoginUserContextType = {
  user: string | null;
  setUser: Dispatch<SetStateAction<string | null>>;
};

export const LoginuserContext = createContext<LoginUserContextType>(
  {} as LoginUserContextType
);
