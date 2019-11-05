export namespace BespokenDetails {
  export type Upload = () => Promise<any>;

  export interface MturkDetails {
    assignmentId: string;
    hitId: string;
    workerId: string;
    turkSubmitTo: string;
    numSentences: string;
    filters: string;
  }

  export interface State {
    contractor: string;
    mturkDetails: MturkDetails;
    isMturkContext: boolean;
  }

  enum ActionType {
    ADD_CONTRACTOR = 'ADD_CONTRACTOR',
    ADD_MTURK_DETAILS = 'ADD_MTURK_DETAILS',
  }

  interface AddContractorAction {
    type: ActionType.ADD_CONTRACTOR;
    contractor: string;
  }

  interface AddMturkDetailsAction {
    type: ActionType.ADD_MTURK_DETAILS;
    mturkDetails: MturkDetails;
  }

  export type Action = AddContractorAction | AddMturkDetailsAction;

  export const actions = {
    addContractor: (contractor: string) => ({
      type: ActionType.ADD_CONTRACTOR,
      contractor,
    }),
    addMturkDetails: (mturkDetails: MturkDetails) => ({
      type: ActionType.ADD_MTURK_DETAILS,
      mturkDetails,
    }),
  };

  export function reducer(
    state: State = {
      contractor: '',
      mturkDetails: {
        assignmentId: '',
        hitId: '',
        workerId: '',
        turkSubmitTo: '',
        numSentences: '',
        filters: '',
      },
      isMturkContext: false,
    },
    action: Action
  ): State {
    switch (action.type) {
      case ActionType.ADD_CONTRACTOR:
        return { ...state, contractor: action.contractor };
      case ActionType.ADD_MTURK_DETAILS:
        return {
          ...state,
          mturkDetails: action.mturkDetails,
          isMturkContext: !!action.mturkDetails.workerId,
        };
      default:
        return state;
    }
  }
}
