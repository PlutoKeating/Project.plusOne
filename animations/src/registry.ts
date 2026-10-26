import type { SceneDef } from "./kit";
import { scene as s0 } from "./scenes/app-prompt-five-parts";
import { scene as s1 } from "./scenes/app-stack-layers";
import { scene as s2 } from "./scenes/ch00-growth-path";
import { scene as s3 } from "./scenes/ch01-chat-loop";
import { scene as s4 } from "./scenes/ch01-try-except";
import { scene as s5 } from "./scenes/ch02-api-roundtrip";
import { scene as s6 } from "./scenes/ch02-attention-links";
import { scene as s7 } from "./scenes/ch02-multiturn-messages";
import { scene as s8 } from "./scenes/ch02-qkv-steps";
import { scene as s9 } from "./scenes/ch03-embedding-map";
import { scene as s10 } from "./scenes/ch03-rag-indexing";
import { scene as s11 } from "./scenes/ch03-rag-query";
import { scene as s12 } from "./scenes/ch04-function-calling";
import { scene as s13 } from "./scenes/ch04-max-steps";
import { scene as s14 } from "./scenes/ch04-react-loop";
import { scene as s15 } from "./scenes/ch05-context-window";
import { scene as s16 } from "./scenes/ch05-mcp-flow";
import { scene as s17 } from "./scenes/ch05-memory-recall";
import { scene as s18 } from "./scenes/ch06-orchestrator-dispatch";
import { scene as s19 } from "./scenes/ch06-serial-vs-parallel";
import { scene as s20 } from "./scenes/ch07-kb-qa-flow";

export const scenes: Record<string, SceneDef> = {
  "app-prompt-five-parts": s0,
  "app-stack-layers": s1,
  "ch00-growth-path": s2,
  "ch01-chat-loop": s3,
  "ch01-try-except": s4,
  "ch02-api-roundtrip": s5,
  "ch02-attention-links": s6,
  "ch02-multiturn-messages": s7,
  "ch02-qkv-steps": s8,
  "ch03-embedding-map": s9,
  "ch03-rag-indexing": s10,
  "ch03-rag-query": s11,
  "ch04-function-calling": s12,
  "ch04-max-steps": s13,
  "ch04-react-loop": s14,
  "ch05-context-window": s15,
  "ch05-mcp-flow": s16,
  "ch05-memory-recall": s17,
  "ch06-orchestrator-dispatch": s18,
  "ch06-serial-vs-parallel": s19,
  "ch07-kb-qa-flow": s20,
};
