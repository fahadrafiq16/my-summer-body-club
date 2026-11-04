import React, { useState } from 'react';
import './GymMascot.css';

const EXERCISES = [
  { id: 'curl', color: '#f44e17', nl: 'Dumbbell curls', en: 'Dumbbell curls' },
  { id: 'squat', color: '#2563eb', nl: 'Squats', en: 'Squats' },
  { id: 'bend', color: '#7c3aed', nl: 'Zijwaarts buigen', en: 'Side bends' },
];
let pageExercise;

// Keep one choice for this page load, including React Strict Mode remounts.
function chooseExercise() {
  if (pageExercise) return pageExercise;
  let previous;
  try {
    previous = sessionStorage.getItem('msbc-gym-exercise');
  } catch {
    // Random selection still works when browser storage is unavailable.
  }
  const choices = EXERCISES.filter((exercise) => exercise.id !== previous);
  pageExercise = choices[Math.floor(Math.random() * choices.length)];
  try {
    sessionStorage.setItem('msbc-gym-exercise', pageExercise.id);
  } catch {
    // Remembering the previous exercise is optional.
  }
  return pageExercise;
}

export default function GymMascot({ lang = 'nl' }) {
  const [exercise] = useState(chooseExercise);
  const [paused, setPaused] = useState(false);
  const label = lang === 'nl'
    ? (paused ? 'Animatie afspelen' : 'Animatie pauzeren')
    : (paused ? 'Play animation' : 'Pause animation');

  return (
    <button
      type="button"
      className={`gym-mascot gym-mascot-${exercise.id}${paused ? ' gym-mascot-paused' : ''}`}
      style={{ '--gym-shirt-color': exercise.color }}
      onClick={() => setPaused((value) => !value)}
      aria-label={`${exercise[lang] || exercise.en} — ${label}`}
      title={`${exercise[lang] || exercise.en} — ${label}`}
    >
      <svg viewBox="0 0 140 120" aria-hidden="true" focusable="false">
        <ellipse cx="70" cy="108" rx="43" ry="6" fill="#fed7aa" />
        <circle cx="70" cy="58" r="48" fill="#fff7ed" />
        <g className="gym-mascot-body">
        <g stroke="#263344" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M61 83 L57 103 L48 105 M79 83 L83 103 L92 105" fill="none" />
          <g className="gym-mascot-lift">
            <path d="M57 59 L43 68 L31 48 M83 59 L97 68 L109 48" stroke="#efb78e" fill="none" strokeWidth="9" />
            <g strokeWidth="5">
              <path d="M20 46 H42 M98 46 H120" />
              <path d="M22 39 V53 M40 39 V53 M100 39 V53 M118 39 V53" strokeWidth="8" />
            </g>
          </g>
        </g>
        <path d="M57 55 Q70 50 83 55 L87 83 Q70 91 53 83 Z" fill="var(--gym-shirt-color)" />
        <path d="M54 80 H86 L84 90 H73 L70 85 L67 90 H56 Z" fill="#263344" />
        <circle cx="70" cy="34" r="20" fill="#efb78e" />
        <path d="M50 30 Q49 11 69 12 Q87 10 90 29 L82 23 L76 26 L66 22 L57 30 Z" fill="#263344" />
        <path d="M51 29 Q70 22 89 29" fill="none" stroke="var(--gym-shirt-color)" strokeWidth="6" />
        <circle cx="63" cy="36" r="2" fill="#263344" />
        <circle cx="77" cy="36" r="2" fill="#263344" />
        <path d="M64 43 Q70 49 76 43" fill="none" stroke="#263344" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M67 63 L63 72 H70 L67 80 L78 68 H71 L74 63 Z" fill="#fff" />
        </g>
      </svg>
    </button>
  );
}
