import { ReactNode } from "react";

export type ButtonProps = {
  id: string;
  title: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  containerClass: string;
}