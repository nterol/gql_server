// tslint:disable
// graphql typescript definitions

declare namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IQuery {
    __typename: 'Query';
    me: IUser | null;
  }

  interface IUser {
    __typename: 'User';
    id: string;
    email: string;
    graphs: Array<IGraph>;
    notes: Array<INote>;
  }

  interface IGraph {
    __typename: 'Graph';
    id: string;
    title: string;
    author: IUser;
    notes: Array<INote> | null;
    edges: Array<IEdge> | null;
  }

  interface INote {
    __typename: 'Note';
    id: string;
    title: string;
    author: IUser;
    asSource: IEdge;
    asTarget: IEdge;
  }

  interface IEdge {
    __typename: 'Edge';
    id: string;
    title: string;
    source: INote;
    target: INote;
  }

  interface IMutation {
    __typename: 'Mutation';
    sendForgotPasswordEmail: boolean | null;
    changePassword: Array<IError> | null;
    login: Array<IError> | null;
    logout: boolean | null;
    register: Array<IError> | null;
  }

  interface ISendForgotPasswordEmailOnMutationArguments {
    email: string;
  }

  interface IChangePasswordOnMutationArguments {
    newPassword: string;
    key: string;
  }

  interface ILoginOnMutationArguments {
    email: string;
    password: string;
  }

  interface IRegisterOnMutationArguments {
    email: string;
    password: string;
  }

  interface IError {
    __typename: 'Error';
    path: string;
    message: string;
  }
}

// tslint:enable
