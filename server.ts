import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Helper to safely initialize Gemini
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", school: "Vispa Academy Kenya", grades: "Grade 1 to Grade 10" });
});

// API 1: Generate CBC Report Card Remarks
app.post("/api/gemini/cbc-remarks", async (req, res) => {
  try {
    const { studentName, grade, stream, performanceData, teacherNotes } = req.body;
    
    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response if key is missing
      return res.json({
        remarks: `${studentName} has demonstrated commendable dedication in Grade ${grade} (${stream}). Performance across core strands indicates steady conceptual grasp. Continued practice in application tasks is recommended for next term.`,
        formativeGuidance: "Focus on guided revision in science activities and independent reading in Kiswahili and English."
      });
    }

    const prompt = `You are a Senior Head Teacher / Class Teacher at Vispa Academy, a reputable Kenyan mixed school offering Grade 1 to 10 under the Competency-Based Curriculum (CBC).
Write an insightful, professional, and encouraging report card remark for student "${studentName}" in Grade ${grade} (${stream}).

Performance Summary:
${JSON.stringify(performanceData, null, 2)}
Teacher Notes: ${teacherNotes || "Good discipline, active in school co-curricular activities."}

Requirements:
- Align with Kenyan CBC terminology (Strands, Sub-strands, Exceeding Expectations (EE), Meeting Expectations (ME), Approaching Expectations (AE), Below Expectations (BE)).
- Provide:
1. Overall Teacher Remarks (approx 60-90 words, professional, uplifting, actionable)
2. Formative Guidance / Areas for Improvement (1-2 sentences)

Return valid JSON with keys: "remarks" and "formativeGuidance".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error("Error generating CBC remarks:", err);
    res.status(500).json({
      remarks: "The student exhibits good effort and active class participation. Consistent practice is encouraged to boost mastery across all CBC learning areas.",
      formativeGuidance: "Encourage daily home reading and supervised exercise completion."
    });
  }
});

// API 2: Antigravity Student AI Tutor (Grade 1 - Grade 10)
app.post("/api/gemini/tutor", async (req, res) => {
  try {
    const { grade, subject, question, studentLevel } = req.body;
    
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        answer: `Here is an explanation for **Grade ${grade} ${subject}**:\n\n**Key Concept:** ${question}\n\n1. **Core Idea:** In the Kenyan CBC syllabus for Grade ${grade}, this concept focuses on real-world observation and practical application.\n2. **Example:** Think of how we observe plants, numbers, or language in our daily lives in Kenya.\n3. **Quick Practice:** Try answering: Why is this concept important in our everyday community?`,
        practiceQuiz: [
          {
            question: `Which of the following is a key component of Grade ${grade} ${subject}?`,
            options: ["A) Observation and practical application", "B) Memorizing without testing", "C) Ignoring community context", "D) None of the above"],
            correctAnswer: "A",
            explanation: "CBC emphasizes competency, practical observation, and community-based learning."
          }
        ]
      });
    }

    const prompt = `You are the Vispa Antigravity AI Academic Tutor for Vispa Mixed School in Kenya.
You are helping a student in Grade ${grade} studying ${subject}.

Student Query / Topic: "${question}"
Target Level: Grade ${grade} (Kenya CBC Syllabus, Grade 1 to 10).

Explain the concept clearly using friendly, age-appropriate Kenyan context (examples with local items, environment, Kiswahili/English cultural context where appropriate).

Format your response as valid JSON with two fields:
1. "answer": A clear markdown formatted explanation (with bold key terms, step-by-step bullet points, and real-life Kenya examples).
2. "practiceQuiz": Array of 2 multiple-choice questions testing this topic. Each object has:
   - "question": string
   - "options": array of 4 option strings (A, B, C, D)
   - "correctAnswer": string ("A", "B", "C", or "D")
   - "explanation": string explaining why it is correct.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error("Error in AI Tutor:", err);
    res.status(500).json({
      answer: "We encountered an issue fetching the full explanation. Please review your subject notes or try rephrasing your question.",
      practiceQuiz: []
    });
  }
});

// API 3: AI CBC Lesson Plan Generator for Teachers
app.post("/api/gemini/lesson-plan", async (req, res) => {
  try {
    const { grade, subject, strand, subStrand, durationMinutes } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        lessonPlan: {
          title: `Grade ${grade} ${subject} - ${strand}`,
          subStrand: subStrand || "General Overview",
          duration: `${durationMinutes || 40} Minutes`,
          learningOutcomes: [
            `By the end of the lesson, the learner should be able to identify key features of ${subStrand || strand}.`,
            `Demonstrate teamwork through group tasks and real-life activities.`,
            `Appreciate the value of ${subject} in daily Kenyan living.`
          ],
          keyInquiryQuestions: [`How does ${strand} impact our daily community activities in Kenya?`],
          learningResources: ["CBC Textbook", "Local realia & charts", "Digital devices / Projector"],
          lessonSteps: [
            { phase: "Introduction (5 mins)", description: "Brainstorming and recall of previous lesson through a quick Q&A." },
            { phase: "Lesson Development (25 mins)", description: "Guided inquiry, group activity examining specimens or solving sample problems." },
            { phase: "Conclusion & Reflection (10 mins)", description: "Learners present their findings. Teacher summarizes key takeaways and gives a fun homework task." }
          ],
          assessmentMethods: ["Observation schedule", "Oral questions", "Written exercise in exercise books"]
        }
      });
    }

    const prompt = `You are an expert Curriculum Developer at KICD / Vispa Academy Kenya.
Create a structured Kenyan CBC Lesson Plan for:
- Grade: Grade ${grade}
- Subject/Learning Area: ${subject}
- Strand: ${strand}
- Sub-strand: ${subStrand || "General Concept"}
- Duration: ${durationMinutes || 40} minutes

Return valid JSON with structure:
{
  "lessonPlan": {
    "title": string,
    "subStrand": string,
    "duration": string,
    "learningOutcomes": string[],
    "keyInquiryQuestions": string[],
    "learningResources": string[],
    "lessonSteps": [
      { "phase": string, "description": string }
    ],
    "assessmentMethods": string[]
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (err: any) {
    console.error("Error generating lesson plan:", err);
    res.status(500).json({ error: "Failed to generate lesson plan." });
  }
});

// API 4: School FAQ / Vispa Info Assistant
app.post("/api/gemini/school-faq", async (req, res) => {
  try {
    const { userQuery } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        answer: "Welcome to Vispa Academy! We are a mixed day and boarding school offering Grade 1 through Grade 10 CBC curriculum in Kenya. For fee breakdowns, term dates, or admission forms, please navigate to the Fee Management or Student Directory modules."
      });
    }

    const prompt = `You are the official automated Assistant for Vispa Academy, a premier mixed primary and junior/senior secondary school in Kenya with classes from Grade 1 to Grade 10.
School Details:
- Motto: Virtue, Knowledge & Excellence
- Offerings: Lower Primary (G1-3), Upper Primary (G4-6), Junior Secondary (JSS G7-9), Senior Secondary (G10)
- Options: Day Scholars and Boarding Scholars
- Key Values: Discipline, CBC Practical Skills, Co-curriculars (Scouts, Music, Athletics, Coding/Robotics)
- Fees: KSh 22,000 to KSh 45,000 per term depending on grade & boarding status. M-Pesa Paybill: 400200, Account: Student NEMIS Number.

User Question: "${userQuery}"

Provide a warm, courteous, accurate response suited for parents, students, or visitors. Format with clean markdown lines.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt
    });

    return res.json({ answer: response.text });
  } catch (err) {
    res.json({ answer: "Vispa Academy welcomes all enquiries! Please feel free to contact the administration office or check our portal sections." });
  }
});

// Vite Dev Server Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vispa Academy Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
