import React from "react";
const Key = ({ letter, typeLetter, isAbsent, isPresent, isCorrect }) => {
  return (
    <div
      className={`key ${isAbsent && "key--absent"} ${
        isPresent && "key--present"
      } ${isCorrect && "key--correct"}`}
      onClick={() => typeLetter(letter)}
    >
      {letter}
    </div>
  );
};

export default Key;
