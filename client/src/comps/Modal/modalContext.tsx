import React, { createContext, useCallback, useContext, useState } from "react"

import { AuthModal } from "./AuthModal"

const MODALS = {
  NONE: null,
  AUTH: AuthModal,
} as const

type ModalCtxValue = {
  ModalContent: (typeof MODALS)[keyof typeof MODALS]
  closeModal: VoidFunction
  openModalAuth: VoidFunction
}

const modalCtx = createContext<ModalCtxValue>({} as ModalCtxValue)

type Props = {
  children: React.ReactNode
}

export const ProviderModal: React.FC<Props> = ({ children }) => {
  const [modalType, setModalType] = useState<keyof typeof MODALS>("NONE")

  const closeModal = useCallback(() => {
    setModalType("NONE")
  }, [])

  const openModalAuth = useCallback(() => {
    setModalType("AUTH")
  }, [])

  return (
    <modalCtx.Provider
      value={{
        ModalContent: MODALS[modalType],
        closeModal,
        openModalAuth,
      }}
    >
      {children}
    </modalCtx.Provider>
  )
}

export const useCtxModal = () => useContext(modalCtx)
