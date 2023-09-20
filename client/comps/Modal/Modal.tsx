import FocusTrap from "focus-trap-react"
import React, { useEffect } from "react"

import { Card } from "@/comps/Card"
import { useAppDispatch, useAppSelector } from "@/reducers"

import s from "./Modal.module.scss"
import { closeModal as closeModalAction, MODAL_MAP } from "./modalReducer"

export const Modal = () => {
  const ModalContent = useAppSelector(
    (s) => MODAL_MAP[s.modalReducer.modalType],
  )
  const dispatch = useAppDispatch()
  const closeModal = () => {
    dispatch(closeModalAction())
  }

  useEffect(() => {
    const closeModalListener = (evt: KeyboardEvent) => {
      if (evt.key === "Escape" && ModalContent) {
        dispatch(closeModalAction())
      }
    }

    window.addEventListener("keyup", closeModalListener)

    return () => {
      window.removeEventListener("keyup", closeModalListener)
    }
  }, [dispatch, ModalContent])

  return ModalContent ? (
    <FocusTrap
      focusTrapOptions={{
        // fragile-y hardcoded to webpack classname output from App.scss file
        onActivate: () => {
          document.body.classList.add("App--bodyScrollLock")
        },
        onDeactivate: () => {
          document.body.classList.remove("App--bodyScrollLock")
        },
      }}
    >
      <aside onClick={closeModal} className={s.modal__overlay}>
        <Card
          role="dialog"
          aria-modal
          aria-label="modal"
          onClick={(evt: React.MouseEvent) => {
            evt.stopPropagation()
          }}
        >
          <div className={s.modal__closeButtonContainer}>
            <button type="button" autoFocus onClick={closeModal}>
              Close
            </button>
          </div>
          <ModalContent />
        </Card>
      </aside>
    </FocusTrap>
  ) : null
}
