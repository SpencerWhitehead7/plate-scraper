import React from 'react'
import { connect } from 'react-redux'
import FocusTrap from 'focus-trap-react'

import Card from 'comps/Card'
import { MODAL_MAP } from './modalTypes'
import { closeModal as closeModalAction } from './modalReducer'

import s from './Modal.scss'

const Modal = ({ ModalContent, closeModal }) => (
  ModalContent
    ? (
      <FocusTrap
        focusTrapOptions={{
          // fragile-y hardcoded to webpack classname output from App.scss file
          onActivate: () => { document.body.classList.add(`App--bodyScrollLock`) },
          onDeactivate: () => { document.body.classList.remove(`App--bodyScrollLock`) },
        }}
      >
        <aside
          onClick={closeModal}
          onKeyUp={evt => { // onKeyPress does not "hear" the esc key for ??? reasons
            if (evt.keyCode === 27) closeModal() // esc
          }}
          className={s.modal__overlay}
        >
          <Card
            role="dialog"
            aria-modal
            aria-label="modal"
            onClick={evt => { evt.stopPropagation() }}
          >
            <div className={s.modal__closeButtonContainer}>
              <button type="button" autoFocus onClick={closeModal}>Close</button>
            </div>
            <ModalContent />
          </Card>
        </aside>
      </FocusTrap>
    )
    : null)

const mstp = state => ({
  ModalContent: state.modal.modalType && MODAL_MAP[state.modal.modalType],
})

const mdtp = {
  closeModal: closeModalAction,
}

export default connect(mstp, mdtp)(Modal)
