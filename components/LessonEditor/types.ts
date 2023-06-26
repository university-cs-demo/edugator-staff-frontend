import { Content } from "@tiptap/react";

export interface LessonData {
  title: string | undefined;
  author: string | undefined;
  content: Content | undefined;
}

export type LessonAction =
  | {
      type: "SET_TITLE";
      payload: string;
    }
  | {
      type: "SET_AUTHOR";
      payload: string;
    }
  | {
      type: "SET_CONTENT";
      payload: Content;
    }
  | {
      type: "RESET_LESSON";
    };
