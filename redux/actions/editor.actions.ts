import { createAction } from "@reduxjs/toolkit";
import { Uri } from "monaco-editor";
import { ConsoleLog, EditorLanguages, Files } from "../../utils/typings/types";

export const UPDATE_CODE =
	createAction<{ type: EditorLanguages; code: string }>("EDITOR.UPDATE_CODE");

export const SWITCH_FILE =
	createAction<{ name: Files; lang: EditorLanguages }>("EDITOR.SWITCH_FILE");

export const PRINT_CONSOLE = createAction<ConsoleLog>("EDITOR.PRINT_CONSOLE");

export const CLEAR_LOGS = createAction("EDITOR.CLEAR_LOGS");

export const CREATE_URI =
	createAction<{ filename: string; uri: Uri }>("EDITOR.CREATE_URI");
