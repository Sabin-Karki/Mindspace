import type { IAudioResponseDTO } from "../../../types";

const AudioGet = ({card}: {card: IAudioResponseDTO}) =>{
  
  
  return(
    <>
    <div className=" border-x-amber-950 p-4">
      {card.title}
      {card.audioUrl}
      {card.createdAt}
    </div>
    </>
  )
}

export default AudioGet;