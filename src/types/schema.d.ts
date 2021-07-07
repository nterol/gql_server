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
    edge: IEdge;
    edges: Array<IEdge>;
    graph: IGraph | null;
    graphs: Array<IGraph>;
    note: INote;
    notes: Array<INote>;
    me: IUser | null;
  }

  interface IEdgeOnQueryArguments {
    id: string;
  }

  interface IGraphOnQueryArguments {
    id: string;
  }

  interface INoteOnQueryArguments {
    id: string;
  }

  interface IEdge {
    __typename: 'Edge';
    id: string;
    title: string;
    source: INote;
    target: INote;
    graph: IGraph;
  }

  interface INote {
    __typename: 'Note';
    id: string;
    title: string;
    body: string;
    author: IUser;
    graph: IGraph;
    asSource: Array<IEdge>;
    asTarget: Array<IEdge>;
  }

  interface IUser {
    __typename: 'User';
    id: string;
    email: string;
    graphs: Array<IGraph> | null;
    notes: Array<INote> | null;
  }

  interface IGraph {
    __typename: 'Graph';
    id: string;
    title: string;
    author: IUser;
    notes: Array<INote> | null;
    edges: Array<IEdge> | null;
  }

  interface IMutation {
    __typename: 'Mutation';
    addEdge: IEdge | null;
    removeEdge: Array<IError>;
    createGraph: Array<IError> | null;
    createNote: INote | null;
    updateNote: INote | null;
    deleteNote: Array<IError> | null;
    sendForgotPasswordEmail: boolean | null;
    changePassword: Array<IError> | null;
    login: Array<IError> | null;
    logout: boolean | null;
    register: Array<IError> | null;
  }

  interface IAddEdgeOnMutationArguments {
    sourceId: string;
    targetId: string;
    title: string;
  }

  interface IRemoveEdgeOnMutationArguments {
    id: string;
  }

  interface ICreateGraphOnMutationArguments {
    title: string;
  }

  interface ICreateNoteOnMutationArguments {
    title: string;
    body?: string | null;
    graphId: string;
  }

  interface IUpdateNoteOnMutationArguments {
    id: string;
    title?: string | null;
    body?: string | null;
  }

  interface IDeleteNoteOnMutationArguments {
    noteId: string;
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
