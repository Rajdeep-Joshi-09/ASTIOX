import { useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  List,
  Link,
  BlockQuote,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  Alignment,
  Indent,
  HorizontalLine,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorConfig = useMemo(
    () => ({
      licenseKey: "GPL",
      placeholder: placeholder || "Write product description...",
      plugins: [
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Heading,
        List,
        Link,
        BlockQuote,
        Table,
        TableToolbar,
        TableProperties,
        TableCellProperties,
        Alignment,
        Indent,
        HorizontalLine,
      ],
      toolbar: {
        items: [
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "alignment",
          "outdent",
          "indent",
          "|",
          "link",
          "blockQuote",
          "insertTable",
          "horizontalLine",
          "|",
          "undo",
          "redo",
        ],
        shouldNotGroupWhenFull: false,
      },
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
        ],
      },
      heading: {
        options: [
          { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
          { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
          { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
          { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
        ],
      },
    }),
    [placeholder]
  );

  return (
    <div className="ckeditor-wrapper rounded-lg border border-input overflow-hidden bg-background [&_.ck-editor__editable]:min-h-[280px] [&_.ck-editor__editable]:max-h-[500px] [&_.ck-editor__editable]:overflow-y-auto">
      <CKEditor
        editor={ClassicEditor}
        config={editorConfig}
        data={value || ""}
        onChange={(_event, editor) => onChange(editor.getData())}
      />
    </div>
  );
};

export default RichTextEditor;
