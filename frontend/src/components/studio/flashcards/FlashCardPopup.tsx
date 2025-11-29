import type { ICardDetailResponse } from "../../../types";


const FlashCardPopup = ({flashCardQA, closeModal}:{flashCardQA: ICardDetailResponse; closeModal: () => void; }) => {
  


  return (
    <>
    <div key={flashCardQA.cardId}></div>
      <div>{flashCardQA.question}</div>
      <div>{flashCardQA.question}</div>
      <div>{flashCardQA.question}</div>
    </>
  )
} 

export default FlashCardPopup;