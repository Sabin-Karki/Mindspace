import { create } from "zustand";
import type { IReportResponse } from "../types";

interface ReportCardState {
  reports: IReportResponse[];
  reportCardName: string;
  
  setReportCards: (reportCards: IReportResponse[]) => void;
  clearReportCards: () => void;

  addReportCard: (reportCard: IReportResponse) => void;
  removeReportCard: (reportCardId: number) => void;

  updateReportCardName: (reportCardId: number, newName: string) => void;
}

export const useReportCardStore = create<ReportCardState>(

  (set) =>({
    reports: [],
    reportCardName: "",
    setReportCards: (reportCards) =>set( {reports: reportCards} ),
    clearReportCards:() => set( {reports:[]} ),
    
    addReportCard:(reportCard) =>set(
      (state) =>{
        const alreadyExists = state.reports.some( 
          (r) => r.reportId === reportCard.reportId
        );
        if(alreadyExists) return state;
        return {reports: [...state.reports, reportCard]}
      }
    ),
    removeReportCard:(reportCardId) => set(
      //explicit return
      // (state) =>{ 
      //   return {
      //     reports: state.reports.filter( (r) => r.reportId !== reportCardId)
      //   }
      // }
      //implcit return 
      (state) =>({
        reports: state.reports.filter( (r) => r.reportId !== reportCardId)
      })
    
    ),
    updateReportCardName:(reportCardId, newName) =>set(
      // (state) =>({
      //   reports: state.reports.map( (r) =>{ 
      //     if(r.reportId === reportCardId){
      //       return {...r, newName};
      //     }
      //     return r;
      //   })
      // })

      (state) =>({
        reports: state.reports.map( (r) =>(
          r.reportId === reportCardId ? {...r, reportCardName: newName} : r 
        ))
      })
    ),


  })
) 