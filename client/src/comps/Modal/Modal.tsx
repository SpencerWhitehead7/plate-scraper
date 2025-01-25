import React, { useEffect, useRef } from "react"

import { Card } from "@/comps/Card"

import s from "./Modal.module.scss"
import { useCtxModal } from "./modalContext"

export const Modal: React.FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const { ModalContent, closeModal } = useCtxModal()

  useEffect(() => {
    ModalContent === null
      ? dialogRef.current?.close()
      : dialogRef.current?.showModal()
  }, [ModalContent])

  return (
    <dialog
      ref={dialogRef}
      onClose={closeModal}
      onClick={closeModal}
      className={s.modal}
    >
      <Card
        onClick={(evt) => {
          evt.stopPropagation()
        }}
      >
        <div className={s.modal__closeButtonContainer}>
          <button type="button" autoFocus onClick={closeModal}>
            Close
          </button>
        </div>
        {ModalContent && <ModalContent />}
      </Card>
    </dialog>
  )
}
