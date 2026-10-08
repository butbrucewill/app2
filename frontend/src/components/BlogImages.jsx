import Image from "@tiptap/extension-image";

const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      alignment: {
        default: "center",

        parseHTML: (element) =>
          element.getAttribute("data-alignment") || "center",

        renderHTML: (attributes) => ({
          "data-alignment": attributes.alignment || "center",
        }),
      },

      width: {
        default: "100%",

        parseHTML: (element) =>
          element.getAttribute("data-width") || "100%",

        renderHTML: (attributes) => ({
          "data-width": attributes.width || "100%",
        }),
      },

      alt: {
        default: "",

        parseHTML: (element) =>
          element.getAttribute("alt") || "",

        renderHTML: (attributes) => ({
          alt: attributes.alt || "",
        }),
      },
    };
  },
});

export default BlogImage;