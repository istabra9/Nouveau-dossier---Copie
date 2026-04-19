export type AuthActionState = {
  status: "idle" | "error";
  message?: string;
};

export const initialAuthState: AuthActionState = {
  status: "idle",
};
