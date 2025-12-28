import { useState } from "react";
import type { IQuizOverviewResponse } from "../../../types";
interface RenameQuizOverviewProps{
    handleUpdateQuizTitle:(inpit:string)=>void;
    closeRenameModal:()=>void;
    quiz:IQuizOverviewResponse;   
}
 const RenameQuizOverview = ({handleUpdateQuizTitle,closeRenameModal,quiz}:RenameQuizOverviewProps)=>{
    const [localQuizTitle,setLocalQuizTitle]=useState(quiz.title||" ");


    const handleChangeQuizTitle=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setLocalQuizTitle(e.target.value);
    }

    const handleKeyDown = (e:React.KeyboardEvent)=>{
        if(e.key==="Escape"){
            closeRenameModal();
        }
        if(localQuizTitle===quiz.title||localQuizTitle.trim().length===0){
            return; // no change or empty title
        }
        if(e.key==="Enter"){
            handleUpdateQuizTitle(localQuizTitle);
            closeRenameModal();
        }
    }

    return(
        <>
        <input type="text" onClick={(e)=>e.stopPropagation()} value={localQuizTitle} onChange={handleChangeQuizTitle} onKeyDown={handleKeyDown} 
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus />
        </>
    )
}
export default RenameQuizOverview;