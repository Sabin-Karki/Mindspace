//discovery<user see list of quiz,quiz title,question.count --> interaction<the viewing part basically> -> management <user can delete  ,rename quiz ,list also updates without need of  reload>>
//so the type is kind of like the list,the quiz full which has all questions fetched and all and only viewed after modal opens is management..
//zustland is basically to manage global "data"so first defining what data should be "global" ->will it be correctAnswerIndex[],no since it will be needed for each QuizOverview only,each specific one,
//QuizList -> will be global as quizget<to show the quiz in list when modal is opened> or the quizlist to fetch the data from api..
//data that multiple components need 

import { create } from "zustand";
import  type {  IQuizOverviewResponse } from "../types";

interface QuizStateStore{
    quizzes:IQuizOverviewResponse[];

    setQuizzes:(quizzes:IQuizOverviewResponse[])=>void;
    addQuiz:(quiz:IQuizOverviewResponse)=>void;
    removeQuiz:(quizId:number)=>void;
    updateQuiz:(quizId:number,title:string)=>void;
}

//^it is basically declaring a global state saying there is a array of quizzes<1 array> and the rest of it is method use to update it
//what is set->set is a function that tells zustland which tells everyone that state changed
export const useQuizStore=create<QuizStateStore>((set)=>(
    {
        quizzes:[],

        setQuizzes:(quizzes:IQuizOverviewResponse[])=>set({quizzes}),

        //because we have incomplete data 
        addQuiz:(newQuiz:IQuizOverviewResponse)=>set((state)=>{
            const existingQuiz=state.quizzes.find((q)=>q.quizId == newQuiz.quizId);
            
            if(existingQuiz){
                //if there is no questions then //no questoins === half data ok 
                //so update half data with full data
                if( !existingQuiz.questions || existingQuiz.questions.length === 0 ){
                    return {
                        quizzes: state.quizzes.map( (q) =>
                            q.quizId === newQuiz.quizId ? newQuiz : q
                        )
                    }
                }
                return state;
            } 
            return {quizzes: [...state.quizzes,newQuiz]}; //gotta return the existing one along with the new added,cant just replace the whole thing
        }),
        removeQuiz:(quizId:number)=>set((state)=>(
            ({
                quizzes:state.quizzes.filter((quiz)=>quizId!==quiz.quizId),

            })
           
        )    
    ),
        updateQuiz:(quizId:number,title:string)=>set((state)=>({
            quizzes:state.quizzes.map((quiz)=>{
                if(quiz.quizId===quizId){
                    return {...quiz,title};
                }
                return quiz;
            }),
        })),

    }
))
