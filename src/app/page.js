"use client";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

// Initial file structure with HTML file
const initialFiles = {
  "index.html": {
    name: "index.html",
    language: "html",
    value: "",
  },
};

// All possible files including CSS and JavaScript
const allFiles = {
  ...initialFiles,
  "style.css": {
    name: "style.css",
    language: "css",
    value: "",
  },
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: "",
  },
};

export default function Home() {
  const [fileName, setFileName] = useState("index.html");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [files, setFiles] = useState(initialFiles);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Update file content on editor change
  function handleEditorChange(value) {
    const updatedFiles = { ...files };
    updatedFiles[fileName].value = value;
    setFiles(updatedFiles);
  }

  const file = files[fileName];

  // Add event listeners for Run and Close buttons
  useEffect(() => {
    const runBtn = document.getElementById("runCode");
    const clsBtn = document.getElementById("closeWindow");
    runBtn?.addEventListener("click", () => {
      setHtmlCode(files["index.html"].value);
      setCssCode(files["style.css"] ? files["style.css"].value : "");
      setJsCode(files["script.js"] ? files["script.js"].value : "");
      document.getElementById("outputWindow").style.display = "block";
    });

    clsBtn?.addEventListener("click", () => {
      document.getElementById("outputWindow").style.display = "none";
    });
  }, [files]);

  // Get button CSS class based on active file
  const getButtonClass = (name) => {
    return fileName === name
      ? "px-4 py-2 text-sm text-white flex flex-row bg-green-500 rounded-"
      : "px-4 py-2 text-sm text-white flex flex-row bg-gray-900";
  };

  // Change active file
  const handleFileChange = (name) => {
    setFileName(name);
    document.getElementById("outputWindow").style.display = "none";
  };

  // Create new file and show popup
  const createFile = (name) => {
    const updatedFiles = { ...files, [name]: allFiles[name] };
    setFiles(updatedFiles);
    setFileName(name);
    setPopupMessage(`Congrats! Created ${name}`);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 1000);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="bg-gray-900 flex justify-center w-full py-2">
          {Object.keys(files).map((name) => (
            <button
              key={name}
              className={getButtonClass(name)}
              disabled={fileName === name}
              onClick={() => handleFileChange(name)}
            >
              <div
                className={`pr-1 m-1 ${
                  name === "index.html"
                    ? "text-red-600"
                    : name === "style.css"
                    ? "text-blue-500"
                    : "text-yellow-400"
                }`}
              >
                {name === "index.html" ? "🅗" : name === "style.css" ? "🅒" : "🅙"}
              </div>
              {name}
            </button>
          ))}
          {files["style.css"] === undefined && (
            <button
              className="px-4 py-2 text-sm bg-gray-900 text-white flex flex-row"
              onClick={() => createFile("style.css")}
            >
              <div className="pr-1 m-1 text-blue-500">➕</div>
              Create style.css
            </button>
          )}
          {files["script.js"] === undefined && (
            <button
              className="px-4 py-2 text-sm bg-gray-900 text-white flex flex-row"
              onClick={() => createFile("script.js")}
            >
              <div className="pr-1 m-1 text-yellow-400">➕</div>
              Create script.js
            </button>
          )}
          <button
            className="px-4 py-2 text-sm bg-gray-900 text-white flex flex-row"
            id="runCode"
          >
            <div className="pr-1 m-1 text-green-500">▶️</div>
            Run
          </button>
        </div>
        <Editor
          height="100vh"
          theme="vs-dark"
          saveViewState={true}
          path={file.name}
          defaultLanguage={file.language}
          defaultValue={file.value}
          onChange={handleEditorChange}
          value={file.value}
        />
      </div>
      <div
        className="absolute z-10 top-[30vh] left-[25vw] hidden bg-white shadow-lg"
        id="outputWindow"
      >
        <div className="bg-gray-100 shadow-md flex justify-between">
          <h1 className="text-black mx-6 my-auto">output section</h1>
          <button
            className="px-4 py-2 text-lg font-bold bg-gray-100 text-red-600 shadow-md"
            id="closeWindow"
          >
            <div className="pr-1 m-1">❌</div>
          </button>
        </div>
        <iframe
          title="output"
          srcDoc={`
  <html>
    <body>${htmlCode}</body>
    <style>${cssCode}</style>
    <script>${jsCode}</script>
  </html>
`}
          className="w-[50vw] h-[45vh] bg-white"
        />
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h1 className="text-black text-lg">{popupMessage}</h1>
          </div>
        </div>
      )}
    </>
  );
}
