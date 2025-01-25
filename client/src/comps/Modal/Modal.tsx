import FocusTrap from "focus-trap-react"
import React, { useEffect } from "react"

import { Card } from "@/comps/Card"

import s from "./Modal.module.scss"
import { useCtxModal } from "./modalContext"

export const Modal: React.FC = () => {
  const { ModalContent, closeModal } = useCtxModal()

  useEffect(() => {
    const closeModalListener = (evt: KeyboardEvent) => {
      if (evt.key === "Escape" && ModalContent) {
        closeModal()
      }
    }

    window.addEventListener("keyup", closeModalListener)

    return () => {
      window.removeEventListener("keyup", closeModalListener)
    }
  }, [ModalContent, closeModal])

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
