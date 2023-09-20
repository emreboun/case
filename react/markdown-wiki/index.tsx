import React, { useEffect, useState, useRef } from "react";
import { Box, Button, InputBase } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useTranslation } from "react-i18next";
import { TextForm } from "../../form-common/text-form";
import { TabPanel } from "../../common/tab-common";
import { HeaderEdit } from "../../common/header-edit";
import Toolbar from "./markdown-toolbar";
import ModalBox from "../../info-common/modal-box";
import styles from "../../../styles/Markdown.module.css";

interface MarkdownPageProps {
  onSubmitMarkdown: (markdown: string, version: number) => void;
  isEditor: boolean;
  module: {
    markdown: string;
    version: number;
  };
}

const FORMS = [
  [
    { name: "linkText", label: "Link Text" },
    { name: "url", label: "URL", def: "https://" },
  ],
  [
    { name: "imageUrl", label: "Image URL", def: "https://" },
    { name: "alt", label: "Alt Text" },
  ],
];

const MarkdownPage: React.FC<MarkdownPageProps> = ({
  onSubmitMarkdown,
  isEditor,
  module,
}) => {
  const { t } = useTranslation();
  const editRef = useRef<HTMLInputElement>(null);

  const [markdown, setMarkdown] = useState<string>("");
  const [editBool, setEditBool] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const [caret, setCaret] = useState<number>(0);
  const [menu, setMenu] = useState<number>(-1);

  useEffect(() => {
    setMarkdown(module.markdown);
    setEditBool(false);
  }, [module.markdown]);

  useEffect(() => {
    if (editBool && !preview) {
      editRef.current?.focus();
    }
  }, [preview, editBool]);

  useEffect(() => {
    if (editBool && !preview && caret !== 0) {
      const input = editRef.current;
      if (input) {
        input.selectionStart = caret;
        input.selectionEnd = caret;
        input.focus();
        setCaret(0);
      }
    }
  }, [markdown, editBool, caret]);

  const onChangeMarkdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    const temp = e.target.value;
    setMarkdown(temp);
  };

  const handleSubmit = () => {
    onSubmitMarkdown(markdown.trim(), module.version);
  };

  const handleEdit = () => {
    if (!editBool && preview) {
      setPreview(false);
    }
    setEditBool(!editBool);
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  const handleInsert = (v: string, p?: number, e?: string) => {
    const phase = p ?? 0;
    const caretVal = editRef.current?.selectionEnd ?? 0;
    const newLine =
      caretVal !== 0 && markdown[caretVal - 1] !== "\n" ? "\n" : "";
    const extend = e && markdown[caretVal] !== "\n" ? e : "";
    const arr = markdown.split("");
    arr.splice(caretVal, 0, newLine + v + extend);
    const temp = arr.join("");
    setCaret(caretVal + newLine.length + v.length + extend.length - phase);
    setMarkdown(temp);
  };

  const handleModalMenu = (e: React.MouseEvent, i: number) => {
    if (i > -1 && menu === i) {
      setMenu(-1);
    } else {
      setMenu(i);
    }
  };

  const onSubmitAdd = (e: React.MouseEvent, form: any) => {
    let text;
    switch (menu) {
      case 0:
        text = `[${form.linkText}](${form.url})`;
        break;
      case 1:
        text = `![${form.alt}](${form.imageUrl})`;
        break;
    }
    handleInsert(text);
    handleModalMenu(e, -1);
  };

  return (
    <Box
      sx={{
        height: 1 / 1,
        position: "relative",
        bgcolor: !editBool ? "background.paper" : "",
      }}
    >
      <ModalBox open={menu >= 0} handleOpen={handleModalMenu}>
        <TabPanel index={0} value={menu}>
          <TextForm
            items={FORMS[0]}
            handleClose={handleModalMenu}
            onSubmit={onSubmitAdd}
          />
        </TabPanel>
        <TabPanel index={1} value={menu}>
          <TextForm
            items={FORMS[1]}
            handleClose={handleModalMenu}
            onSubmit={onSubmitAdd}
          />
        </TabPanel>
      </ModalBox>

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pt: 0,
          height: 1 / 1,
          width: 1 / 1,
        }}
      >
        <Box
          sx={{
            height: 1 / 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <HeaderEdit
            info={{
              header: !editBool
                ? "wiki-page"
                : preview
                ? "preview"
                : "edit-page",
              title: "edit-page",
              sticky: "appBar",
            }}
            isEditor={isEditor}
            edited={module.markdown.trim() !== markdown.trim()}
            edit={editBool}
            handleEdit={handleEdit}
            onSubmit={handleSubmit}
          >
            {editBool && (
              <Button
                sx={{
                  textTransform: "none",
                }}
                onClick={handlePreview}
              >
                {!preview ? t("preview-mode") : t("edit-mode")}
              </Button>
            )}
          </HeaderEdit>

          {editBool && !preview ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Toolbar
                config={[0, 0, 0]}
                handleConfig={() => {}}
                handleInsert={handleInsert}
                handleMenu={handleModalMenu}
              />
              <Box
                sx={{
                  flexGrow: 1,
                  minHeight: 100,
                  m: 1,
                  border: 1,
                  borderColor: (theme) => theme.palette.divider,
                  borderRadius: 1.5,
                  bgcolor: "background.paper",
                }}
              >
                <InputBase
                  ref={editRef}
                  required
                  sx={{
                    py: 0.6,
                    px: 1,
                    width: 1 / 1,
                    height: 1 / 1,
                    alignItems: "flex-start",
                  }}
                  multiline
                  id="page"
                  name="page"
                  type="text"
                  value={markdown}
                  onChange={onChangeMarkdown}
                  variant="standard"
                />
              </Box>
            </Box>
          ) : (
            <Box
              className={styles.markdownDark}
              sx={{
                flexGrow: 1,
                p: 1,
                bgcolor: "background.paper",
                //overflowY: 'hidden',
                overflowX: "auto",
              }}
            >
              <ReactMarkdown
                remarkPlugins={[/* remarkToc, */ remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {!editBool ? module.markdown : markdown}
              </ReactMarkdown>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
