import { useState, useCallback, useEffect, useRef } from "react";
import { Modal, Button, Text, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const CONFETTI_COLORS = ["#e8a0a8", "#d4a574", "#fff8f0", "#c97b84", "#ffd6e0"];

function App() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [
    letterModalOpened,
    { open: openLetterModal, close: closeLetterModal },
  ] = useDisclosure(false);
  const [surpriseVisible, setSurpriseVisible] = useState(false);
  const [candlePhase, setCandlePhase] = useState("idle");
  const [countdownNum, setCountdownNum] = useState(3);
  const [hearts, setHearts] = useState([]);
  const [letterScrolling, setLetterScrolling] = useState(false);
  const letterScrollTimeoutRef = useRef(null);
  const audioRef = useRef(null);
  const musicStartedRef = useRef(false);

  const launchConfetti = useCallback(() => {
    for (let i = 0; i < 60; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.left = Math.random() * 100 + "vw";
      el.style.backgroundColor =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      el.style.animationDuration = Math.random() * 2 + 2 + "s";
      el.style.animationDelay = Math.random() * 0.5 + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  }, []);

  const openEnvelope = useCallback(() => {
    setEnvelopeOpen(true);
    setTimeout(openLetterModal, 100);
  }, [openLetterModal]);

  const closeLetter = useCallback(() => {
    closeLetterModal();
    setEnvelopeOpen(false);
  }, [closeLetterModal]);

  const handleLetterScroll = useCallback(() => {
    setLetterScrolling(true);
    if (letterScrollTimeoutRef.current) clearTimeout(letterScrollTimeoutRef.current);
    letterScrollTimeoutRef.current = setTimeout(() => setLetterScrolling(false), 600);
  }, []);

  const showSurprise = useCallback(() => {
    setSurpriseVisible(true);
    launchConfetti();
  }, [launchConfetti]);

  const startCandleCountdown = useCallback(() => {
    if (candlePhase !== "idle") return;
    setCandlePhase("countdown");
    setCountdownNum(3);
  }, [candlePhase]);

  useEffect(() => {
    if (candlePhase !== "countdown") return;
    if (countdownNum <= 0) {
      setCandlePhase("blown");
      launchConfetti();
      return;
    }
    const t = setTimeout(() => setCountdownNum((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [candlePhase, countdownNum, launchConfetti]);

  const addHeart = useCallback(() => {
    const id = Date.now() + Math.random();
    const heart = {
      id,
      left: Math.random() * 100,
      size: Math.random() * 22 + 20,
      duration: Math.random() * 2 + 5,
    };
    setHearts((prev) => [...prev.slice(-55), heart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 10000);
  }, []);

  useEffect(() => {
    const t = setInterval(addHeart, 220);
    return () => clearInterval(t);
  }, [addHeart]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const play = () => {
      audio.play().then(() => { musicStartedRef.current = true; }).catch(() => {});
    };
    play();
    const onInteraction = () => {
      if (musicStartedRef.current) return;
      play();
      document.removeEventListener("click", onInteraction);
      document.removeEventListener("touchstart", onInteraction);
    };
    document.addEventListener("click", onInteraction, { once: true });
    document.addEventListener("touchstart", onInteraction, { once: true });
  }, []);

  const handleHeartClick = useCallback(
    (id) => {
      setHearts((prev) =>
        prev.map((h) => (h.id === id ? { ...h, burst: true } : h)),
      );
      launchConfetti();
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 500);
    },
    [launchConfetti],
  );

  return (
    <div className="min-h-screen overflow-x-hidden text-center font-sans text-ink bg-gradient-to-b from-[#ffeef2] via-[#ffd6e0] to-[#f8c4d0] relative">
      <audio ref={audioRef} src="/birthday.mp3" loop preload="auto" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(255,182,193,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,218,224,0.4) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-[520px] mx-auto px-4 py-8 pb-16">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-ink drop-shadow-sm animate-[gentle-pulse_4s_ease-in-out_infinite]">
          Happy Birthday Maya !!!
        </h1>
        <p className="text-rose-deep text-sm uppercase tracking-widest mb-8">
          🎂 ✨ You deserve the world ✨ 🎂
        </p>

        <div className="mt-8">
          {candlePhase === "idle" && (
            <>
              <button
                type="button"
                className="text-8xl cursor-pointer transition transform hover:scale-110 hover:-rotate-6 active:scale-105 drop-shadow-md bg-transparent border-0"
                onClick={startCandleCountdown}
                title="Blow the candles!"
              >
                🎂
              </button>
              <p className="text-rose-deep text-sm mt-2">
                Blow the candles — make a wish!
              </p>
              <p className="text-rose-deep/80 text-xs mt-1">
                Click the cake to start
              </p>
            </>
          )}
          {candlePhase === "countdown" && (
            <div className="animate-[gentle-pulse_0.8s_ease-in-out_infinite]">
              <p className="text-rose-deep font-semibold text-lg mb-1">
                Blow the candle in...
              </p>
              <p className="text-4xl font-bold text-rose-deep tabular-nums">
                {countdownNum}
              </p>
              <p className="text-8xl mt-2">🎂</p>
            </div>
          )}
          {candlePhase === "blown" && (
            <div className="animate-[gentle-pulse_2s_ease-in-out_1]">
              <p className="text-8xl mb-2">🎂</p>
              <p className="text-rose-deep font-semibold">
                The candle is blown! 🎉
              </p>
            </div>
          )}
        </div>

        <div
          className="envelope-wrap my-8 mx-auto cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Open envelope to read letter"
          onClick={openEnvelope}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openEnvelope();
            }
          }}
        >
          <div className={`envelope ${envelopeOpen ? "open" : ""}`}>
            <div className="base" />
            <div className="left" />
            <div className="right" />
            <div className="flap" />
            <div className="letter" />
          </div>
        </div>
      </div>

      <Modal
        opened={letterModalOpened}
        onClose={closeLetter}
        title={null}
        centered
        withCloseButton={false}
        classNames={{
          content: "rounded-xl w-[calc(100%-2rem)] max-w-[350px] sm:max-w-[420px] mx-auto",
          body: "p-0",
        }}
        styles={{
          content: {
            background: "linear-gradient(180deg, #fdf6ed 0%, #f9ede0 100%)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(212,165,116,0.3)",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
          body: {
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <div className="relative font-serif text-left min-h-0 flex flex-col flex-1">
          <Button
            variant="subtle"
            color="gray"
            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-xl sm:text-2xl leading-none min-w-0 w-9 h-9 sm:w-8 sm:h-8 p-0 text-rose-deep hover:scale-110 z-10 rounded-full"
            onClick={closeLetter}
            aria-label="Close"
          >
            ×
          </Button>
          <div
            className={`letter-scroll flex-1 min-h-0 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto overflow-x-hidden px-4 pt-9 pb-6 pr-5 sm:px-8 sm:pt-10 sm:pb-8 sm:pr-6 ${letterScrolling ? "is-scrolling" : ""}`}
            onScroll={handleLetterScroll}
          >
          <Text size="lg" fw={600} className="text-center text-rose-deep mb-4">
            To Maya, on your special day 💌
          </Text>
          <Text size="md" lh={1.7} className="text-ink mb-4">
            Dear Maya,
          </Text>
          <Text size="md" lh={1.7} className="text-ink mb-4">
            Happy Birthday to my favorite person in the entire world. Today is
            your dayyy!! Yayyyy 🫶🏻💃🏻
          </Text>
          <Text size="md" lh={1.7} className="text-ink mb-4">
            I might have been so preoccupied with this Valentine’s stuff, but I
            still managed to remember your birthday. 😭😭 I even told him
            yesterday that tomorrow is your birthday. I don’t know how, but it
            randomly crossed my mind yesterday. Maybe it was God’s doing. 🤭
          </Text>
          <Text size="md" lh={1.7} className="text-ink mb-4">
            I only have old photos to post 😭😭 We seriously need to click more
            from now on.
          </Text>
          <Text size="md" lh={1.7} className="text-ink mb-4">
            I don’t think you realize it, but yes, you’re the only friend who
            stayed and whom I truly care about. If you hadn’t been around, I
            would’ve been completely alone. I enjoy your company more than
            anything. I love you more than I can even express — it’s a feeling I
            can’t put into words. You are so, so, so precious and important to
            me.
          </Text>
          <Text size="md" lh={1.7} className="text-ink mb-4">
            At this point, you’re like a sister to me. 😭😭
          </Text>
          <Text size="md" lh={1.7} className="text-ink mb-4">
            Thank you for always being there for me. Thank you for tolerating
            me. Thank youuuu for staying. Thank you for being my friend.
          </Text>
          <Text size="md" lh={1.7} className="text-ink mb-4">
            I’ll never forget how we became friends — the journey we were just
            talking about the day before yesterday. 😆😆
          </Text>
          <Text size="md" lh={1.7} className="text-ink mb-4">
            You’re not just my BESTEST friend. You’re my SAMIKSHYA. Everyone
            should have their own Samikshya in their life. But not MINE — not a
            chance.
          </Text>
          <Text size="md" lh={1.7} className="text-ink mb-4">
            Okayyy so yeahhhhh, I’m so happy you were born. 🫂🫂 I’m so excited
            while typing all this. I can’t wait to celebrate your birthday. I
            love youuuuuuuuuuu, Mayaaaaa. 😽
          </Text>
          <Text size="md" lh={1.7} className="text-ink mt-6 font-semibold">Your Sanu,</Text>
          <Text size="md" className="text-rose-deep">Sichu 💖</Text>
          </div>
        </div>
      </Modal>

      {hearts.map((h) => (
        <div
          key={h.id}
          role="button"
          tabIndex={0}
          className={`fixed text-rose cursor-pointer z-10 transition-transform hover:scale-150 heart-float heart-visible ${h.burst ? "burst" : ""}`}
          style={{
            left: h.left + "vw",
            fontSize: h.size + "px",
            animationDuration: h.duration + "s",
          }}
          onClick={() => handleHeartClick(h.id)}
          onKeyDown={(e) => e.key === "Enter" && handleHeartClick(h.id)}
        >
          💖
        </div>
      ))}
    </div>
  );
}

export default App;
