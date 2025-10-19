import { useState, useRef, useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RichTextEditor({ value, onChange, placeholder, rows = 4 }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    h1: false,
    h2: false,
    h3: false,
    ul: false,
    ol: false,
  });

  useEffect(() => {
    if (editorRef.current) {
        // If value is empty string, clear the editor
        if (value === "" || value === null || value === undefined) {
          editorRef.current.innerHTML = "";
        } else if (editorRef.current.innerHTML !== value) {
          editorRef.current.innerHTML = value;
        }
      }
  }, [value]);

  const updateActiveFormats = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const formats = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      h1: false,
      h2: false,
      h3: false,
      ul: document.queryCommandState('insertUnorderedList'),
      ol: document.queryCommandState('insertOrderedList'),
    };

    // Check for heading tags
    let node = selection.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeName === 'H1') formats.h1 = true;
      if (node.nodeName === 'H2') formats.h2 = true;
      if (node.nodeName === 'H3') formats.h3 = true;
      node = node.parentNode;
    }

    setActiveFormats(formats);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    updateContent();
    updateActiveFormats();
  };

  const formatHeading = (level) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    // Get the current block
    let node = selection.anchorNode;
    while (node && node !== editorRef.current && node.nodeType !== 1) {
      node = node.parentNode;
    }

    // If already a heading of the same level, convert back to paragraph
    if (node && node.nodeName === `H${level}`) {
      execCommand('formatBlock', 'p');
    } else {
      execCommand('formatBlock', `h${level}`);
    }
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    updateContent();
    updateActiveFormats();
  };

  const handleKeyUp = () => {
    updateActiveFormats();
  };

  const handleMouseUp = () => {
    updateActiveFormats();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const getButtonClass = (isActive) => {
    return isActive ? "bg-primary/20 text-primary" : "";
  };

  const editorStyles = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'inherit',
  };

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <style dangerouslySetInnerHTML={{__html: `
        .rich-text-editor:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
        .rich-text-editor h1 {
          font-size: 1.875rem !important;
          font-weight: 700 !important;
          margin: 1rem 0 0.5rem 0 !important;
          color: #8328FA !important;
          line-height: 1.2 !important;
          display: block !important;
        }
        .rich-text-editor h2 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 0.875rem 0 0.5rem 0 !important;
          color: #8328FA !important;
          line-height: 1.3 !important;
          display: block !important;
        }
        .rich-text-editor h3 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin: 0.75rem 0 0.5rem 0 !important;
          color: #8328FA !important;
          line-height: 1.4 !important;
          display: block !important;
        }
        .rich-text-editor ul {
          margin: 0.5rem 0 !important;
          padding-left: 2.5rem !important;
          list-style-type: disc !important;
          display: block !important;
        }
        .rich-text-editor ol {
          margin: 0.5rem 0 !important;
          padding-left: 2.5rem !important;
          list-style-type: decimal !important;
          display: block !important;
        }
        .rich-text-editor li {
          margin: 0.375rem 0 !important;
          padding-left: 0.25rem !important;
          display: list-item !important;
          list-style-position: outside !important;
        }
        .rich-text-editor p {
          margin: 0.5rem 0 !important;
          display: block !important;
        }
        .rich-text-editor strong, .rich-text-editor b {
          font-weight: 700 !important;
        }
        .rich-text-editor em, .rich-text-editor i {
          font-style: italic !important;
        }
        .rich-text-editor:focus {
          outline: none !important;
        }
      `}} />
      
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        {/* <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${getButtonClass(activeFormats.h1)}`}
          onClick={() => formatHeading(1)}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${getButtonClass(activeFormats.h2)}`}
          onClick={() => formatHeading(2)}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${getButtonClass(activeFormats.h3)}`}
          onClick={() => formatHeading(3)}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button> */}
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${getButtonClass(activeFormats.bold)}`}
          onClick={() => execCommand('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${getButtonClass(activeFormats.italic)}`}
          onClick={() => execCommand('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${getButtonClass(activeFormats.ul)}`}
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${getButtonClass(activeFormats.ol)}`}
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        className="rich-text-editor p-3 min-h-[100px] max-h-[300px] overflow-y-auto focus:outline-none"
        style={{
          minHeight: `${rows * 1.5}rem`,
          ...editorStyles,
        }}
        onInput={handleInput}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}