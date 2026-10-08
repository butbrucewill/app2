import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import BlogImage from "./BlogImages";
 
// One extension list used by BOTH the admin editor and the public reader,
// so what the admin sees while writing is exactly what visitors see.
export const getBlogExtensions = ({ editable = true } = {}) => [
  StarterKit,
  Link.configure({
    openOnClick: !editable,
    autolink: editable,
    linkOnPaste: editable,
    HTMLAttributes: { target: "_blank", rel: "noopener noreferrer nofollow" },
  }),
  BlogImage.configure({
    inline: false,
    allowBase64: true,
    resize: editable
      ? {
          enabled: true,
          directions: ["left", "right"],
          minWidth: 100,
          minHeight: 50,
          alwaysPreserveAspectRatio: true,
        }
      : { enabled: false },
  }),
];
 