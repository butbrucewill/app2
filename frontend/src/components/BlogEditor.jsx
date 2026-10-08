import { useEditor, EditorContent } from "@tiptap/react";
import { getBlogExtensions } from "./BlogExtension";

import "./BlogEditor.css";

const Btn = ({ active, onClick, disabled, children }) => (
  <button
    type="button"
    className={active ? "active" : ""}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Divider = () => <span className="toolbar-divider" />;

/**
 * Props:
 *  - initialContent: HTML string to load (use a `key` on the component to reload for another post)
 *  - onChange(html): called on every edit with editor.getHTML()
 *  - onPost(html): called when the "Post" button is clicked (publishes). Button hidden if omitted.
 *  - onSaveDraft(html): optional "Save draft" button
 *  - postLabel: text of the post button (default "Post blog")
 *  - busy: disables the buttons while a request is in flight
 */
export const BlogEditor = ({
  initialContent = "",
  onChange,
  onPost,
  onSaveDraft,
  postLabel = "Post blog",
  busy = false,
}) => {
  const editor = useEditor({
    extensions: getBlogExtensions({ editable: true }),
    content: initialContent || "<p>Start writing your blog content...</p>",
    shouldRerenderOnTransaction: true, // keeps toolbar "active" states + image toolbar in sync
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: { attributes: { class: "blog-editor-content" } },
  });

  if (!editor) return null;

  const run = (fn) => () => fn(editor.chain().focus()).run();

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url, alt: "Blog image" }).run();
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const imageAttrs = editor.getAttributes("image");
  const setImage = (attrs) => editor.chain().focus().updateAttributes("image", attrs).run();

  return (
    <div className="blog-editor">
      <div className="blog-editor-toolbar">
        <Btn onClick={run((c) => c.undo())} disabled={!editor.can().undo()}>↶</Btn>
        <Btn onClick={run((c) => c.redo())} disabled={!editor.can().redo()}>↷</Btn>
        <Divider />

        <Btn active={editor.isActive("paragraph")} onClick={run((c) => c.setParagraph())}>P</Btn>
        {[2, 3].map((level) => (
          <Btn
            key={level}
            active={editor.isActive("heading", { level })}
            onClick={run((c) => c.toggleHeading({ level }))}
          >
            H{level}
          </Btn>
        ))}
        <Divider />

        <Btn active={editor.isActive("bold")} onClick={run((c) => c.toggleBold())}><strong>B</strong></Btn>
        <Btn active={editor.isActive("italic")} onClick={run((c) => c.toggleItalic())}><em>I</em></Btn>
        <Btn active={editor.isActive("strike")} onClick={run((c) => c.toggleStrike())}><s>S</s></Btn>
        <Divider />

        <Btn active={editor.isActive("bulletList")} onClick={run((c) => c.toggleBulletList())}>• List</Btn>
        <Btn active={editor.isActive("orderedList")} onClick={run((c) => c.toggleOrderedList())}>1. List</Btn>
        <Btn active={editor.isActive("blockquote")} onClick={run((c) => c.toggleBlockquote())}>Quote</Btn>
        <Divider />

        <Btn active={editor.isActive("link")} onClick={addLink}>🔗</Btn>
        <Btn onClick={addImage}>🖼 Image</Btn>
      </div>

      {editor.isActive("image") && (
        <div className="blog-image-toolbar">
          <span className="blog-image-toolbar-label">Image</span>
          {["left", "center", "right"].map((a) => (
            <Btn
              key={a}
              active={(imageAttrs.alignment || "center") === a}
              onClick={() => setImage({ alignment: a })}
            >
              {a[0].toUpperCase() + a.slice(1)}
            </Btn>
          ))}
          <Divider />
          <label>
            Width
            <select
              value={imageAttrs.width || "100%"}
              onChange={(e) => setImage({ width: e.target.value })}
            >
              {["25%", "50%", "75%", "100%"].map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <EditorContent editor={editor} />

      <div className="blog-editor-footer">
        {!onPost && (
          <span className="blog-editor-footer-hint">
            Post isn't connected: render this editor through BlogAdminPanel, or pass onPost.
          </span>
        )}
        {onSaveDraft && (
          <button
            type="button"
            className="blog-editor-draft-btn"
            disabled={busy}
            onClick={() => onSaveDraft(editor.getHTML())}
          >
            Save draft
          </button>
        )}
        <button
          type="button"
          className="blog-editor-post-btn"
          disabled={busy || !onPost || editor.isEmpty}
          onClick={() => onPost?.(editor.getHTML())}
        >
          {busy ? "Posting…" : postLabel}
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;