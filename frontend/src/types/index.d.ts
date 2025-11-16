
export interface ISignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ISigninRequest {
  email: string;
  password: string;
}

export interface ICardRequestDTO {
  sourceIds: number[]; // Java Long[] maps to number[]
}

export interface IQuizRequestDTO {
  sourceIds: number[]; // Java Long[] maps to number[]
}

export interface IChatRequest {
  question: string;
}

export interface IChatRenameRequest {
  title:  string;   ///we should get title too
}

export interface ICardResponse {
  cardOverViewId: number; //chat generates a flash card 
  title: string;
  sourceId: number;
  question: string;
  answer: string;
}

export interface IChatResponse {
  question: string;
  answer: string;
}

export interface IAudioUpdateDTO {
  title: string;
}

export interface ICardUpdate {
  title: string;
}

export interface IQuizUpdate {
  title: string;
}

export interface ISourceUpdateDTO {
  title: string;
}

export interface JwtResponse {
  token: string;
}

export interface IAudioResponseDTO {
  id: number;
  title: string;
  createdAt: string; // LocalDate maps to string (e.g., "2024-10-31")
  audioUrl: string;
}


export type MessageRole = 'user' | 'model' | 'system';

export interface IChatMessage {
  message: string;
  role: MessageRole; // Enforcing roles based on common chat structure
  createdAt: string; // LocalDate
}

export interface IQuestionResponse {
  questionId: number;
  questionText: string;
  options: string[]; // List<String>
  correctAnswerIndex: number; // int
}

export interface IQuizOverviewResponse {
  quizId: number;
  title: string;
  sourceId: number;
  questions: IQuestionResponse[];
}

// uploaded file source 
export interface IUploadResponse {
  sourceId: number;
  chunksSize: number;
  summary: string;
  title: string;
}

export interface IUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string; // LocalDate
}

export interface IChatSession {
  sessionId: number;
  title:  string;   ///we should get title too
  createdAt: string; // LocalDate
}

export interface ChatSessionGetDTO {
  sessionId: number;
  title:  string; 
  createdAt: string; // LocalDate
}

export interface IAudioOverview {
  id: number;
  title: string;
  createdAt: string; // LocalDate
  script: string;
  sourceId?: number; // Optional in case Source is null (nullable = true)
  audioUrl: string;
}

export interface IFlashCard {
  id: number;
  question: string;
  answer: string;
  flashCardOverviewId: number; // ID of the parent FlashCardOverview
}

export interface IFlashCardOverview {
  id: number;
  title: string;
  createdAt: string; // LocalDate
  sourceId?: number; // Optional in case Source is null
  // flashCards (OneToMany) is typically omitted in the overview/summary model
}

export interface IQuestion {
  id: number;
  questionText: string;
  options: string[]; // List<String>
  correctAnswerIndex: number;
  quizId: number; // ID of the parent QuizOverview
}

export interface IQuizOverview {
  id: number;
  title: string;
  createdAt: string; // LocalDate
  sourceId?: number; // Optional in case Source is null
  // questions (OneToMany) is typically omitted in the overview/summary model
}

export interface ISource {
  sourceId: number;
  title: string;
  content: string;
  summary: string;
  fileName: string;
  createdAt: string; // LocalDate
  userId: number; // ID of the related User
  sessionId?: number; // Optional in case ChatSession is null
}


export interface IChatSessionDetail extends IChatSessionSummary {
  user: IUser;
  // Note: Only include ChatMessages if the REST endpoint explicitly loads them.
  chatMessages: IChatMessage[];
}

// Example of an entity with its children loaded
export interface IFlashCardOverviewDetail extends IFlashCardOverview {
  flashCards: IFlashCard[];
}