import { GoogleGenAI, Type } from "@google/genai";
import { SquareValue } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will not be shown to the user but is a good practice for development.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const modelConfig = {
    model: "gemini-2.5-flash",
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                move: {
                    type: Type.INTEGER,
                    description: "The board index (0-8) for the AI's next move.",
                },
            },
            required: ["move"],
        },
        // Disable thinking for faster, more deterministic responses suitable for Tic-Tac-Toe
        thinkingConfig: { thinkingBudget: 0 } 
    }
};

const getSystemInstruction = (board: SquareValue[]) => {
    const availableSpots = board
        .map((val, index) => (val === null ? index : null))
        .filter((val) => val !== null)
        .join(", ");

    return `You are an expert Tic-Tac-Toe AI player. Your designation is 'O'. The user is 'X'.
The game board is represented by a 9-element array. The indices are as follows:
0 | 1 | 2
--|---|--
3 | 4 | 5
--|---|--
6 | 7 | 8

You will be given the current board state.
Your task is to choose the best possible move to win the game or force a draw.
The available empty spots for your move are at indices: [${availableSpots}].
You must choose one of these available spots.
Return your move as a JSON object with a single key "move" indicating the index of your chosen square.`;
};

export const getAiMove = async (board: SquareValue[]): Promise<number> => {
  try {
    const systemInstruction = getSystemInstruction(board);
    const prompt = `Current board state: ${JSON.stringify(board)}. Your turn, 'O'. Make your move.`;

    const response = await ai.models.generateContent({
        ...modelConfig,
        config: {
            ...modelConfig.config,
            systemInstruction: systemInstruction,
        },
        contents: prompt,
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (typeof result.move === 'number' && result.move >= 0 && result.move <= 8) {
      if (board[result.move] === null) {
        return result.move;
      } else {
        console.warn("AI chose an occupied square. Finding an alternative.");
      }
    }
    
    // Fallback if AI fails to provide a valid move
    throw new Error("AI returned an invalid move.");

  } catch (error) {
    console.error("Error getting AI move:", error);
    // Fallback strategy: pick the first available spot
    const availableSpots = board
      .map((val, index) => (val === null ? index : null))
      .filter((val): val is number => val !== null);
    
    return availableSpots.length > 0 ? availableSpots[0] : -1;
  }
};