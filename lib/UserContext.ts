import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export type LoginUserContextType = {
  user: string | null;
  setUser: Dispatch<SetStateAction<string | null>>;
};

export const LoginuserContext = createContext<LoginUserContextType>(
  {} as LoginUserContextType
);
