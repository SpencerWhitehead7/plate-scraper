import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type ModalState = {
  modalType: string
}

const initialState: ModalState = {
  modalType: '',
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload }: PayloadAction<{ modalType: string }>) => {
      state.modalType = payload.modalType
    },
    closeModal: (state) => {
      state.modalType = ''
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
export const handleCloseModal = modalSubmitThunk => async dispatch => {
  if (modalSubmitThunk) {
    await modalSubmitThunk(dispatch)
  }
  dispatch(closeModal())
}

export const modalReducer = modalSlice.reducer
