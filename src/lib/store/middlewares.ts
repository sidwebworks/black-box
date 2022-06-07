import { loader, Monaco } from "@monaco-editor/react";
import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { isFile } from "@typings/guards";
import { getLanguage } from "..";
import { LOAD_INITIAL_FILES } from "./thunks";

export const editorMiddleware: Middleware = (store) => (next) => {
  let monaco: Monaco | null = null;
  let done = false;

  return async (action: PayloadAction) => {
    if (LOAD_INITIAL_FILES.fulfilled.match(action) && !done) {
      done = true;

      monaco = await loader.init();

      const files = store.getState().editor.dir.children;

      for (let file of files) {
        if (!isFile(file)) return;

        monaco.editor.createModel(
          file.content,
          getLanguage(file.name),
          monaco.Uri.parse(file.path)
        );
      }
    }

    next(action);
  };
};