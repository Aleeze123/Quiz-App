"use client";

import { initFirebase } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  const app = initFirebase();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        goToAccount(); 
      }
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const rightArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  );

  const goToAccount = () => {
    router.push("/quiz");
  };

  return (
    <div className="relative h-screen text-white">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 object-cover w-full h-full"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      <div className="flex justify-center items-center h-full absolute inset-0">
        <div className="text-center p-8 rounded-lg shadow-2xl border-4 border-white bg-opacity-50 bg-black">
          <div className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-white">Quiz App</span>
          </div>
          <div className="text-lg md:text-2xl font-light mb-8">
            Ready to challenge your knowledge? Let&apos;s dive into the quiz!
          </div>
          <button
            onClick={signIn}
            className="bg-white text-black p-4 px-6 text-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out border border-black hover:shadow-1xl hover:shadow-white hover:bg-gray-100"
          >
            <div className="flex gap-2 items-center align-middle">
              Login With Google {rightArrow}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
