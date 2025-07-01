import React, { useReducer } from "react";
import "../../components_css/auth_buttons_css/sign_up_button.css";

interface Props {
  property1: "hover" | "default";
}

export const SignUp = ({ property1 }: Props): React.ReactElement => {
  const [state, dispatch] = useReducer(reducer, {
    property1: property1 || "default",
  });

  return (
    <div
      className={`sign-up ${state.property1}`}
      onMouseLeave={() => {
        dispatch("mouse_leave");
      }}
      onMouseEnter={() => {
        dispatch("mouse_enter");
      }}
    >
      <div className="sign-up-text-content">
        Sign Up
      </div>
    </div>
  );
};

function reducer(state: any, action: any) {
  switch (action) {
    case "mouse_enter":
      return {
        ...state,
        property1: "hover",
      };

    case "mouse_leave":
      return {
        ...state,
        property1: "default",
      };
  }

  return state;
}