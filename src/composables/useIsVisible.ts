import { useAuth } from "@/app/config/store/auth";

export const useIsVisible = () => {
  const auth = useAuth();
  const isVisible = (item: any): boolean => {
    let bool: boolean = false;
    if (Array.isArray(item)) {
      item.forEach((el) => {
        bool = bool || auth.can(el);
      });
      return bool;
    } else if (typeof item === "string") {
      return (bool = auth.can(item));
    } else if (typeof item === "boolean") {
      return (bool = true);
    } else {
      return bool;
    }
  };

  return {
    isVisible: isVisible
  };
};
