import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GAME_LEVELS } from "../constants";
import { GraduationCap, Award, CheckCircle2, XCircle, RefreshCcw, Timer, Trophy, Star, ChevronRight, Lock, BrainCircuit } from "lucide-react";

export default function PuzzleGame() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "finished" | "level_complete">("idle");
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [shuffledRight, setShuffledRight] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [lastMatchedPair, setLastMatchedPair] = useState<any | null>(null);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const levelData = useMemo(() => GAME_LEVELS.find(l => l.level === currentLevel)!, [currentLevel]);

  useEffect(() => {
    let interval: any;
    if (gameStatus === "playing") {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus === "playing") {
      if (levelData.type === "matching") {
        setShuffledRight([...levelData.pairs].sort(() => Math.random() - 0.5));
      } else {
        setCurrentQuestionIndex(0);
        setQuizFeedback(null);
      }
      setMatches([]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setError(false);
      setLastMatchedPair(null);
    }
  }, [gameStatus, currentLevel, levelData]);

  const handleQuizAnswer = useCallback((option: string) => {
    if (quizFeedback || error) return;
    
    const currentQuestion = levelData.questions[currentQuestionIndex];
    if (option === currentQuestion.answer) {
      setQuizFeedback({ isCorrect: true, message: currentQuestion.feedback });
      setScore(prev => prev + 200);
      
      setTimeout(() => {
        setQuizFeedback(null);
        if (currentQuestionIndex + 1 < levelData.questions.length) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          if (currentLevel < GAME_LEVELS.length) {
            setGameStatus("level_complete");
            setUnlockedLevels(prev => prev.includes(currentLevel + 1) ? prev : [...prev, currentLevel + 1]);
          } else {
            setGameStatus("finished");
          }
        }
      }, 3000);
    } else {
      setError(true);
      setScore(prev => Math.max(0, prev - 50));
      setTimeout(() => {
        setError(false);
      }, 800);
    }
  }, [quizFeedback, error, levelData, currentQuestionIndex, currentLevel]);

  const checkMatch = useCallback((leftId: string, rightId: string) => {
    if (leftId === rightId) {
      const matched = levelData.pairs.find(p => p.id === leftId);
      setMatches(prev => [...prev, leftId]);
      setLastMatchedPair(matched || null);
      setScore(prev => prev + 100);
      setSelectedLeft(null);
      setSelectedRight(null);
      setError(false);
      
      if (matches.length + 1 === levelData.pairs.length) {
        setTimeout(() => {
          if (currentLevel < GAME_LEVELS.length) {
            setGameStatus("level_complete");
            setUnlockedLevels(prev => prev.includes(currentLevel + 1) ? prev : [...prev, currentLevel + 1]);
          } else {
            setGameStatus("finished");
          }
          setLastMatchedPair(null);
        }, 2500);
      } else {
        setTimeout(() => setLastMatchedPair(null), 2500);
      }
    } else {
      setError(true);
      setScore(prev => Math.max(0, prev - 20));
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setError(false);
      }, 800);
    }
  }, [levelData, matches.length, currentLevel]);

  const handleLeftClick = useCallback((id: string) => {
    if (matches.includes(id) || error) return;
    setSelectedLeft(id);
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  }, [matches, error, selectedRight, checkMatch]);

  const handleRightClick = useCallback((id: string) => {
    if (matches.includes(id) || error) return;
    setSelectedRight(id);
    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  }, [matches, error, selectedLeft, checkMatch]);

  const useHint = useCallback(() => {
    if (score < 50 || gameStatus !== "playing") return;
    setScore(prev => Math.max(0, prev - 50));
    setHintsUsed(prev => prev + 1);
    
    if (levelData.type === "matching") {
      const unmatched = levelData.pairs.find(p => !matches.includes(p.id));
      if (unmatched) {
        setSelectedLeft(unmatched.id);
        setSelectedRight(unmatched.id);
        setTimeout(() => {
          checkMatch(unmatched.id, unmatched.id);
        }, 500);
      }
    } else {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }
  }, [score, gameStatus, levelData, matches, checkMatch]);

  const startLevel = useCallback((level: number) => {
    if (!unlockedLevels.includes(level)) return;
    setCurrentLevel(level);
    setGameStatus("playing");
  }, [unlockedLevels]);

  const resetGame = useCallback(() => {
    setMatches([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setGameStatus("idle");
    setError(false);
    setLastMatchedPair(null);
    setTime(0);
    setScore(0);
    setCurrentLevel(1);
    setUnlockedLevels([1]);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <section id="game" className="py-32 bg-warm-bg text-ink overflow-hidden border-t border-burgundy/5 relative">
      <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-8 bg-burgundy/20" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-burgundy/60">
                Thử thách trí tuệ
              </span>
              <div className="h-px w-8 bg-burgundy/20" />
            </div>
            <h2 className="text-[clamp(2.5rem,10vw,5rem)] md:text-[clamp(5rem,15vw,9rem)] font-serif font-bold mb-6 md:mb-10 leading-[0.85] tracking-tighter">
              Đấu trường <br />
              <span className="italic font-normal text-burgundy">Khoa bảng</span>
            </h2>
            <p className="text-base md:text-lg text-olive/80 font-serif italic leading-relaxed max-w-2xl mx-auto">
              "Vượt qua các cấp độ thử thách để chứng minh kiến thức của bạn về di sản Văn Miếu Mao Điền."
            </p>
          </motion.div>
        </div>

        <div className="oriental-frame bg-wood p-6 md:p-16 shadow-2xl relative overflow-hidden min-h-[500px] md:min-h-[750px] flex flex-col">
          <div className="absolute inset-0 opacity-[0.05] cloud-pattern pointer-events-none" />
          <div className="absolute inset-4 border border-gold/10 pointer-events-none" />

          {/* Game Header Stats */}
          {gameStatus === "playing" && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-between items-center mb-8 md:mb-16 gap-4 md:gap-6 relative z-10"
            >
              <div className="flex items-center gap-4 md:gap-8">
                <div className="px-4 md:px-6 py-2 md:py-3 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 shadow-sm backdrop-blur-sm">
                  <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-gold/40 block mb-0.5 md:mb-1">Cấp độ</span>
                  <span className="text-xl md:text-3xl font-serif text-white">{currentLevel}/{GAME_LEVELS.length}</span>
                </div>
                <div className="px-4 md:px-6 py-2 md:py-3 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 shadow-sm backdrop-blur-sm">
                  <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-gold/40 block mb-0.5 md:mb-1">Thời gian</span>
                  <span className="text-xl md:text-3xl font-mono text-white">{formatTime(time)}</span>
                </div>
                <button
                  onClick={useHint}
                  disabled={score < 50}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border transition-all flex flex-col items-center justify-center ${
                    score >= 50 
                    ? "bg-gold/10 border-gold/30 text-gold hover:bg-gold/20" 
                    : "bg-white/5 border-white/10 text-white/20 cursor-not-allowed"
                  }`}
                >
                  <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest block mb-0.5 md:mb-1">Gợi ý (-50đ)</span>
                  <BrainCircuit size={18} />
                </button>
              </div>
              <div className="px-6 md:px-10 py-3 md:py-5 bg-burgundy text-white rounded-2xl md:rounded-3xl border border-gold/20 shadow-xl flex items-center gap-3 md:gap-5 oriental-border">
                <Trophy size={20} className="text-gold md:w-8 md:h-8" />
                <span className="font-mono text-3xl md:text-5xl tracking-tighter">{score}</span>
              </div>
            </motion.div>
          )}

          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(#8B0000_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>

          <AnimatePresence mode="wait">
            {gameStatus === "idle" ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex-1 flex flex-col items-center justify-center py-10"
              >
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full max-w-6xl mb-10 md:mb-16">
                  {GAME_LEVELS.map((l) => (
                    <button
                      key={l.level}
                      onClick={() => startLevel(l.level)}
                      disabled={!unlockedLevels.includes(l.level)}
                      className={`relative w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(16.666%-1rem)] p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center gap-3 md:gap-4 group ${
                        unlockedLevels.includes(l.level)
                          ? "bg-white/5 border-white/10 hover:border-gold/40 hover:-translate-y-2 hover:shadow-2xl"
                          : "bg-stone-100/10 border-transparent opacity-20 cursor-not-allowed"
                      }`}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity lattice-pattern" />
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors duration-500 relative z-10 ${
                        unlockedLevels.includes(l.level) ? "bg-burgundy/20 group-hover:bg-burgundy/40 border border-gold/20" : "bg-stone-200/20"
                      }`}>
                        {unlockedLevels.includes(l.level) ? (
                          <Star size={16} className={`md:w-5 md:h-5 ${l.level <= unlockedLevels.length - 1 ? "text-gold fill-gold" : "text-gold/20"}`} />
                        ) : (
                          <Lock size={14} className="text-stone-400" />
                        )}
                      </div>
                      <div className="text-center relative z-10">
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gold/40 mb-0.5 md:mb-1 block">Cấp {l.level}</span>
                        <span className="text-[10px] md:text-[11px] font-medium tracking-tight text-white line-clamp-1">{l.title}</span>
                      </div>
                      {l.type === "quiz" && unlockedLevels.includes(l.level) && (
                        <div className="absolute -top-1 -right-1 bg-gold text-wood text-[7px] md:text-[8px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full uppercase tracking-tighter shadow-lg z-20">Quiz</div>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => startLevel(unlockedLevels[unlockedLevels.length - 1])}
                  className="group relative px-16 py-5 bg-burgundy text-white rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-burgundy/90 transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(139,0,0,0.2)]"
                >
                  Bắt đầu Thử thách
                  <ChevronRight size={16} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : gameStatus === "playing" ? (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col relative z-10"
              >
                <div className="mb-8 md:mb-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <h3 className="text-2xl md:text-4xl font-serif text-white">{levelData.title}</h3>
                    {levelData.type === "quiz" && (
                      <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Câu {currentQuestionIndex + 1}/{levelData.questions.length}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gold/60 text-xs md:text-sm font-serif italic tracking-wide">{levelData.description}</p>
                </div>

                {levelData.type === "matching" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-3 md:space-y-4">
                      {levelData.pairs.map((pair) => (
                        <button
                          key={pair.id}
                          onClick={() => handleLeftClick(pair.id)}
                          disabled={matches.includes(pair.id) || error}
                          className={`w-full text-left p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-500 flex items-center justify-between group ${
                            matches.includes(pair.id)
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400/40"
                              : selectedLeft === pair.id
                              ? "bg-burgundy text-white border-gold shadow-2xl scale-[1.02]"
                              : error && selectedLeft === pair.id
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-400 animate-shake"
                              : "bg-white/5 border-white/10 hover:border-gold/40 text-white"
                          }`}
                        >
                          <span className="font-serif text-base md:text-xl tracking-tight">{pair.left}</span>
                          {matches.includes(pair.id) ? (
                            <CheckCircle2 size={18} className="text-emerald-500 md:w-5 md:h-5" />
                          ) : (
                            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 transition-colors duration-500 ${selectedLeft === pair.id ? "border-white bg-white" : "border-gold/20 group-hover:border-gold/40"}`} />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      {shuffledRight.map((pair) => (
                        <button
                          key={pair.id}
                          onClick={() => handleRightClick(pair.id)}
                          disabled={matches.includes(pair.id) || error}
                          className={`w-full text-left p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-500 flex items-center justify-between group ${
                            matches.includes(pair.id)
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400/40"
                              : selectedRight === pair.id
                              ? "bg-burgundy text-white border-gold shadow-2xl scale-[1.02]"
                              : error && selectedRight === pair.id
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-400 animate-shake"
                              : "bg-white/5 border-white/10 hover:border-gold/40 text-white"
                          }`}
                        >
                          <span className="text-xs md:text-sm font-serif leading-relaxed italic pr-4 md:pr-6 text-gold/60 group-hover:text-white transition-colors">{pair.right}</span>
                          {matches.includes(pair.id) ? (
                            <CheckCircle2 size={18} className="text-emerald-500 md:w-5 md:h-5" />
                          ) : (
                            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 transition-colors duration-500 ${selectedRight === pair.id ? "border-white bg-white" : "border-gold/20 group-hover:border-gold/40"}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
                    <div className="mb-10 p-10 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-sm relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 cloud-pattern pointer-events-none" />
                      <h4 className="text-3xl font-serif text-white leading-relaxed relative z-10">
                        {levelData.questions[currentQuestionIndex].question}
                      </h4>
                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-gold/20 border border-gold/40 rounded-xl text-gold text-sm italic font-serif"
                        >
                          Gợi ý: Đáp án đúng là "{levelData.questions[currentQuestionIndex].answer}"
                        </motion.div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {levelData.questions[currentQuestionIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(option)}
                          disabled={!!quizFeedback || error}
                          className={`p-8 rounded-3xl border text-left transition-all duration-300 flex items-center gap-6 group ${
                            quizFeedback?.isCorrect && option === levelData.questions[currentQuestionIndex].answer
                              ? "bg-emerald-600 text-white border-gold shadow-xl"
                              : error && !quizFeedback
                              ? "bg-white/5 border-white/10 opacity-20"
                              : "bg-white/5 border-white/10 hover:border-gold/40 hover:bg-white/10 text-white shadow-sm"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[10px] font-bold text-gold/40 group-hover:bg-burgundy group-hover:text-gold transition-colors shrink-0 border border-white/10">
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="text-xl font-serif italic">{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Success Feedback Modal (Matching) */}
                <AnimatePresence>
                  {lastMatchedPair && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.1, y: -20 }}
                      className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-wood/90 backdrop-blur-md rounded-[3rem]"
                    >
                      <div className="bg-white text-ink p-12 rounded-[3rem] shadow-2xl max-w-lg w-full text-center border-4 border-gold relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
                        <div className="relative z-10">
                          <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12 border border-emerald-100">
                            <BrainCircuit size={48} className="text-emerald-600" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-6 block">Kiến thức mới</span>
                          <h4 className="text-4xl font-serif mb-8 tracking-tight leading-tight">{lastMatchedPair.left}</h4>
                          <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100 mb-4">
                            <p className="text-ink font-serif italic text-lg mb-4 leading-relaxed">{lastMatchedPair.right}</p>
                            <p className="text-olive/60 text-sm font-serif leading-relaxed italic">
                              {lastMatchedPair.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quiz Feedback Modal */}
                <AnimatePresence>
                  {quizFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.1, y: -20 }}
                      className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-wood/90 backdrop-blur-md rounded-[3rem]"
                    >
                      <div className="bg-white text-ink p-12 rounded-[3rem] shadow-2xl max-w-lg w-full text-center border-4 border-gold relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
                        <div className="relative z-10">
                          <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12 border border-emerald-100">
                            <CheckCircle2 size={48} className="text-emerald-600" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-6 block">Chính xác!</span>
                          <h4 className="text-3xl font-serif mb-8 tracking-tight">Tuyệt vời</h4>
                          <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100 mb-4">
                            <p className="text-olive/60 text-sm font-serif leading-relaxed italic">
                              {quizFeedback.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-3 text-rose-600 font-bold uppercase tracking-[0.4em] text-[10px] bg-rose-50 px-8 py-3 rounded-full border border-rose-200 shadow-lg"
                  >
                    <XCircle size={14} />
                    <span>Hãy thử lại nhé!</span>
                  </motion.div>
                )}
              </motion.div>
            ) : gameStatus === "level_complete" ? (
              <motion.div
                key="level_complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center py-10 text-center relative z-10"
              >
                <div className="w-28 h-28 rounded-[2.5rem] bg-gold/10 flex items-center justify-center mb-10 border-2 border-gold shadow-xl rotate-12">
                  <CheckCircle2 size={48} className="text-gold" />
                </div>
                <h3 className="text-5xl font-serif font-bold text-white mb-6 tracking-tight">Hoàn thành Cấp {currentLevel}!</h3>
                <p className="text-gold/70 mb-12 max-w-md font-serif italic leading-relaxed text-xl">
                  "Tuyệt vời! Bạn đã vượt qua thử thách về {levelData.title.toLowerCase()}. 
                  Sẵn sàng cho cấp độ tiếp theo chưa?"
                </p>
                <button
                  onClick={() => startLevel(currentLevel + 1)}
                  className="group flex items-center gap-6 px-20 py-6 bg-burgundy text-white rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-lacquer transition-all duration-500 shadow-2xl oriental-border"
                >
                  Tiếp tục Cấp {currentLevel + 1}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center py-10 text-center relative z-10"
              >
                <div className="w-36 h-36 rounded-[3rem] bg-gold/10 flex items-center justify-center mb-12 border-2 border-gold shadow-2xl -rotate-6">
                  <Award size={64} className="text-gold" />
                </div>
                <h3 className="text-6xl font-serif font-bold text-white mb-8 tracking-tight">Bậc thầy Mao Điền!</h3>
                <div className="flex gap-20 mb-16">
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/40 mb-3">Tổng Thời gian</div>
                    <div className="text-5xl font-mono text-white tracking-tighter">{formatTime(time)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/40 mb-3">Tổng Điểm</div>
                    <div className="text-5xl font-mono text-white tracking-tighter">{score}</div>
                  </div>
                </div>
                <p className="text-gold/70 mb-16 max-w-lg font-serif italic leading-relaxed text-xl">
                  "Chúc mừng bạn đã hoàn thành tất cả các thử thách. 
                  Bạn thực sự là một chuyên gia về lịch sử và văn hóa Văn miếu Mao Điền!"
                </p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-6 px-20 py-6 bg-burgundy text-white rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-lacquer transition-all duration-500 shadow-2xl oriental-border"
                >
                  <RefreshCcw size={18} />
                  Chơi lại từ đầu
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
