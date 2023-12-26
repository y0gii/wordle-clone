import React, { useEffect, useRef, useState } from "react";
import "../styles/Wordle.scss";
import Rows from "./Rows";
import { LETTERS, potentialWords } from "../data/lettersAndWords";
import Keyboard from "./Keyboard";
const SOLUTION =
  potentialWords[Math.floor(Math.random() * potentialWords.length)];
const Wordle = () => {
  const [guesses, setGuesses] = useState([
    "     ",
    "     ",
    "     ",
    "     ",
    "     ",
    "     ",
  ]);

  const [solutionFound, setSolutionFound] = useState(false);
  const [activeLetterIndex, setActiveLetterIndex] = useState(0);
  const [notification, setNotification] = useState("");
  const [activeRowindex, setActiveRowindex] = useState(0);
  const [failedGuesses, setFailedGuesses] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [presentLetters, setPresentLetters] = useState([]);
  const [absentLetters, setAbsentLetters] = useState([]);
  const [solutionWord, setSolutionWord] = useState("");
  const wordleRef = useRef();
  useEffect(() => {
    wordleRef.current.focus();
  }, []);

  const typeLetter = (letter) => {
    if (activeLetterIndex < 5) {
      setNotification("");
      let newGuesses = [...guesses];
      newGuesses[activeRowindex] = replaceCharacter(
        newGuesses[activeRowindex],
        activeLetterIndex,
        letter
      );
      setGuesses(newGuesses);
      setActiveLetterIndex((index) => index + 1);
    }
  };
  const replaceCharacter = (string, index, replacement) => {
    return (
      string.slice(0, index) +
      replacement +
      string.slice(index + replacement.length)
    );
  };
  const hitEnter = () => {
    if (activeRowindex === 5 && activeLetterIndex > 4) {
      setSolutionWord(SOLUTION);
      setNotification(`You Lost!!, word is:  ${SOLUTION}`);
    }
    if (activeLetterIndex === 5) {
      const currentGuess = guesses[activeRowindex];
      if (!potentialWords.includes(currentGuess)) {
        setNotification("NOT IN WORD LIST!!");
      } else if (failedGuesses.includes(currentGuess)) {
        setNotification("WORD TRIED ALREADY!!");
      } else if (currentGuess == SOLUTION) {
        setSolutionFound(true);
        setNotification("WELL DONE");
        setCorrectLetters([...SOLUTION]);
      } else {
        let correctLetters = [];
        [...currentGuess].forEach((letter, index) => {
          if (SOLUTION[index] === letter) {
            correctLetters.push(letter);
          }
        });

        setCorrectLetters([...new Set(correctLetters)]);

        setPresentLetters([
          ...new Set([
            ...presentLetters,
            ...[...currentGuess].filter((letter) => SOLUTION.includes(letter)),
          ]),
        ]);
        setAbsentLetters([
          ...new Set([
            ...absentLetters,
            ...[...currentGuess].filter((letter) => !SOLUTION.includes(letter)),
          ]),
        ]);
        setFailedGuesses(...failedGuesses, currentGuess);
        setActiveRowindex((index) => index + 1);
        setActiveLetterIndex(0);
      }
    } else {
      setNotification("FIVE LETTER WORDS ONLY!!");
    }
  };
  const hitBackSpace = () => {
    setNotification("");
    if (guesses[activeRowindex][0] !== " ") {
      const newGuesses = [...guesses];
      newGuesses[activeRowindex] = replaceCharacter(
        newGuesses[activeRowindex],
        activeLetterIndex - 1,
        " "
      );
      setGuesses(newGuesses);
      setActiveLetterIndex((index) => index - 1);
    }
  };
  const handleKeydown = (event) => {
    if (solutionFound) return;
    if (LETTERS.includes(event.key)) {
      typeLetter(event.key);
      return;
    }
    if (event.key === "Enter") {
      hitEnter();
      return;
    }
    if (event.key === "Backspace") {
      hitBackSpace();
    }
  };
  return (
    <div
      className="wordle"
      ref={wordleRef}
      tabIndex="0"
      onBlur={(e) => {
        e.target.focus();
      }}
      onKeyDown={handleKeydown}
    >
      <h1 className="title">Wordle Clone</h1>
      <div className={`notification ${solutionFound && "notification--green"}`}>
        {notification}
      </div>
      {guesses.map((guess, index) => {
        return (
          <Rows
            key={index}
            word={guess}
            applyRotation={
              activeRowindex > index ||
              (solutionFound && activeRowindex === index)
            }
            solution={SOLUTION}
            bounceOnError={
              notification !== "WELL DONE" &&
              notification !== "" &&
              activeRowindex === index
            }
          />
        );
      })}
      <Keyboard
        presentLetters={presentLetters}
        correctLetters={correctLetters}
        absentLetters={absentLetters}
        typeLetter={typeLetter}
        hitEnter={hitEnter}
        hitBackSpace={hitBackSpace}
      />
    </div>
  );
};

export default Wordle;
