export namespace BespokenDetails {
  export type Upload = () => Promise<any>;

  export interface State {
    contractor: string;
  }

  enum ActionType {
    ADD_CONTRACTOR = 'ADD_CONTRACTOR',
  }

  interface AddAction {
    type: ActionType.ADD_CONTRACTOR;
    contractor: string;
  }

  export type Action = AddAction;

  export const actions = {
    addContractor: (contractor: string) => ({
      type: ActionType.ADD_CONTRACTOR,
      contractor,
    }),
  };

  export function reducer(
    state: State = { contractor: '' },
    action: Action
  ): State {
    switch (action.type) {
      case ActionType.ADD_CONTRACTOR:
        return { ...state, contractor: action.contractor };
      default:
        return state;
    }
  }
}
