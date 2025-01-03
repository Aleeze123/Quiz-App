
"use client";
import { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { initFirebase } from "@/app/firebase";
import { getAuth } from "firebase/auth";

type Answer = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  question: string;
  answers: Answer[];
};

type QuizState = {
  currentQuestion: number;
  score: number;
  showResults: boolean;
  questions: Question[];
  isLoading: boolean;
};

export default function QuizPage() {
  const app = initFirebase();
  const auth = getAuth(app);
  const userName = auth.currentUser?.displayName;
  const email = auth.currentUser?.email;
  const router = useRouter();

  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    showResults: false,
    questions: [],
    isLoading: true,
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&type=multiple"
        );
        const data = await response.json();
        const questions = data.results.map((item: any) => {
          const incorrectAnswers = item.incorrect_answers.map(
            (answer: string) => ({
              text: answer,
              isCorrect: false,
            })
          );
          const correctAnswer = {
            text: item.correct_answer,
            isCorrect: true,
          };
          return {
            question: item.question,
            answers: [...incorrectAnswers, correctAnswer].sort(
              () => Math.random() - 0.5
            ),
          };
        });
        setState((prevState) => ({
          ...prevState,
          questions,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerClick = (isCorrect: boolean): void => {
    if (isCorrect) {
      setState((prevState) => ({ ...prevState, score: prevState.score + 1 }));
    }

    const nextQuestion = state.currentQuestion + 1;
    if (nextQuestion < state.questions.length) {
      setState((prevState) => ({
        ...prevState,
        currentQuestion: nextQuestion,
      }));
    } else {
      setState((prevState) => ({ ...prevState, showResults: true }));
    }
  };

  const resetQuiz = (): void => {
    setState({
      currentQuestion: 0,
      score: 0,
      showResults: false,
      questions: state.questions,
      isLoading: false,
    });
  };

  const signOut = () => {
    auth.signOut();
    router.push("/");
  };

  if (state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <ClipLoader />
        <p>Loading quiz questions, please wait...</p>
      </div>
    );
  }

  if (state.questions.length === 0) {
    return <div>No questions available.</div>;
  }

  const currentQuestion = state.questions[state.currentQuestion];

  return (
    <div className="flex flex-col items-center justify-center h-screen text-foreground relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 flex flex-col items-center text-center mb-8 w-full px-4">
        <div className="text-white mb-1 text-lg">{`Signed in as ${userName}`}</div>
        <div className="text-white text-xl">{email}</div>
      </div>

      {/* Quiz Success Message */}
      {state.showResults && (
        <div className="fixed top-0 left-0 w-full bg-black bg-opacity-70 text-white p-6 rounded-b-lg shadow-xl flex items-center gap-4 justify-center z-50 border-white">
          <FaCheckCircle />
          <span className="text-2xl font-semibold">Quiz Completed Successfully!</span>
        </div>
      )}

      {state.showResults ? (
        <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-md w-full max-w-md relative z-10 border-2 border-white">
          <h2 className="text-2xl font-bold mb-4 text-white">Results</h2>
          <p className="text-lg mb-4 text-white">
            {email} scored {state.score} out of {state.questions.length}
          </p>
          <button
            onClick={resetQuiz}
            className="w-full bg-blue-950 text-white py-3 px-6 text-lg rounded-xl shadow-xl transform hover:scale-105 transition-all hover:from-indigo-600 hover:to-purple-700 border-white"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-md w-full max-w-md relative z-10 border-2 border-white">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Question {state.currentQuestion + 1}/{state.questions.length}
          </h2>
          <p
            className="text-lg mb-4 text-white"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />
          <div className="grid gap-4">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(answer.isCorrect)}
                className="w-full bg-blue-950 text-white py-3 px-6 text-lg rounded-xl shadow-xl transform hover:scale-105 transition-all hover:from-indigo-600 hover:to-purple-700 border-white"
              >
                {answer.text}
              </button>
            ))}
          </div>
          <div className="mt-4 text-right">
            <span className="text-muted-foreground text-white">Score: {state.score}</span>
          </div>
        </div>
      )}

      <button
        onClick={signOut}
        className="text-white hover:text-white text-lg text-center underline hover:no-underline transition-all mt-8 relative z-10"
      >
        Sign Out
      </button>
    </div>
  );
}
