/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: login
// ====================================================

export interface login_login {
  __typename: "LoginOutput";
  ok: boolean;
  token: string;
  error: string | null;
}

export interface login {
  login: login_login;
}

export interface loginVariables {
  loginInput: LoginInput;
}
