const A = {
  OPEN_MODAL: `modal/OPEN_MODAL`,
  CLOSE_MODAL: `modal/CLOSE_MODAL`,
}

export const openModal = modalType => ({ type: A.OPEN_MODAL, modalType })
export const closeModal = () => ({ type: A.CLOSE_MODAL })

const initialState = {
  modalType: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case A.OPEN_MODAL:
      return {
        ...state,
        modalType: action.modalType,
      }
    case A.CLOSE_MODAL:
      return {
        ...state,
        modalType: null,
      }
    default:
      return state
  }
}

export default reducer
