import {
  Extensions,
  // generateHTML,
  // generateJSON,
  mergeAttributes,
  Node as TipTapNode,
} from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ProductNodeView } from "./components/product-view";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { Underline } from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customExtension: {
      addProduct: (data: ProductNodeData) => ReturnType;
    };
  }
}

export type ProductNodeData = {
  id: string;
  name: string;
  src: string;
  amount: number;
  unit: "Thùng" | "Sản Phẩm";
  amountOfCargoBox: number;
};

const ProductNode = TipTapNode.create({
  name: "product",
  group: "block",
  atom: true,
  addAttributes: () => ({
    id: { default: "" },
    name: { default: "" },
    src: { default: "" },
    amount: { default: "0" },
    unit: { default: "Sản Phẩm" },
    amountOfCargoBox: { default: "0" },
  }),
  renderHTML({ HTMLAttributes }) {
    return ["product-node", mergeAttributes(HTMLAttributes)];
  },
  parseHTML() {
    return [
      {
        tag: "product-node",
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ProductNodeView);
  },
  addCommands() {
    return {
      addProduct(data: ProductNodeData) {
        return ({ commands }) => {
          return commands.insertContent({
            type: "product",
            attrs: {
              name: data.name,
              src: data.src,
              amount: data.amount.toString(),
              unit: data.unit,
              id: data.id,
              amountOfCargoBox: data.amountOfCargoBox.toString(),
            },
          });
        };
      },
    };
  },
});

type Levels = 1 | 2 | 3 | 4;

const classes: Record<Levels, string> = {
  1: "scroll-m-20 text-5xl font-extrabold tracking-tight ",
  2: "scroll-m-20 text-4xl font-semibold tracking-tight ",
  3: "scroll-m-20 text-3xl font-semibold tracking-tight",
  4: "scroll-m-20 text-2xl font-semibold tracking-tight",
};

export const extensions: Extensions = [
  StarterKit.configure({
    heading: false,
  }),
  Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
      const hasLevel = this.options.levels.includes(node.attrs.level);
      const level: Levels = hasLevel
        ? node.attrs.level
        : this.options.levels[0];

      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `${classes[level]}`,
        }),
        0,
      ];
    },
  }),
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  ProductNode,
];
