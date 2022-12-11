import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import AuthModal from './AuthModal'

export const MODAL_TYPES = {
  AUTH: 'modal_types/AUTH',
}

export const MODAL_MAP = {
  [MODAL_TYPES.AUTH]: AuthModal,
}

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

const { openModal } = modalSlice.actions
export const openAuthModal = () => openModal({ modalType: MODAL_TYPES.AUTH })

export const { closeModal } = modalSlice.actions
export const handleCloseModal = modalSubmitThunk => async dispatch => {
  if (modalSubmitThunk) {
    await modalSubmitThunk(dispatch)
  }
  dispatch(closeModal())
}

export const modalReducer = modalSlice.reducer
