import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  Alert,
  InputLabel,
  InputBase,
} from "@mui/material";
import XIcon from "@mui/icons-material/CloseOutlined";
import CheckIcon from "@mui/icons-material/CheckOutlined";
import { TabBar } from "../common/tab-bar";
import { NEW_IMAGE } from "../../constants/constraints";

interface UploadImageFormProps {
  info: {
    header: string;
    tabs?: string[];
  };
  screenshot: string | null;
  onSubmit: (file: File) => void;
  onClose: () => void;
  onScreenshot: () => void;
}

export const UploadImageForm: React.FC<UploadImageFormProps> = ({
  info,
  screenshot,
  onSubmit,
  onClose,
  onScreenshot,
}) => {
  const { t } = useTranslation();

  const [tab, setTab] = useState<number>(0);
  const [img, setImg] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [ssFile, setSsFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (img) {
      setImgUrl(URL.createObjectURL(img));
    }
  }, [img]);

  useEffect(() => {
    if (screenshot && typeof screenshot === "string") {
      const temp = screenshot.replace(/^data:image\/(png|jpeg);base64,/, "");
      const blob = b64toBlob(temp, "image/jpeg");
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });
      setSsFile(file);
    }
  }, [screenshot]);

  const handleTab = (v: number) => {
    setTab(v);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];

    if (
      selectedFile &&
      (selectedFile.type === "image/png" || selectedFile.type === "image/jpeg")
    ) {
      if (selectedFile.size > NEW_IMAGE.data.max) {
        setError(NEW_IMAGE.data.error);
        setImg(null);
      } else {
        setError("");
        setImg(selectedFile);
      }
    } else {
      setError(NEW_IMAGE.type.error);
      setImg(null);
    }
  };

  const handleSubmit = () => {
    if (tab === 0 && img) {
      onSubmit(img);
    } else if (tab === 1 && ssFile) {
      onSubmit(ssFile);
    }
  };

  return (
    <Box sx={{ height: 1 / 1, width: 1 / 1 }}>
      {info && (
        <Box sx={{ px: 2.5, pt: 1 }}>
          {error !== "" ? (
            <Alert
              sx={{ py: 0.3, px: { sm: 1 }, borderRadius: 1.5 }}
              severity="error"
            >
              {t(error)}
            </Alert>
          ) : (
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body"
              color="text.primary"
            >
              {t(info.header)}
            </Typography>
          )}

          {info.tabs && (
            <TabBar
              tabs={info.tabs}
              nc={true}
              value={tab}
              handleChange={handleTab}
              sx={{ textTransform: "none" }}
            ></TabBar>
          )}
          <Divider sx={{ mt: info.header && 0.5 }} />
        </Box>
      )}

      <Box
        sx={{
          width: 1 / 1,
          px: 2.5,
          pt: 1,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-start",
        }}
      >
        {tab === 0 && (
          <>
            <InputBase
              id="input-base"
              sx={{ mb: 0.7 }}
              type={"file"}
              onChange={onImageChange}
              hidden
            />

            <InputLabel
              htmlFor="input-base"
              sx={{
                bgcolor: (theme) => theme.palette.primary.main,
                color: "rgba(255, 255, 255, 0.85)",
                borderRadius: 1.1,
                cursor: "pointer",
                py: 0.6,
                px: 1.2,
              }}
            >
              {t("choose-file")}
            </InputLabel>
          </>
        )}
        {tab === 1 && (
          <>
            {screenshot && (
              <Avatar
                src={screenshot}
                sx={{
                  width: { xs: 40, sm: 70 },
                  height: { xs: 40, sm: 70 },
                  borderRadius: 0,
                }}
              ></Avatar>
            )}
            <Button
              variant={"contained"}
              sx={{ ml: 0.5, textTransform: "none" }}
              onClick={onScreenshot}
            >
              {t("take-graph-screenshot")}
            </Button>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          color="primary"
          sx={{ px: 0, mx: 0.5, mt: 0, minWidth: 36 }}
          onClick={onClose}
        >
          <XIcon color="white" fontSize={"small"} />
        </Button>

        <Button
          variant="contained"
          color="primary"
          sx={{ px: 0, mx: 0.5, mt: 0, minWidth: 36 }}
          onClick={handleSubmit}
          disabled={(tab === 0 && !img) || (tab === 1 && !ssFile)}
        >
          <CheckIcon color="white" fontSize={"small"} />
        </Button>
      </Box>
    </Box>
  );
};

const b64toBlob = (
  b64Data: string,
  contentType: string = "",
  sliceSize: number = 512
): Blob => {
  const byteCharacters = atob(b64Data);
  const byteArrays: any[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
