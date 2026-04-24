let recognitionInstance = null;
let recordingStartedAt = null;

function computeAccuracy(transcript, expected) {
  const normalizedTranscript = transcript.toLowerCase().trim();
  const normalizedExpected = expected.toLowerCase().trim();
  if (!normalizedTranscript) return 0;
  if (normalizedTranscript.includes(normalizedExpected)) return 95;
  const words = normalizedTranscript.split(/\s+/);
  const closeMatch = words.some((word) => word.startsWith(normalizedExpected.slice(0, 3)));
  return closeMatch ? 75 : 45;
}

function updateLiveAiStatus(text) {
  const el = document.getElementById("ai-live-status");
  if (el) el.textContent = text;
}

async function startVoiceValidation() {
  const selectedVerb = window.tbVerbPractice?.selectedVerb;
  const selectedTense = window.tbVerbPractice?.selectedTense;
  if (!selectedVerb) {
    alert("Select a verb card first.");
    return;
  }

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  recognitionInstance = new Recognition();
  recognitionInstance.lang = "en-US";
  recognitionInstance.interimResults = true;
  recognitionInstance.continuous = false;
  recordingStartedAt = Date.now();
  let finalTranscript = "";

  updateLiveAiStatus("Listening... speak now.");

  recognitionInstance.onresult = async (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalTranscript += `${transcript} `;
      else interim += transcript;
    }
    updateLiveAiStatus(`Heard: ${(finalTranscript + interim).trim() || "..."}`);
  };

  recognitionInstance.onerror = () => {
    updateLiveAiStatus("Recording failed. Try again.");
  };

  recognitionInstance.onend = async () => {
    const transcript = finalTranscript.trim();
    const expectedSpeech = formatVerbByTense(selectedVerb, selectedTense);
    const durationSeconds = Math.max(1, Math.round((Date.now() - recordingStartedAt) / 1000));
    const pronunciationScore = Math.max(45, Math.min(100, 100 - Math.abs(transcript.length - expectedSpeech.length) * 4));
    const fluencyScore = Math.max(40, Math.min(100, 70 + Math.round(20 / durationSeconds)));
    const accuracyScore = computeAccuracy(transcript, expectedSpeech);
    const overallScore = Math.round((pronunciationScore + fluencyScore + accuracyScore) / 3);
    const passed = overallScore >= 75;

    document.getElementById("ai-score-pronunciation").textContent = `${pronunciationScore}`;
    document.getElementById("ai-score-fluency").textContent = `${fluencyScore}`;
    document.getElementById("ai-score-accuracy").textContent = `${accuracyScore}`;
    document.getElementById("ai-score-overall").textContent = `${overallScore}`;
    updateLiveAiStatus(`Transcript: ${transcript || "No speech captured"}`);

    await saveVoiceAttempt({
      verb: selectedVerb,
      tense: selectedTense,
      transcript,
      pronunciationScore,
      fluencyScore,
      accuracyScore,
      overallScore,
      passed
    });
    await refreshProgressTracking();
  };

  recognitionInstance.start();
}

function stopVoiceValidation() {
  if (recognitionInstance) {
    recognitionInstance.stop();
  }
}

window.startVoiceValidation = startVoiceValidation;
window.stopVoiceValidation = stopVoiceValidation;
