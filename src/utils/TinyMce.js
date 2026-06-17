import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import fileService from "../services/file";

export default function App({ value = "", onChange }) {
  const editorRef = useRef(null);

  // Sync external value safely
  useEffect(() => {
    if (
      editorRef.current &&
      value !== editorRef.current.getContent()
    ) {
      const cursorBookmark = editorRef.current.selection.getBookmark(2, true);

      editorRef.current.setContent(value || "");

      editorRef.current.selection.moveToBookmark(cursorBookmark);
    }
  }, [value]);

  return (
    <Editor
      tinymceScriptSrc="/tinymce.min.js"
      value={value}
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      init={{
        height: 300,
        menubar: "file edit view insert format tools table help",

        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "preview",
          "help",
          "wordcount",
          "toc",
          "autosave",
          "save",
          "directionality",
          "visualchars",
          "template",
          "codesample",
          "hr",
          "pagebreak",
          "nonbreaking",
          "quickbars",
          "emoticons",
        ],

        toolbar:
          "undo redo | toc | " +
          "bold italic underline strikethrough | " +
          "fontselect fontsizeselect formatselect | " +
          "alignleft aligncenter alignright alignjustify | " +
          "outdent indent | numlist bullist | " +
          "forecolor backcolor removeformat | " +
          "charmap emoticons | fullscreen preview save print | " +
          "image media link codesample",

        content_style: `
          @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Spartan&display=swap');

          body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 14px;
          }

          .mymention {
            color: gray;
          }
        `,

        font_formats:
          "Montserrat=Montserrat;" +
          "Spartan=Spartan;" +
          "Arial=arial,helvetica,sans-serif;" +
          "Helvetica=helvetica;" +
          "Times New Roman=times new roman,times;" +
          "Verdana=verdana,geneva;",

        autosave_ask_before_unload: true,
        autosave_interval: "30s",
        autosave_retention: "2m",

        image_advtab: true,
        image_caption: true,

        quickbars_selection_toolbar:
          "bold italic | quicklink h2 h3 blockquote quickimage quicktable",

        toolbar_mode: "sliding",

        contextmenu: "link image table",

        directionality: "ltr",

        file_picker_callback: function (cb) {
          const input = document.createElement("input");

          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");

          input.onchange = async function () {
            const file = this.files[0];

            const fmData = new FormData();
            fmData.append("file", file);

            try {
              const res = await fileService.save(fmData);

              cb(res.data.url, {
                title: res.data.name,
              });
            } catch (err) {
              console.log(err);
            }
          };

          input.click();
        },
      }}
      onEditorChange={(content) => {
        onChange?.(content);
      }}
    />
  );
}


// import React, { useRef, useEffect } from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import fileService from "../services/file";

// export default function App({ value = "", onChange }) {
//   const editorRef = useRef(null);

//   // Update editor content when value prop changes externally
//   useEffect(() => {
//     if (editorRef.current && value !== editorRef.current.getContent()) {
//       editorRef.current.setContent(value);
//     }
//   }, [value]);

//   return (
//     <Editor
//       tinymceScriptSrc={"/tinymce.min.js"}
//       onInit={(evt, editor) => {
//         editorRef.current = editor;
//         // Set initial content
//         editor.setContent(value);
//       }}
//       init={{
//         height: 300,
//         menubar: false,
//         plugins: [
//           "advlist", "autolink", "lists", "link", "image", "charmap", 
//           "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
//           "insertdatetime", "media", "table", "preview", "help", "wordcount"
//         ],
//         toolbar: "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
//         content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
//         image_advtab: true,
//         image_caption: true,
//         directionality: "ltr",
//         file_picker_callback: function (cb, value, meta) {
//           const input = document.createElement("input");
//           input.setAttribute("type", "file");
//           input.setAttribute("accept", "image/*");
//           input.onchange = function () {
//             const file = this.files[0];
//             const fmData = new FormData();
//             fmData.append("file", file);
//             try {
//               fileService.save(fmData).then((res) => {
//                 cb(res.data.url, { title: res.data.name });
//               });
//             } catch (err) {}
//           };
//           input.click();
//         },
//       }}
//       onEditorChange={(content) => {
//         onChange?.(content);
//       }}
//     />
//   );
// }