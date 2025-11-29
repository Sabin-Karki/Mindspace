import { toast } from "sonner";
import {  useEffect, useState } from "react";
import { getFlashCardsBySessionId } from "../../../api/flashApi";
import { useSessionStore } from "../../../store/sessionStore";
import { useFlashCardStore } from "../../../store/flashCardStore";
import type { ICardResponse } from "../../../types";
import FlashGet from "./FlashGet";

const FlashList = () => {
 
  const sessionId = useSessionStore((state) => state.sessionId);
  const setFlashCards = useFlashCardStore((state) => state.setFlashCards);

  const [error, setError ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() =>{
    const handleGetAllFlashList = async() =>{
      try {
        if(!sessionId) return;
        setError(null);
        setIsLoading(true);
        const response: ICardResponse[] = await getFlashCardsBySessionId(sessionId);
        console.log(response);
        
        setFlashCards(response);
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        const axiosMessage = error?.message;
        const message = serverMessage || axiosMessage || "Failed to generate flashcard. Please try again.";
        setError(message);
        toast.error(message);
      }finally{
        setIsLoading(false);
      }
    }
    handleGetAllFlashList();
  },[sessionId ]);


  return (
    <>
    <div>FlashList</div>
    { flashCards.length === 0 ? (
      <div>No flashcards found</div>

      ): flashCards.map( (flashCard) =>(
        //display all flash cards 
        <FlashGet
          key={flashCard.cardOverViewId}
          flashCard={flashCard} 
        />
      ))
    }
    </>
  )
}

export default FlashList;


//Eg data
export const flashCards: ICardResponse[] = [
  {
    cardOverViewId: 1,
    title: "Java Basics",
    sourceId: 101,
    cardDetails: [
      {
        cardId: 1,
        question: "What is JVM?",
        answer: "JVM stands for Java Virtual Machine and runs Java bytecode."
      },
      {
        cardId: 2,
        question: "What is a Class in Java?",
        answer: "A class is a blueprint used to create objects."
      },
      {
        cardId: 3,
        question: "What is an Object?",
        answer: "An object is an instance of a class with state and behavior."
      },
      {
        cardId: 4,
        question: "What is Inheritance?",
        answer: "Inheritance allows one class to acquire the properties of another class."
      },
      {
        cardId: 5,
        question: "What is Polymorphism?",
        answer: "Polymorphism allows methods to behave differently based on the object."
      }
    ]
  },

  {
    cardOverViewId: 2,
    title: "JavaScript Basics",
    sourceId: 102,
    cardDetails: [
      {
        cardId: 6,
        question: "What is JavaScript?",
        answer: "JavaScript is a scripting language used to build dynamic web pages."
      },
      {
        cardId: 7,
        question: "What is a Promise?",
        answer: "A Promise represents the eventual result of an asynchronous operation."
      },
      {
        cardId: 8,
        question: "What is an Arrow Function?",
        answer: "A shorter syntax for writing functions using =>."
      },
      {
        cardId: 9,
        question: "What is the DOM?",
        answer: "DOM stands for Document Object Model; it represents the structure of a webpage."
      },
      {
        cardId: 10,
        question: "What is Hoisting?",
        answer: "Hoisting means variable and function declarations are moved to the top during execution."
      }
    ]
  }
];

