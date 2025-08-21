// src/pages/CanvasEditor.jsx (enhanced)
import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../pages/styles/CanvasEditor.css";
import axios from "axios";

/**
 * NEW FEATURES ADDED
 * - Freehand drawing (mode = 'draw') using SVG polyline paths
 * - Multiple selection (drag a selection rectangle + shift-click)
 * - Zoom in/out with transform scale (and Rnd scale prop)
 * - Element locking (locked property disables drag/resize)
 * - Infinite/scrollable canvas wrapper
 * - Copy/Paste using Clipboard API (JSON payload) + keyboard shortcuts
 * - Rich keyboard shortcuts (see useEffect at bottom)
 */

const FONT_FAMILIES = [
  "Arial",
  "Poppins",
  "Inter",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Fira Code",
  "Montserrat",
  "Roboto",
  "Merriweather",
];

// Make the internal stage larger; wrapper is scrollable (infinite feel)
const INITIAL_CANVAS = { width: 3000, height: 2000, bg: "#ffffff" };

export default function CanvasEditor({ userId }) {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [multiSelectedIds, setMultiSelectedIds] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [snap, setSnap] = useState(true);
  const [gridSize, setGridSize] = useState(10);

  const [mode, setMode] = useState("select"); // 'select' | 'draw'
  const [zoom, setZoom] = useState(1); // 0.25 - 4

  const [imgPrompt, setImgPrompt] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  // Selection rectangle state
  const [selRect, setSelRect] = useState({
    active: false,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  // Drawing state
  const drawingRef = useRef({ isDrawing: false, elId: null });

  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  const selectedEl = useMemo(
    () => elements.find((e) => e.id === selectedId),
    [elements, selectedId]
  );

  // ---------- Helpers ----------
  const pushHistory = (next) => {
    setHistory((h) => [...h, elements]);
    setElements(next);
    setRedoStack([]);
  };

  const addElement = (el) => pushHistory([...elements, el]);

  const updateElementById = (id, patch) => {
    pushHistory(
      elements.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  };

  const updateSelected = (patch) => {
    if (!selectedId) return;
    updateElementById(selectedId, patch);
  };

  const updateMultiSelected = (patch) => {
    if (!multiSelectedIds.length) return;
    const patched = elements.map((e) =>
      multiSelectedIds.includes(e.id) ? { ...e, ...patch } : e
    );
    pushHistory(patched);
  };

  const removeSelected = () => {
    const targets = multiSelectedIds.length ? multiSelectedIds : selectedId ? [selectedId] : [];
    if (!targets.length) return;
    pushHistory(elements.filter((e) => !targets.includes(e.id)));
    setSelectedId(null);
    setMultiSelectedIds([]);
  };

  // Example: change color of all selected
updateMultiSelected({ fill: "red" });

  const duplicateSelected = () => {
    const targets = multiSelectedIds.length ? multiSelectedIds : selectedId ? [selectedId] : [];
    if (!targets.length) return;
    const clones = elements
      .filter((e) => targets.includes(e.id))
      .map((e) => ({ ...e, id: Date.now() + Math.random(), x: e.x + 20, y: e.y + 20 }));
    pushHistory([...elements, ...clones]);
    if (clones.length === 1) setSelectedId(clones[0].id);
    setMultiSelectedIds(clones.map((c) => c.id));
  };

  const bringForward = () => {
    const targets = new Set(multiSelectedIds.length ? multiSelectedIds : selectedId ? [selectedId] : []);
    if (!targets.size) return;
    const arr = [...elements];
    for (let i = arr.length - 2; i >= 0; i--) {
      if (targets.has(arr[i].id) && !targets.has(arr[i + 1].id)) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
    pushHistory(arr);
  };

  const sendBackward = () => {
    const targets = new Set(multiSelectedIds.length ? multiSelectedIds : selectedId ? [selectedId] : []);
    if (!targets.size) return;
    const arr = [...elements];
    for (let i = 1; i < arr.length; i++) {
      if (targets.has(arr[i].id) && !targets.has(arr[i - 1].id)) {
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      }
    }
    pushHistory(arr);
  };

  const toggleLockSelected = () => {
    const targets = multiSelectedIds.length ? multiSelectedIds : selectedId ? [selectedId] : [];
    if (!targets.length) return;
    const arr = elements.map((e) =>
      targets.includes(e.id) ? { ...e, locked: !e.locked } : e
    );
    pushHistory(arr);
  };

  // ---------- Element Creators ----------
  const addText = () => {
    addElement({
      id: Date.now(),
      type: "text",
      content: "Double-click to edit ✍️",
      x: 60,
      y: 60,
      width: 220,
      height: 70,
      fontSize: 20,
      color: "#111827",
      fontFamily: "Poppins",
      fontWeight: "400",
      fontStyle: "normal",
      textAlign: "left",
      rotation: 0,
      opacity: 1,
      locked: false,
    });
  };

  const addRect = () =>
    addElement({
      id: Date.now(),
      type: "rect",
      x: 120,
      y: 120,
      width: 160,
      height: 100,
      fill: "#4f46e5",
      stroke: "#1f2937",
      strokeWidth: 2,
      rotation: 0,
      opacity: 1,
      locked: false,
    });

  const addCircle = () =>
    addElement({
      id: Date.now(),
      type: "circle",
      x: 200,
      y: 200,
      width: 120,
      height: 120,
      fill: "#16a34a",
      stroke: "#064e3b",
      strokeWidth: 2,
      rotation: 0,
      opacity: 1,
      locked: false,
    });

  const addTriangle = () =>
    addElement({
      id: Date.now(),
      type: "triangle",
      x: 260,
      y: 160,
      width: 140,
      height: 140,
      fill: "#f59e0b",
      stroke: "#92400e",
      strokeWidth: 2,
      rotation: 0,
      opacity: 1,
      locked: false,
    });

  const addStar = () =>
    addElement({
      id: Date.now(),
      type: "star",
      x: 320,
      y: 100,
      width: 160,
      height: 160,
      fill: "#ec4899",
      stroke: "#831843",
      strokeWidth: 2,
      rotation: 0,
      opacity: 1,
      locked: false,
    });

  const addLine = () =>
    addElement({
      id: Date.now(),
      type: "line",
      x: 100,
      y: 350,
      width: 220,
      height: 6,
      stroke: "#111827",
      strokeWidth: 4,
      rotation: 0,
      opacity: 1,
      locked: false,
    });

  const addArrow = () =>
    addElement({
      id: Date.now(),
      type: "arrow",
      x: 140,
      y: 420,
      width: 260,
      height: 40,
      stroke: "#111827",
      strokeWidth: 4,
      rotation: 0,
      opacity: 1,
      locked: false,
    });

  const uploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      addElement({
        id: Date.now(),
        type: "image",
        src: reader.result,
        x: 150,
        y: 150,
        width: 260,
        height: 260,
        rotation: 0,
        opacity: 1,
        locked: false,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const generateImage = async () => {
    if (!imgPrompt.trim()) return;
    try {
      setImgLoading(true);
      const res = await axios.post("http://localhost:5001/api/ai/image", {
        prompt: imgPrompt,
        size: "512x512",
      });

      let src = "";
      if (res.data?.url) src = res.data.url;
      else if (res.data?.b64) src = `data:image/png;base64,${res.data.b64}`;
      else if (res.data?.image) src = res.data.image;

      if (!src) throw new Error("No image returned from API");

      addElement({
        id: Date.now(),
        type: "image",
        src,
        x: 180,
        y: 180,
        width: 300,
        height: 300,
        rotation: 0,
        opacity: 1,
        locked: false,
      });
      setImgPrompt("");
    } catch (err) {
      console.error("Image generation failed:", err);
      alert("⚠️ Image generation failed. Check your API or prompt.");
    } finally {
      setImgLoading(false);
    }
  };

  // ---------- Undo/Redo ----------
  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack((r) => [elements, ...r]);
    setElements(prev);
    setHistory((h) => h.slice(0, -1));
    if (selectedId && !prev.find((e) => e.id === selectedId)) {
      setSelectedId(null);
    }
    setMultiSelectedIds((ids) => ids.filter((id) => prev.find((e) => e.id === id)));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const [next, ...rest] = redoStack;
    setHistory((h) => [...h, elements]);
    setElements(next);
    setRedoStack(rest);
  };

  // ---------- Export ----------
  const exportPNG = () => {
    html2canvas(canvasRef.current, { scale: 2, backgroundColor: null }).then(
      (canvas) => {
        const link = document.createElement("a");
        link.download = "canvas.png";
        link.href = canvas.toDataURL();
        link.click();
      }
    );
  };

  const exportPDF = () => {
    html2canvas(canvasRef.current, { scale: 2, backgroundColor: "#ffffff" }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("canvas.pdf");
      }
    );
  };

  // ---------- Geometry helpers ----------
  const pointFromEvent = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left + canvasRef.current.scrollLeft) / zoom;
    const y = (e.clientY - rect.top + canvasRef.current.scrollTop) / zoom;
    return { x, y };
  };

  const rectFromPoints = (a, b) => {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    const w = Math.abs(a.x - b.x);
    const h = Math.abs(a.y - b.y);
    return { x, y, w, h };
  };

  const isInside = (el, rect) => {
    const ex = el.x;
    const ey = el.y;
    const ew = el.width || 0;
    const eh = el.height || 0;
    return ex >= rect.x && ey >= rect.y && ex + ew <= rect.x + rect.w && ey + eh <= rect.y + rect.h;
  };

  // ---------- Renders ----------
  const renderShape = (el) => {
    const common = {
      width: "100%",
      height: "100%",
      opacity: el.opacity ?? 1,
      pointerEvents: el.locked ? "none" : "auto",
    };

    if (el.type === "rect") {
      return (
        <div
          style={{
            ...common,
            background: el.fill,
            border: `${el.strokeWidth || 0}px solid ${el.stroke || "transparent"}`,
          }}
        />
      );
    }

    if (el.type === "circle") {
      return (
        <div
          style={{
            ...common,
            background: el.fill,
            borderRadius: "50%",
            border: `${el.strokeWidth || 0}px solid ${el.stroke || "transparent"}`,
          }}
        />
      );
    }

    if (el.type === "triangle") {
      return (
        <svg style={common} viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            points="50,0 100,100 0,100"
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
          />
        </svg>
      );
    }

    if (el.type === "star") {
      const points =
        "50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35";
      return (
        <svg style={common} viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            points={points}
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
          />
        </svg>
      );
    }

    if (el.type === "line") {
      return (
        <svg style={common} viewBox="0 0 100 100" preserveAspectRatio="none">
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            strokeLinecap="round"
          />
        </svg>
      );
    }

    if (el.type === "arrow") {
      return (
        <svg style={common} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker
              id={`arrow-${el.id}`}
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill={el.stroke} />
            </marker>
          </defs>
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            strokeLinecap="round"
            markerEnd={`url(#arrow-${el.id})`}
          />
        </svg>
      );
    }

    if (el.type === "image") {
      return (
        <img
          src={el.src}
          alt="user"
          style={{ ...common, objectFit: "cover", borderRadius: 8 }}
        />
      );
    }

    if (el.type === "text") {
      return (
        <textarea
          className="canvas-text"
          style={{
            ...common,
            width: "100%",
            height: "100%",
            resize: "none",
            border: "1px dashed rgba(0,0,0,0.1)",
            outline: "none",
            background: "transparent",
            color: el.color,
            fontSize: el.fontSize,
            fontFamily: el.fontFamily,
            fontWeight: el.fontWeight,
            fontStyle: el.fontStyle,
            textAlign: el.textAlign,
          }}
          defaultValue={el.content}
          onBlur={(e) => {
            updateSelected({ content: e.target.value });
          }}
          disabled={el.locked}
        />
      );
    }

    if (el.type === "path") {
      // Freehand drawing stored as normalized polyline points [ {x,y}, ... ]
      return (
        <svg style={common} viewBox={`0 0 ${el.width} ${el.height}`}>
          <polyline
            fill="none"
            stroke={el.stroke || "#111827"}
            strokeWidth={el.strokeWidth || 3}
            points={el.points
              .map((p) => `${p.x - el.x},${p.y - el.y}`)
              .join(" ")}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    return null;
  };

  const handleDragStop = (el, d) => {
    if (el.locked) return;
    el.x = snap ? Math.round(d.x / gridSize) * gridSize : d.x;
    el.y = snap ? Math.round(d.y / gridSize) * gridSize : d.y;
  };

  const handleResizeStop = (el, ref, pos) => {
    if (el.locked) return;
    el.width = ref.offsetWidth;
    el.height = ref.offsetHeight;
    el.x = snap ? Math.round(pos.x / gridSize) * gridSize : pos.x;
    el.y = snap ? Math.round(pos.y / gridSize) * gridSize : pos.y;
  };

  const handleRotate = (e) => {
    if (!selectedEl) return;
    const val = Number(e.target.value) || 0;
    updateSelected({ rotation: val });
  };

  const handleOpacity = (e) => {
    const targets = multiSelectedIds.length ? multiSelectedIds : selectedId ? [selectedId] : [];
    const val = Number(e.target.value);
    if (!targets.length) return;
    const arr = elements.map((el) =>
      targets.includes(el.id) ? { ...el, opacity: Math.min(1, Math.max(0, val)) } : el
    );
    pushHistory(arr);
  };

  // ---------- Copy / Paste ----------
  const copySelectionToClipboard = async (cut = false) => {
    const targets = multiSelectedIds.length ? multiSelectedIds : selectedId ? [selectedId] : [];
    if (!targets.length) return;
    const payload = elements.filter((e) => targets.includes(e.id));
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload));
      if (cut) {
        pushHistory(elements.filter((e) => !targets.includes(e.id)));
        setSelectedId(null);
        setMultiSelectedIds([]);
      }
    } catch (e) {
      console.error("Clipboard write failed", e);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const payload = JSON.parse(text);
      if (!Array.isArray(payload)) return;
      const clones = payload.map((e) => ({ ...e, id: Date.now() + Math.random(), x: (e.x || 0) + 20, y: (e.y || 0) + 20 }));
      pushHistory([...elements, ...clones]);
      setSelectedId(clones.length === 1 ? clones[0].id : null);
      setMultiSelectedIds(clones.map((c) => c.id));
    } catch (e) {
      console.error("Clipboard read failed", e);
    }
  };

  // ---------- Canvas Mouse Handlers ----------
  const onCanvasMouseDown = (e) => {
    const isLeft = e.button === 0;
    if (!isLeft) return;

    const start = pointFromEvent(e);

    // Draw mode
    if (mode === "draw") {
      const id = Date.now();
      drawingRef.current = { isDrawing: true, elId: id };
      const newEl = {
        id,
        type: "path",
        points: [start],
        x: start.x,
        y: start.y,
        width: 1,
        height: 1,
        stroke: "#111827",
        strokeWidth: 3,
        rotation: 0,
        opacity: 1,
        locked: false,
      };
      setElements((prev) => [...prev, newEl]);
      return;
    }

    // Selection rectangle (hold Shift or empty area drag)
    setSelectedId(null);
    if (!e.shiftKey) setMultiSelectedIds([]);
    setSelRect({ active: true, x: start.x, y: start.y, w: 0, h: 0 });
  };

  const onCanvasMouseMove = (e) => {
    // Drawing
    if (drawingRef.current.isDrawing) {
      const pt = pointFromEvent(e);
      setElements((prev) => {
        const arr = [...prev];
        const idx = arr.findIndex((x) => x.id === drawingRef.current.elId);
        if (idx === -1) return prev;
        const el = { ...arr[idx] };
        el.points = [...el.points, pt];
        // Update bounds to fit points
        const xs = el.points.map((p) => p.x);
        const ys = el.points.map((p) => p.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        el.x = minX;
        el.y = minY;
        el.width = Math.max(1, maxX - minX);
        el.height = Math.max(1, maxY - minY);
        arr[idx] = el;
        return arr;
      });
      return;
    }

    // Selection rectangle
    if (selRect.active) {
      const current = pointFromEvent(e);
      setSelRect((r) => ({ ...r, ...rectFromPoints({ x: r.x, y: r.y }, current) }));
    }
  };

  const onCanvasMouseUp = (e) => {
    // Finish drawing
    if (drawingRef.current.isDrawing) {
      drawingRef.current.isDrawing = false;
      drawingRef.current.elId = null;
      return;
    }

    // Finish selection rectangle
    if (selRect.active) {
      const rect = selRect;
      setSelRect({ active: false, x: 0, y: 0, w: 0, h: 0 });
      if (rect.w > 2 && rect.h > 2) {
        const ids = elements.filter((el) => isInside(el, rect)).map((el) => el.id);
        setMultiSelectedIds((prev) => Array.from(new Set([...(e.shiftKey ? prev : []), ...ids])));
      }
    }
  };

  // ---------- Keyboard Shortcuts ----------
  const onKeyDown = useCallback(
    (e) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const mod = isMac ? e.metaKey : e.ctrlKey;

      // Global
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (document.activeElement && document.activeElement.tagName === "TEXTAREA") return; // don't interrupt typing
        e.preventDefault();
        removeSelected();
      }
      if (mod && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copySelectionToClipboard(false);
      }
      if (mod && e.key.toLowerCase() === "x") {
        e.preventDefault();
        copySelectionToClipboard(true);
      }
      if (mod && e.key.toLowerCase() === "v") {
        e.preventDefault();
        pasteFromClipboard();
      }
      if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateSelected();
      }
      if (e.key === "+" || (mod && e.key === "=")) {
        e.preventDefault();
        setZoom((z) => Math.min(4, parseFloat((z + 0.1).toFixed(2))));
      }
      if (e.key === "-" || (mod && e.key === "-")) {
        e.preventDefault();
        setZoom((z) => Math.max(0.25, parseFloat((z - 0.1).toFixed(2))));
      }
      if (e.key.toLowerCase() === "l") {
        // toggle lock
        e.preventDefault();
        toggleLockSelected();
      }
      if (e.key === "Escape") {
        setSelectedId(null);
        setMultiSelectedIds([]);
        setMode("select");
      }
    },
    [elements, selectedId, multiSelectedIds, snap, gridSize]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // ---------- UI ----------
  return (
    <div className="editor-container">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-row">
          <button onClick={addText}>➕ Text</button>
          <button onClick={addRect}>⬛ Rect</button>
          <button onClick={addCircle}>⚪ Circle</button>
          <button onClick={addTriangle}>🔺 Triangle</button>
          <button onClick={addStar}>⭐ Star</button>
          <button onClick={addLine}>〰️ Line</button>
          <button onClick={addArrow}>➡️ Arrow</button>

          <label className="upload-btn">
            📷 Upload
            <input type="file" hidden onChange={uploadImage} />
          </label>

          <button onClick={undo}>↩️ Undo</button>
          <button onClick={redo}>↪️ Redo</button>
          <button onClick={duplicateSelected} disabled={!selectedEl && !multiSelectedIds.length}>
            🧬 Duplicate
          </button>
          <button onClick={removeSelected} disabled={!selectedEl && !multiSelectedIds.length}>
            🗑️ Delete
          </button>

          <div className="divider" />

          <button
            className={mode === "select" ? "active" : ""}
            onClick={() => setMode("select")}
            title="V — Select (Esc to reset)"
          >
            🖱️ Select
          </button>
          <button
            className={mode === "draw" ? "active" : ""}
            onClick={() => setMode("draw")}
            title="B — Brush"
          >
            ✍️ Draw
          </button>

          <div className="divider" />

          <button onClick={() => setZoom((z) => Math.max(0.25, parseFloat((z - 0.1).toFixed(2))))}>➖ Zoom</button>
          <span style={{ padding: "0 8px" }}>Zoom: {(zoom * 100).toFixed(0)}%</span>
          <button onClick={() => setZoom((z) => Math.min(4, parseFloat((z + 0.1).toFixed(2))))}>➕ Zoom</button>
          <button onClick={() => setZoom(1)}>🔁 Reset</button>

          <div className="divider" />

          <button onClick={toggleLockSelected} disabled={!selectedEl && !multiSelectedIds.length}>
            🔒/🔓 Lock
          </button>
        </div>

        <div className="toolbar-row">
          <button onClick={exportPNG}>📸 Export PNG</button>
          <button onClick={exportPDF}>📄 Export PDF</button>

          <div className="divider" />

          <label className="toggle">
            <input
              type="checkbox"
              checked={snap}
              onChange={() => setSnap((s) => !s)}
            />
            <span>Snap</span>
          </label>

          <label className="compact">
            Grid:
            <input
              type="number"
              min="2"
              max="100"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value || 10))}
              style={{ width: 64, marginLeft: 6 }}
            />
          </label>

          <div className="divider" />

          {/* Image Generation */}
          <input
            className="prompt-input"
            placeholder="Generate image panels or card......."
            value={imgPrompt}
            onChange={(e) => setImgPrompt(e.target.value)}
          />
          <button onClick={generateImage} disabled={imgLoading || !imgPrompt}>
            {imgLoading ? "Generating…" : "✨ Generate"}
          </button>

          {/* Selection indicator */}
          <div style={{ marginLeft: "auto", opacity: 0.8 }}>
            {multiSelectedIds.length > 1 && <span>🧲 {multiSelectedIds.length} selected</span>}
          </div>
        </div>

        {/* Property Panel for selected element(s) */}
        {(selectedEl || multiSelectedIds.length) && (
          <div className="toolbar-row props">
            <span className="props-title">Selected: {multiSelectedIds.length ? `${multiSelectedIds.length} items` : selectedEl?.type}</span>

            {/* Common */}
            <label className="compact">
              Rotate°
              <input
                type="number"
                value={selectedEl?.rotation || 0}
                onChange={handleRotate}
                style={{ width: 72, marginLeft: 6 }}
                disabled={multiSelectedIds.length > 1}
              />
            </label>

            <label className="compact">
              Opacity
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={
                  multiSelectedIds.length ? 1 : (selectedEl?.opacity ?? 1)
                }
                onChange={handleOpacity}
                style={{ width: 72, marginLeft: 6 }}
              />
            </label>

            {/* Text controls */}
            {selectedEl && selectedEl.type === "text" && multiSelectedIds.length === 0 && (
              <>
                <label className="compact">
                  Font
                  <select
                    value={selectedEl.fontFamily}
                    onChange={(e) =>
                      updateSelected({ fontFamily: e.target.value })
                    }
                    style={{ marginLeft: 6 }}
                  >
                    {FONT_FAMILIES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="compact">
                  Size
                  <input
                    type="number"
                    min="8"
                    max="200"
                    value={selectedEl.fontSize}
                    onChange={(e) =>
                      updateSelected({ fontSize: Number(e.target.value || 16) })
                    }
                    style={{ width: 72, marginLeft: 6 }}
                  />
                </label>

                <label className="compact">
                  Color
                  <input
                    type="color"
                    value={selectedEl.color}
                    onChange={(e) => updateSelected({ color: e.target.value })}
                    style={{ marginLeft: 6 }}
                  />
                </label>

                <button
                  onClick={() =>
                    updateSelected({
                      fontWeight:
                        selectedEl.fontWeight === "700" ? "400" : "700",
                    })
                  }
                >
                  <b>B</b>
                </button>
                <button
                  onClick={() =>
                    updateSelected({
                      fontStyle:
                        selectedEl.fontStyle === "italic" ? "normal" : "italic",
                    })
                  }
                >
                  <i>I</i>
                </button>

                <label className="compact">
                  Align
                  <select
                    value={selectedEl.textAlign}
                    onChange={(e) =>
                      updateSelected({ textAlign: e.target.value })
                    }
                    style={{ marginLeft: 6 }}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                </label>
              </>
            )}

            {/* Shape/image strokes/fills */}
            {selectedEl && ["rect", "circle", "triangle", "star"].includes(selectedEl.type) && multiSelectedIds.length === 0 && (
              <>
                <label className="compact">
                  Fill
                  <input
                    type="color"
                    value={selectedEl.fill}
                    onChange={(e) => updateSelected({ fill: e.target.value })}
                    style={{ marginLeft: 6 }}
                  />
                </label>
                <label className="compact">
                  Stroke
                  <input
                    type="color"
                    value={selectedEl.stroke}
                    onChange={(e) => updateSelected({ stroke: e.target.value })}
                    style={{ marginLeft: 6 }}
                  />
                </label>
                <label className="compact">
                  Stroke px
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={selectedEl.strokeWidth}
                    onChange={(e) =>
                      updateSelected({
                        strokeWidth: Number(e.target.value || 0),
                      })
                    }
                    style={{ width: 64, marginLeft: 6 }}
                  />
                </label>
              </>
            )}

            {selectedEl && ["line", "arrow"].includes(selectedEl.type) && multiSelectedIds.length === 0 && (
              <>
                <label className="compact">
                  Stroke
                  <input
                    type="color"
                    value={selectedEl.stroke}
                    onChange={(e) => updateSelected({ stroke: e.target.value })}
                    style={{ marginLeft: 6 }}
                  />
                </label>
                <label className="compact">
                  Width px
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={selectedEl.strokeWidth}
                    onChange={(e) =>
                      updateSelected({
                        strokeWidth: Number(e.target.value || 1),
                      })
                    }
                    style={{ width: 64, marginLeft: 6 }}
                  />
                </label>
              </>
            )}
          </div>
        )}
      </div>

      {/* Canvas */}
      <div
        className="canvas-wrapper"
        ref={wrapperRef}
        style={{ width: "100%", height: "calc(100vh - 220px)", overflow: "auto" }}
      >
        <div
          className="canvas-area"
          ref={canvasRef}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={onCanvasMouseUp}
          style={{
            position: "relative",
            width: INITIAL_CANVAS.width,
            height: INITIAL_CANVAS.height,
            background: "#ffffff",
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            backgroundImage: snap
              ? `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`
              : "none",
            backgroundSize: snap ? `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px` : "none",
          }}
        >
          {elements.map((el) => (
            <Rnd
              key={el.id}
              size={{ width: el.width, height: el.height }}
              position={{ x: el.x, y: el.y }}
              bounds="parent"
              onDragStop={(e, d) => {
                handleDragStop(el, d);
                setElements([...elements]);
              }}
              onResizeStop={(e, dir, ref, delta, pos) => {
                handleResizeStop(el, ref, pos);
                setElements([...elements]);
              }}
              enableUserSelectHack={false}
              onClick={(e) => {
                e.stopPropagation();
                if (el.locked) return;
                if (e.shiftKey) {
                  setMultiSelectedIds((ids) =>
                    ids.includes(el.id) ? ids.filter((id) => id !== el.id) : [...ids, el.id]
                  );
                } else {
                  setSelectedId(el.id);
                  setMultiSelectedIds([]);
                }
              }}
              disableDragging={!!el.locked}
              enableResizing={!el.locked}
              style={{
                transform: `rotate(${el.rotation || 0}deg)`,
                outline:
                  selectedId === el.id || multiSelectedIds.includes(el.id)
                    ? "2px dashed #6366f1"
                    : el.locked
                    ? "1px solid rgba(0,0,0,0.05)"
                    : "none",
                outlineOffset: "2px",
                borderRadius: el.type === "image" ? 8 : 0,
              }}
              scale={zoom}
            >
              {renderShape(el)}
            </Rnd>
          ))}

          {/* Selection rectangle visual */}
          {selRect.active && (
            <div
              style={{
                position: "absolute",
                left: selRect.x,
                top: selRect.y,
                width: selRect.w,
                height: selRect.h,
                border: "1px dashed #6366f1",
                background: "rgba(99,102,241,0.1)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>

      <div className="footer">
        <small>🎨 Canva-like Editor — User: {userId}</small>
        <div className="layer-controls">
          <button onClick={bringForward} disabled={!selectedEl && !multiSelectedIds.length}>
            ⬆️ Bring Forward
          </button>
          <button onClick={sendBackward} disabled={!selectedEl && !multiSelectedIds.length}>
            ⬇️ Send Backward
          </button>
        </div>
      </div>

      {/* Small helper legend */}
      <div style={{ fontSize: 12, opacity: 0.8, padding: "6px 10px" }}>
        <div><b>Shortcuts:</b> Ctrl/Cmd+Z (Undo), Shift+Ctrl/Cmd+Z or Ctrl/Cmd+Y (Redo), Delete (Remove), Ctrl/Cmd+C/X/V (Copy/Cut/Paste), Ctrl/Cmd+D (Duplicate), +/− (Zoom), L (Lock/Unlock), Esc (Clear selection), Shift+Drag (Marquee select)</div>
      </div>
    </div>
  );
}
